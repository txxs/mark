原文地址：
https://minichou.github.io/2016/03/25/Redis%20Sentinel%E5%8E%9F%E7%90%86/

### gossip（节点通信，主观和客观宕机）+raft（master宕机之后选主使用）这有点像consul

### Sentinel主要功能
sentinel主要功能是在主库（master）出现问题后，实现：master存活检测、主从运行情况检测、自动failover、主从切换等高可用。redis的sentinel最小配置是一主一从，实现故障转移高可用。

**基本原理：投票算法+心跳机制**

在哨兵的运行阶段，其会向其他的哨兵、master和slave发送消息确认其是否存活，如果在指定的时间内未收到正常回应，暂时认为对法挂起了（被标记为主观宕机–SDOWN）
当多个哨兵都报告同一个master没有响应了，通过投票算法，系统判断其已死亡（被标记为客观宕机–ODOWN）。在已知的slave节点中，根据实际情况和优先级从该下线的master所属slave中选出一个slave提升为新的master，其他的slave都指向这个新的master，继续维护主从关系。

redis的sentinel系统可以用来管理多个redis服务器，该系统可以执行以下三个任务：

1. 监控：sentinel会不断的检查你的主服务器和从服务器是否正常运行。
2. 提醒：当被监控的某个redis服务器出现问题，sentinel通过API向管理员或者其他的应用程序发送通知。
3. 自动故障转移：当主服务器不能正常工作时，sentinel会开始一次自动的故障转移操作，它会将与失效主服务器是主从关系的其中一个从库升级为新的主服务器，并且修改其他的的slave，重定向到新的slave。
redis的sentinel是一个分布式系统，可以在一个架构下运行多个sentinel进程，这些进程之间通过**流言协议（gossip protocols)来接收关于主服务器是否下线的信息**， 并使用**投票协议（agreement protocols）来决定是否执行自动故障迁移选出新的领导**， 以及选择哪个从slave服务器作为新的主服务器。

### 关于redis sentinel的主观下线和客观下线
redis sentinel关于被监控的redis实例出现不响应的判断，内部有两种不同的概念：主观下线和客观下线

#### 主观下线：
当只有单个sentinel实例对redis实例做出无响应的判断，此时进入主观判断，不会触发自动故障转移等操作。
注意，一个服务器必须在 master-down-after-milliseconds 毫秒内， 一直返回无效回复才会被 Sentinel 标记为主观下线。

#### 客观下线：
多个 Sentinel 实例在对同一个服务器做出 SDOWN 判断， 并且通过 SENTINEL is-master-down-by-addr 命令互相交流之后， 得出的服务器下线判断。 （一个 Sentinel 可以通过向另一个 Sentinel 发送 SENTINEL is-master-down-by-addr 命令来询问对方是否认为给定的服务器已下线）

从主观下线状态切换到客观下线状态并没有使用严格的法定人数算法（strong quorum algorithm）， 而是使用了流言协议： 如果 Sentinel 在给定的时间范围内， 从其他 Sentinel 那里接收到了足够数量的主服务器下线报告， 那么 Sentinel 就会将主服务器的状态从主观下线改变为客观下线。 如果之后其他 Sentinel 不再报告主服务器已下线， 那么客观下线状态就会被移除。

客观下线条件只适用于主服务器： 对于任何其他类型的 Redis 实例， Sentinel 在将它们判断为下线前不需要进行协商， 所以从服务器或者其他 Sentinel 永远不会达到客观下线条件。
只要一个 Sentinel 发现某个主服务器进入了客观下线状态， 这个 Sentinel 就可能会被其他 Sentinel 推选出， 并对失效的主服务器执行自动故障迁移操作。

### Sentinel定时执行的操作
1、每个 Sentinel 以每秒钟一次的频率向它所知的主服务器、从服务器以及其他 Sentinel 实例发送一个 PING 命令。

2、如果一个实例（instance）距离最后一次有效回复 PING 命令的时间超过 down-after-milliseconds 选项所指定的值， 那么这个实例会被 Sentinel 标记为主观下线。 一个有效回复可以是： +PONG 、 -LOADING 或者 -MASTERDOWN 。

3、如果一个主服务器被标记为主观下线， 那么正在监视这个主服务器的所有 Sentinel 要以每秒一次的频率确认主服务器的确进入了主观下线状态。

4、如果一个主服务器被标记为主观下线， 并且有足够数量的 Sentinel （至少要达到配置文件指定的数量）在指定的时间范围内同意这一判断， 那么这个主服务器被标记为客观下线。

5、在一般情况下， 每个 Sentinel 会以每 10 秒一次的频率向它已知的所有主服务器和从服务器发送 INFO 命令。 当一个主服务器被 Sentinel 标记为客观下线时， Sentinel 向下线主服务器的所有从服务器发送 INFO 命令的频率会从 10 秒一次改为每秒一次。

6、当没有足够数量的 Sentinel 同意主服务器已经下线， 主服务器的客观下线状态就会被移除。 当主服务器重新向 Sentinel 的 PING 命令返回有效回复时， 主服务器的主管下线状态就会被移除。

自动发现哨兵（sentinel）和从服务器 sentinel与sentinel之间可以进行信息交换和检测对方的可用性。

无需为运行的每个sentinel分别设置其他的sentinel地址，因为sentinel可以通过redis内部的发布\订阅功能来自动的发现正在监视相同主机服务器的其他sentinel，这个功能是通过 sentinel:hello发送消息来实现的。

不必列出所有slave的信息，因为sentinel可以通过询问主服务器获取从服务器信息。
每个 Sentinel 会以每两秒一次的频率， 通过发布与订阅功能， 向被它监视的所有主服务器和从服务器的 sentinel:hello 频道发送一条信息， 信息中包含了 Sentinel 的 IP 地址、端口号和运行 ID （runid）。

每个 Sentinel 都订阅了被它监视的所有主服务器和从服务器的 sentinel:hello 频道， 查找之前未出现过的 sentinel （looking for unknown sentinels）。

当一个 Sentinel 发现一个新的 Sentinel 时， 它会将新的 Sentinel 添加到一个列表中， 这个列表保存了 Sentinel 已知的， 监视同一个主服务器的所有其他 Sentinel 。

Sentinel 发送的信息中还包括完整的主服务器当前配置（configuration）。 如果一个 Sentinel 包含的主服务器配置比另一个 Sentinel 发送的配置要旧， 那么这个 Sentinel 会立即升级到新配置上。

在将一个新 Sentinel 添加到监视主服务器的列表上面之前， Sentinel 会先检查列表中是否已经包含了和要添加的 Sentinel 拥有相同运行 ID 或者相同地址（包括 IP 地址和端口号）的 Sentinel ， 如果是的话， Sentinel 会先移除列表中已有的那些拥有相同运行 ID 或者相同地址的 Sentinel ， 然后再添加新 Sentinel

## 恢复的流程，这个很重要

Sentinel执行failover流程

sentinel发现master下线，修改其状态为sdown；

sentinel和其他sentinel确认master是否down掉，确认其状态为odown；

对我们的当前纪元进行自增（详情请参考 Raft leader election ）， 并尝试在这个纪元中当选(即首先发现master down掉的sentinel有优先权当选为leader)；
如果当选失败，那么在设定的故障迁移超时时间的两倍之后，重新尝试当选。如果当选成功，那么执行以下步骤；

选出一个从服务器，并将它升级为主服务器；

leader选出一个slave作为master，发送slaveof no one命令；

通过发布与订阅功能，将更新后的配置传播给所有其他 Sentinel，其他 Sentinel 对它们自己的配置进行更新；

并通过给其他slave发送slave of master命令告知其他slave新的master；

当所有从服务器都已经开始复制新的主服务器时，领头Sentinel终止这次故障迁移操作。

Sentinel发出投票通知：

发现一个master down掉的sentinel发出投票请求的时候，接收者依据epoch进行判断后并返回它认为的leader后，发现者对接收者的意见照单全收，并没有进行“反驳”。换句话说，接收者接收所有的接收者的意见后，并没有进行一番比较，就接收了每个接收者的认为的leader，结果其leader就是最后一个接收者认为的leader。

但是从另一方面说，每个接收者都会收到所有潜在的leader的选举邀请，他们会对所有这些候选者进行比较一番后，本地的leader肯定是最后比较的结果，这个结果会通过反馈给每个候选者的通知，使他们知道最终的胜出者，所以还是能选举出最后的leader。

Sentinel领头羊选举

Sentinel 自动故障迁移使用 Raft 算法来选举领头（leader） Sentinel ， 从而确保在一个给定的纪元（epoch）里， 只有一个领头产生。

这表示在同一个纪元中， 不会有两个 Sentinel 同时被选中为领头， 并且各个 Sentinel 在同一个纪元中只会对一个领头进行投票。

更高的配置纪元总是优于较低的纪元， 因此每个 Sentinel 都会主动使用更新的纪元来代替自己的配置。

简单来说， 我们可以将 Sentinel 配置看作是一个带有版本号的状态。 一个状态会以最后写入者胜出（last-write-wins）的方式（也即是，最新的配置总是胜出）传播至所有其他 Sentinel 。

举个例子， 当出现网络分割（network partitions）时， 一个 Sentinel 可能会包含了较旧的配置， 而当这个 Sentinel 接到其他 Sentinel 发来的版本更新的配置时， Sentinel 就会对自己的配置进行更新。

如果要在网络分割出现的情况下仍然保持一致性， 那么应该使用 min-slaves-to-write 选项， 让主服务器在连接的从实例少于给定数量时停止执行写操作， 与此同时， 应该在每个运行 Redis 主服务器或从服务器的机器上运行 Redis Sentinel 进程。

Sentinel主master选举

Sentinel 使用以下规则来选择新的主服务器：

在失效主服务器属下的从服务器当中， 那些被标记为主观下线、已断线、或者最后一次回复 PING 命令的时间大于五秒钟的从服务器都会被淘汰。

在失效主服务器属下的从服务器当中， 那些与失效主服务器连接断开的时长超过 down-after 选项指定的时长十倍的从服务器都会被淘汰。

我们选出复制偏移量（replication offset）最大的那个从服务器作为新的主服务器； 如果复制偏移量不可用， 或者从服务器的复制偏移量相同， 那么带有最小运行 ID 的那个从服务器成为新的主服务器。

Sentinel与redis实例之间的通信

以下是sentinel节点所接受的命令：

PING ：返回 PONG 。

SENTINEL masters ：列出所有被监视的主服务器，以及这些主服务器的当前状态。

SENTINEL slaves ：列出给定主服务器的所有从服务器，以及这些从服务器的当前状态。

SENTINEL get-master-addr-by-name ： 返回给定名字的主服务器的 IP 地址和端口号。 如果这个主服务器正在执行故障转移操作， 或者针对这个主服务器的故障转移操作已经完成， 那么这个命令返回新的主服务器的 IP 地址和端口号。

SENTINEL reset ： 重置所有名字和给定模式 pattern 相匹配的主服务器。 pattern 参数是一个 Glob 风格的模式。 重置操作清除主服务器目前的所有状态， 包括正在执行中的故障转移， 并移除目前已经发现和关联的， 主服务器的所有从服务器和 Sentinel 。

SENTINEL failover ： 当主服务器失效时， 在不询问其他 Sentinel 意见的情况下， 强制开始一次自动故障迁移 （不过发起故障转移的 Sentinel 会向其他 Sentinel 发送一个新的配置，其他 Sentinel 会根据这个配置进行相应的更新）。

sentinel连接一个redis实例的时候，会创建cmd和pub/sub两个链接，cmd连接创建成功时候立即发送一个ping命令，pub/sub连接创建成功的时候立即去监听hello channel。

通过cmd连接给redis发送命令，通过pub/sub连接得到redis实例上的其他sentinel实例。

sentinel与maste/slave的交互主要包括：

PING:sentinel向其发送PING以了解其状态（是否下线）

INFO:sentinel向其发送INFO以获取replication相关的信息，通过这个命令可以获取master的slaves

PUBLISH:sentinel向其监控的master/slave发布本身的信息及master相关的配置

SUBSCRIBE:sentinel通过订阅master/slave的”sentinel:hello“频道以获取其它正在监控相同服务的sentinels

sentinel与sentinel的交互主要包括：

PING:sentinel向slave发送PING以了解其状态（是否下线）
SENTINEL is-master-down-by-addr：和其他sentinel协商master状态，如果master odown，则投票选出leader做fail over
Sentinel配置文件参数说明
部分参数说明：
port ：sentinel实例之间通讯的端口

dir :指定工作目录

sentinel monitor：sentinel需要监控的主库信息 sentinel monitor
其中master-name为自定义master名称，ip为master所在主机的ip地址，redis-port为redis实例的端口号，quorum界定有多少个sentinel实例提交与master通信失败才会判断master为客观宕机（ODOWN），从而发起自动切换。

sentinel auth-pass：如果master开启的密码验证，在这里配置master的密码 sentinel auth-pass

sentinel down-after-milliseconds：master被当前sentinel判断为失效的时间间隔，sentinel与master之间的通信没有响应或者代码错误等超过这个时间限定，sentinel会判断master为客观宕机SDOWNdown-after-milliseconds
sentinel parallel-syncs：当自动切换完成后，同时进行slaveof到新的master并行执行SYNC的slave个数，默认为1，建议线上保留这个数字，在slave执行slaveof的时候，将不会对客户端请求进行响应，对于读写分离业务会有一定的影响
sentinel parallel-syncs

sentinel failover-timeout：制定failover的过期时间，超过此时间没有触发任何的failover操作，当前的sentinel会认为此次的failover擦走哦失败。 sentinel failover-timeout

sentinel notification-script ：当进行failover时，可以指定一个通知脚本用来通知系统管理员，当前集群的情况。脚本被允许执行的最大时间为60秒，超过这个时间，脚本会被kill。 sentinel notification-script

稍后重试，最大重试次数为10;
执行结束，无需重试
sentinel client-reconfig-script：
failover之后重配置客户端，执行脚本时会传递大量参数，请参考相关文档

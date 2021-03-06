原文地址：

https://www.jianshu.com/p/e689e67d1f7b

https://juejin.im/post/5b924b0de51d450e9a2de615

https://zhuanlan.zhihu.com/p/27335748

ZAB协议（Zookeeper Atomic Broadcast Protocol）是Zookeeper系统专门设计的一种支持崩溃恢复的原子广播协议。Zookeeper使用该协议来实现分布数据一致性并实现了一种主备模式的系统架构来保持各集群中各个副本之间的数据一致性。

ZAB协议理论与Zookeeper对该协议的实现还是存在一些差别，本文将针对ZAB的协议本身和Zookeeper的实现两个维度来介绍。

### 服务器的状态

Looking：该状态表示集群中不存在群首节点，进入群首选举过程。

Leading：群首状态，表示该服务器是群首节点。

Following：跟随者状态，表示该服务器是群首的Follow节点。

### 节点的持久数据状态

history: 当前节点接收到的事务提议的log

acceptedEpoch：follower节点已经接受的leader更改年号的NEWEPOCH提议

currentEpoch：当前所处的年代

lastZxid：history中最近接收到的提议的zxid

```
在 ZAB 协议的事务编号 Zxid 设计中，Zxid 是一个 64 位的数字，其中低 32 位是一个简单的单调递增的计数器，针对客户端每一个事务请求，计数器加 1；而高 32 位则代表 Leader 周期 epoch 的编号，每个当选产生一个新的 Leader 服务器，就会从这个 Leader 服务器上取出其本地日志中最大事务的ZXID，并从中读取 epoch 值，然后加 1，以此作为新的 epoch，并将低 32 位从 0 开始计数。

epoch：可以理解为当前集群所处的年代或者周期，每个 leader 就像皇帝，都有自己的年号，所以每次改朝换代，leader 变更之后，都会在前一个年代的基础上加 1。这样就算旧的 leader 崩溃恢复之后，也没有人听他的了，因为 follower 只听从当前年代的 leader 的命令。这有点像raft的周期

值得注意的是，ZAB 提交事务并不像 2PC 一样需要全部 follower 都 ACK，只需要得到 quorum （超过半数的节点）的 ACK 就可以了。

```

### 四个阶段

a. 选举阶段：在选举阶段，只要有节点有集群中超过半数的节点支持，该节点就会被作为准Leader。该节点暂不会作为Leader节点来提供服务，能否真正作为Leader节点，还依赖与后续的阶段能否正常完成。

```
Phase 0: Leader election（选举阶段）节点在一开始都处于选举阶段，只要有一个节点得到超半数节点的票数，它就可以当选准 leader。只有到达 Phase 3 准 leader 才会成为真正的 leader。这一阶段的目的是就是为了选出一个准 leader，然后进入下一个阶段。协议并没有规定详细的选举算法，后面我们会提到实现中使用的 Fast Leader Election。

```

**zab协议是利用Fast Leader Election实现的**

b. 发现阶段：在选举出Leader节点后，集群进入发现阶段。Follow与准Leader进行通信，同步集群中各个节点的状态，确认集群中最新提议历史。

```
Phase 1: Discovery（发现阶段）在这个阶段，followers 跟准 leader 进行通信，同步 followers 最近接收的事务提议。这个一阶段的主要目的是发现当前大多数节点接收的最新提议，并且准 leader 生成新的 epoch，让 followers 接受，更新它们的 acceptedEpoch

```

c. 同步阶段：在完成发现阶段后，准Leader可以获取集群中最新的提议历史。准Leader在该阶段会把最新的提议历史同步到集群中的所有节点。当同步完成时，准Leader才会真正成为Leader，执行Leader的工作。

```
Phase 2: Synchronization（同步阶段）同步阶段主要是利用 leader 前一阶段获得的最新提议历史，同步集群中所有的副本。只有当 quorum 都同步完成，准 leader 才会成为真正的 leader。follower 只会接收 zxid 比自己的 lastZxid 大的提议。
```

d. 广播阶段：到了该阶段，Zookeeper才能真正对外提供事务服务，leader可以进行消息的广播。

```
Phase 3: Broadcast（广播阶段）到了这个阶段，Zookeeper 集群才能正式对外提供事务服务，并且 leader 可以进行消息广播。同时如果有新的节点加入，还需要对新节点进行同步。值得注意的是，ZAB 提交事务并不像 2PC 一样需要全部 follower 都 ACK，只需要得到 quorum （超过半数的节点）的 ACK 就可以了。

```

### Zookeeper的仲裁原则
对于ZAB协议来说，遵循如下的仲裁原则：少数服从多数

1、群首选举过程中有超过一半的节点达成一致则选举过程结束。

2、事务的确认同样遵循该原则，只要得到半数以上的支持，则表示事务成功。

3、少数服从多数可以保证集群分裂也存在至少一个公共节点。

4、Zookeeper的集群数配置奇数更为合理，因为n与n+1的容错是相等的，n这里为奇数。


### Zookeeper对ZAB协议的具体实现

协议的 Java 版本实现跟上面的定义有些不同，选举阶段使用的是 Fast Leader Election（FLE），它包含了 Phase 1 的发现职责。因为 FLE 会选举拥有最新提议历史的节点作为 leader，这样就省去了发现最新提议的步骤。实际的实现将 Phase 1 和 Phase 2 合并为 Recovery Phase（恢复阶段）。所以，ZAB 的实现只有三个阶段

A：选举阶段（Fast Leader Election）

B：恢复阶段（Recovery Phase）

C：广播阶段（Broadcast Phase）

#### Fast Leader Election

前面提到 FLE 会选举拥有最新提议历史（lastZixd最大）的节点作为 leader，这样就省去了发现最新提议的步骤。这是基于拥有最新提议的节点也有最新提交记录的前提。

成为 leader 的条件

1、选epoch最大的

2、epoch相等，选 zxid 最大的

3、epoch和zxid都相等，选择server id最大的（就是我们配置zoo.cfg中的myid）

节点在选举开始都默认投票给自己，当接收其他节点的选票时，会根据上面的条件更改自己的选票并重新发送选票给其他节点，当有一个节点的得票超过半数，该节点会设置自己的状态为 leading，其他节点会设置自己的状态为 following。

#### Recovery Phase （恢复阶段）

这一阶段 follower 发送它们的 lastZixd 给 leader，leader 根据 lastZixd 决定如何同步数据。这里的实现跟前面 Phase 2 有所不同：Follower 收到 TRUNC 指令会中止 L.lastCommittedZxid 之后的提议，收到 DIFF 指令会接收新的提议。

```
history.lastCommittedZxid：最近被提交的提议的 zxid
history:oldThreshold：被认为已经太旧的已提交提议的 zxid
```


#### 广播——主从同步

主从同步数据比较简单，当有写操作时，如果是从机接收，会转到主机。做一次转发，保证写都是在主机上进行。主先提议事务，收到过半回复后，再发提交。
主收到写操作时，先本地生成事务为事务生成zxid，然后发给所有follower节点。当follower收到事务时，先把提议事务的日志写到本地磁盘，成功后返回给leader。
leader收到过半反馈后对事务提交。再通知所有的follower提交事务，follower收到后也提交事务，提交后就可以对客户端进行分发了。



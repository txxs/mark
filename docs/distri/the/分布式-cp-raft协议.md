原文地址：

https://www.jdon.com/artichect/raft.html

https://www.infoq.cn/article/raft-paper

下边是演示动画的地址：

http://thesecretlivesofdata.com/raft/

　　过去, Paxos一直是分布式协议的标准，但是Paxos难于理解，更难以实现，Google的分布式锁系统Chubby作为Paxos实现曾经遭遇到很多坑。

　　来自Stanford的新的分布式协议研究称为Raft，它是一个为真实世界应用建立的协议，主要注重协议的落地性和可理解性。

　　为了以容错方式达成一致，我们不可能要求所有服务器100%都达成一致状态，只要超过半数的大多数服务器达成一致就可以了，假设有N台服务器，N/2 +1 就超过半数，代表大多数了。


在Raft中，任何时候一个服务器可以扮演下面角色之一：

1、Leader: 处理所有客户端交互，日志复制等，一般一次只有一个Leader.

2、Follower: 类似选民，完全被动

3、Candidate候选人: 类似Proposer律师，可以被选为一个新的领导人。

### 简单过程，没有细节

Raft阶段分为两个，首先是选举过程，然后在选举出来的领导人带领进行正常操作，比如日志复制等。下面用图示展示这个过程：

1. 任何一个服务器都可以成为一个候选者Candidate，它向其他服务器Follower发出要求选举自己的请求：

2. 其他服务器同意了，发出OK。注意如果在这个过程中，有一个Follower当机，没有收到请求选举的要求，因此候选者可以自己选自己，只要达到N/2 + 1 的大多数票，候选人还是可以成为Leader的。

3. 这样这个候选者就成为了Leader领导人，它可以向选民也就是Follower们发出指令，比如进行日志复制。

4. 以后通过心跳进行日志复制的通知

5. 如果一旦这个Leader当机崩溃了，那么Follower中有一个成为候选者，发出邀票选举。

6. Follower同意后，其成为Leader，继续承担日志复制等指导工作：值得注意的是，整个选举过程是有一个时间限制的，　Splite Vote是因为如果同时有两个候选人向大家邀票，这时通过类似加时赛来解决，两个候选者在一段timeout比如300ms互相不服气的等待以后，因为双方得到的票数是一样的，一半对一半，那么在300ms以后，再由这两个候选者发出邀票，这时同时的概率大大降低，那么首先发出邀票的的候选者得到了大多数同意，成为领导者Leader，而另外一个候选者后来发出邀票时，那些Follower选民已经投票给第一个候选者，不能再投票给它，它就成为落选者了，最后这个落选者也成为普通Follower一员了。

### 日志复制

1、下面以日志复制为例子说明Raft算法，假设Leader领导人已经选出，这时客户端发出增加一个日志的要求，比如日志是"sally"：

2. Leader要求Followe遵从他的指令，都将这个新的日志内容追加到他们各自日志中：

3.大多数follower服务器将日志写入磁盘文件后，确认追加成功，发出Commited Ok:

4. 在下一个心跳heartbeat中，Leader会通知所有Follwer更新commited 项目。

对于每个新的日志记录，重复上述过程。

如果在这一过程中，发生了网络分区或者网络通信故障，使得Leader不能访问大多数Follwers了，那么Leader只能正常更新它能访问的那些Follower服务器，而大多数的服务器Follower因为没有了Leader，他们重新选举一个候选者作为Leader，然后这个Leader作为代表于外界打交道，如果外界要求其添加新的日志，这个新的Leader就按上述步骤通知大多数Followers，如果这时网络故障修复了，那么原先的Leader就变成Follower，在失联阶段这个老Leader的任何更新都不能算commit，都回滚，接受新的Leader的新的更新。


原文地址：https://www.jianshu.com/p/aa77c8f4cb5c

### Raft 的选举过程

Raft 协议在集群初始状态下是没有 Leader 的, 集群中所有成员均是 Follower，在选举开始期间所有 Follower 均可参与选举，这时所有 Follower 的角色均转变为 Condidate, Leader 由集群中所有的 Condidate 投票选出，最后获得投票最多的 Condidate 获胜，其角色转变为 Leader 并开始其任期，其余落败的 Condidate 角色转变为 Follower 开始服从 Leader 领导。这里有一种意外的情况会选不出 Leader 就是所有 Condidate 均投票给自己，这样无法决出票数多的一方，Raft 算法为了解决这个问题引入了北洋时期袁世凯获选大总统的谋略，即选不出 Leader 不罢休，直到选出为止，一轮选不出 Leader，便令所有 Condidate 随机 sleap（Raft 论文称为 timeout）一段时间，然后马上开始新一轮的选举，这里的随机 sleep 就起了很关键的因素，第一个从 sleap 状态恢复过来的 Condidate 会向所有 Condidate 发出投票给我的申请，这时还没有苏醒的 Condidate 就只能投票给已经苏醒的 Condidate ，因此可以有效解决 Condiadte 均投票给自己的故障，便可快速的决出 Leader。

选举出 Leader 后 Leader 会定期向所有 Follower 发送 heartbeat 来维护其 Leader 地位，如果 Follower 一段时间后未收到 Leader 的心跳则认为 Leader 已经挂掉，便转变自身角色为 Condidate，同时发起新一轮的选举，产生新的 Leader。

### Raft 的数据一致性策略

Raft 协议强依赖 Leader 节点来确保集群数据一致性。即 client 发送过来的数据均先到达 Leader 节点，Leader 接收到数据后，先将数据标记为 uncommitted 状态，随后 Leader 开始向所有 Follower 复制数据并等待响应，在获得集群中大于 N/2 个 Follower 的已成功接收数据完毕的响应后，Leader 将数据的状态标记为 committed，随后向 client 发送数据已接收确认，在向 client 发送出已数据接收后，再向所有 Follower 节点发送通知表明该数据状态为committed。

### Raft 如何处理 Leader 意外的？
1、client 发送数据到达 Leader 之前 Leader 就挂了，因为数据还没有到达集群内部，所以对集群内部数据的一致性没有影响，Leader 挂了之后，集群会进行新的选举产生新的 Leader，之前挂掉的 Leader 重启后作为 Follower 加入集群，并同步 Leader 上的数据。这里最好要求 client 有重试机制在一定时间没有收到 Leader 的数据已接收确认后进行一定次数的重试，并再次向新的 Leader 发送数据来确保业务的流畅性。

2、client 发送数据到 Leader，数据到达 Leader 后，Leader 还没有开始向 Folloers 复制数据，Leader就挂了，此时数据仍被标记为 uncommited 状态，这时集群会进行新的选举产生新的 Leader，之前挂掉的 Leader 重启后作为 Follower 加入集群，并同步 Leader 上的数据，来保证数据一致性，之前接收到 client 的数据由于是 uncommited 状态所以可能会被丢弃。这里同样最好要求 client 有重试机制通过在一定时间在没有收到 Leader 的数据已接收确认后进行一定次数的重试，再次向新的 Leader 发送数据来确保业务的流畅性。

3、client 发送数据到 Leader, Leader 接收数据完毕后标记为 uncommited，开始向 Follower复制数据，在复制完毕一小部分 Follower 后 Leader 挂了，此时数据在所有已接收到数据的 Follower 上仍被标记为 uncommitted，但国不可一日无君，此时集群将进行新的选举，而拥有最新数据的 Follower 变换角色为 Condidate，也就意味着 Leader 将在拥有最新数据的 Follower 中产生，新的 Leader 产生后所有节点开始从新 Leader 上同步数据确保数据的一致性，包括之前挂掉后恢复了状态的 老Leader，这时也以 Follower 的身份同步新 Leader 上的数据。

4、client 发送数据到 Leader，Leader 接收数据完毕后标记为 uncommitted，开始向 Follower 复制数据，在复制完毕所有 Follower 节点或者大部分节点（大于 N/2），并接收到大部分节点接收完毕的响应后，Leader 节点将数据标记为 committed，这时 Leader 挂了，此时已接收到数据的所有 Follower 节点上的数据状态由于还没有接收到 Leader 的 commited 通知，均处于 uncommited 状态。这时集群进行了新的选举，新的 Leader 将在拥有最新数据的节点中产生，新的 Leader 产生后，由于 client 端因老 Leader 挂掉前没有通知其数据已接收，所以会向新的 Leader 发送重试请求，而新的 Leader 上已经存在了这个之前从老 Leader 上同步过来的数据，因此 Raft 集群要求各节点自身实现去重的机制，保证数据的一致性。

5、集群脑裂的一致性处理，多发于双机房的跨机房模式的集群。假设一个 5 节点的 Raft 集群，其中三个节点在 A 机房，Leader 节点也在 A 机房，两个节点在 B 机房。突然 A、B 两个机房之间因其他故障无法通讯，那么此时 B 机房中的 2 个Follower 因为失去与 Leader 的联系，均转变自身角色为 Condidate。根据 Leader 选举机制，B 机房中产生了一个新的 Leader，这就发生了脑裂即存在 A 机房中的老 Leader 的集群与B机房新 Leader 的集群。Raft 针对这种情况的处理方式是老的 Leader 集群虽然剩下三个节点，但是 Leader 对数据的处理过程还是在按原来 5 个节点进行处理，所以老的 Leader 接收到的数据，在向其他 4 个节点复制数据，由于无法获取超过 N/2 个 Follower 节点的复制完毕数据响应（因为无法连接到 B 机房中的 2个节点），所以 client 在向老 Leader 发送的数据请求均无法成功写入，而 client 向B机房新 Leader 发送的数据，因为是新成立的集群，所以可以成功写入数据，在A、B两个机房恢复网络通讯后，A 机房中的所有节点包括老 Leader 再以 Follower 角色接入这个集群，并同步新 Leader 中的数据，完成数据一致性处理。


### 更具有细节的解释

https://www.cnblogs.com/foxmailed/p/3418143.html

https://my.oschina.net/u/1174461/blog/1864000

时间被分为很多连续的随机长度的term(一段时间)，一个term由一个唯一的id标识。每个term一开始就进行leader election：

    1. followers将自己维护的current_term_id加1。

    2. 然后将自己的状态转成candidate。

    3. 发送RequestVoteRPC消息(带上current_term_id) 给 其它所有server

这个过程会有三种结果：

    1. 自己被选成了主。当收到了majority的投票后，状态切成leader，并且定期给其它的所有server发心跳消息(其实是不带log的AppendEntriesRPC)以告诉对方自己是current_term_id所标识的term的leader。每个term最多只有一个leader，term id作为logical clock，在每个RPC消息中都会带上，用于检测过期的消息，比如自己是一个过期的leader(term id更小的leader)。当一个server收到的RPC消息中的rpc_term_id比本地的current_term_id更大时，就更新current_term_id为rpc_term_id，并且如果当前state为leader或者candidate时，将自己的状态切成follower。如果rpc_term_id比本地的current_term_id更小，则拒绝这个RPC消息。

    2. 别人成为了主。如1所述，当candidate在等待投票的过程中，收到了大于或者等于本地的current_term_id的声明对方是leader的AppendEntriesRPC时，则将自己的state切成follower，并且更新本地的current_term_id。

    3. 没有选出主。当投票被瓜分，没有任何一个candidate收到了majority的vote时，没有leader被选出。这种情况下，每个candidate等待的投票的过程就超时了，接着candidates都会将本地的current_term_id再加1，发起RequestVoteRPC进行新一轮的leader election。

投票策略：

每个server只会给每个term投一票，具体的是否同意和后续的Safety有关。

当投票被瓜分后，所有的candidate同时超时，然后有可能进入新一轮的票数被瓜分，为了避免这个问题，Raft采用一种很简单的方法：每个candidate的election timeout从150ms-300ms之间随机取，那么第一个超时的candidate就可以发起新一轮的leader election，带着最大的term_id给其它所有server发送RequestVoteRPC消息，从而自己成为leader，然后给他们发送心跳消息以告诉他们自己是主。


### 一些名词解释

https://yq.aliyun.com/articles/582124

### 1.Term
Term的概念类比中国历史上的朝代更替，Raft 算法将时间划分成为任意不同长度的任期（term）。

任期用连续的数字进行表示。每一个任期的开始都是一次选举（election），一个或多个候选人会试图成为领导人。如果一个候选人赢得了选举，它就会在该任期的剩余时间担任领导人。在某些情况下，选票会被瓜分，有可能没有选出领导人，那么，将会开始另一个任期，并且立刻开始下一次选举。Raft 算法保证在给定的一个任期最多只有一个领导人。


### 2.RPC
Raft 算法中服务器节点之间通信使用远程过程调用（RPCs），并且基本的一致性算法只需要两种类型的 RPCs，为了在服务器之间传输快照增加了第三种 RPC。

RPC有三种：

RequestVote RPC：候选人在选举期间发起

AppendEntries RPC：领导人发起的一种心跳机制，复制日志也在该命令中完成

InstallSnapshot RPC: 领导者使用该RPC来发送快照给太落后的追随者


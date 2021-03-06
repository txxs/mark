原文地址：

https://my.oschina.net/cloudcoder/blog/711503

https://yq.aliyun.com/articles/582124

https://li5jun.com/article/224.html

http://www.voidcn.com/article/p-xnxllebc-bpu.html

https://cloud.tencent.com/developer/news/261787

https://www.cnblogs.com/bangerlee/p/5991417.html

https://www.jianshu.com/p/78cdf955ceca

https://my.oschina.net/OutOfMemory/blog/812947

https://www.iminho.me/wiki/docs/blockchain_guide/distribute_system-paxos.md

### 两阶段提交协议

两阶段提交系统具有完全的C，很糟糕的A，很糟糕的P。首先，两阶段提交协议保证了副本间是完全一致的，这也是协议的设计目的。再者，协议在一个节点出现异常时，就无法更新数据，其服务可用性较低。最后，一旦协调者与参与者之间网络分化，无法提供服务。

### Paxos和Raft算法


Paxos 协议和Raft算法都是强一致性协议。Paxos只有两种情况下服务不可用:

一是超过半数的 Proposer 异常，可以通过增加 Proposer 的个数来 降低由于 Proposer 异常影响服务的概率

二是出现活锁。此处本身发生的概率就极低。

```
Phase1：确定谁的编号最高，只有编号最高者才有权利提交proposal；
Phase2：编号最高者提交proposal，如果没有其他节点提出更高编号的proposal，则该提案会被顺利通过；否则，整个过程就会重来。

你编号高，我比你更高，反复如此，算法永远无法结束，这叫活锁。FLP Impossibility已经证明，在异步通信中不存在任何一致性算法，活锁便是Paxos无法解决的硬伤。
```

最后，只要能与超过半数的 Proposer 通信就可以完成协议流程，协议本身具有较好的容忍网络分区的能力。

Raft特点：

相比于Paxos，Raft最大的特点就是可理解性。相信读过Paxos论文的人应该对此深有体会。

Raft把一致性问题，分解成三个比较独立的子问题，并给出每个子问题的解决方法：

选举：描述Raft是如何选择一个leader的，这个部分很受容易理解了。

日志复制：描述Raft的leader是如何把日志复制到集群的各个节点上的。

安全性：描述Raft是如何保证“State Machine Safety Property”。


### ZAB和Paxos 

总的来汫， ZAB协议和 Paxos本质区别在于，两者的设计目标不太一样。 ZAB 协议主要用于构建一个高可用的分布式数椐主备系统，例如ZooKeeper, 而Paxos算法 则是用于构建一个分布式的一致性状态机系统，Zab的作者认为Zab与paxos并不相同，只所以没有采用Paxos是因为Paxos保证不了全序顺序

ZAB协议并不像Paxos算法那样，一种通用的分布式一致性算法，而是一种特别为ZooKeeper设计的崩溃可恢复的原子消息广播算法
当Leader服务器不可用或者已经不存在过半服务器与该Leader服务器保持正常通信时，在重新开始新一轮的原子广播事务操作之前，ZAB会进入恢复模式选举新的Leader服务器，使集群彼此达到一个一致的状态，从消息广播模式进入到崩溃恢复模式。当集群过半机器都与新的Leader服务器完成了状态同步操作后ZAB协议会退出恢复模式

ZAB协议并不是 Paxos 算法的一个典型实现，在讲解 ZAB和 Paxos之间的区别之前, 我们首先看下两者的联系， 

• 两者都有一个类似于Leader进程的角色，由其负责协调多个Follower运行 

• Leader进程都会等待超过半数的Follower做出正确的反馈后，才会将一个提案进行提交。 

• 在ZAB协议中，每个Proposal都包含了一个epoch值，用来代表当前的Leader 周期，在Paxos算法中，同样存在这样的一个标识，只是名字变成了Ballot。

在Paxos算法中，一个新选举产生的主进程会进行两个阶段的工作，第一阶段被称为读阶段，在这个阶段中，这个新的主进程会通过和所有其他进程进行通信的方式来收集上一个—个主进程提出的提案，并将它们提交.第二阶段被称为写阶段，在这个阶段，与前主进程开始提出自己的提案。

在Paxos算法设计的基础上， ZAB协议额外添加了一 个同步阶段。在同步阶段之前，ZAB协议也存在一个和Paxos算法中的读阶段I类似的过程，被称为发现（ Discovery)阶段，在同步阶段中，新的 Leader会确存在过半数的Follower已经提交了之前Leader周期中的所有事物的Proposal，在这一同步阶段的引人，能够有效地保证Leader在新的周期中提出事务Proposal之前，所有的进程都已经完成了对之前所有事物的Proposal的提交。 

Paxos算法中，一个新的选举产生的主进程会进行两个阶段的工作

1、读阶段，新的主进程会通过和所有其他进程进行通信的方式来搜集上一个主进程提出的提案，并将它们提交。

2、写阶段，当前主进程开始提出它自己的提案。

ZAB在Paxos基础上额外添加一个同步阶段。同步阶段之前，ZAB协议存在一个和Paxos读阶段类似的发现（Discovery）阶段
同步阶段中，新的Leader会确保存在过半的Follower已经提交了之前Leader周期中的所有事务Proposal
发现阶段的存在，确保所有进程都已经完成对之前所有事物Proposal的提交

ZAB协议主要用于构建一个高可用的分布式数据主备系统，例如ZooKeeper

Paxos算法则是用于构建一个分布式的一致性状态机系统

1.  两者的初衷或者说设计目标不一样 

Paxos算法用于构建一个分布式的一致性状态机系统 

ZAB算法用于构建一个高可用的分布式数据主备系统 

2. 流程上有区别
 
Paxos算法，选举出一个新的Leader进程需要进行两个阶段。 

第一个阶段是读阶段，这个阶段中，这个新的主进程会通过和其他 所有其他进程进行通信的方式收集上一个主进程提出的提案，并将它们提交。

第二个阶段是写阶段，这个阶段中，当前主进程Leader开始提出它自己的提案。 

ZAB算法存在三个阶段：发现阶段、同步阶段、广播阶段，其中发现阶段等同于Paxos的 读阶段，广播阶段等同于Paxos的写阶段。 

### zab和raft

zab和raft的重点在于，一开始启动的情况下就必要选主，然后再提供正常服务，如何能达到一致性的安全性，而后就是异常场景的恢复过程，都比较容易理解。 区别在于选主的方式。zab是广播式互相计数方式，发现别人比自己牛逼的时候要帮助别人扩散消息，根据本机计数决定谁是主。raft是个节点发起投票，大家根据规则选择投于不投，然后各自收到别人对自己的投票超过半数时宣布自己成为主。

Zab和Raft都是强一致性协议，但是Zab和Raft的实质是一样的，都是mutli-paxos衍生出来的强一致性算法。简单而言，他们的算法都都是先通过Leader选举，选出一个Leader，然后Leader接受到客户端的提议时，都是先写入操作日志，然后再与其他Followers同步日志，Leader再commit提议，再与其他Followers同步提议。如果Leader故障，重新走一遍选举流程，选取最新的操作日志，然后同步日志，接着继续接受客户端请求等等。过程都是一样，只不过两个的实现方式不同，描述方式不同。实现Raft的核心是Term，Zab的核心是Zxid，反正Term和Zxid都是逻辑时钟。






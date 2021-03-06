原文地址：

https://www.jdon.com/artichect/paxos.html　

https://zhuanlan.zhihu.com/p/31780743


作为分布式一致性代名词的Paxos算法号称是最难理解的算法。本文试图用通俗易懂的语言讲述Paxos算法。开源的ZooKeeper，以及MySQL 5.7推出的用来取代传统的主从复制的MySQL Group Replication等纷纷采用Paxos算法解决分布式一致性问题。然而，Paxos的最大特点就是难，不仅难以理解，更难以实现。

下面以分布式拍卖案例说明这种情况以及Paxos的基本原理？

　　在传统拍卖场景中，价高者先得，这些拍卖者都是在同一个房间，彼此能够直接看得到对方的报价，如果我们假设分布式拍卖是将这些拍卖者分离到不同的地方，这样我们可以用拍卖者之间的联系模拟分布式计算机之间的通讯。

　　假设拍卖者各自在自己家里拍卖，通过邮局信件发出自己的拍卖信息，拍卖者之间除非等到邮局投递人告诉他们彼此之间的报价，否则是无法知道对方报价的。如果邮局信件投递这个环节出了问题，投递速度慢了甚至无法投递了，那么整个拍卖程序就无法继续进行下去。

### Paxos解决共识思路

Paxos算法运行在允许宕机故障的异步系统中，不要求可靠的消息传递，可容忍消息丢失、延迟、乱序以及重复。它利用大多数 (Majority) 机制保证了2F+1的容错能力，即2F+1个节点的系统最多允许F个节点同时出现故障。

一个或多个提议进程 (Proposer) 可以发起提案 (Proposal)，Paxos算法使所有提案中的某一个提案，在所有进程中达成一致。系统中的多数派同时认可该提案，即达成了一致。最多只针对一个确定的提案达成一致。

Paxos将系统中的角色分为提议者 (Proposer)，决策者 (Acceptor)，和最终决策学习者 (Learner):


Paxos将系统中的角色分为提议者 (Proposer)，决策者 (Acceptor)，和最终决策学习者 (Learner):

Proposer: 提出提案 (Proposal)。Proposal信息包括提案编号 (Proposal ID) 和提议的值 (Value)。

Acceptor：参与决策，回应Proposers的提案。收到Proposal后可以接受提案，若Proposal获得多数Acceptors的接受，则称该Proposal被批准。

Learner：不参与决策，从Proposers/Acceptors学习最新达成一致的提案（Value）。

在多副本状态机中，每个副本同时具有Proposer、Acceptor、Learner三种角色。

Paxos完成一次写操作需要两次来回，分别是prepare/promise, 和 propose/accept：

Paxos算法通过一个决议分为两个阶段（Learn阶段之前决议已经形成）：

第一阶段：Prepare阶段。Proposer向Acceptors发出Prepare请求，Acceptors针对收到的Prepare请求进行Promise承诺。

第二阶段：Accept阶段。Proposer收到多数Acceptors承诺的Promise后，向Acceptors发出Propose请求，Acceptors针对收到的Propose请求进行Accept处理。

第三阶段：Learn阶段。Proposer在收到多数Acceptors的Accept之后，标志着本次Accept成功，决议形成，将形成的决议发送给所有Learners。


Paxos算法流程中的每条消息描述如下：

Prepare: Proposer生成全局唯一且递增的Proposal ID (可使用时间戳加Server ID)，向所有Acceptors发送Prepare请求，这里无需携带提案内容，只携带Proposal ID即可。
Promise: Acceptors收到Prepare请求后，做出“两个承诺，一个应答”。
两个承诺：

1. 不再接受Proposal ID小于等于（注意：这里是<= ）当前请求的Prepare请求。

2. 不再接受Proposal ID小于（注意：这里是< ）当前请求的Propose请求。

一个应答：

不违背以前作出的承诺下，回复已经Accept过的提案中Proposal ID最大的那个提案的Value和Proposal ID，没有则返回空值。

Propose: Proposer 收到多数Acceptors的Promise应答后，从应答中选择Proposal ID最大的提案的Value，作为本次要发起的提案。如果所有应答的提案Value均为空值，则可以自己随意决定提案Value。然后携带当前Proposal ID，向所有Acceptors发送Propose请求。
Accept: Acceptor收到Propose请求后，在不违背自己之前作出的承诺下，接受并持久化当前Proposal ID和提案Value。
Learn: Proposer收到多数Acceptors的Accept后，决议形成，将形成的决议发送给所有Learners。

### Paxos第一阶段：准备Perpare/诺言Promises
　　Paxos的第一阶段是prepare/promise，准备阶段就是将建议值发送到各个目标节点。

　　当建议被发到目标节点后，流程会会检查建议中的序列号，是否是它们见到过的最高级，如果是最高级，它们会发出一个promise不再接受比这个新序列号更旧的建议了，这个诺言promise作为消息从许下诺言的流程发到提交建议新值的流程服务器，这个诺言消息给提交建议的流程后，提交建议的流程需要自己统计一下有多少其他流程已经发回它们的诺言promise了，如果判断数量上是否达到大多数？如果大多数流程已经同意接受这个建议或者更高级序列号的建议，这个提交建议的流程就能知道它获得了发言权(因为有大多数支持)，这样就开始讲话，算法中的下一步处理将可能进行；如果回复诺言的节点数量没有达到大多数，也就是共识没有达成，这样这个节点提交的建议将退出，客户端要求的写操作失败。

　　为了决定一个建议是否已经有足够的回复诺言promises, 提交建议者只是统计一下它接受到的 promise 消息数量，然后和整个系统中节点服务器数量比较一下，“足够”意味着大多数(N/2 + 1)个流程服务器在某段时间内都回复了诺言promises。如果超过一半的流程服务器没有返回诺言，这意味着这个建议没有被大多数通过，那么在前面描述的读算法中就不能满足大多数的要求，也就不能达成共识，这个建议就退出。其他包括网络分区错误也可能会阻止大多数达成共识，


### 第二阶段：Paoxs接纳Acceptance
　　当完成prepare/promise阶段，进入了 propose/accept阶段。

　　一旦建议提交者已经从大多数其他流程服务器获得了诺言，它会要求许诺的流程服务器接收它们之前承诺接受的新值数据，这是一个“确认commit”阶段，如果没有冲突建议 失败或分区错误，那么这个新建议将被所有其他节点接受，那么Paxos过程就完成了。

　　你能看到右边的演示，注意这个演示比上面promise在最后多了一个动作，也就是提交建议者将新值发给那些许诺言的流程服务器，让它们接受了这个新值。

　　接受的过程也许可能会发生失败，在回复了诺言消息以后，在接受到Accept消息之前，如果有足够多的服务器正好在这个时间段失败，那么接受行为只能是少数服务器，那么Paxos进入了厄运状态：一些流程服务器接受了新值，而不是全部的，这种不一致已经在前面读操作中描述：一个客户端试图从系统中大多数节点服务器读取它们同意接受的值，它发现一些节点服务器报告有不同的值数据，这会引起读失败，但是Paxos还保持一致性，不允许在没有达成共识情况下任何写操作发生，这种坏的情况在实践中经常通过重复接受阶段来让大多数节点最终接受。

### 总结

　　Paxos算法是保证在分布式系统中写操作能够顺利进行，保证系统中大多数状态是一致的，没有机会看到不一致，因此，Paxos算法的特点是一致性>可用性。

   vector clock向量时钟是另外一种保证复制的算法，其特点是可用性>一致性，但是，一旦发生冲突，不像Paxos能自行解决，需要人工干预编写代码解决。


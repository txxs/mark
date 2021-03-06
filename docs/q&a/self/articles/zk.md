# Zk

------------

在分布式场景中，zk的应用非常广泛，如：数据发布/订阅、命名服务、配置中心、分布式锁、集群管理、选主与服务发现等等。这不仅得益于zk类文件系统的数据模型和基于Watcher机制的分布式事件通知，也得益于zk特殊的高容错数据一致性协议。

Zookeeper是一个分布式开源框架，提供了协调分布式应用的基本服务，它向外部应用暴露一组通用服务——分布式同步（Distributed Synchronization）、命名服务（Naming Service）、集群维护（Group Maintenance） 等，简化分布式应用协调及其管理的难度，提供高性能的分布式服务。ZooKeeper本身可以以单机模式安装运行，不过它的长处在于通过分布式ZooKeeper集群（一个Leader，多个Follower），基于一定的策略来保证ZooKeeper集群的稳定性和可用性，从而实现分布式应用的可靠性。核心实现了分布式CAP原理的CP特性。

> 引用自：https://zhuanlan.zhihu.com/p/64702090

- 命名服务:在zookeeper的文件系统里创建一个目录，即有唯一的path。在我们使用tborg无法确定上游程序的部署机器时即可与下游程序约定好path，通过path即能互相探索发现，不见不散了。
- 配置服务:程序是需要配置的，如果程序分散部署在多台机器上，要逐个改变配置就变得困难。现在把这些配置全部放到zookeeper上去，保存在 Zookeeper的某个目录节点中，然后所有相关应用程序对这个目录节点进行监听，一旦配置信息发生变化，每个应用程序就会收到 Zookeeper 的通知，然后从 Zookeeper 获取新的配置信息应用到系统中就好。
- 集群管理：1)是否有机器退出：所有机器约定在父目录GroupMembers下创建临时目录节点，然后监听父目录节点的子节点变化消息。一旦有机器挂掉，该机器与 zookeeper的连接断开，其所创建的临时目录节点被删除，所有其他机器都收到通知：某个兄弟目录被删除，于是，所有人都知道了。新机器加入 也是类似，所有机器收到通知：新兄弟目录加入，highcount又有了；2)选举master：所有机器创建临时顺序编号目录节点，每次选取编号最小的机器作为master就好。
- 分布式锁：锁服务可以分为两类，一个是保持独占，另一个是控制时序。对于第一类，我们将zookeeper上的一个znode看作是一把锁，通过createznode的方式来实现。所有客户端都去创建 /distribute_lock 节点，最终成功创建的那个客户端也即拥有了这把锁。厕所有言：来也冲冲，去也冲冲，用完删除掉自己创建的distribute_lock 节点就释放出锁。对于第二类， /distribute_lock 已经预先存在，所有客户端在它下面创建临时顺序编号目录节点，和选master一样，编号最小的获得锁，用完删除，依次方便。
- 队列管理：两种类型的队列：1、 同步队列，当一个队列的成员都聚齐时，这个队列才可用，否则一直等待所有成员到达。2、队列按照 FIFO 方式进行入队和出队操作。第一类，在约定目录下创建临时目录节点，监听节点数目是否是我们要求的数目。第二类，和分布式锁服务中的控制时序场景基本原理一致，入列有编号，出列按编号。


### 一、主要结构

Zookeeper = 文件系统 + 通知机制

#### 1.1 Znode存储结构

ZooKeeper数据模型的结构与Unix文件系统很类似，整体上可以看作是一棵树，每个节点称做一个ZNode。每一个ZNode默认能够存储1MB的数据，每个ZNode都可以通过其路径唯一标识。

Zookeeper采用层次化目录结构存储数据。目录 ==节点，在zookeeper中称为Znode。Znode的特点：

- 一次写入、多次读取，数据写入后不可更改。
- 可以存储多个版本的数据，以实现更新顺序性。
- 一次性读取整个Znode，不支持部分读取。
  根据数据的生命周期，具有4种节点，在创建时确定并且不能再修改。

    - 临时节点（EPHEMERAL）：不支持子节点，会在客户端会话结束时被删除。
    - 临时顺序节点（EPHEMERAL_SEQUENTIAL）:临时节点，但父节点会为一级子节点记录创建时间，记录节点的创建顺序。
    - 持久节点（PERSISTENT）:持久存储，一般根据客户端需求删除。
    - 持久顺序节点(PERSISTENT_SEQUENTIAL):持久节点，但父节点会为一级子节点记录创建时间，记录节点的创建顺序。

#### 1.2 Watch机制

客户端可以通过watch机制关注Znode的信息变化，实现配置管理、数据同步和分布式锁等功能。客户端首先需要注册一个watch，来观察某个Znode。当出现数据更新或被删除、子节点发生变化等情况时，Zookeeper集群会通过异步消息向客户端发送事件通知。通知发送后，该watcher就会失效，如果此时再发送信息变化，客户端就无法获取新的通知，除非客户端在进行新的注册。可见，watch机制能够确保消息的顺序性（旧消息被接收之前，客户端无法获得新消息）以及最终一致性，但无法确保所有的数据变化都能够被观察到。

1) 节点变更事件类型(Watcher.Event.EventType):

- None:空事件类型,表示当前事件不是节点变更事件(极有可能是KeeperState事件)
- NodeCreated :当注册的watcher所关注的节点被创建时
- NodeDeleted :当注册的watcher所关注的节点被删除时
- NodeDataChanged :当注册的watcher所关注的节点数据被update时
- NodeChildrenChanged:当注册的watcher所关注的节点的子节点列表有变更时.

2) Server状态事件 (Watcher.Event.KeeperState):此类型事件为了告知client端,此时server端状态发生了何种变更

- Disconnected:当client端失去链接时,将会发出一个本地消息(此event非server端返回),接下来也极有可能会抛出异常(例如: ConnectionLossException, SessionExpiredException, SessionMovedException等..)
- SyncConnected:client已经成功和ZK server建立连接,通常和Follower或者Leader建立连接.
- AuthFailed:授权验证失败,比如建立连接时,链接重建或者session校验时.
- ConnectedReadOnly:client和一个read-only server建立了链接.可能因为环境问题,导致当前client无法找到ZK 环境中的”Followers”或者客户端被允许连接到Observer类型的server上.
- Expired:当前session已经过期,其数据已经被cluster移除;这种信息是非常致命的,可能是因为client端长时间离群,或者ZK 集群已经失效太久;一旦出现这个事件,唯一的办法就是new Zookeeper(…)

> 引用自：https://juejin.cn/post/6974737393324654628

watch过程（客户端要注册观察节点，服务端要进行统治，两个部分都要进行）

- 客户端 Watch 注册实现过程：客户端的实现过程，在发送一个 Watch 监控事件的会话请求时，ZooKeeper 客户端主要做了两个工作：标记该会话是一个带有 Watch 事件的请求；将 Watch 事件存储到 ZKWatchManager以 getData 接口为例。当发送一个带有 Watch 事件的请求时，客户端首先会把该会话标记为带有 Watch 监控的事件请求，之后通过 DataWatchRegistration 类来保存 watcher 事件和节点的对应关系。之后客户端向服务器发送请求时，是将请求封装成一个 Packet 对象，并添加到一个等待发送队列 outgoingQueue 中。最后，ZooKeeper 客户端就会向服务器端发送这个请求，完成请求发送后。调用负责处理服务器响应的 SendThread 线程类中的 readResponse 方法接收服务端的回调，并在最后执行 finishPacket（）方法将 Watch 注册到 ZKWatchManager 中
- 服务端 Watch 注册实现过程：Zookeeper 服务端处理 Watch 事件基本有 2 个过程：解析收到的请求是否带有 Watch 注册事件；将对应的 Watch 事件存储到 WatchManager。服务端 Watch 事件的触发过程。在客户端和服务端都对 watch 注册完成后，在 ZooKeeper 中触发一个 Watch 事件的底层实现过程：以 setData 接口即“节点数据内容发生变更”事件为例。在 setData 方法内部执行完对节点数据的变更后，会调用 WatchManager.triggerWatch 方法触发数据变更事件。triggerWatch 函数内部，封装了一个具有会话状态、事件类型、数据节点 3 种属性的 WatchedEvent 对象。之后查询该节点注册的 Watch 事件，如果为空说明该节点没有注册过 Watch 事件。如果存在 Watch 事件则添加到定义的 Wathcers 集合中，并在 WatchManager 管理中删除。最后，通过调用 process 方法向客户端发送通知。

简单点就是：

- 客户端调用getData方法，watch参数是true。服务端接到请求，返回节点数据，并且在对应的哈希表里插入被Watch的Znode路径，以及Watcher列表。
- 当被Watch的Znode已删除，服务端会查找哈希表，找到该Znode对应的所有Watcher，异步通知客户端，并且删除哈希表中对应的Key-Value。

> 引用自：https://zhuanlan.zhihu.com/p/64702090

### 二、Zookeeper内部原理

#### 2.1 选举机制

当leader崩溃或者leader失去大多数的follower，这时候zk进入恢复模式，恢复模式需要重新选举出一个新的leader，让所有的 Server都恢复到一个正确的状态。Zk的选举算法有两种：一种是基于basic paxos实现的，另外一种是基于fast paxos算法实现的。系统默认的选举算法为fast paxos。先介绍basic paxos流程：

- 1 .选举线程由当前Server发起选举的线程担任，其主要功能是对投票结果进行统计，并选出推荐的Server；
- 2 .选举线程首先向所有Server发起一次询问(包括自己)；
- 3 .选举线程收到回复后，验证是否是自己发起的询问(验证zxid是否一致)，然后获取对方的id(myid)，并存储到当前询问对象列表中，最后获取对方提议的leader相关信息( id,zxid)，并将这些信息存储到当次选举的投票记录表中；
- 4. 收到所有Server回复以后，就计算出zxid最大的那个Server，并将这个Server相关信息设置成下一次要投票的Server；
- 5. 线程将当前zxid最大的Server设置为当前Server要推荐的Leader，如果此时获胜的Server获得n/2 + 1的Server票数， 设置当前推荐的leader为获胜的Server，将根据获胜的Server相关信息设置自己的状态，否则，继续这个过程，直到leader被选举出来。

通过流程分析我们可以得出：要使Leader获得多数Server的支持，则Server总数必须是奇数2n+1，且存活的Server的数目不得少于n+1.

#### 2.2 同步流程

- Leader领导者 ：Leader 节点负责Zookeeper集群内部投票的发起和决议（一次事务操作），更新系统的状态；同时它也能接收并且响应Client端发送的请求
- Follower 跟随者： Follower节点用于接收并且响应Client端的请求，如果是事务操作，会将请求转发给Leader节点，发起投票，参与集群的内部投票
- Observer 观察者：Observer节点功能和Follower相同，只是Observer 节点不参与投票过程，只会同步Leader节点的状态。

选完leader以后，zk就进入状态同步过程。

- 1. leader等待server连接；
- 2 .Follower连接leader，将最大的zxid发送给leader；
- 3 .Leader根据follower的zxid确定同步点；
- 4 .完成同步后通知follower 已经成为uptodate状态；
- 5 .Follower收到uptodate消息后，又可以重新接受client的请求进行服务了。

> 引用自：https://zhuanlan.zhihu.com/p/25594630

#### 2.3 zookeeper一致性协议

zookeeper实现数据一致性的核心是ZAB协议（Zookeeper原子消息广播协议）。该协议需要做到以下几点：
- （1）集群在半数以下节点宕机的情况下，能正常对外提供服务；
- （2）客户端的写请求全部转交给leader来处理，leader需确保写变更能实时同步给所有follower及observer；
- （3）leader宕机或整个集群重启时，需要确保那些已经在leader服务器上提交的事务最终被所有服务器都提交，确保丢弃那些只在leader服务器上被提出的事务，并保证集群能快速恢复到故障前的状态。Zab协议有两种模式， 崩溃恢复（选主+数据同步）和消息广播（事务操作）。任何时候都需要保证只有一个主进程负责进行事务操作，而如果主进程崩溃了，就需要迅速选举出一个新的主进程。主进程的选举机制与事务操作机制是紧密相关的。

崩溃恢复

（1）设置状态为LOOKING，初始化内部投票Vote (id,zxid) 数据至内存，并将其广播到集群其它节点。节点首次投票都是选举自己作为leader，将自身的服务ID、处理的最近一个事务请求的ZXID（ZXID是从内存数据库里取的，即该节点最近一个完成commit的事务id）及当前状态广播出去。然后进入循环等待及处理其它节点的投票信息的流程中。

（2）循环等待流程中，节点每收到一个外部的Vote信息，都需要将其与自己内存Vote数据进行PK，规则为取ZXID大的，若ZXID相等，则取ID大的那个投票。若外部投票胜选，节点需要将该选票覆盖之前的内存Vote数据，并再次广播出去；同时还要统计是否有过半的赞同者与新的内存投票数据一致，无则继续循环等待新的投票，有则需要判断leader是否在赞同者之中，在则退出循环，选举结束，根据选举结果及各自角色切换状态，leader切换成LEADING、follower切换到FOLLOWING、observer切换到OBSERVING状态

广播(同步)

一旦leader已经和多数的follower进行了状态同步后，他就可以开始广播消息了，即进入广播状态。这时候当一个server加入zookeeper服务中，它会在恢复模式下启动，发现leader，并和leader进行状态同步。待到同步结束，它也参与消息广播。
Zookeeper服务一直维持在Broadcast状态，直到leader崩溃了或者leader失去了大部分的followers支持。

> 引用自：https://www.jianshu.com/p/5300f1f454e8 和 https://blog.51cto.com/kinglab/2447330

#### 2.4 ZK的读写流程

> 引用自：https://www.sparksys.top/archives/24

zk写流程：（广播或者事物，类似于两断提交，leader先propose，然后flower进行ACK，然后leader再发送消息进行ACK）

写入请求直接发送到Leader节点时的操作步骤如下：

- 1.Client向Leader发出写请求。
- 2.Leader将数据写入到本节点，并将数据发送到所有的Follower节点；
- 3.等待Follower节点返回；
- 4.当Leader接收到一半以上节点(包含自己)返回写成功的信息之后，返回写入成功消息给client;

写入请求发送到Follower节点的操作步骤如下：

- 1.Client向Follower发出写请求
- 2.Follower节点将请求转发给Leader
- 3.Leader将数据写入到本节点，并将数据发送到所有的Follower节点
- 4.等待Follower节点返回
- 5.Leader 节点需要等待所有 Follower 节点的反馈，一旦超过半数的 Follower 节点进行了正确的反馈（执行事务成功），那么 Leader 就会再次向所有的 Follower 节点发送 commit 消息，要求各个 follower 节点对前面的一个 Proposal 进行提交。
- 6.原来的Follower返回写入成功消息给Client

leader通过transaction（事务）的形式广播执行，这个过程是怎样的呢？
- （1）leader 会给所有follower发送一个PROPOSAL提案消息
- （2）一个follower接收到这次PROPOSAL消息，写到磁盘，发送给leader一个ACK消息，告知已经收到。
- （3）当Leader收到法定人数（quorum）的follower的ACK时候，发送commit消息执行。 注意：只有发送commit之后，做的修改才会提交，不然是会回退的；如果发现写入超时，是会回退这个更新操作

zk读流程：

读是局部姓的，即client只需要从与它相连的follower上读取数据即可

#### 2.5 ZXID

zxid，也就是事务id， 为了保证事务的顺序一致性，zookeeper 采用了递增的事 务 id 号（zxid）来标识事务。所有的提议（proposal）都 在被提出的时候加上了 zxid。实现中 zxid 是一个 64 位的 数字，它高32位是epoch（ZAB协议通过epoch编号来 区分 Leader 周期变化的策略）用来标识 leader 关系是否 改变，每次一个 leader 被选出来，它都会有一个新的 epoch=（原来的epoch+1），标识当前属于那个leader的 统治时期。低32位用于递增计数
epoch ：可以理解为当前集群所处的年代或者周期，每个 leader 就像皇帝，都有自己的年号，所以每次改朝换代， leader 变更之后，都会在前一个年代的基础上加 1 。这样 就算旧的 leader 崩 溃 恢 复 之 后 ，也 没 有 人 听 他 的 了 ，因 为 follower 只听从当前年代的 leader 的命令。

> 引用自：https://blog.csdn.net/zgpeace/article/details/108598794

### 三、基本概念

#### 3.1 概念
- data：Znode存储的数据信息。
- ACL：记录Znode的访问权限，即哪些人或哪些IP可以访问本节点。
- stat：包含Znode的各种元数据，比如事务ID、版本号、时间戳、大小等等。
- child：当前节点的子节点引用，类似于二叉树的左孩子右孩子。

#### 3.2 基本操作

- create：创建节点
- delete：删除节点
- exists：判断节点是否存在
- getData：获得一个节点的数据
- setData：设置一个节点的数据
- getChildren：获取节点下的所有子节点

这其中，exists，getData，getChildren属于读操作。Zookeeper客户端在请求读操作的时候，可以选择是否设置Watch。



### 自己的文章

https://blog.csdn.net/maoyeqiu/article/details/102950220

https://blog.csdn.net/maoyeqiu/article/details/102891080

https://blog.csdn.net/maoyeqiu/article/details/103243183
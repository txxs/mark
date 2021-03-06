原文地址：
有脑裂图 https://www.iloveqyc.com/2019/03/25/zookeeper-zab/ 

ZAB协议选主过程详解 https://zhuanlan.zhihu.com/p/27335748

Zookeeper系列（5）--ZAB协议，消息广播，崩溃恢复，数据同步 https://blog.csdn.net/u013679744/article/details/79240249

有选举状体图 http://www.solinx.co/archives/435


ZooKeeper为高可用的一致性协调框架，自然的ZooKeeper也有着一致性算法的实现，ZooKeeper使用的是ZAB协议作为数据一致性的算法，ZAB（ZooKeeper Atomic Broadcast ）全称为：原子消息广播协议；ZAB可以说是在Paxos算法基础上进行了扩展改造而来的，ZAB协议设计了支持崩溃恢复，ZooKeeper使用单一主进程Leader用于处理客户端所有事务请求，采用ZAB协议将服务器数状态以事务形式广播到所有Follower上；由于事务间可能存在着依赖关系，ZAB协议保证Leader广播的变更序列被顺序的处理，：一个状态被处理那么它所依赖的状态也已经提前被处理；ZAB协议支持的崩溃恢复可以保证在Leader进程崩溃的时候可以重新选出Leader并且保证数据的完整性；
　　在ZooKeeper中所有的事务请求都由一个主服务器也就是Leader来处理，其他服务器为Follower，Leader将客户端的事务请求转换为事务Proposal，并且将Proposal分发给集群中其他所有的Follower，然后Leader等待Follwer反馈，当有过半数（>=N/2+1）的Follower反馈信息后，Leader将再次向集群内Follower广播Commit信息，Commit为将之前的Proposal提交；

### 协议状态
　　ZAB协议中存在着三种状态，每个节点都属于以下三种中的一种：

　　1. Looking：系统刚启动时或者Leader崩溃后正处于选举状态

　　2. Following：Follower节点所处的状态，Follower与Leader处于数据同步阶段；

　　3. Leading：Leader所处状态，当前集群中有一个Leader为主进程；

　　ZooKeeper启动时所有节点初始状态为Looking，这时集群会尝试选举出一个Leader节点，选举出的Leader节点切换为Leading状态；当节点发现集群中已经选举出Leader则该节点会切换到Following状态，然后和Leader节点保持同步；当Follower节点与Leader失去联系时Follower节点则会切换到Looking状态，开始新一轮选举；在ZooKeeper的整个生命周期中每个节点都会在Looking、Following、Leading状态间不断转换；


　　选举出Leader节点后ZAB进入原子广播阶段，这时Leader为和自己同步的每个节点Follower创建一个操作序列，一个时期一个Follower只能和一个Leader保持同步，Leader节点与Follower节点使用心跳检测来感知对方的存在；当Leader节点在超时时间内收到来自Follower的心跳检测那Follower节点会一直与该节点保持连接；若超时时间内Leader没有接收到来自过半Follower节点的心跳检测或TCP连接断开，那Leader会结束当前周期的领导，切换到Looking状态，所有Follower节点也会放弃该Leader节点切换到Looking状态，然后开始新一轮选举；

### 阶段
　　ZAB协议定义了选举（election）、发现（discovery）、同步（sync）、广播(Broadcast)四个阶段；ZAB选举（election）时当Follower存在ZXID（事务ID）时判断所有Follower节点的事务日志，只有lastZXID的节点才有资格成为Leader，这种情况下选举出来的Leader总有最新的事务日志，基于这个原因所以ZooKeeper实现的时候把发现（discovery）与同步（sync）合并为恢复（recovery）阶段；
  
　　1. Election：在Looking状态中选举出Leader节点，Leader的lastZXID总是最新的；
  
　　2. Discovery：Follower节点向准Leader推送FOllOWERINFO，该信息中包含了上一周期的epoch，接受准Leader的NEWLEADER指令，检查newEpoch有效性，准Leader要确保Follower的epoch与ZXID小于或等于自身的；
  
　　3. sync：将Follower与Leader的数据进行同步，由Leader发起同步指令，最总保持集群数据的一致性；
  
　　4. Broadcast：Leader广播Proposal与Commit，Follower接受Proposal与Commit；
  
　　5. Recovery：在Election阶段选举出Leader后本阶段主要工作就是进行数据的同步，使Leader具有highestZXID，集群保持数据的一致性；

　　#### 选举（Election）
　　election阶段必须确保选出的Leader具有highestZXID，否则在Recovery阶段没法保证数据的一致性，Recovery阶段Leader要求Follower向自己同步数据没有Follower要求Leader保持数据同步，所有选举出来的Leader要具有最新的ZXID；
  
　　在选举的过程中会对每个Follower节点的ZXID进行对比只有highestZXID的Follower才可能当选Leader；
选举流程：

　　1. 每个Follower都向其他节点发送选自身为Leader的Vote投票请求，等待回复；
  
　　2. Follower接受到的Vote如果比自身的大（ZXID更新）时则投票，并更新自身的Vote，否则拒绝投票；
  
　　3. 每个Follower中维护着一个投票记录表，当某个节点收到过半的投票时，结束投票并把该Follower选为Leader，投票结束；

　　ZAB协议中使用ZXID作为事务编号，ZXID为64位数字，低32位为一个递增的计数器，每一个客户端的一个事务请求时Leader产生新的事务后该计数器都会加1，高32位为Leader周期epoch编号，当新选举出一个Leader节点时Leader会取出本地日志中最大事务Proposal的ZXID解析出对应的epoch把该值加1作为新的epoch，将低32位从0开始生成新的ZXID；ZAB使用epoch来区分不同的Leader周期；

　　#### 恢复（Recovery）
　　在election阶段选举出来的Leader已经具有最新的ZXID，所有本阶段的主要工作是根据Leader的事务日志对Follower节点数据进行更新；
　　Leader：Leader生成新的ZXID与epoch，接收Follower发送过来的FOllOWERINFO（含有当前节点的LastZXID）然后往Follower发送NEWLEADER；Leader根据Follower发送过来的LastZXID根据数据更新策略向Follower发送更新指令；
　　同步策略：
　　1. SNAP：如果Follower数据太老，Leader将发送快照SNAP指令给Follower同步数据；
  
　　2. DIFF：Leader发送从Follolwer.lastZXID到Leader.lastZXID议案的DIFF指令给Follower同步数据；
  
　　3. TRUNC：当Follower.lastZXID比Leader.lastZXID大时，Leader发送从Leader.lastZXID到Follower.lastZXID的TRUNC指令让Follower丢弃该段数据；
  
　　Follower：往Leader发送FOLLOERINFO指令，Leader拒绝就转到Election阶段；接收Leader的NEWLEADER指令，如果该指令中epoch比当前Follower的epoch小那么Follower转到Election阶段；Follower还有主要工作是接收SNAP/DIFF/TRUNC指令同步数据与ZXID，同步成功后回复ACKNETLEADER，然后进入下一阶段；Follower将所有事务都同步完成后Leader会把该节点添加到可用Follower列表中；
  
　　SNAP与DIFF用于保证集群中Follower节点已经Committed的数据的一致性，TRUNC用于抛弃已经被处理但是没有Committed的数据；

　　#### 广播(Broadcast)
　　客户端提交事务请求时Leader节点为每一个请求生成一个事务Proposal，将其发送给集群中所有的Follower节点，收到过半Follower的反馈后开始对事务进行提交，ZAB协议使用了原子广播协议；在ZAB协议中只需要得到过半的Follower节点反馈Ack就可以对事务进行提交，这也导致了Leader几点崩溃后可能会出现数据不一致的情况，ZAB使用了崩溃恢复来处理数字不一致问题；消息广播使用了TCP协议进行通讯所有保证了接受和发送事务的顺序性。广播消息时Leader节点为每个事务Proposal分配一个全局递增的ZXID（事务ID），每个事务Proposal都按照ZXID顺序来处理；
  
　　Leader节点为每一个Follower节点分配一个队列按事务ZXID顺序放入到队列中，且根据队列的规则FIFO来进行事务的发送。Follower节点收到事务Proposal后会将该事务以事务日志方式写入到本地磁盘中，成功后反馈Ack消息给Leader节点，Leader在接收到过半Follower节点的Ack反馈后就会进行事务的提交，以此同时向所有的Follower节点广播Commit消息，Follower节点收到Commit后开始对事务进行提交；

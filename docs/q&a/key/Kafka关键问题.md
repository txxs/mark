1. Kafka一致性（可靠性）原理。 
   
- 生产者：
  - 生产的消息需要被ac，有三种ack的方式，分别是全部副本要ack；全部副本不需要ack；还有就是ISR，ISR是在延迟时间内可以和leader保持一致的副本。 
  - 另外还有幂等：通过produceID+序列号的方式实现。而消费者这边也是两种。 
   
- 消费者：
  - 分别是高水位，只有高水位的消息才会被消费，这样就保证了副本的一致性。
  - 另外就是消费了的消息才会被提交，保证了单副本的一致性。
   
- 故障时期：
   HW 更新是需要一轮额外的拉取请求才能实现，Follower 副本要拉取 Leader 副本的数据，也就是说，Leader 副本 HW 更新和 Follower 副本 HW 更新在时间上是存在错配的。这种错配是很多“数据丢失”或“数据不一致”问题的根源。因此社区在 0.11 版本正式引入了 「Leader Epoch」 概念，来规避因 HW 更新错配导致的各种不一致问题。
   所谓 Leader Epoch，我们大致可以认为是 Leader 版本。它由两部分数据组成
   1）Epoch: 一个单调递增的版本号。每当副本 Leader 权力发生变更时，都会增加该版本号。小版本号的 Leader 被认为是过期 Leader，不能再行使 Leader 权力。
   2）起始位移（Start Offset）: Leader 副本在该 Epoch 值上写入的首条消息的位移。

- 代码层面：
  看3


2. Kafka 为什么能那么快 | Kafka高效读写数据的原因据的原因 | 吞吐量大的原因？
- partition 并行处理 
- 顺序写磁盘，充分利用磁盘特性
- 利用了现代操作系统分页存储 Page Cache 来利用内存提高 I/O 效率
- 采用了零拷贝技术
   - Producer 生产的数据持久化到 broker，采用 mmap 文件映射，实现顺序的快速写入
   - Customer 从 broker 读取数据，采用 sendfile，将磁盘文件读到 OS 内核缓冲区后，转到 NIO buffer进行网络发送，减少 CPU 消耗

3. 如何保证消息队列的幂等性？
   
   一个是生产者幂等，另外一个是消费者幂等。生产者幂等是设置参数为true。消费者幂等，更多的是通过程序保证：
   向数据库insert数据时，先根据主键查询，若数据存在则不insert，改为update
   向Redis中写数据可以用set去重，天然保证幂等性
   生产者发送每条消息时，增加一个全局唯一id（类似订单id），消费者消费到时，先根据这个id去Redis中查询是否消费过该消息。如果没有消费过，就处理，将id写入Redis；如果消费过了，那么就不处理，保证不重复处理相同消息。
   基于数据库的唯一键约束来保证不会插入重复的数据，当消费者企图插入重复数据到数据库时，会报错。

4. 谈一谈 Kafka 的再均衡
   
   发生条件
   - 一：分区数放生变化
   - 二：topic发生变化
   - 三：消费者发生变化

   - 第一步：所有成员都向 coordinator 发送请求，请求入组。一旦所有成员都发送了请求，coordinator 会从中选择一个consumer担任leader的角色，并把组成员信息以及订阅信息发给leader。 
   - 第二步：leader开始分配消费方案，指明具体哪个consumer负责消费哪些topic的哪些partition。一旦完成分配，leader会将这个方案发给coordinator。coordinator接收到分配方案之后会把方案发给各个consumer，这样组内

5. 再均衡策略
   
这里主要说的是消费的分区分配策略，我们知道一个 Consumer Group 中有多个 Consumer，一个 Topic 也有多个 Partition，所以必然会有 Partition 分配问题「 确定哪个 Partition 由哪个 Consumer 来消费的问题」。Kafka 客户端提供了3 种分区分配策略：RangeAssignor、RoundRobinAssignor 和 StickyAssignor，前两种分配方案相对简单一些StickyAssignor 分配方案相对复杂一些。

- RangeAssignor RangeAssignor 是 Kafka 默认的分区分配算法，它是按照 Topic 的维度进行分配的，首先对 每个Topic 的 Partition 按照分区ID进行排序，然后对订阅该 Topic 的 Consumer Group 的 Consumer 按名称字典进行排序，之后尽量均衡的按照范围区段将分区分配给 Consumer。此时也可能会造成先分配分区的 Consumer 任务过重（分区数无法被消费者数量整除）。 问题：优先分配前边几个消费组，如果消费者多partition少的情况下，总是前几个消费者分配。

- RoundRobinAssignor 该分区分配策略是将 Consumer Group 订阅的所有 Topic 的 Partition 及所有 Consumer 按照字典进行排序后尽量均衡的挨个进行分配。如果 Consumer Group 内，每个 Consumer 订阅都订阅了相同的Topic，那么分配结果是均衡的。如果订阅 Topic 是不同的，那么分配结果是不保证「 尽量均衡」的，因为某些 Consumer 可能不参与一些 Topic 的分配。 问题：单个topic和单个partition分配不均衡

- StickyAssignor 该分区分配算法是最复杂的一种，可以通过 partition.assignment.strategy 参数去设置，从 0.11 版本开始引入，目的就是在执行新分配时，尽量在上一次分配结果上少做调整，其主要实现了以下2个目标： 1、Topic Partition 的分配要尽量均衡。 2、当 Rebalance 发生时，尽量与上一次分配结果保持一致。 注意：当两个目标发生冲突的时候，优先保证第一个目标，这样可以使分配更加均匀，其中第一个目标是3种分配策略都尽量去尝试完成的， 而第二个目标才是该算法的精髓所在

6. 消费出现挤压
   
   发送端：发送端即生产者业务代码都是先执行自己的业务逻辑，最后再发送消息。如果说性能上不去，需要你优先检查一下，是不是发消息之前的业务逻辑耗时太多导致的。

   对于发送消息的业务逻辑，只需要注意设置合适的并发和批量大小，就可以达到很好的发送性能。我们知道 Producer 发消息给 Broker 且收到消息并返回 ack 响应，假设这一次过程的平均时延是 1ms，它包括了下面这些步骤的耗时：
   - 1）发送端在发送网络请求之前的耗时。
   - 2）发送消息和返回响应在网络传输中的耗时
   - 3）Broker 端处理消息的时延。
   
   假设此时你的发送端是单线程，每次只能发送 1 条消息，那么每秒只能发送 1000 条消息，这种情况下并不能发挥出 Kafka 的真实性能。此时无论是增加每次发送消息的批量大小，还是增加并发，都可以成倍地提升发送性能。

   如果当前发送端是在线服务的话，比较在意请求响应时延，此时可以采用并发方式来提升性能。
   如果当前发送端是离线服务的话，更关注系统的吞吐量，发送数据一般都来自数据库，此时更适合批量读取，批量发送来提升性能
   另外还需要关注下消息体是否过大，如果消息体过大，势必会增加 IO 的耗时，影响 Kafka 生产和消费的速度，也可能会造成消息积压

   首先看生产者是不不是流量增加，如果增加了就询问原因和沟通
   其次看消费者是不是有报错，如果必须要增加流量就需要评估增加流量的链路是否有问题，如果没有问题那手段可以是：增加并发度，增加线程，批量消费，无效的消息过滤等。

7. 发送端怎么避免fullfc
   弄一个内存池子，分块，批量发送的时候循环使用，同时不要释放这块内存，这样就可以避免fullgc。

8. 写入的过程可以总结为：

- Producer先从Zookeeper的"/brokers/.../state"节点找到该Partition的Leader。
- Producer将消息发送给该Leader。
- Leader将消息写入本地log。
- followers从Leader pull消息，写入本地log后Leader发送ACK。
- Leader收到所有ISR中的replica的ACK后，增加HW并向Producer发送ACK。

9. 存储机制
   一个topic可以分为多个partition，一个partition可以分为多个segment，一个segment可以分为index和log文件。
   index 和 log 文件以当前 Segment 的第一条消息的 Offset 命名
   分段的好处：好查询，好删除


10. kafka高可用：

- 备份机制：Kafka允许同一个Partition存在多个消息副本，每个Partition的副本通常由1个Leader及0个以上的Follower组成，生产者将消息直接发往对应Partition的Leader，Follower会周期地向Leader发送同步请求，同一Partition的Replica不应存储在同一个Broker上，因为一旦该Broker宕机，对应Partition的所有Replica都无法工作，这就达不到高可用的效果

- ISR机制：ISR 中的副本都是与 Leader 同步的副本，相反，不在 ISR 中的追随者副本就被认为是与 Leader 不同步的，这里的保持同步不是指与Leader数据保持完全一致，只需在replica.lag.time.max.ms时间内与Leader保持有效连接

- ACK机制：生产者发送消息中包含acks字段，该字段代表Leader应答生产者前Leader收到的应答数

- 故障恢复机制：「Kafka从0.8版本开始引入了一套Leader选举及失败恢复机制」，首先需要在集群所有Broker中选出一个Controller，负责各Partition的Leader选举以及Replica的重新分配当出现Leader故障后，Controller会将Leader/Follower的变动通知到需为此作出响应的Broker。Kafka使用ZooKeeper存储Broker、Topic等状态数据，Kafka集群中的Controller和Broker会在ZooKeeper指定节点上注册Watcher(事件监听器)，以便在特定事件触发时，由ZooKeeper将事件通知到对应Broker

11. kafka的事务

- 幂等设计只能保证单个 Producer 对于同一个<Topic, Partition>的Exactly Once语义，它并不能保证写操作的原子性——即多个写操作，要么全部被 Commit 要么全部不被 Commit。为了实现这一点，Kafka 0.11.0.0 引入了一个服务器端的模块，名为Transaction Coordinator，用于管理 Producer 发送的消息的事务性。该Transaction Coordinator维护Transaction Log，该 log 存于一个内部的 Topic 内。由于 Topic 数据具有持久性，因此事务的状态也具有持久性。Producer 并不直接读写Transaction Log，它与Transaction Coordinator通信，然后由Transaction Coordinator将该事务的状态插入相应的Transaction Log。 事务初始化是针对于多条的produrcert同时发送的情况：

- 事务初始化：Producer 在使用事务功能，必须先自定义一个唯一的 transaction id。有了 transaction id，即使客户端挂掉了，它重启后也能继续处理未完成的事务。Kafka 实现事务需要依靠幂等性，而幂等性需要指定 producer id 。所以Producer在启动事务之前，需要向 TC 服务申请 producer id。TC 服务在分配 producer id 后，会将它持久化到事务 topic。

- 发送消息：Producer 在接收到 producer id 后，就可以正常的发送消息了。不过发送消息之前，需要先将这些消息的分区地址，上传到 TC 服务。TC 服务会将这些分区地址持久化到事务 topic。然后 Producer 才会真正的发送消息，这些消息与普通消息不同，它们会有一个字段，表示自身是事务消息。这里需要注意下一种特殊的请求，提交消费位置请求，用于原子性的从某个 topic 读取消息，并且发送消息到另外一个 topic。我们知道一般是消费者使用消费组订阅 topic，才会发送提交消费位置的请求，而这里是由 Producer 发送的。Producer 首先会发送一条请求，里面会包含这个消费组对应的分区（每个消费组的消费位置都保存在 __consumer_offset topic 的一个分区里），TC 服务会将分区持久化之后，发送响应。Producer 收到响应后，就会直接发送消费位置请求给 GroupCoordinator。

- 发送提交请求：Producer 发送完消息后，如果认为该事务可以提交了，就会发送提交请求到 TC 服务。Producer 的工作至此就完成了，接下来它只需要等待响应。这里需要强调下，Producer 会在发送事务提交请求之前，会等待之前所有的请求都已经发送并且响应成功。

- 提交请求持久化：TC 服务收到事务提交请求后，会先将提交信息先持久化到事务 topic 。持久化成功后，服务端就立即发送成功响应给 Producer。然后找到该事务涉及到的所有分区，为每 个分区生成提交请求，存到队列里等待发送。读者可能有所疑问，在一般的二阶段提交中，协调者需要收到所有参与者的响应后，才能判断此事务是否成功，最后才将结果返回给客户。那如果 TC 服务在发送响应给 Producer 后，还没来及向分区发送请求就挂掉了，那么 Kafka 是如何保证事务完成。因为每次事务的信息都会持久化，所以 TC 服务挂掉重新启动后，会先从 事务 topic 加载事务信息，如果发现只有事务提交信息，却没有后来的事务完成信息，说明存在事务结果信息没有提交到分区。

- 发送事务结果信息给分区：后台线程会不停的从队列里，拉取请求并且发送到分区。当一个分区收到事务结果消息后，会将结果保存到分区里，并且返回成功响应到 TC服务。当 TC 服务收到所有分区的成功响应后，会持久化一条事务完成的消息到事务 topic。至此，一个完整的事务流程就完成了。





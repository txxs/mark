### 1. Kafka的用途有哪些？使用场景如何？
总结下来就几个字:异步处理、日常系统解耦、削峰、提速、广播

如果再说具体一点例如:消息,网站活动追踪,监测指标,日志聚合,流处理,事件采集,提交日志等

### 2. Kafka中的ISR、AR又代表什么？ISR的伸缩又指什么
ISR:In-Sync Replicas 副本同步队列

AR:Assigned Replicas 所有副本

ISR是由leader维护，follower从leader同步数据有一些延迟（包括延迟时间replica.lag.time.max.ms和延迟条数replica.lag.max.messages两个维度, 当前最新的版本0.10.x中只支持replica.lag.time.max.ms这个维度），任意一个超过阈值都会把follower剔除出ISR, 存入OSR（Outof-Sync Replicas）列表，新加入的follower也会先存放在OSR中。AR=ISR+OSR。

### 3. Kafka中的HW、LEO、LSO、LW等分别代表什么？
HW:High Watermark 高水位，取一个partition对应的ISR中最小的LEO作为HW，consumer最多只能消费到HW所在的位置上一条信息。

LEO:LogEndOffset 当前日志文件中下一条待写信息的offset

HW/LEO这两个都是指最后一条的下一条的位置而不是指最后一条的位置。

LSO:Last Stable Offset 对未完成的事务而言，LSO 的值等于事务中第一条消息的位置(firstUnstableOffset)，对已完成的事务而言，它的值同 HW 相同

LW:Low Watermark 低水位, 代表 AR 集合中最小的 logStartOffset 值

### 4. Kafka中是怎么体现消息顺序性的？
kafka每个partition中的消息在写入时都是有序的，消费时，每个partition只能被每一个group中的一个消费者消费，保证了消费时也是有序的。
整个topic不保证有序。如果为了保证topic整个有序，

1. 那么将partition调整为1

2. 通过哈希的方式将数据哈希到固定的节点上去

### 5. Kafka中的分区器、序列化器、拦截器是否了解？它们之间的处理顺序是什么？
拦截器->序列化器->分区器

### 6. Kafka生产者客户端的整体结构是什么样子的？
### 7. Kafka生产者客户端中使用了几个线程来处理？分别是什么？
2个，主线程和Sender线程。主线程负责创建消息，然后通过分区器、序列化器、拦截器作用之后缓存到累加器RecordAccumulator中。Sender线程负责将RecordAccumulator中消息发送到kafka中.

### 9. Kafka的旧版Scala的消费者客户端的设计有什么缺陷？
### 10. “消费组中的消费者个数如果超过topic的分区，那么就会有消费者消费不到数据”这句话是否正确？如果不正确，那么有没有什么hack的手段？
不正确，通过自定义分区分配策略，可以将一个consumer指定消费所有partition。

### 11. 消费者提交消费位移时提交的是当前消费到的最新消息的offset还是offset+1?
offset+1

### 12. 有哪些情形会造成重复消费？
消费者消费后没有commit offset

1. 程序崩溃
2. 强行kill
3. 消费耗时
4. 自动提交偏移情况下unscrible

### 13. 那些情景下会造成消息漏消费？
消费者没有处理完消息 提交offset

发生在自动提交的情况下：自动提交偏移 未处理情况下程序异常结束

### 14. KafkaConsumer是非线程安全的，那么怎么样实现多线程消费？
1.在每个线程中新建一个KafkaConsumer

2.单线程创建KafkaConsumer，多个处理线程处理消息（难点在于是否要考虑消息顺序性，offset的提交方式）

### 15. 简述消费者与消费组之间的关系

消费者从属与消费组，消费偏移以消费组为单位。每个消费组可以独立消费主题的所有数据，同一消费组内消费者共同消费主题数据，每个分区只能被同一消费组内一个消费者消费。

### 16. 当你使用kafka-topics.sh创建（删除）了一个topic之后，Kafka背后会执行什么逻辑？
创建:在zk上/brokers/topics/下节点 kafkabroker会监听节点变化创建主题
删除:调用脚本删除topic会在zk上将topic设置待删除标志，kafka后台有定时的线程会扫描所有需要删除的topic进行删除

### 17. topic的分区数可不可以增加？如果可以怎么增加？如果不可以，那又是为什么？
可以。当一个主题被创建之后，依然允许我们对其做一定的修改，比如修改分区个数、修改配置等，这个修改的功能就是由kafka-topics.sh脚本中的alter指令所提供。我们首先来看如何增加主题的分区数。

以前面的主题topic-config为例，当前分区数为1，修改为3，示例如下：

注意上面提示的告警信息：当主题中的消息包含有key时（即key不为null），根据key来计算分区的行为就会有所影响。当topic-config的分区数为1时，不管消息的key为何值，消息都会发往这一个分区中；当分区数增加到3时，那么就会根据消息的key来计算分区号，原本发往分区0的消息现在有可能会发往分区1或者分区2中。如此还会影响既定消息的顺序，所以在增加分区数时一定要三思而后行。对于基于key计算的主题而言，建议在一开始就设置好分区数量，避免以后对其进行调整。

### 18. topic的分区数可不可以减少？如果可以怎么减少？如果不可以，那又是为什么？

https://cloud.tencent.com/developer/news/329459

不可以。按照Kafka现有的代码逻辑而言，此功能完全可以实现，不过也会使得代码的复杂度急剧增大。实现此功能需要考虑的因素很多，比如删除掉的分区中的消息该作何处理？如果随着分区一起消失则消息的可靠性得不到保障；如果需要保留则又需要考虑如何保留。直接存储到现有分区的尾部，消息的时间戳就不会递增，如此对于Spark、Flink这类需要消息时间戳（事件时间）的组件将会受到影响；如果分散插入到现有的分区中，那么在消息量很大的时候，内部的数据复制会占用很大的资源，而且在复制期间，此主题的可用性又如何得到保障？与

此同时，顺序性问题、事务性问题、以及分区和副本的状态机切换问题都是不得不面对的。反观这个功能的收益点却是很低，如果真的需要实现此类的功能，完全可以重新创建一个分区数较小的主题，然后将现有主题中的消息按照既定的逻辑复制过去即可。

### 19. 创建topic时如何选择合适的分区数？

根据集群的机器数量和需要的吞吐量来决定适合的分区数。

https://www.iteblog.com/archives/1805.html

1. 越多的分区可以提供更高的吞吐量：

首先我们需要明白以下事实：在kafka中，单个patition是kafka并行操作的最小单元。在producer和broker端，向每一个分区写入数据是可以完全并行化的，此时，可以通过加大硬件资源的利用率来提升系统的吞吐量，例如对数据进行压缩。在consumer段，kafka只允许单个partition的数据被一个consumer线程消费。因此，在consumer端，每一个Consumer Group内部的consumer并行度完全依赖于被消费的分区数量。综上所述，通常情况下，在一个Kafka集群中，partition的数量越多，意味着可以到达的吞吐量越大。

　　我们可以粗略地通过吞吐量来计算kafka集群的分区数量。假设对于单个partition，producer端的可达吞吐量为p，Consumer端的可达吞吐量为c，期望的目标吞吐量为t，那么集群所需要的partition数量至少为max(t/p,t/c)。在producer端，单个分区的吞吐量大小会受到批量大小、数据压缩方法、 确认类型（同步/异步）、复制因子等配置参数的影响。经过测试，在producer端，单个partition的吞吐量通常是在10MB/s左右。在consumer端，单个partition的吞吐量依赖于consumer端每个消息的应用逻辑处理速度。因此，我们需要对consumer端的吞吐量进行测量。

2. 越多的分区可能增加端对端的延迟

Kafka端对端延迟定义为producer端发布消息到consumer端接收消息所需要的时间。即consumer接收消息的时间减去producer发布消息的时间。Kafka只有在消息提交之后，才会将消息暴露给消费者。例如，消息在所有in-sync副本列表同步复制完成之后才暴露。因此，in-sync副本复制所花时间将是kafka端对端延迟的最主要部分。在默认情况下，每个broker从其他broker节点进行数据副本复制时，该broker节点只会为此工作分配一个线程，该线程需要完成该broker所有partition数据的复制。经验显示，将1000个partition从一个broker到另一个broker所带来的时间延迟约为20ms，这意味着端对端的延迟至少是20ms。这样的延迟对于一些实时应用需求来说显得过长。

　　注意，上述问题可以通过增大kafka集群来进行缓解。例如，将1000个分区leader放到一个broker节点和放到10个broker节点，他们之间的延迟是存在差异的。在10个broker节点的集群中，每个broker节点平均需要处理100个分区的数据复制。此时，端对端的延迟将会从原来的数十毫秒变为仅仅需要几毫秒。

　　根据经验，如果你十分关心消息延迟问题，限制每个broker节点的partition数量是一个很好的主意：对于b各broker节点和复制因子为r的kafka集群，整个kafka集群的partition数量最好不超过100*b*r个，即单个partition的leader数量不超过100. 


### 20. Kafka目前有那些内部topic，它们都有什么特征？各自的作用又是什么？
__consumer_offsets 以下划线开头，保存消费组的偏移

### 21. 优先副本是什么？它有什么特殊的作用？
优先副本 会是默认的leader副本 发生leader变化时重选举会优先选择优先副本作为leader

### 22. Kafka有哪几处地方有分区分配的概念？简述大致的过程及原理

https://blog.csdn.net/qq_39907763/article/details/82697211

https://juejin.im/post/5d1df788f265da1b8811fa7b

对于用户而言，当调用send方法发送消息之后，消息就自然而然的发送到了broker中。其实在这一过程中，有可能还要经过拦截器、序列化器和分区器（Partitioner）的一系列作用之后才能被真正地发往broker。

1. 生产者的分区分配

当key为空时，消息随机发送到各个分区（各个版本会有不同，有的是采用轮询的方式，有的是随机，有的是一定时间内只发送给固定partition,隔一段时间后随机换一个）; 用key的ha’sh值对partion个数取模，决定要把消息发送到哪个partition上

2. 消费者的分区分配

在Kafka的默认规则中，每一个分区只能被同一个消费组中的一个消费者消费。消费者的分区分配是指为消费组中的消费者分配所订阅主题中的分区。

### 23. 简述Kafka的日志目录结构

每个partition一个文件夹，包含四类文件.index .log .timeindex leader-epoch-checkpoint

.index:前缀为上一个segment的最后一个消息的偏移

.log:log文件中保存了所有的消息

.timeindex: timeindex保存的则是时间索引

leader-epoch-checkpoint中保存了每一任leader开始写入消息时的offset 会定时更新

follower被选为leader时会根据这个确定哪些消息可用

### 24. Kafka中有那些索引文件？
如上

### 25. 如果我指定了一个offset，Kafka怎么查找到对应的消息？

1. 通过文件名前缀数字x找到该绝对offset 对应消息所在文件

2. offset-x为在文件中的相对偏移

3. 通过index文件中记录的索引找到最近的消息的位置

4. 从最近位置开始逐条寻找

### 26. 如果我指定了一个timestamp，Kafka怎么查找到对应的消息？
原理同上 但是时间的因为消息体中不带有时间戳 所以不精确

### 27. 聊一聊你对Kafka的Log Retention的理解
kafka留存策略包括 删除和压缩两种

删除: 根据时间和大小两个方式进行删除 大小是整个partition日志文件的大小

超过的会从老到新依次删除 时间指日志文件中的最大时间戳而非文件的最后修改时间

压缩: 相同key的value只保存一个 压缩过的是clean 未压缩的dirty 压缩之后的偏移量不连续 未压缩时连续

### 28. 聊一聊你对Kafka的Log Compaction的理解
### 29. 聊一聊你对Kafka底层存储的理解（页缓存、内核层、块层、设备层）
### 30. 聊一聊Kafka的延时操作的原理
### 31. 聊一聊Kafka控制器的作用
### 32. 消费再均衡的原理是什么？（提示：消费者协调器和消费组协调器）
### 33. Kafka中的幂等是怎么实现的

pid+序号实现，单个producer内幂等

### 33. Kafka中的事务是怎么实现的（这题我去面试6家被问4次，照着答案念也要念十几分钟，面试官简直凑不要脸。实在记不住的话…只要简历上不写精通Kafka一般不会问到，我简历上写的是“熟悉Kafka，了解RabbitMQ….”）

https://blog.csdn.net/u013256816/article/details/89135417

https://zhmin.github.io/2019/05/20/kafka-transaction/

Kafka是如何具体实现幂等的呢？Kafka为此引入了producer id（以下简称PID）和序列号（sequence number）这两个概念。每个新的生产者实例在初始化的时候都会被分配一个PID，这个PID对用户而言是完全透明的。对于每个PID，消息发送到的每一个分区都有对应的序列号，这些序列号从0开始单调递增。生产者每发送一条消息就会将对应的序列号的值加1。


### 34. Kafka中有那些地方需要选举？这些地方的选举策略又有哪些？

https://blog.csdn.net/u013256816/article/details/89369160

1. 控制器的选举

在Kafka集群中会有一个或多个broker，其中有一个broker会被选举为控制器（Kafka Controller），它负责管理整个集群中所有分区和副本的状态等工作。比如当某个分区的leader副本出现故障时，由控制器负责为该分区选举新的leader副本。再比如当检测到某个分区的ISR集合发生变化时，由控制器负责通知所有broker更新其元数据信息。

Kafka Controller的选举是依赖Zookeeper来实现的，在Kafka集群中哪个broker能够成功创建/controller这个临时（EPHEMERAL）节点他就可以成为Kafka Controller。

2. 分区leader的选举

分区leader副本的选举由Kafka Controller 负责具体实施。当创建分区（创建主题或增加分区都有创建分区的动作）或分区上线（比如分区中原先的leader副本下线，此时分区需要选举一个新的leader上线来对外提供服务）的时候都需要执行leader的选举动作。

基本思路是按照AR集合中副本的顺序查找第一个存活的副本，并且这个副本在ISR集合中。一个分区的AR集合在分配的时候就被指定，并且只要不发生重分配的情况，集合内部副本的顺序是保持不变的，而分区的ISR集合中副本的顺序可能会改变。注意这里是根据AR的顺序而不是ISR的顺序进行选举的。这个说起来比较抽象，有兴趣的读者可以手动关闭/开启某个集群中的broker来观察一下具体的变化。

3. 消费者相关的选举

组协调器GroupCoordinator需要为消费组内的消费者选举出一个消费组的leader，这个选举的算法也很简单，分两种情况分析。如果消费组内还没有leader，那么第一个加入消费组的消费者即为消费组的leader。如果某一时刻leader消费者由于某些原因退出了消费组，那么会重新选举一个新的leader，这个重新选举leader的过程又更“随意”了



### 35. 失效副本是指什么？有那些应对措施？
### 36. 多副本下，各个副本中的HW和LEO的演变过程
### 37. 为什么Kafka不支持读写分离？
### 38. Kafka在可靠性方面做了哪些改进？（HW, LeaderEpoch）
### 39. Kafka中怎么实现死信队列和重试队列？
### 40. Kafka中的延迟队列怎么实现（这题被问的比事务那题还要多！！！听说你会Kafka，那你说说延迟队列怎么实现？）

https://www.cnblogs.com/hzmark/p/mq-delay-msg.html

https://ketao1989.github.io/2016/01/02/delayed-message-consume-service-use-kafka/

从 kafka 消息队列中 pull到消息，按照约定的格式进行解析，然后进行处理，produce 真实的业务消息，push 到kafka消息队列中。当我们pull到的消息还未到定时时间，则阻塞等待时间，交给schedulerThread来执行，执行完了之后，会手动触发commit offset，从而消费对应partitioner的下一条消息。这里可能性能有问题，不过通过多部署实例和多partitioner来扩展。

>通过键生成消息(每个msg包含创建时间戳),这样可以确保每个分区已按生成时间排序消息.auto.commit.enable = false(将在每个消息处理后显式提交),消费消息,检查消息时间戳,并检查是否有足够的时间过去,进程消息(此操作永远不会失败),commit 1 offset

### 41. Kafka中怎么做消息审计？
### 42. Kafka中怎么做消息轨迹？
### 43. Kafka中有那些配置参数比较有意思？聊一聊你的看法
### 44. Kafka中有那些命名比较有意思？聊一聊你的看法
### 45. Kafka有哪些指标需要着重关注？
生产者关注MessagesInPerSec、BytesOutPerSec、BytesInPerSec 消费者关注消费延迟Lag

### 46. 怎么计算Lag？(注意read_uncommitted和read_committed状态下的不同)
参考 如何监控kafka消费Lag情况

### 47. Kafka的那些设计让它有如此高的性能？
零拷贝，页缓存，顺序写

### 48. Kafka有什么优缺点？
### 49. 还用过什么同质类的其它产品，与Kafka相比有什么优缺点？
### 50. 为什么选择Kafka?
吞吐量高，大数据消息系统唯一选择。

### 51. 在使用Kafka的过程中遇到过什么困难？怎么解决的？
### 52. 怎么样才能确保Kafka极大程度上的可靠性？

- 对于一个分区来说，它的消息是有序的。如果一个生产者向一个分区先写入消息A，然后写入消息B，那么消费者会先读取消息A再读取消息B。
- 当消息写入所有in-sync状态的副本后，消息才会认为已提交（committed）。这里的写入有可能只是写入到文件系统的缓存，不一定刷新到磁盘。生产者可以等待不同时机的确认，比如等待分区主副本写入即返回，后者等待所有in-sync状态副本写入才返回。
- 一旦消息已提交，那么只要有一个副本存活，数据不会丢失。
- 消费者只能读取到已提交的消息。


### 53. 聊一聊你对Kafka生态的理解
confluent全家桶(connect/kafka stream/ksql/center/rest proxy等)，开源监控管理工具kafka-manager,kmanager等

### 54. Kafka的复制机制

https://blog.csdn.net/qq_37502106/article/details/80271800

同步复制： 只有所有的follower把数据拿过去后才commit，一致性好，可用性不高。

异步复制： 只要leader拿到数据立即commit，等follower慢慢去复制，可用性高，立即返回，一致性差一些。

Commit：是指leader告诉客户端，这条数据写成功了。kafka尽量保证commit后立即leader挂掉，其他flower都有该条数据。

kafka不是完全同步，也不是完全异步，是一种ISR机制：
1. leader会维护一个与其基本保持同步的Replica列表，该列表称为ISR(in-sync Replica)，每个Partition都会有一个ISR，而且是由leader动态维护
2. 如果一个flower比一个leader落后太多，或者超过一定时间未发起数据复制请求，则leader将其重ISR中移除
3. 当ISR中所有Replica都向Leader发送ACK时，leader才commit

### 一个partition只能由一个consumer消费吗

原文地址：https://www.jianshu.com/p/6233d5341dfe

同一个partition内的消息只能被同一个组中的一个consumer消费。当消费者数量多于partition的数量时，多余的消费者空闲。也就是说如果只有一个partition你在同一组启动多少个consumer都没用，partition的数量决定了此topic在同一组中被可被均衡的程度，例如partition=4，则可在同一组中被最多4个consumer均衡消费。

消费者少于和等于partition，即多个partition对应一个消费者，C1接收到消息量是C2的两倍

同一个消费组可以并发地消费多个分区的消息，同一个partition也可以由多个consumerGroup并发消费，但是在consumerGroup中一个partition只能由一个consumer消费


### kafka哈希的过程和prouducer到queue的过程

算partition 根据key和value的配置对消息进行序列化,然后计算partition： ProducerRecord对象中如果指定了partition，就使用这个partition。否则根据key和topic的partition数目取余，如果key也没有的话就随机生成一个counter，使用这个counter来和partition数目取余。这个counter每次使用的时候递增。

发送到batch&&唤醒Sender 线程 根据topic-partition获取对应的batchs（Dueue），然后将消息append到batch中.如果有batch满了则唤醒Sender 线程。队列的操作是加锁执行，所以batch内消息时有序的。后续的Sender操作当前方法异步操作。


### Producer幂等性发送

为实现Producer的幂等性，Kafka引入了Producer ID（即PID）和Sequence Number。对于每个PID，该Producer发送消息的每个<Topic, Partition>都对应一个单调递增的Sequence Number。同样，Broker端也会为每个<PID, Topic, Partition>维护一个序号，并且每Commit一条消息时将其对应序号递增。对于接收的每条消息，如果其序号比Broker维护的序号）大一，则Broker会接受它，否则将其丢弃：

如果消息序号比Broker维护的序号差值比一大，说明中间有数据尚未写入，即乱序，此时Broker拒绝该消息，Producer抛出InvalidSequenceNumber 如果消息序号小于等于Broker维护的序号，说明该消息已被保存，即为重复消息，Broker直接丢弃该消息，Producer抛出DuplicateSequenceNumber Sender发送失败后会重试，这样可以保证每个消息都被发送到broker

### Consumer设计原理

#### poll消息

- 消费者通过fetch线程拉消息（单线程）
- 消费者通过心跳线程来与broker发送心跳。超时会认为挂掉
- 每个consumer group在broker上都有一个coordnator来管理，消费者加入和退出，以及消费消息的位移都由coordnator处理。

#### 位移管理

consumer的消息位移代表了当前group对topic-partition的消费进度，consumer宕机重启后可以继续从该offset开始消费。 在kafka0.8之前，位移信息存放在zookeeper上，由于zookeeper不适合高并发的读写，新版本Kafka把位移信息当成消息，发往__consumers_offsets 这个topic所在的broker，__consumers_offsets默认有50个分区。

#### 重平衡reblance

什么时候发生rebalance？：

- 组订阅topic数变更
- topic partition数变更
- consumer成员变更
- consumer 加入群组或者离开群组的时候
- consumer被检测为崩溃的时候

过程：

consumer被检测为崩溃引起的reblance 比如心跳线程在timeout时间内没和broker发送心跳，此时coordnator认为该group应该进行reblance。接下来其他consumer发来fetch请求后，coordnator将回复他们进行reblance通知。当consumer成员收到请求后，只有leader会根据分配策略进行分配，然后把各自的分配结果返回给coordnator。这个时候只有consumer leader返回的是实质数据，其他返回的都为空。收到分配方法后，consumer将会把分配策略同步给各consumer


### Broker设计原理

Broker 是Kafka 集群中的节点。负责处理生产者发送过来的消息，消费者消费的请求。以及集群节点的管理等。

#### broker消息存储

Kafka的消息以二进制的方式紧凑地存储，节省了很大空间 此外消息存在ByteBuffer而不是堆，这样broker进程挂掉时，数据不会丢失，同时避免了gc问题 通过零拷贝和顺序寻址，让消息存储和读取速度都非常快 处理fetch请求的时候通过zero-copy 加快速度

### Kafka高可用

原文地址：https://github.com/Snailclimb/JavaGuide/blob/master/docs/system-design/data-communication/Kafka%E7%B3%BB%E7%BB%9F%E8%AE%BE%E8%AE%A1%E5%BC%80%E7%AF%87-%E9%9D%A2%E8%AF%95%E7%9C%8B%E8%BF%99%E7%AF%87%E5%B0%B1%E5%A4%9F%E4%BA%86.md

同步复制：要求所有能工作的Follower都复制完，这条消息才会被认为commit，这种复制方式极大的影响了吞吐率 

异步复制：Follower异步的从Leader pull数据，data只要被Leader写入log认为已经commit，这种情况下如果Follower落后于Leader的比较多，如果Leader突然宕机，会丢失数据

ISR：Kafka结合同步复制和异步复制，使用ISR（与Partition Leader保持同步的Replica列表）的方式在确保数据不丢失和吞吐率之间做了平衡。Producer只需把消息发送到Partition Leader，Leader将消息写入本地Log。Follower则从Leader pull数据。Follower在收到该消息向Leader发送ACK。一旦Leader收到了ISR中所有Replica的ACK，该消息就被认为已经commit了，Leader将增加HW并且向Producer发送ACK。这样如果leader挂了，只要Isr中有一个replica存活，就不会丢数据。

kafka不是完全同步，也不是完全异步，是一种ISR机制：

1. leader会维护一个与其基本保持同步的Replica列表，该列表称为ISR(in-sync Replica)，每个Partition都会有一个ISR，而且是由leader动态维护
2. 如果一个flower比一个leader落后太多，或者超过一定时间未发起数据复制请求，则leader将其重ISR中移除
3. 当ISR中所有Replica都向Leader发送ACK时，leader才commit

既然所有Replica都向Leader发送ACK时，leader才commit，那么flower怎么会leader落后太多？

producer往kafka中发送数据，不仅可以一次发送一条数据，还可以发送message的数组；批量发送，同步的时候批量发送，异步的时候本身就是就是批量；底层会有队列缓存起来，批量发送，对应broker而言，就会收到很多数据(假设1000)，这时候leader发现自己有1000条数据，flower只有500条数据，落后了500条数据，就把它从ISR中移除出去，这时候发现其他的flower与他的差距都很小，就等待；如果因为内存等原因，差距很大，就把它从ISR中移除出去。

### kafka为什么这么快

https://mlog.club/article/31656

### kafka-如何保证消息的可靠性与一致性

在kafka中主要通过ISR机制来保证消息的可靠性

原文地址：https://juejin.im/post/5c46e729e51d452c8e6d5679

在zk中会保存AR（Assigned Replicas）列表，其中包含了分区所有的副本，其中 AR = ISR+OSR

- ISR（in sync replica）：是kafka动态维护的一组同步副本，在ISR中有成员存活时，只有这个组的成员才可以成为leader，内部保存的为每次提交信息时必须同步的副本（acks = all时），每当leader挂掉时，在ISR集合中选举出一个follower作为leader提供服务，当ISR中的副本被认为坏掉的时候，会被踢出ISR，当重新跟上leader的消息数据时，重新进入ISR。
- OSR（out sync replica）:保存的副本不必保证必须同步完成才进行确认，OSR内的副本是否同步了leader的数据，不影响数据的提交，OSR内的follower尽力的去同步leader，可能数据版本会落后。

kafka如何控制需要同步多少副本才可以返回确定到生产者消息才可用？

- 当写入到kakfa时，生产者可以选择是否等待0（只需写入leader）,1（只需同步一个副本） 或 -1（全部副本）的消息确认（这里的副本指的是ISR中的副本）。
- 需要注意的是“所有副本确认”并不能保证全部分配副本已收到消息。默认情况下，当acks=all时，只要当前所有在同步中的副本（ISR中的副本）收到消息，就会进行确认。所以Kafka的交付承诺可以这样理解：对没有提交成功的消息不做任何交付保证，而对于ISR中至少有一个存活的完全同步的副本的情况下的“成功提交”的消息保证不会丢失。

### 对于kafka节点活着的条件是什么？

第一点：一个节点必须维持和zk的会话，通过zk的心跳检测实现

第二点：如果节点是一个slave也就是复制节点，那么他必须复制leader节点不能太落后。这里的落后可以指两种情况

1. 数据复制落后，slave节点和leader节点的数据相差较大，这种情况有一个缺点，在生产者突然发送大量消息导致网络堵塞后，大量的slav复制受阻，导致数据复制落后被大量的踢出ISR
2. 时间相差过大，指的是slave向leader请求复制的时间距离上次请求相隔时间过大。通过配置replica.lag.time.max就可以配置这个时间参数。这种方式解决了上述第一种方式导致的问题。

### Kafka幂等性实现原理

原文地址：https://www.jianshu.com/p/b1599f46229b

为了实现Producer的幂等性，Kafka引入了Producer ID（即PID）和Sequence Number。

- PID。每个新的Producer在初始化的时候会被分配一个唯一的PID，这个PID对用户是不可见的。
- Sequence Numbler。（对于每个PID，该Producer发送数据的每个<Topic, Partition>都对应一个从0开始单调递增的Sequence Number
Kafka可能存在多个生产者，会同时产生消息，但对Kafka来说，只需要保证每个生产者内部的消息幂等就可以了，所有引入了PID来标识不同的生产者。

对于Kafka来说，要解决的是生产者发送消息的幂等问题。也即需要区分每条消息是否重复。Kafka通过为每条消息增加一个Sequence Numbler，通过Sequence Numbler来区分每条消息。每条消息对应一个分区，不同的分区产生的消息不可能重复。所有Sequence Numbler对应每个分区

Broker端在缓存中保存了这seqnumber，对于接收的每条消息，如果其序号比Broker缓存中序号大于1则接受它，否则将其丢弃。这样就可以实现了消息重复提交了。但是，只能保证单个Producer对于同一个<Topic, Partition>的Exactly Once语义。不能保证同一个Producer一个topic不同的partion幂等。

### 拉取系统

由于kafka broker会持久化数据，broker没有内存压力，因此，consumer非常适合采取pull的方式消费数据，具有以下几点好处：

1. 简化kafka设计
2. consumer根据消费能力自主控制消息拉取速度
3. consumer根据自身情况自主选择消费模式，例如批量，重复消费，从尾端开始消费等

### kafka的高吞吐率

高吞吐是kafka需要实现的核心目标之一，为此kafka做了以下一些设计：

1. 数据磁盘持久化：消息不在内存中cache，直接写入到磁盘，充分利用磁盘的顺序读写性能，写是顺序的，读也是顺序的
2. zero-copy：减少IO操作步骤
3. 数据批量发送
4. 数据压缩
5. Topic划分为多个partition，提高并行能力

### kafka 为什么采用ISR而不是半数选取的方式

主要是因为不用同步那么多的节点了

https://blog.csdn.net/maoyeqiu/article/details/103243183



































































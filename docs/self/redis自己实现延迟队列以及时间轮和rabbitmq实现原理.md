原文地址：

https://juejin.im/post/5b5e52ecf265da0f716c3203

https://www.cnblogs.com/hzmark/p/mq-delay-msg.html

如果我们自己要去实现一个支持任意延迟的消息队列，难点在哪里呢？

- 排序
- 消息存储

首先，支持任意延迟意味着消息是需要在服务端进行排序的。比如用户先发了一条延迟1分钟的消息，一秒后发了一条延迟3秒的消息，显然延迟3秒的消息需要先被投递出去。那么服务端在收到消息后需要对消息进行排序后再投递出去。在MQ中，为了保证可靠性，消息是需要落盘的，且对性能和延迟的要求，决定了在服务端对消息进行排序是完全不可接受的。其次，目前MQ的方案中都是基于WAL的方式实现的（RocketMQ、Kafka），日志文件会被过期删除，一般会保留最近一段时间的数据。

### 自己项目的方案
项目中用到的：数据放在zset中，其中member放的是时间戳，定时任务执行lua脚本拿到当前小于当前时间的数据，发送到kafka中，如果还需要处理，消费处理业务完成之后放入redis中，更新member的sore值，满足的数据继续发送kafka。

原文地址：https://medium.com/@cheukfung/redis%E5%BB%B6%E8%BF%9F%E9%98%9F%E5%88%97-c940850a264f

Sorted Set是一个有序的集合，元素的排序基于加入集合时指定的score。通过ZRANGEBYSCORE命令，我们可以取得score在指定区间内的元素。将集合中的元素做为消息，score视为延迟的时间，这便是一个延迟队列的模型。

消费者通过ZRANGEBYSCORE获取消息。如果时间未到，将得不到消息；当时间已到或已超时，都可以得到消息：使用ZRANGEBYSCORE取得消息后，消息并没有从集合中删出。需要调用ZREM删除消息：美中不足的是，消费者组合使用ZRANGEBYSCORE和ZREM的过程不是原子的，当有多个消费者时会存在竞争，可能使得一条消息被消费多次。此时需要使用Lua脚本保证消费操作的原子性：score存储的是当前时间+处理时间，查询的范围是0-当前时间，只有到了当前时间才能被查出来

```
if #message > 0 then
  redis.call('ZREM', KEYS[1], message[1]);
  return message;
else
  return {};
end
```

### RabbitMQ

虽然决定自己做，但是依旧需要先了解开源的实现，那么就只能看看RocketMQ开源版本中，支持18个Level是怎么实现的，希望能从中得到一些灵感。

![1](https://txxs.github.io/pic/tofutureself/1-1.png)

上图是通过RocketMQ源码分析后简化一个实现原理方案示意图。分为两个部分：

1. 消息的写入
2. 消息的Schedule

#### 消息写入中：

1. 在写入CommitLog之前，如果是延迟消息，替换掉消息的Topic和queueId(被替换为延迟消息特定的Topic，queueId则为延迟级别对应的id)
2. 消息写入CommitLog之后，提交dispatchRequest到DispatchService
3. 因为在第①步中Topic和QueueId被替换了，所以写入的ConsumeQueue实际上非真正消息应该所属的ConsumeQueue，而是写入到ScheduledConsumeQueue中（这个特定的Queue存放不会被消费）

#### Schedule过程中：

1. 给每个Level设置定时器，从ScheduledConsumeQueue中读取信息
2. 如果ScheduledConsumeQueue中的元素已近到时，那么从CommitLog中读取消息内容，恢复成正常的消息内容写入CommitLog
3. 写入CommitLog后提交dispatchRequest给DispatchService
4. 因为在写入CommitLog前已经恢复了Topic等属性，所以此时DispatchService会将消息投递到正确的ConsumeQueue中

回顾一下这个方案，最大的优点就是没有了排序：

- 先发一条level是5s的消息，再发一条level是3s的消息，因为他们会属于不同的ScheduleQueue所以投递顺序能保持正确
- 如果先后发两条level相同的消息，那么他们的处于同一个ConsumeQueue且保持发送顺序
- 因为level数固定，每个level的有自己独立的定时器，开销也不会很大
- ScheduledConsumeQueue其实是一个普通的ConsumeQueue，所以可靠性等都可以按照原系统的M-S结构等得到保障

```
./conf/broker.conf  文件，并添加如下延迟级别的时长设置:
messageDelayLevel = 1s 5s 10s 30s 1m 2m 3m 4m 5m 6m 7m 8m 9m 10m 20m 30m 1h 2h
```

但是这个方案也有一些问题：

- 固定了Level，不够灵活，最多只能支持18个Level
- 业务是会变的，但是Level需要提前划分，不支持修改
- 如果要支持30天的延迟，CommitLog的量会很大，这块怎么处理没有看到

### 时间轮的处理方案（Timer）

总结RocketMQ的方案，通过划分Level的方式，将排序操作转换为了O(1)的ConsumeQueue的append操作。我们去支持任意延迟的消息，必然也需要通过类似的方式避免掉排序。此时我们想到了TimeWheel：《Hashed and Hierarchical Timing Wheels: Data Structures for the Efficient Implementation of a Timer Facility 》** Netty中也是用TimeWheel来优化I/O超时的操作。**

TimeWheel的大致原理如下：

![1](https://txxs.github.io/pic/tofutureself/1-2.png)

箭头按照一定方向固定频率移动（如手表指针），每一次跳动称为一个tick。ticksPerWheel表示一个定时轮上的tick数。如每次tick为1秒，ticksPerWheel为60，那么这就和现实中的秒针走动完全一致。无论定时消息还是延迟消息，最终都是投递后延迟一段时间对用户可见。假设这个延迟时间为X秒，那么X%(ticksPerWheel * tick)可以计算出X所属的TimeWheel中位置。这里存在一个问题，以上图为例，TimeWheel的size为8，那么延迟1秒和9秒的消息都处在一个链表中。如果用户先发了延迟9秒的消息再发了延迟1秒的消息，他们在一个链表中所以延迟1秒的消息会需要等待延迟9秒的消息先投递。显然这是不能接受的，那么如何解决这个问题？

1. 排序，显然，如果对TimeWheel一个tick中的元素进行排序显然就解决了上面的问题。但是显而易见的是排序是不可能的。

2. 扩大时间轮，最直观的方式，我们能不能通过扩大时间轮的方式避免延迟9和延迟1落到一个tick位置上？假设支持30天，精度为1秒，那么ticksPerWheel=30 * 24 * 60 * 60，这样每一个tick上的延迟都是一致的，不存在上述的问题（类似于将RocketMQ的Level提升到了30 * 24 * 60 * 60个）。但是TimeWheel需要被加载到内存操作，这显然是无法接受的。

3. 多级时间轮，单个TimeWheel无法支持，那么能否显示中的时针、分针的形式，构建多级时间轮来解决呢？

![1](https://txxs.github.io/pic/tofutureself/1-3.png)

多级时间轮解决了上述的问题，但是又引入了新的问题：

在整点（tick指向0的位置）需要加载大量的数据会导致延迟，比如第二个时间轮到整点需要加载未来一天的数据，时间轮需要载入到内存，这个开销是不可接受的，通过延迟加载的方式，多级定时轮的问题在于需要加载大量数据到内存，那么能否优化一下将这里的数据延迟加载到内存来解决内存开销的问题呢？在多级定时轮的方案中，显然对于未来一小时或者未来一天的数据可以不加载到内存，而可以只加载延迟时间临近的消息。进一步优化，可以将数据按照固定延迟间隔划分，那么每次加载的数据量是大致相同的，不会出tick约大的定时轮需要加载越多的数据，那么方案如下：

![1](https://txxs.github.io/pic/tofutureself/1-4.png)

基于上述的方案，那么TimeWheel中存储未来30分钟需要投递的消息的索引，索引为一个long型，那么数据量为：30 * 60 * 8 * TPS，相对来说内存开销是可以接受的，比如TPS为1w那么大概开销为200M+。之后的数据按照每30分钟一个块的形式写入文件，那么每个整点时的操作就是计算一下将30分钟的消息Hash到对应的TimeWheel上，那么排序问题就解决了。

到此为止就只剩下一个问题，如何保存30天的数据？

- CommitLog保存超长延迟的数据
- CommitLog是有时效性的，比如在我们只保存最近7天的消息，过期数据将被删除。对于延迟消息，可能需要30天之后投递，显然是不能被删除的。

那么我们怎么保存延迟消息呢？直观的方法就是将延迟消息从CommitLog中剥离出来，独立存储以保存更长的时间。

![1](https://txxs.github.io/pic/tofutureself/1-5.png)

通过DispatchService将WAL中的延迟消息写入到独立的文件中。这些文件按照延迟时间组成一个链表。链表长度为最大延迟时间/每个文件保存的时间长度。那么WAL可以按照正常的策略进行过期删除，Delay Msg File则在一个文件投递完之后进行删除。唯一的问题是这里会有Delay Msg File带来的随机写问题，但是这个对系统整体性能不会有很大影响，在可接受范围内。


结合TimeWheel和CommitLog保存超长延迟数据的方案，加上一些优化手段，基本就完成了支持任意延迟时间的方案：

![1](https://txxs.github.io/pic/tofutureself/1-6.png)

- 消息写入WAL
- Dispatcher处理延迟消息
- 延迟消息一定时间的直接写入TimeWheel
- 延迟超过一定时间写入DelayMessageStorage
- DelayMessageStorage对DelayMsgFile构建一层索引，这样在映射到TimeWheel时只需要做一次Hash操作
- 通过TimeWheel将消息投递到ConsumeQueue中完成对Consumer的可见
- 通过这个方案解决了最初提出来的任意延迟消息的两个难点：


### 另外成熟方案：

- 定期轮询（数据库等）
- DelayQueue
- Timer
- ScheduledExecutorService
- 时间轮(kafka)
- RabbitMQ
- Quartz
- Redis Zset
- Koala
- JCronTab
- SchedulerX（阿里）
- 有赞延迟队列

####  轮询

特点：定期轮训数据库，设置状态。

- 优点：实现简单
- 缺点：数据量过大时会消耗太多的IO资源，效率太低

####  DelayQueue

特点： 无界、延迟、阻塞队列。

- BlockingQueue+PriorityQueue（堆排序）+Delayed
- DelayQueue中存放的对象需要实现compareTo()方法和getDelay()方法。
- getDelay方法返回该元素距离失效还剩余的时间，当<=0时元素就失效了，就可以从队列中获取到。





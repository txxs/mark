(window.webpackJsonp=window.webpackJsonp||[]).push([[200],{581:function(a,r,t){"use strict";t.r(r);var e=t(13),s=Object(e.a)({},(function(){var a=this,r=a.$createElement,t=a._self._c||r;return t("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[t("p",[a._v("原文地址： 12-1.png\nhttps://juejin.im/post/5b59c6055188257bcc16738c\nhttps://www.jianshu.com/p/6cbe28a44543\nhttps://blog.csdn.net/suifeng3051/article/details/48053965 这个最为详细")]),a._v(" "),t("p",[a._v("整体架构图：\n"),t("img",{attrs:{src:"https://txxs.github.io/pic/tofuturekafka/12-1.png",alt:"1"}})]),a._v(" "),t("h3",{attrs:{id:"名词解释"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#名词解释"}},[a._v("#")]),a._v(" 名词解释")]),a._v(" "),t("p",[a._v("在一套kafka架构中有多个Producer，多个Broker,多个Consumer，每个Producer可以对应多个Topic，每个Consumer只能对应一个ConsumerGroup。\n整个Kafka架构对应一个ZK集群，通过ZK管理集群配置，选举Leader，以及在consumer group发生变化时进行rebalance。")]),a._v(" "),t("p",[a._v("Broker：消息中间件处理节点，一个Kafka节点就是一个broker，一个或者多个Broker可以组成一个Kafka集群\nTopic：主题，Kafka根据topic对消息进行归类，发布到Kafka集群的每条消息都需要指定一个topic\nProducer：消息生产者，向Broker发送消息的客户端\nConsumer：消息消费者，从Broker读取消息的客户端\nConsumerGroup：每个Consumer属于一个特定的Consumer Group，一条消息可以发送到多个不同的Consumer Group，但是一个ConsumerGroup中只能有一个Consumer能够消费该消息\nPartition：物理上的概念，一个topic可以分为多个partition，每个partition内部是有序的；kafka为每个主题维护了分布式的分区(partition)日志文件，"),t("strong",[a._v("每个partition在kafka存储层面是append log")]),a._v("。任何发布到此partition的消息都会被追加到log文件的尾部，在分区中的每条消息都会按照时间顺序分配到一个单调递增的顺序编号，也就是我们的offset,offset是一个long型的数字，我们通过这个offset可以确定一条在该partition下的唯一消息。在partition下面是保证了有序性，但是在topic下面没有保证有序性。\n1.如果没有Key值则进行轮询发送。\n2.如果有Key值，对Key值进行Hash，然后对分区数量取余，保证了同一个Key值的会被路由到同一个分区，"),t("strong",[a._v("如果想队列的强顺序一致性，可以让所有的消息都设置为同一个Key")]),a._v("。\nSegment:"),t("strong",[a._v("partition物理上由多个segment组成")]),a._v("，每一个segment 数据文件都有一个索引文件对应\nOffset:每个partition都由一系列有序的、不可变的消息组成，这些消息被连续的追加到partition中。partition中的每个消息都有一个连续的序列号叫做offset,用于partition唯一标识一条消息.")]),a._v(" "),t("h3",{attrs:{id:"消费模型"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#消费模型"}},[a._v("#")]),a._v(" 消费模型")]),a._v(" "),t("p",[a._v("消息由生产者发送到kafka集群后，会被消费者消费。一般来说我们的消费模型有两种:推送模型(psuh)和拉取模型(pull)")]),a._v(" "),t("p",[a._v("基于推送模型的消息系统，由消息代理记录消费状态。消息代理将消息推送到消费者后，标记这条消息为已经被消费，但是这种方式无法很好地保证消费的处理语义。比如当我们把已经把消息发送给消费者之后，由于消费进程挂掉或者由于网络原因没有收到这条消息，如果我们在消费代理将其标记为已消费，这个消息就永久丢失了。如果我们利用生产者收到消息后回复这种方法，消息代理需要记录消费状态，这种不可取。如果采用push，消息消费的速率就完全由消费代理控制，一旦消费者发生阻塞，就会出现问题。")]),a._v(" "),t("p",[a._v("Kafka采取拉取模型(poll)由自己控制消费速度，以及消费的进度，消费者可以按照任意的偏移量进行消费。比如消费者可以消费已经消费过的消息进行重新处理，或者消费最近的消息等等。")]),a._v(" "),t("p",[a._v("push模式很难适应消费速率不同的消费者，因为消息发送速率是由broker决定的。"),t("strong",[a._v("push模式的目标是尽可能以最快速度传递消息")]),a._v("，但是这样很容易造成consumer来不及处理消息，典型的表现就是拒绝服务以及网络拥塞。"),t("strong",[a._v("而pull模式则可以根据consumer的消费能力以适当的速率消费消息")]),a._v("。\n所以我们一般在 Kafka 前面再加一个 Log Server，可以用 LevelDB 缓存，作为一个缓冲，提高峰值处理能力")]),a._v(" "),t("p",[a._v("作者：heamon7\n链接：https://www.jianshu.com/p/6cbe28a44543\n来源：简书\n简书著作权归作者所有，任何形式的转载都请联系作者获得授权并注明出处。")]),a._v(" "),t("h3",{attrs:{id:"网络模型"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#网络模型"}},[a._v("#")]),a._v(" 网络模型")]),a._v(" "),t("h4",{attrs:{id:"kafkaclient-单线程selector"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#kafkaclient-单线程selector"}},[a._v("#")]),a._v(" KafkaClient --单线程Selector")]),a._v(" "),t("p",[a._v("单线程模式适用于并发链接数小，逻辑简单，数据量小。")]),a._v(" "),t("p",[t("img",{attrs:{src:"https://txxs.github.io/pic/tofuturekafka/12-2.png",alt:"1"}})]),a._v(" "),t("p",[a._v("在kafka中，consumer和producer都是使用的上面的单线程模式。这种模式不适合kafka的服务端，在服务端中请求处理过程比较复杂，会造成线程阻塞，一旦出现后续请求就会无法处理，会造成大量请求超时，引起雪崩。而在服务器中应该充分利用多线程来处理执行逻辑。")]),a._v(" "),t("h4",{attrs:{id:"kafka-server-多线程selector"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#kafka-server-多线程selector"}},[a._v("#")]),a._v(" Kafka-server--多线程Selector")]),a._v(" "),t("p",[t("img",{attrs:{src:"https://txxs.github.io/pic/tofuturekafka/12-3.png",alt:"1"}}),a._v("\n在kafka服务端采用的是多线程的Selector模型，Acceptor运行在一个单独的线程中，对于读取操作的线程池中的线程都会在selector注册read事件，负责服务端读取请求的逻辑。成功读取后，将请求放入message queue共享队列中。然后在写线程池中，取出这个请求，对其进行逻辑处理，即使某个请求线程阻塞了，还有后续的县城从消息队列中获取请求并进行处理，在写线程中处理完逻辑处理，由于注册了OP_WIRTE事件，所以还需要对其发送响应。")]),a._v(" "),t("h3",{attrs:{id:"高可靠分布式存储模型"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#高可靠分布式存储模型"}},[a._v("#")]),a._v(" 高可靠分布式存储模型")]),a._v(" "),t("p",[a._v("在Kafka中保证高可靠模型的依靠的是副本机制，有了副本机制之后，就算机器宕机也不会发生数据丢失。")]),a._v(" "),t("h4",{attrs:{id:"高性能的日志存储"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#高性能的日志存储"}},[a._v("#")]),a._v(" 高性能的日志存储")]),a._v(" "),t("p",[a._v("kafka一个topic下面的所有消息都是以partition的方式分布式的存储在多个节点上。同时在kafka的机器上，每个Partition其实都会对应一个日志目录，在目录下面会对应多个日志分段(LogSegment)。LogSegment文件由两部分组成，分别为“.index”文件和“.log”文件，分别表示为segment索引文件和数据文件。这两个文件的命令规则为：partition全局的第一个segment从0开始，后续每个segment文件名为上一个segment文件最后一条消息的offset值，数值大小为64位，20位数字字符长度，没有数字用0填充，如下，假设有1000条消息，每个LogSegment大小为100，下面展现了900-1000的索引和Log：")]),a._v(" "),t("p",[t("img",{attrs:{src:"https://txxs.github.io/pic/tofuturekafka/12-4.png",alt:"1"}})]),a._v(" "),t("p",[a._v("由于kafka消息数据太大，如果全部建立索引，即占了空间又增加了耗时，所以kafka选择了稀疏索引的方式，这样的话索引可以直接进入内存，加快偏查询速度。\n简单介绍一下如何读取数据，如果我们要读取第911条数据首先第一步，找到他是属于哪一段的，根据二分法查找到他属于的文件，找到0000900.index和00000900.log之后，然后去index中去查找 (911-900) =11这个索引或者小于11最近的索引,在这里通过二分法我们找到了索引是[10,1367]然后我们通过这条索引的物理位置1367，开始往后找，直到找到911条数据。\n上面讲的是如果要找某个offset的流程，但是我们大多数时候并不需要查找某个offset,只需要按照顺序读即可，而在顺序读中，操作系统会对内存和磁盘之间添加page cahe，也就是我们平常见到的预读操作，所以我们的顺序读操作时速度很快。但是kafka有个问题，如果分区过多，那么日志分段也会很多，写的时候由于是批量写，其实就会变成随机写了，随机I/O这个时候对性能影响很大。所以一般来说Kafka不能有太多的partition。针对这一点，RocketMQ把所有的日志都写在一个文件里面，就能变成顺序写，通过一定优化，读也能接近于顺序读。")]),a._v(" "),t("p",[a._v("可以思考一下:1.为什么需要分区，也就是说主题只有一个分区，难道不行吗？2.日志为什么需要分段")]),a._v(" "),t("h4",{attrs:{id:"副本机制"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#副本机制"}},[a._v("#")]),a._v(" 副本机制")]),a._v(" "),t("p",[a._v("Kafka的副本机制是多个服务端节点对其他节点的主题分区的日志进行复制。当集群中的某个节点出现故障，访问故障节点的请求会被转移到其他正常节点(这一过程通常叫Reblance),kafka每个主题的每个分区都有一个主副本以及0个或者多个副本，副本保持和主副本的数据同步，当主副本出故障时就会被替代。")]),a._v(" "),t("p",[t("img",{attrs:{src:"https://txxs.github.io/pic/tofuturekafka/12-5.png",alt:"1"}})]),a._v(" "),t("p",[a._v("在Kafka中并不是所有的副本都能被拿来替代主副本，所以在kafka的leader节点中维护着一个ISR(In sync Replicas)集合，翻译过来也叫正在同步中集合，在这个集合中的需要满足两个条件:\n1、节点必须和ZK保持连接\n2、在同步的过程中这个副本不能落后主副本太多\n另外还有个AR(Assigned Replicas)用来标识副本的全集,OSR用来表示由于落后被剔除的副本集合，所以公式如下:ISR = leader + 没有落后太多的副本; AR = OSR+ ISR;\n这里先要说下两个名词:HW(高水位)是consumer能够看到的此partition的位置，LEO是每个partition的log最后一条Message的位置。HW能保证leader所在的broker失效，该消息仍然可以从新选举的leader中获取，不会造成消息丢失。\n当producer向leader发送数据时，可以通过request.required.acks参数来设置数据可靠性的级别：\n1（默认）：这意味着producer在ISR中的leader已成功收到的数据并得到确认后发送下一条message。如果leader宕机了，则会丢失数据。\n0：这意味着producer无需等待来自broker的确认而继续发送下一批消息。这种情况下数据传输效率最高，但是数据可靠性确是最低的。\n-1：producer需要等待ISR中的所有follower都确认接收到数据后才算一次发送完成，可靠性最高。但是这样也不能保证数据不丢失，比如当ISR中只有leader时(其他节点都和zk断开连接，或者都没追上)，这样就变成了acks=1的情况。")]),a._v(" "),t("h3",{attrs:{id:"kafka-核心组件"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#kafka-核心组件"}},[a._v("#")]),a._v(" Kafka 核心组件")]),a._v(" "),t("h4",{attrs:{id:"_3-1-replications、partitions-和leaders"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_3-1-replications、partitions-和leaders"}},[a._v("#")]),a._v(" 3.1 Replications、Partitions 和Leaders")]),a._v(" "),t("p",[a._v("通过上面介绍的我们可以知道，kafka中的数据是持久化的并且能够容错的。Kafka允许用户为每个topic设置副本数量，副本数量决定了有几个broker来存放写入的数据。如果你的副本数量设置为3，那么一份数据就会被存放在3台不同的机器上，那么就允许有2个机器失败。一般推荐副本数量至少为2，这样就可以保证增减、重启机器时不会影响到数据消费。如果对数据持久化有更高的要求，可以把副本数量设置为3或者更多。\nKafka中的topic是以partition的形式存放的，每一个topic都可以设置它的partition数量，Partition的数量决定了组成topic的log的数量。Producer在生产数据时，会按照一定规则（这个规则是可以自定义的）把消息发布到topic的各个partition中。上面将的副本都是以partition为单位的，不过只有一个partition的副本会被选举成leader作为读写用。\n关于如何设置partition值需要考虑的因素。一个partition只能被一个消费者消费（一个消费者可以同时消费多个partition），因此，如果设置的partition的数量小于consumer的数量，就会有消费者消费不到数据。所以，推荐partition的数量一定要大于同时运行的consumer的数量。另外一方面，建议partition的数量大于集群broker的数量，这样leader partition就可以均匀的分布在各个broker中，最终使得集群负载均衡。在Cloudera,每个topic都有上百个partition。需要注意的是，kafka需要为每个partition分配一些内存来缓存消息数据，如果partition数量越大，就要为kafka分配更大的heap space。")]),a._v(" "),t("h4",{attrs:{id:"_3-2-producers"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_3-2-producers"}},[a._v("#")]),a._v(" 3.2 Producers")]),a._v(" "),t("p",[a._v("Producers直接发送消息到broker上的leader partition，不需要经过任何中介一系列的路由转发。为了实现这个特性，kafka集群中的每个broker都可以响应producer的请求，并返回topic的一些元信息，这些元信息包括哪些机器是存活的，topic的leader partition都在哪，现阶段哪些leader partition是可以直接被访问的。\nProducer客户端自己控制着消息被推送到哪些partition。实现的方式可以是随机分配、实现一类随机负载均衡算法，或者指定一些分区算法。Kafka提供了接口供用户实现自定义的分区，用户可以为每个消息指定一个partitionKey，通过这个key来实现一些hash分区算法。比如，把userid作为partitionkey的话，相同userid的消息将会被推送到同一个分区。\n以Batch的方式推送数据可以极大的提高处理效率，kafka Producer 可以将消息在内存中累计到一定数量后作为一个batch发送请求。Batch的数量大小可以通过Producer的参数控制，参数值可以设置为累计的消息的数量（如500条）、累计的时间间隔（如100ms）或者累计的数据大小(64KB)。通过增加batch的大小，可以减少网络请求和磁盘IO的次数，当然具体参数设置需要在效率和时效性方面做一个权衡。\nProducers可以异步的并行的向kafka发送消息，但是通常producer在发送完消息之后会得到一个future响应，返回的是offset值或者发送过程中遇到的错误。这其中有个非常重要的参数“acks”,这个参数决定了producer要求leader partition 收到确认的副本个数，如果acks设置数量为0，表示producer不会等待broker的响应，所以，producer无法知道消息是否发送成功，这样有可能会导致数据丢失，但同时，acks值为0会得到最大的系统吞吐量。\n若acks设置为1，表示producer会在leader partition收到消息时得到broker的一个确认，这样会有更好的可靠性，因为客户端会等待直到broker确认收到消息。若设置为-1，producer会在所有备份的partition收到消息时得到broker的确认，这个设置可以得到最高的可靠性保证。\nKafka 消息有一个定长的header和变长的字节数组组成。因为kafka消息支持字节数组，也就使得kafka可以支持任何用户自定义的序列号格式或者其它已有的格式如Apache Avro、protobuf等。Kafka没有限定单个消息的大小，但我们推荐消息大小不要超过1MB,通常一般消息大小都在1~10kB之前。")]),a._v(" "),t("h4",{attrs:{id:"_3-3-consumers"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_3-3-consumers"}},[a._v("#")]),a._v(" 3.3 Consumers")]),a._v(" "),t("p",[a._v("Kafka提供了两套consumer api，分为high-level api和sample-api。Sample-api 是一个底层的API，它维持了一个和单一broker的连接，并且这个API是完全无状态的，每次请求都需要指定offset值，因此，这套API也是最灵活的。\n在kafka中，当前读到消息的offset值是由consumer来维护的，因此，consumer可以自己决定如何读取kafka中的数据。比如，consumer可以通过重设offset值来重新消费已消费过的数据。不管有没有被消费，kafka会保存数据一段时间，这个时间周期是可配置的，只有到了过期时间，kafka才会删除这些数据。\nHigh-level API封装了对集群中一系列broker的访问，可以透明的消费一个topic。它自己维持了已消费消息的状态，即每次消费的都是下一个消息。\nHigh-level API还支持以组的形式消费topic，如果consumers有同一个组名，那么kafka就相当于一个队列消息服务，而各个consumer均衡的消费相应partition中的数据。若consumers有不同的组名，那么此时kafka就相当与一个广播服务，会把topic中的所有消息广播到每个consumer。")]),a._v(" "),t("p",[t("img",{attrs:{src:"https://txxs.github.io/pic/tofuturekafka/12-6.png",alt:"1"}})]),a._v(" "),t("h3",{attrs:{id:"kafka核心特性"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#kafka核心特性"}},[a._v("#")]),a._v(" Kafka核心特性")]),a._v(" "),t("h4",{attrs:{id:"_4-1-压缩"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_4-1-压缩"}},[a._v("#")]),a._v(" 4.1 压缩")]),a._v(" "),t("p",[a._v("我们上面已经知道了Kafka支持以集合（batch）为单位发送消息，在此基础上，Kafka还支持对消息集合进行压缩，Producer端可以通过GZIP或Snappy格式对消息集合进行压缩。Producer端进行压缩之后，在Consumer端需进行解压。压缩的好处就是减少传输的数据量，减轻对网络传输的压力，在对大数据处理上，瓶颈往往体现在网络上而不是CPU（压缩和解压会耗掉部分CPU资源）。\n那么如何区分消息是压缩的还是未压缩的呢，Kafka在消息头部添加了一个描述压缩属性字节，这个字节的后两位表示消息的压缩采用的编码，如果后两位为0，则表示消息未被压缩。")]),a._v(" "),t("h4",{attrs:{id:"_4-2消息可靠性"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_4-2消息可靠性"}},[a._v("#")]),a._v(" 4.2消息可靠性")]),a._v(" "),t("p",[a._v("在消息系统中，保证消息在生产和消费过程中的可靠性是十分重要的，在实际消息传递过程中，可能会出现如下三中情况：")]),a._v(" "),t("p",[a._v("一个消息发送失败\n一个消息被发送多次\n最理想的情况：exactly-once ,一个消息发送成功且仅发送了一次\n有许多系统声称它们实现了exactly-once，但是它们其实忽略了生产者或消费者在生产和消费过程中有可能失败的情况。比如虽然一个Producer成功发送一个消息，但是消息在发送途中丢失，或者成功发送到broker，也被consumer成功取走，但是这个consumer在处理取过来的消息时失败了。\n从Producer端看：Kafka是这么处理的，当一个消息被发送后，Producer会等待broker成功接收到消息的反馈（可通过参数控制等待时间），如果消息在途中丢失或是其中一个broker挂掉，Producer会重新发送（我们知道Kafka有备份机制，可以通过参数控制是否等待所有备份节点都收到消息）。\n从Consumer端看：前面讲到过partition，broker端记录了partition中的一个offset值，这个值指向Consumer下一个即将消费message。当Consumer收到了消息，但却在处理过程中挂掉，此时Consumer可以通过这个offset值重新找到上一个消息再进行处理。Consumer还有权限控制这个offset值，对持久化到broker端的消息做任意处理。")]),a._v(" "),t("h4",{attrs:{id:"_4-3-备份机制"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_4-3-备份机制"}},[a._v("#")]),a._v(" 4.3 备份机制")]),a._v(" "),t("p",[a._v("备份机制是Kafka0.8版本的新特性，备份机制的出现大大提高了Kafka集群的可靠性、稳定性。有了备份机制后，Kafka允许集群中的节点挂掉后而不影响整个集群工作。一个备份数量为n的集群允许n-1个节点失败。在所有备份节点中，有一个节点作为lead节点，这个节点保存了其它备份节点列表，并维持各个备份间的状体同步。下面这幅图解释了Kafka的备份机制:")]),a._v(" "),t("p",[t("img",{attrs:{src:"https://txxs.github.io/pic/tofuturekafka/12-7.png",alt:"1"}})]),a._v(" "),t("h3",{attrs:{id:"_4-4-kafka高效性相关设计"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_4-4-kafka高效性相关设计"}},[a._v("#")]),a._v(" 4.4 Kafka高效性相关设计")]),a._v(" "),t("h4",{attrs:{id:"_4-4-1-消息的持久化"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_4-4-1-消息的持久化"}},[a._v("#")]),a._v(" 4.4.1 消息的持久化")]),a._v(" "),t("p",[a._v("Kafka高度依赖文件系统来存储和缓存消息，一般的人认为磁盘是缓慢的，这导致人们对持久化结构具有竞争性持怀疑态度。其实，磁盘远比你想象的要快或者慢，这决定于我们如何使用磁盘。\n一个和磁盘性能有关的关键事实是：磁盘驱动器的吞吐量跟寻到延迟是相背离的，也就是所，线性写的速度远远大于随机写。比如：在一个6 7200rpm SATA RAID-5 的磁盘阵列上线性写的速度大概是600M/秒，但是随机写的速度只有100K/秒，两者相差将近6000倍。线性读写在大多数应用场景下是可以预测的，因此，操作系统利用read-ahead和write-behind技术来从大的数据块中预取数据，或者将多个逻辑上的写操作组合成一个大写物理写操作中。更多的讨论可以在ACMQueueArtical中找到，他们发现，对磁盘的线性读在有些情况下可以比内存的随机访问要快一些。\n为了补偿这个性能上的分歧，现代操作系统都会把空闲的内存用作磁盘缓存，尽管在内存回收的时候会有一点性能上的代价。所有的磁盘读写操作会在这个统一的缓存上进行。\n此外，如果我们是在JVM的基础上构建的，熟悉java内存应用管理的人应该清楚以下两件事情：")]),a._v(" "),t("p",[a._v("一个对象的内存消耗是非常高的，经常是所存数据的两倍或者更多。\n随着堆内数据的增多，Java的垃圾回收会变得非常昂贵。\n基于这些事实，利用文件系统并且依靠页缓存比维护一个内存缓存或者其他结构要好——我们至少要使得可用的缓存加倍，通过自动访问可用内存，并且通过存储更紧凑的字节结构而不是一个对象，这将有可能再次加倍。这么做的结果就是在一台32GB的机器上，如果不考虑GC惩罚，将最多有28-30GB的缓存。此外，这些缓存将会一直存在即使服务重启，然而进程内缓存需要在内存中重构（10GB缓存需要花费10分钟）或者它需要一个完全冷缓存启动（非常差的初始化性能）。它同时也简化了代码，因为现在所有的维护缓存和文件系统之间内聚的逻辑都在操作系统内部了，这使得这样做比one-off in-process attempts更加高效与准确。如果你的磁盘应用更加倾向于顺序读取，那么read-ahead在每次磁盘读取中实际上获取到这人缓存中的有用数据。\n以上这些建议了一个简单的设计：不同于维护尽可能多的内存缓存并且在需要的时候刷新到文件系统中，我们换一种思路。所有的数据不需要调用刷新程序，而是立刻将它写到一个持久化的日志中。事实上，这仅仅意味着，数据将被传输到内核页缓存中并稍后被刷新。我们可以增加一个配置项以让系统的用户来控制数据在什么时候被刷新到物理硬盘上。")]),a._v(" "),t("h4",{attrs:{id:"_4-4-2-常数时间性能保证"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_4-4-2-常数时间性能保证"}},[a._v("#")]),a._v(" 4.4.2 常数时间性能保证")]),a._v(" "),t("p",[a._v("消息系统中持久化数据结构的设计通常是维护者一个和消费队列有关的B树或者其它能够随机存取结构的元数据信息。B树是一个很好的结构，可以用在事务型与非事务型的语义中。但是它需要一个很高的花费，尽管B树的操作需要O(logN)。通常情况下，这被认为与常数时间等价，但这对磁盘操作来说是不对的。磁盘寻道一次需要10ms，并且一次只能寻一个，因此并行化是受限的。\n直觉上来讲，一个持久化的队列可以构建在对一个文件的读和追加上，就像一般情况下的日志解决方案。尽管和B树相比，这种结构不能支持丰富的语义，但是它有一个优点，所有的操作都是常数时间，并且读写之间不会相互阻塞。这种设计具有极大的性能优势：最终系统性能和数据大小完全无关，服务器可以充分利用廉价的硬盘来提供高效的消息服务。\n事实上还有一点，磁盘空间的无限增大而不影响性能这点，意味着我们可以提供一般消息系统无法提供的特性。比如说，消息被消费后不是立马被删除，我们可以将这些消息保留一段相对比较长的时间（比如一个星期）。")]),a._v(" "),t("h4",{attrs:{id:"_4-4-3-进一步提高效率"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_4-4-3-进一步提高效率"}},[a._v("#")]),a._v(" 4.4.3 进一步提高效率")]),a._v(" "),t("p",[a._v("我们已经为效率做了非常多的努力。但是有一种非常主要的应用场景是：处理Web活动数据，它的特点是数据量非常大，每一次的网页浏览都会产生大量的写操作。更进一步，我们假设每一个被发布的消息都会被至少一个consumer消费，因此我们更要怒路让消费变得更廉价。\n通过上面的介绍，我们已经解决了磁盘方面的效率问题，除此之外，在此类系统中还有两类比较低效的场景：")]),a._v(" "),t("p",[a._v("太多小的I/O操作\n过多的字节拷贝\n为了减少大量小I/O操作的问题，kafka的协议是围绕消息集合构建的。Producer一次网络请求可以发送一个消息集合，而不是每一次只发一条消息。在server端是以消息块的形式追加消息到log中的，consumer在查询的时候也是一次查询大量的线性数据块。消息集合即MessageSet，实现本身是一个非常简单的API，它将一个字节数组或者文件进行打包。所以对消息的处理，这里没有分开的序列化和反序列化的上步骤，消息的字段可以按需反序列化（如果没有需要，可以不用反序列化）。\n另一个影响效率的问题就是字节拷贝。为了解决字节拷贝的问题，kafka设计了一种“标准字节消息”，Producer、Broker、Consumer共享这一种消息格式。Kakfa的message log在broker端就是一些目录文件，这些日志文件都是MessageSet按照这种“标准字节消息”格式写入到磁盘的。\n维持这种通用的格式对这些操作的优化尤为重要：持久化log 块的网络传输。流行的unix操作系统提供了一种非常高效的途径来实现页面缓存和socket之间的数据传递。在Linux操作系统中，这种方式被称作：sendfile system call（Java提供了访问这个系统调用的方法：FileChannel.transferTo api）。")]),a._v(" "),t("p",[a._v("为了理解sendfile的影响，需要理解一般的将数据从文件传到socket的路径：")]),a._v(" "),t("p",[a._v("操作系统将数据从磁盘读到内核空间的页缓存中\n应用将数据从内核空间读到用户空间的缓存中\n应用将数据写回内核空间的socket缓存中\n操作系统将数据从socket缓存写到网卡缓存中，以便将数据经网络发出\n这种操作方式明显是非常低效的，这里有四次拷贝，两次系统调用。如果使用sendfile，就可以避免两次拷贝：操作系统将数据直接从页缓存发送到网络上。所以在这个优化的路径中，只有最后一步将数据拷贝到网卡缓存中是需要的。\n我们期望一个主题上有多个消费者是一种常见的应用场景。利用上述的zero-copy，数据只被拷贝到页缓存一次，然后就可以在每次消费时被重得利用，而不需要将数据存在内存中，然后在每次读的时候拷贝到内核空间中。这使得消息消费速度可以达到网络连接的速度。这样以来，通过页面缓存和sendfile的结合使用，整个kafka集群几乎都已以缓存的方式提供服务，而且即使下游的consumer很多，也不会对整个集群服务造成压力。")])])}),[],!1,null,null,null);r.default=s.exports}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[204],{579:function(a,t,s){"use strict";s.r(t);var e=s(13),v=Object(e.a)({},(function(){var a=this,t=a.$createElement,s=a._self._c||t;return s("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[s("p",[a._v("原文地址：")]),a._v(" "),s("p",[a._v("https://github.com/doocs/advanced-java/blob/master/docs/high-concurrency/how-to-ensure-the-reliable-transmission-of-messages.md")]),a._v(" "),s("h2",{attrs:{id:"面试题"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#面试题"}},[a._v("#")]),a._v(" 面试题")]),a._v(" "),s("p",[a._v("如何保证消息的可靠性传输？或者说，如何处理消息丢失的问题？")]),a._v(" "),s("h2",{attrs:{id:"面试官心理分析"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#面试官心理分析"}},[a._v("#")]),a._v(" 面试官心理分析")]),a._v(" "),s("p",[a._v("这个是肯定的，用 MQ 有个基本原则，就是"),s("strong",[a._v("数据不能多一条，也不能少一条")]),a._v("，不能多，就是前面说的"),s("RouterLink",{attrs:{to:"/docs/high-concurrency/how-to-ensure-that-messages-are-not-repeatedly-consumed.html"}},[a._v("重复消费和幂等性问题")]),a._v("。不能少，就是说这数据别搞丢了。那这个问题你必须得考虑一下。")],1),a._v(" "),s("p",[a._v("如果说你这个是用 MQ 来传递非常核心的消息，比如说计费、扣费的一些消息，那必须确保这个 MQ 传递过程中"),s("strong",[a._v("绝对不会把计费消息给弄丢")]),a._v("。")]),a._v(" "),s("h2",{attrs:{id:"面试题剖析"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#面试题剖析"}},[a._v("#")]),a._v(" 面试题剖析")]),a._v(" "),s("p",[a._v("数据的丢失问题，可能出现在生产者、MQ、消费者中，咱们从 RabbitMQ 和 Kafka 分别来分析一下吧。")]),a._v(" "),s("h3",{attrs:{id:"rabbitmq"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#rabbitmq"}},[a._v("#")]),a._v(" RabbitMQ")]),a._v(" "),s("p",[s("img",{attrs:{src:"/images/rabbitmq-message-lose.png",alt:"rabbitmq-message-lose"}})]),a._v(" "),s("h4",{attrs:{id:"生产者弄丢了数据"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#生产者弄丢了数据"}},[a._v("#")]),a._v(" 生产者弄丢了数据")]),a._v(" "),s("p",[a._v("生产者将数据发送到 RabbitMQ 的时候，可能数据就在半路给搞丢了，因为网络问题啥的，都有可能。")]),a._v(" "),s("p",[a._v("此时可以选择用 RabbitMQ 提供的事务功能，就是生产者"),s("strong",[a._v("发送数据之前")]),a._v("开启 RabbitMQ 事务"),s("code",[a._v("channel.txSelect")]),a._v("，然后发送消息，如果消息没有成功被 RabbitMQ 接收到，那么生产者会收到异常报错，此时就可以回滚事务"),s("code",[a._v("channel.txRollback")]),a._v("，然后重试发送消息；如果收到了消息，那么可以提交事务"),s("code",[a._v("channel.txCommit")]),a._v("。")]),a._v(" "),s("div",{staticClass:"language-java line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[a._v("// 开启事务")]),a._v("\nchannel"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("txSelect\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("try")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[a._v("// 这里发送消息")]),a._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("catch")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),s("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("Exception")]),a._v(" e"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n    channel"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("txRollback\n\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[a._v("// 这里再次重发这条消息")]),a._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[a._v("// 提交事务")]),a._v("\nchannel"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("txCommit\n")])]),a._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[a._v("1")]),s("br"),s("span",{staticClass:"line-number"},[a._v("2")]),s("br"),s("span",{staticClass:"line-number"},[a._v("3")]),s("br"),s("span",{staticClass:"line-number"},[a._v("4")]),s("br"),s("span",{staticClass:"line-number"},[a._v("5")]),s("br"),s("span",{staticClass:"line-number"},[a._v("6")]),s("br"),s("span",{staticClass:"line-number"},[a._v("7")]),s("br"),s("span",{staticClass:"line-number"},[a._v("8")]),s("br"),s("span",{staticClass:"line-number"},[a._v("9")]),s("br"),s("span",{staticClass:"line-number"},[a._v("10")]),s("br"),s("span",{staticClass:"line-number"},[a._v("11")]),s("br"),s("span",{staticClass:"line-number"},[a._v("12")]),s("br")])]),s("p",[a._v("但是问题是，RabbitMQ 事务机制（同步）一搞，基本上"),s("strong",[a._v("吞吐量会下来，因为太耗性能")]),a._v("。")]),a._v(" "),s("p",[a._v("所以一般来说，如果你要确保说写 RabbitMQ 的消息别丢，可以开启 "),s("code",[a._v("confirm")]),a._v(" 模式，在生产者那里设置开启 "),s("code",[a._v("confirm")]),a._v(" 模式之后，你每次写的消息都会分配一个唯一的 id，然后如果写入了 RabbitMQ 中，RabbitMQ 会给你回传一个 "),s("code",[a._v("ack")]),a._v(" 消息，告诉你说这个消息 ok 了。如果 RabbitMQ 没能处理这个消息，会回调你的一个 "),s("code",[a._v("nack")]),a._v(" 接口，告诉你这个消息接收失败，你可以重试。而且你可以结合这个机制自己在内存里维护每个消息 id 的状态，如果超过一定时间还没接收到这个消息的回调，那么你可以重发。")]),a._v(" "),s("p",[a._v("事务机制和 "),s("code",[a._v("confirm")]),a._v(" 机制最大的不同在于，"),s("strong",[a._v("事务机制是同步的")]),a._v("，你提交一个事务之后会"),s("strong",[a._v("阻塞")]),a._v("在那儿，但是 "),s("code",[a._v("confirm")]),a._v(" 机制是"),s("strong",[a._v("异步")]),a._v("的，你发送个消息之后就可以发送下一个消息，然后那个消息 RabbitMQ 接收了之后会异步回调你的一个接口通知你这个消息接收到了。")]),a._v(" "),s("p",[a._v("所以一般在生产者这块"),s("strong",[a._v("避免数据丢失")]),a._v("，都是用 "),s("code",[a._v("confirm")]),a._v(" 机制的。")]),a._v(" "),s("h4",{attrs:{id:"rabbitmq-弄丢了数据"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#rabbitmq-弄丢了数据"}},[a._v("#")]),a._v(" RabbitMQ 弄丢了数据")]),a._v(" "),s("p",[a._v("就是 RabbitMQ 自己弄丢了数据，这个你必须"),s("strong",[a._v("开启 RabbitMQ 的持久化")]),a._v("，就是消息写入之后会持久化到磁盘，哪怕是 RabbitMQ 自己挂了，"),s("strong",[a._v("恢复之后会自动读取之前存储的数据")]),a._v("，一般数据不会丢。除非极其罕见的是，RabbitMQ 还没持久化，自己就挂了，"),s("strong",[a._v("可能导致少量数据丢失")]),a._v("，但是这个概率较小。")]),a._v(" "),s("p",[a._v("设置持久化有"),s("strong",[a._v("两个步骤")]),a._v("：")]),a._v(" "),s("ul",[s("li",[a._v("创建 queue 的时候将其设置为持久化"),s("br"),a._v("\n这样就可以保证 RabbitMQ 持久化 queue 的元数据，但是它是不会持久化 queue 里的数据的。")]),a._v(" "),s("li",[a._v("第二个是发送消息的时候将消息的 "),s("code",[a._v("deliveryMode")]),a._v(" 设置为 2"),s("br"),a._v("\n就是将消息设置为持久化的，此时 RabbitMQ 就会将消息持久化到磁盘上去。")])]),a._v(" "),s("p",[a._v("必须要同时设置这两个持久化才行，RabbitMQ 哪怕是挂了，再次重启，也会从磁盘上重启恢复 queue，恢复这个 queue 里的数据。")]),a._v(" "),s("p",[a._v("注意，哪怕是你给 RabbitMQ 开启了持久化机制，也有一种可能，就是这个消息写到了 RabbitMQ 中，但是还没来得及持久化到磁盘上，结果不巧，此时 RabbitMQ 挂了，就会导致内存里的一点点数据丢失。")]),a._v(" "),s("p",[a._v("所以，持久化可以跟生产者那边的 "),s("code",[a._v("confirm")]),a._v(" 机制配合起来，只有消息被持久化到磁盘之后，才会通知生产者 "),s("code",[a._v("ack")]),a._v(" 了，所以哪怕是在持久化到磁盘之前，RabbitMQ 挂了，数据丢了，生产者收不到 "),s("code",[a._v("ack")]),a._v("，你也是可以自己重发的。")]),a._v(" "),s("h4",{attrs:{id:"消费端弄丢了数据"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#消费端弄丢了数据"}},[a._v("#")]),a._v(" 消费端弄丢了数据")]),a._v(" "),s("p",[a._v("RabbitMQ 如果丢失了数据，主要是因为你消费的时候，"),s("strong",[a._v("刚消费到，还没处理，结果进程挂了")]),a._v("，比如重启了，那么就尴尬了，RabbitMQ 认为你都消费了，这数据就丢了。")]),a._v(" "),s("p",[a._v("这个时候得用 RabbitMQ 提供的 "),s("code",[a._v("ack")]),a._v(" 机制，简单来说，就是你必须关闭 RabbitMQ 的自动 "),s("code",[a._v("ack")]),a._v("，可以通过一个 api 来调用就行，然后每次你自己代码里确保处理完的时候，再在程序里 "),s("code",[a._v("ack")]),a._v(" 一把。这样的话，如果你还没处理完，不就没有 "),s("code",[a._v("ack")]),a._v(" 了？那 RabbitMQ 就认为你还没处理完，这个时候 RabbitMQ 会把这个消费分配给别的 consumer 去处理，消息是不会丢的。")]),a._v(" "),s("p",[s("img",{attrs:{src:"/images/rabbitmq-message-lose-solution.png",alt:"rabbitmq-message-lose-solution"}})]),a._v(" "),s("h3",{attrs:{id:"kafka"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#kafka"}},[a._v("#")]),a._v(" Kafka")]),a._v(" "),s("h4",{attrs:{id:"消费端弄丢了数据-2"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#消费端弄丢了数据-2"}},[a._v("#")]),a._v(" 消费端弄丢了数据")]),a._v(" "),s("p",[a._v("唯一可能导致消费者弄丢数据的情况，就是说，你消费到了这个消息，然后消费者那边"),s("strong",[a._v("自动提交了 offset")]),a._v("，让 Kafka 以为你已经消费好了这个消息，但其实你才刚准备处理这个消息，你还没处理，你自己就挂了，此时这条消息就丢咯。")]),a._v(" "),s("p",[a._v("这不是跟 RabbitMQ 差不多吗，大家都知道 Kafka 会自动提交 offset，那么只要"),s("strong",[a._v("关闭自动提交")]),a._v(" offset，在处理完之后自己手动提交 offset，就可以保证数据不会丢。但是此时确实还是"),s("strong",[a._v("可能会有重复消费")]),a._v("，比如你刚处理完，还没提交 offset，结果自己挂了，此时肯定会重复消费一次，自己保证幂等性就好了。")]),a._v(" "),s("p",[a._v("生产环境碰到的一个问题，就是说我们的 Kafka 消费者消费到了数据之后是写到一个内存的 queue 里先缓冲一下，结果有的时候，你刚把消息写入内存 queue，然后消费者会自动提交 offset。然后此时我们重启了系统，就会导致内存 queue 里还没来得及处理的数据就丢失了。")]),a._v(" "),s("h4",{attrs:{id:"kafka-弄丢了数据"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#kafka-弄丢了数据"}},[a._v("#")]),a._v(" Kafka 弄丢了数据")]),a._v(" "),s("p",[a._v("这块比较常见的一个场景，就是 Kafka 某个 broker 宕机，然后重新选举 partition 的 leader。大家想想，要是此时其他的 follower 刚好还有些数据没有同步，结果此时 leader 挂了，然后选举某个 follower 成 leader 之后，不就少了一些数据？这就丢了一些数据啊。")]),a._v(" "),s("p",[a._v("生产环境也遇到过，我们也是，之前 Kafka 的 leader 机器宕机了，将 follower 切换为 leader 之后，就会发现说这个数据就丢了。")]),a._v(" "),s("p",[a._v("所以此时一般是要求起码设置如下 4 个参数：")]),a._v(" "),s("ul",[s("li",[a._v("给 topic 设置 "),s("code",[a._v("replication.factor")]),a._v(" 参数：这个值必须大于 1，要求每个 partition 必须有至少 2 个副本。")]),a._v(" "),s("li",[a._v("在 Kafka 服务端设置 "),s("code",[a._v("min.insync.replicas")]),a._v(" 参数：这个值必须大于 1，这个是要求一个 leader 至少感知到有至少一个 follower 还跟自己保持联系，没掉队，这样才能确保 leader 挂了还有一个 follower 吧。")]),a._v(" "),s("li",[a._v("在 producer 端设置 "),s("code",[a._v("acks=all")]),a._v("：这个是要求每条数据，必须是"),s("strong",[a._v("写入所有 replica 之后，才能认为是写成功了")]),a._v("。")]),a._v(" "),s("li",[a._v("在 producer 端设置 "),s("code",[a._v("retries=MAX")]),a._v("（很大很大很大的一个值，无限次重试的意思）：这个是"),s("strong",[a._v("要求一旦写入失败，就无限重试")]),a._v("，卡在这里了。")])]),a._v(" "),s("p",[a._v("我们生产环境就是按照上述要求配置的，这样配置之后，至少在 Kafka broker 端就可以保证在 leader 所在 broker 发生故障，进行 leader 切换时，数据不会丢失。")]),a._v(" "),s("h4",{attrs:{id:"生产者会不会弄丢数据"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#生产者会不会弄丢数据"}},[a._v("#")]),a._v(" 生产者会不会弄丢数据？")]),a._v(" "),s("p",[a._v("如果按照上述的思路设置了 "),s("code",[a._v("acks=all")]),a._v("，一定不会丢，要求是，你的 leader 接收到消息，所有的 follower 都同步到了消息之后，才认为本次写成功了。如果没满足这个条件，生产者会自动不断的重试，重试无限次。")])])}),[],!1,null,null,null);t.default=v.exports}}]);
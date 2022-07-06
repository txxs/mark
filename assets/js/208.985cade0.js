(window.webpackJsonp=window.webpackJsonp||[]).push([[208],{583:function(a,t,r){"use strict";r.r(t);var e=r(13),s=Object(e.a)({},(function(){var a=this,t=a.$createElement,r=a._self._c||t;return r("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[r("p",[a._v("原文地址：")]),a._v(" "),r("p",[a._v("https://raw.githubusercontent.com/doocs/advanced-java/master/docs/high-concurrency/how-to-ensure-high-availability-of-message-queues.md")]),a._v(" "),r("h2",{attrs:{id:"面试题"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#面试题"}},[a._v("#")]),a._v(" 面试题")]),a._v(" "),r("p",[a._v("如何保证消息的顺序性？")]),a._v(" "),r("h2",{attrs:{id:"面试官心理分析"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#面试官心理分析"}},[a._v("#")]),a._v(" 面试官心理分析")]),a._v(" "),r("p",[a._v("其实这个也是用 MQ 的时候必问的话题，第一看看你了不了解顺序这个事儿？第二看看你有没有办法保证消息是有顺序的？这是生产系统中常见的问题。")]),a._v(" "),r("h2",{attrs:{id:"面试题剖析"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#面试题剖析"}},[a._v("#")]),a._v(" 面试题剖析")]),a._v(" "),r("p",[a._v("我举个例子，我们以前做过一个 mysql "),r("code",[a._v("binlog")]),a._v(" 同步的系统，压力还是非常大的，日同步数据要达到上亿，就是说数据从一个 mysql 库原封不动地同步到另一个 mysql 库里面去（mysql -> mysql）。常见的一点在于说比如大数据 team，就需要同步一个 mysql 库过来，对公司的业务系统的数据做各种复杂的操作。")]),a._v(" "),r("p",[a._v("你在 mysql 里增删改一条数据，对应出来了增删改 3 条 "),r("code",[a._v("binlog")]),a._v(" 日志，接着这三条 "),r("code",[a._v("binlog")]),a._v(" 发送到 MQ 里面，再消费出来依次执行，起码得保证人家是按照顺序来的吧？不然本来是：增加、修改、删除；你楞是换了顺序给执行成删除、修改、增加，不全错了么。")]),a._v(" "),r("p",[a._v("本来这个数据同步过来，应该最后这个数据被删除了；结果你搞错了这个顺序，最后这个数据保留下来了，数据同步就出错了。")]),a._v(" "),r("p",[a._v("先看看顺序会错乱的俩场景：")]),a._v(" "),r("ul",[r("li",[r("strong",[a._v("RabbitMQ")]),a._v("：一个 queue，多个 consumer。比如，生产者向 RabbitMQ 里发送了三条数据，顺序依次是 data1/data2/data3，压入的是 RabbitMQ 的一个内存队列。有三个消费者分别从 MQ 中消费这三条数据中的一条，结果消费者2先执行完操作，把 data2 存入数据库，然后是 data1/data3。这不明显乱了。")])]),a._v(" "),r("p",[r("img",{attrs:{src:"/images/rabbitmq-order-01.png",alt:"rabbitmq-order-01"}})]),a._v(" "),r("ul",[r("li",[r("strong",[a._v("Kafka")]),a._v("：比如说我们建了一个 topic，有三个 partition。生产者在写的时候，其实可以指定一个 key，比如说我们指定了某个订单 id 作为 key，那么这个订单相关的数据，一定会被分发到同一个 partition 中去，而且这个 partition 中的数据一定是有顺序的。"),r("br"),a._v("消费者从 partition 中取出来数据的时候，也一定是有顺序的。到这里，顺序还是 ok 的，没有错乱。接着，我们在消费者里可能会搞"),r("strong",[a._v("多个线程来并发处理消息")]),a._v("。因为如果消费者是单线程消费处理，而处理比较耗时的话，比如处理一条消息耗时几十 ms，那么 1 秒钟只能处理几十条消息，这吞吐量太低了。而多个线程并发跑的话，顺序可能就乱掉了。")])]),a._v(" "),r("p",[r("img",{attrs:{src:"/images/kafka-order-01.png",alt:"kafka-order-01"}})]),a._v(" "),r("h3",{attrs:{id:"解决方案"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#解决方案"}},[a._v("#")]),a._v(" 解决方案")]),a._v(" "),r("h4",{attrs:{id:"rabbitmq"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#rabbitmq"}},[a._v("#")]),a._v(" RabbitMQ")]),a._v(" "),r("p",[a._v("拆分多个 queue，每个 queue 一个 consumer，就是多一些 queue 而已，确实是麻烦点；或者就一个 queue 但是对应一个 consumer，然后这个 consumer 内部用内存队列做排队，然后分发给底层不同的 worker 来处理。\n"),r("img",{attrs:{src:"/images/rabbitmq-order-02.png",alt:"rabbitmq-order-02"}})]),a._v(" "),r("h4",{attrs:{id:"kafka"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#kafka"}},[a._v("#")]),a._v(" Kafka")]),a._v(" "),r("ul",[r("li",[a._v("一个 topic，一个 partition，一个 consumer，内部单线程消费，单线程吞吐量太低，一般不会用这个。")]),a._v(" "),r("li",[a._v("写 N 个内存 queue，具有相同 key 的数据都到同一个内存 queue；然后对于 N 个线程，每个线程分别消费一个内存 queue 即可，这样就能保证顺序性。")])]),a._v(" "),r("p",[r("img",{attrs:{src:"/images/kafka-order-02.png",alt:"kafka-order-02"}})])])}),[],!1,null,null,null);t.default=s.exports}}]);
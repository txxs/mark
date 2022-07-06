(window.webpackJsonp=window.webpackJsonp||[]).push([[60],{446:function(v,_,t){"use strict";t.r(_);var p=t(13),a=Object(p.a)({},(function(){var v=this,_=v.$createElement,t=v._self._c||_;return t("ContentSlotsDistributor",{attrs:{"slot-key":v.$parent.slotKey}},[t("p",[v._v("原文地址：\nhttps://zhuanlan.zhihu.com/p/67799988")]),v._v(" "),t("p",[v._v("总结起来就是：")]),v._v(" "),t("p",[v._v("1、利用大数据热点发现\n2、ZK监控\n3、加载热点数据到本地缓存\n4、限流熔断")]),v._v(" "),t("h3",{attrs:{id:"一、20-万用户同时访问一个热点缓存的问题"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#一、20-万用户同时访问一个热点缓存的问题"}},[v._v("#")]),v._v(" 一、20 万用户同时访问一个热点缓存的问题")]),v._v(" "),t("p",[v._v("好了，背景是已经给大家解释清楚了，那么现在就可以给大家说说今天重点要讨论的问题：热点缓存。")]),v._v(" "),t("p",[v._v("我们来做一个假设，你现在有 10 个缓存节点来抗大量的读请求。正常情况下，读请求应该是均匀的落在 10 个缓存节点上的，对吧!")]),v._v(" "),t("p",[v._v("这 10 个缓存节点，每秒承载 1 万请求是差不多的。然后我们再做一个假设，你一个节点承载 2 万请求是极限，所以一般你就限制一个节点正常承载 1 万请求就 OK 了，稍微留一点 Buffer 出来。")]),v._v(" "),t("p",[v._v("好，所谓的热点缓存问题是什么意思呢?很简单，就是突然因为莫名的原因，出现大量的用户访问同一条缓存数据。")]),v._v(" "),t("p",[v._v("举个例子，某个明星突然宣布跟某某结婚，这个时候是不是会引发可能短时间内每秒都是数十万的用户去查看这个明星跟某某结婚的那条新闻?")]),v._v(" "),t("p",[v._v("那么假设那条新闻就是一个缓存，然后对应就是一个缓存 Key，就存在一台缓存机器上，此时瞬时假设有 20 万请求奔向那一台机器上的一个 Key。")]),v._v(" "),t("p",[v._v("这个时候很明显了，我们刚才假设的是一个缓存 Slave 节点最多每秒就是 2 万的请求，当然实际缓存单机承载 5 万~10 万读请求也是可能的，我们这里就是一个假设。")]),v._v(" "),t("p",[v._v("结果此时，每秒突然奔过来 20 万请求到这台机器上，会怎么样?很简单，上面图里那台被 20 万请求指向的缓存机器会过度操劳而宕机的。")]),v._v(" "),t("p",[v._v("那么如果缓存集群开始出现机器的宕机，此时会如何?接着，读请求发现读不到数据，会从数据库里提取原始数据，然后放入剩余的其他缓存机器里去。")]),v._v(" "),t("p",[v._v("但是接踵而来的每秒 20 万请求，会再次压垮其他的缓存机器。以此类推，最终导致缓存集群全盘崩溃，引发系统整体宕机。")]),v._v(" "),t("h3",{attrs:{id:"二、基于流式计算技术的缓存热点自动发现"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#二、基于流式计算技术的缓存热点自动发现"}},[v._v("#")]),v._v(" 二、基于流式计算技术的缓存热点自动发现")]),v._v(" "),t("p",[v._v("其实这里关键的一点，就是对于这种热点缓存，你的系统需要能够在热点缓存突然发生的时候，直接发现他，然后瞬间立马实现毫秒级的自动负载均衡。")]),v._v(" "),t("p",[v._v("那么我们就先来说说，你如何自动发现热点缓存问题?首先你要知道，一般出现缓存热点的时候，你的每秒并发肯定是很高的，可能每秒都几十万甚至上百万的请求量过来，这都是有可能的。")]),v._v(" "),t("p",[v._v("所以，此时完全可以基于大数据领域的流式计算技术来进行实时数据访问次数的统计，比如 Storm、Spark Streaming、Flink，这些技术都是可以的。")]),v._v(" "),t("p",[v._v("然后一旦在实时数据访问次数统计的过程中，比如发现一秒之内，某条数据突然访问次数超过了 1000，就直接立马把这条数据判定为是热点数据，可以将这个发现出来的热点数据写入比如 Zookeeper 中。")]),v._v(" "),t("p",[v._v("当然，你的系统如何判定热点数据，可以根据自己的业务还有经验值来就可以了。")]),v._v(" "),t("p",[v._v("大家看看下面这张图，看看整个流程是如何进行的：\n"),t("img",{attrs:{src:"https://txxs.github.io/pic/tofuturedbredis/8-1.png",alt:"1"}})]),v._v(" "),t("p",[v._v("当然肯定有人会问，那你的流式计算系统在进行数据访问次数统计的时候，会不会也存在说单台机器被请求每秒几十万次的问题呢?")]),v._v(" "),t("p",[v._v("答案是否，因为流式计算技术，尤其是 Storm 这种系统，他可以做到同一条数据的请求过来，先分散在很多机器里进行本地计算，最后再汇总局部计算结果到一台机器进行全局汇总。")]),v._v(" "),t("p",[v._v("所以几十万请求可以先分散在比如 100 台机器上，每台机器统计了这条数据的几千次请求。")]),v._v(" "),t("p",[v._v("然后 100 条局部计算好的结果汇总到一台机器做全局计算即可，所以基于流式计算技术来进行统计是不会有热点问题的。")]),v._v(" "),t("h3",{attrs:{id:"三、热点缓存自动加载为-jvm-本地缓存"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#三、热点缓存自动加载为-jvm-本地缓存"}},[v._v("#")]),v._v(" 三、热点缓存自动加载为 JVM 本地缓存")]),v._v(" "),t("p",[v._v("我们自己的系统可以对 Zookeeper 指定的热点缓存对应的 Znode 进行监听，如果有变化他立马就可以感知到了。")]),v._v(" "),t("p",[v._v("此时系统层就可以立马把相关的缓存数据从数据库加载出来，然后直接放在自己系统内部的本地缓存里即可。")]),v._v(" "),t("p",[v._v("这个本地缓存，你用 Ehcache、Hashmap，其实都可以，一切都看自己的业务需求，主要说的就是将缓存集群里的集中式缓存，直接变成每个系统自己本地实现缓存即可，每个系统自己本地是无法缓存过多数据的。")]),v._v(" "),t("p",[v._v("因为一般这种普通系统单实例部署机器可能就一个 4 核 8G 的机器，留给本地缓存的空间是很少的，所以用来放这种热点数据的本地缓存是最合适的，刚刚好。")]),v._v(" "),t("p",[v._v("假设你的系统层集群部署了 100 台机器，那么好了，此时你 100 台机器瞬间在本地都会有一份热点缓存的副本。")]),v._v(" "),t("p",[v._v("然后接下来对热点缓存的读操作，直接系统本地缓存读出来就给返回了，不用再走缓存集群了。")]),v._v(" "),t("p",[v._v("这样的话，也不可能允许每秒 20 万的读请求到达缓存机器的一台机器上读一个热点缓存了，而是变成 100 台机器每台机器承载数千请求，那么那数千请求就直接从机器本地缓存返回数据了，这是没有问题的。")]),v._v(" "),t("p",[v._v("我们再来画一幅图，一起来看看这个过程：\n"),t("img",{attrs:{src:"https://txxs.github.io/pic/tofuturedbredis/8-2.png",alt:"1"}})]),v._v(" "),t("h3",{attrs:{id:"四、限流熔断保护"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#四、限流熔断保护"}},[v._v("#")]),v._v(" 四、限流熔断保护")]),v._v(" "),t("p",[v._v("除此之外，在每个系统内部，还应该专门加一个对热点数据访问的限流熔断保护措施。")]),v._v(" "),t("p",[v._v("每个系统实例内部，都可以加一个熔断保护机制，假设缓存集群最多每秒承载4万读请求，那么你一共有 100 个系统实例。")]),v._v(" "),t("p",[v._v("你自己就该限制好，每个系统实例每秒最多请求缓存集群读操作不超过 400 次，一超过就可以熔断掉，不让请求缓存集群，直接返回一个空白信息，然后用户稍后会自行再次重新刷新页面之类的。")]),v._v(" "),t("p",[v._v("通过系统层自己直接加限流熔断保护措施，可以很好的保护后面的缓存集群、数据库集群之类的不要被打死")]),v._v(" "),t("h3",{attrs:{id:"五、总结"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#五、总结"}},[v._v("#")]),v._v(" 五、总结")]),v._v(" "),t("p",[v._v("具体要不要在系统里实现这种复杂的缓存热点优化架构呢?这个还要看你们自己的系统有没有这种场景了。")]),v._v(" "),t("p",[v._v("如果你的系统有热点缓存问题，那么就要实现类似本文的复杂热点缓存支撑架构。")]),v._v(" "),t("p",[v._v("但是如果没有的话，那么也别过度设计，其实你的系统可能根本不需要这么复杂的架构。")]),v._v(" "),t("p",[v._v("如果是后者，那么大伙儿就权当看看本文，来了解一下对应的架构思想好了。")])])}),[],!1,null,null,null);_.default=a.exports}}]);
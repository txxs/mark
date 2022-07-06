(window.webpackJsonp=window.webpackJsonp||[]).push([[264],{640:function(a,s,e){"use strict";e.r(s);var t=e(13),_=Object(t.a)({},(function(){var a=this,s=a.$createElement,e=a._self._c||s;return e("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[e("h1",{attrs:{id:"_1-sdown和odown转换机制"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_1-sdown和odown转换机制"}},[a._v("#")]),a._v(" 1 sdown和odown转换机制")]),a._v(" "),e("blockquote",[e("p",[a._v("两种失败状态")])]),a._v(" "),e("h2",{attrs:{id:"_1-1-概念"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_1-1-概念"}},[a._v("#")]),a._v(" 1.1 概念")]),a._v(" "),e("ul",[e("li",[a._v("sdown主观宕机\n一个哨兵自己觉得一个master宕机")]),a._v(" "),e("li",[a._v("odown客观宕机\nquorum数量的哨兵都觉得一个master宕机")])]),a._v(" "),e("h2",{attrs:{id:"_1-2-达成条件"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_1-2-达成条件"}},[a._v("#")]),a._v(" 1.2 达成条件")]),a._v(" "),e("ul",[e("li",[a._v("sdown\n一个哨兵ping一个master，超过"),e("code",[a._v("is-master-down-after-milliseconds")])]),a._v(" "),e("li",[a._v("odown\n一个哨兵在指定时间内，收到了quorum指定数量的其他哨兵也认为那个master是sdown了，那么就认为是odown")])]),a._v(" "),e("h1",{attrs:{id:"_2-自动发现机制"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_2-自动发现机制"}},[a._v("#")]),a._v(" 2 自动发现机制")]),a._v(" "),e("p",[a._v("通过Redis的pub/sub实现哨兵互相之间的发现，每个哨兵都会往"),e("code",[a._v("__sentinel__:hello")]),a._v("这个channel发一个消息，此时所有其他哨兵都可消费到该消息，于是感知到其他哨兵的存在.")]),a._v(" "),e("p",[a._v("每隔2s，哨兵都会往自己监控的某个master+slaves对应的"),e("code",[a._v("__sentinel__:hello")]),a._v("channel里发一个消息，内容为自己的host、ip和runid还有对该master的监控配置")]),a._v(" "),e("p",[a._v("每个哨兵也会去监听自己监控的每个master+slaves对应的"),e("code",[a._v("__sentinel__:hello")]),a._v(" channel，然后去感知到同样在监听这个master+slaves的其他哨兵的存在")]),a._v(" "),e("p",[a._v("每个哨兵还会跟其他哨兵交换对master的监控配置，互相进行监控配置的同步")]),a._v(" "),e("h1",{attrs:{id:"_3-slave配置的自动纠正"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3-slave配置的自动纠正"}},[a._v("#")]),a._v(" 3 slave配置的自动纠正")]),a._v(" "),e("p",[a._v("哨兵会负责自动纠正slave的一些配置,比如")]),a._v(" "),e("ul",[e("li",[a._v("slave要成为潜在的master候选人，哨兵会确保slave复制现有master的数据")]),a._v(" "),e("li",[a._v("slave连接到了一个错误的master上，比如故障转移之后，那么哨兵会确保它们连接至正确的master")])]),a._v(" "),e("h1",{attrs:{id:"_4-slave-master选举算法"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_4-slave-master选举算法"}},[a._v("#")]),a._v(" 4 slave => master选举算法")]),a._v(" "),e("p",[a._v("若一个master被认为odown了，而且majority数量的哨兵都允许了主备切换，那么某个哨兵就会执行主备切换操作，此时首先要选举一个slave,会考虑slave的一些信息")]),a._v(" "),e("ul",[e("li",[a._v("跟master断开连接的时长")]),a._v(" "),e("li",[a._v("slave优先级")]),a._v(" "),e("li",[a._v("复制offset")]),a._v(" "),e("li",[a._v("run id")])]),a._v(" "),e("p",[a._v("若一个slave跟master断开连接的时间已经超过"),e("code",[a._v("down-after-milliseconds")]),a._v("的10倍，外加master的宕机时长，那么slave就会被认为不适合选举为master")]),a._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[a._v("(down-after-milliseconds * 10) + milliseconds_since_master_is_in_SDOWN_state\n")])]),a._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[a._v("1")]),e("br")])]),e("p",[a._v("接下来会对slave进行排序")]),a._v(" "),e("ol",[e("li",[a._v("按照slave优先级进行排序，slave priority越低，优先级就越高")]),a._v(" "),e("li",[a._v("如果slave priority相同，那么看replica offset，哪个slave复制了越多的数据，offset越靠后，优先级就越高")]),a._v(" "),e("li",[a._v("如果上面两个条件都相同，那么选择一个run id比较小的那个slave")])]),a._v(" "),e("h1",{attrs:{id:"_5-quorum和majority"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_5-quorum和majority"}},[a._v("#")]),a._v(" 5 quorum和majority")]),a._v(" "),e("p",[a._v("每次一个哨兵要做主备切换，首先需要quorum数量的哨兵认为odown，然后选举出一个哨兵来做切换\n该哨兵还得得到majority个哨兵的授权，才能正式执行切换")]),a._v(" "),e("ul",[e("li",[e("p",[a._v("若quorum < majority\n比如5个哨兵，majority就是3，quorum设置为2，那么就3个哨兵授权就可以执行切换")])]),a._v(" "),e("li",[e("p",[a._v("若quorum >= majority\n那么必须quorum数量的哨兵都授权，比如5个哨兵，quorum是5，那么必须5个哨兵都同意授权，才能执行切换")])])]),a._v(" "),e("h1",{attrs:{id:"_6-configuration-epoch"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_6-configuration-epoch"}},[a._v("#")]),a._v(" 6 configuration epoch")]),a._v(" "),e("p",[a._v("哨兵会监控一套Redis master+slave，并有相应的监控配置")]),a._v(" "),e("p",[a._v("执行切换的哨兵，会从要切换到的新master（salve => master）那里得到一个configuration epoch，这就是一个version号，每次切换的version号都必须是唯一的")]),a._v(" "),e("p",[a._v("如果第一个选举出的哨兵切换失败，那么其他哨兵，会等待"),e("code",[a._v("failover-timeout")]),a._v("时间，然后接替继续执行切换，此时会重新获取一个新的configuration epoch，作为新的version号")]),a._v(" "),e("h1",{attrs:{id:"_7-configuraiton传播"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_7-configuraiton传播"}},[a._v("#")]),a._v(" 7 configuraiton传播")]),a._v(" "),e("p",[a._v("哨兵完成切换之后，会在自己本地更新生成最新的master配置，然后同步给其他哨兵")]),a._v(" "),e("blockquote",[e("p",[a._v("这里是通过pub/sub机制传递的")])]),a._v(" "),e("p",[a._v("到了这里,之前提到的version号就很重要了，因为各种消息都是通过一个channel去发布和监听的，所以一个哨兵完成一次新的切换之后，新的master配置是跟着新的version号的")]),a._v(" "),e("p",[a._v("其他的哨兵也都是根据版本号的大小来更新自己的master配置的")])])}),[],!1,null,null,null);s.default=_.exports}}]);
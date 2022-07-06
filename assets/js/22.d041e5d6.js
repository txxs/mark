(window.webpackJsonp=window.webpackJsonp||[]).push([[22],{399:function(s,e,t){"use strict";t.r(e);var a=t(13),r=Object(a.a)({},(function(){var s=this,e=s.$createElement,t=s._self._c||e;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("h3",{attrs:{id:"_1、悲观锁或者乐观锁版本号控制超发"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1、悲观锁或者乐观锁版本号控制超发"}},[s._v("#")]),s._v(" 1、悲观锁或者乐观锁版本号控制超发")]),s._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("原来的代码是通过悲观锁来控制超发的情况。（比如一共有100个商品，在最后一刻，我们已经消耗了99个商品，仅剩最后一个。这个时候，系统发来多个并发请求，这批请求读取到的商品余量都是99个，然后都通过了这一个余量判断，最终导致超发。）\n在原来的代码中用的是for update行锁，在高并发的情况下会很多这样的修改请求，每个请求都需要等待锁，某些线程可能永远都没有机会抢到这个锁，这种请求就会死在那里。同时，这种请求会很多，瞬间增大系统的平均响应时间，结果是可用连接数被耗尽，系统陷入异常。\n可以采用乐观锁，是相对于“悲观锁”采用更为宽松的加锁机制，大都是采用带版本号（Version）更新。实现就是，这个数据所有请求都有资格去修改，但会获得一个该数据的版本号，只有版本号符合的才能更新成功，其他的返回抢购失败。\n\nhttps://blog.csdn.net/qq_16681169/article/details/53750704\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br")])]),t("h3",{attrs:{id:"_2、数据库读写分离减轻主库压力"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_2、数据库读写分离减轻主库压力"}},[s._v("#")]),s._v(" 2、数据库读写分离减轻主库压力")]),s._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("现在的数据库查询都是读的主库。将数据库的大量查询改为从库，减轻主库的读写压力。主服务器进行写操作时，不影响查询应用服务器的查询性能，降低阻塞，提高并发。\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br")])]),t("h3",{attrs:{id:"_3、一场抽奖以来单点redis-redis单点故障怎么办-数据如何恢复"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_3、一场抽奖以来单点redis-redis单点故障怎么办-数据如何恢复"}},[s._v("#")]),s._v(" 3、一场抽奖以来单点redis，redis单点故障怎么办，数据如何恢复")]),s._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("1、哨兵的方式 http://16kr.com/42.html\n2、zk的方式 https://uule.iteye.com/blog/2432420\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br")])])])}),[],!1,null,null,null);e.default=r.exports}}]);
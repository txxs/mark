(window.webpackJsonp=window.webpackJsonp||[]).push([[117],{499:function(s,a,n){"use strict";n.r(a);var t=n(13),e=Object(t.a)({},(function(){var s=this,a=s.$createElement,n=s._self._c||a;return n("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[n("h3",{attrs:{id:"简单实现配置中心核心思想"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#简单实现配置中心核心思想"}},[s._v("#")]),s._v(" 简单实现配置中心核心思想")]),s._v(" "),n("p",[s._v("原文地址 https://www.cnblogs.com/cc11001100/p/10230608.html")]),s._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[s._v("一个配置中心的核心是什么：\n\n1. 低延迟：配置改变后能够尽快的将最新配置同步给每一个节点。\n\n2. 高可用：配置中心需要能够稳定不间断的提供服务。\n\n \n\n第一点可以通过zookeeper的watcher机制实现，约定一个节点用来存放配置信息，每个客户端都监听这个节点的NodeDataChanged事件，当配置发生改变时将最新的配置更新到这个节点上（谁更新无所谓，任意一个节点都可以更新，或者做一个另外的配置管理后台用来更新都没有问题），这个节点触发NodeDataChanged事件，通知所有监听此节点NodeDataChanged事件的客户端获取此节点的最新值，因为watcher是一次性的，所以在获取最新值的时候需要重新设置监听事件，因为getData是原子性操作，所以能够保证获取到的一定是最新的值。这里需要注意的是存放在节点上的配置文件不宜过大，如果配置文件部分很大而每次变更的只是一部分的话或许可以考虑对其进行拆分，存放在多个节点上。\n\n第二点的高可用性就是交由zookeeper集群来保证，在应用层面不需要做额外的工作。\n\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br"),n("span",{staticClass:"line-number"},[s._v("6")]),n("br"),n("span",{staticClass:"line-number"},[s._v("7")]),n("br"),n("span",{staticClass:"line-number"},[s._v("8")]),n("br"),n("span",{staticClass:"line-number"},[s._v("9")]),n("br"),n("span",{staticClass:"line-number"},[s._v("10")]),n("br"),n("span",{staticClass:"line-number"},[s._v("11")]),n("br"),n("span",{staticClass:"line-number"},[s._v("12")]),n("br")])]),n("p",[s._v("https://blog.csdn.net/u011320740/article/details/78742625 这篇文章更进一步，把修改的数据都落地到数据库")])])}),[],!1,null,null,null);a.default=e.exports}}]);
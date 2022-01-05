(window.webpackJsonp=window.webpackJsonp||[]).push([[250],{629:function(a,t,r){"use strict";r.r(t);var e=r(13),s=Object(e.a)({},(function(){var a=this,t=a.$createElement,r=a._self._c||t;return r("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[r("h1",{attrs:{id:"_1-面试题"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_1-面试题"}},[a._v("#")]),a._v(" 1 面试题")]),a._v(" "),r("p",[a._v("如果让你写一个消息队列，该如何进行架构设计啊？说一下你的思路")]),a._v(" "),r("h1",{attrs:{id:"_2-考点分析"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_2-考点分析"}},[a._v("#")]),a._v(" 2 考点分析")]),a._v(" "),r("p",[a._v("一般面试官要考察两块：")]),a._v(" "),r("p",[a._v("（1）你有没有对某一个消息队列做过较为深入的原理的了解，或者从整体了解把握住一个mq的架构原理")]),a._v(" "),r("p",[a._v("（2）看看你的设计能力，给你一个常见的系统，就是消息队列系统，看看你能不能从全局把握一下整体架构设计，给出一些关键点出来")]),a._v(" "),r("blockquote",[r("p",[a._v("说实话，一般面类似问题的时候，大部分人基本都会蒙，因为平时从来没有思考过类似的问题，大多数人就是平时埋头用，从来不去思考背后的一些东西。\n类似的问题，我=经常问的还有，如果让你来设计一个spring框架你会怎么做？如果让你来设计一个dubbo框架你会怎么做？如果让你来设计一个mybatis框架你会怎么做？")])]),a._v(" "),r("h1",{attrs:{id:"_3-详解"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_3-详解"}},[a._v("#")]),a._v(" 3 详解")]),a._v(" "),r("p",[a._v("其实回答这类问题，说白了，不求你看过那技术的源码，起码你大概知道那个技术的基本原理，核心组成部分，基本架构构成，然后参照一些开源的技术把一个系统设计出来的思路说一下就好")]),a._v(" "),r("p",[a._v("比如说这个消息队列系统，我们来从以下几个角度来考虑一下")]),a._v(" "),r("h2",{attrs:{id:"_3-1-支持可伸缩性"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_3-1-支持可伸缩性"}},[a._v("#")]),a._v(" 3.1 支持可伸缩性")]),a._v(" "),r("p",[a._v("需要的时候快速扩容，就可增加吞吐量和容量，那怎么搞？\n设计个分布式的系统呗，参照一下kafka的设计理念，broker -> topic -> partition，每个partition放一个机器，就存一部分数据。如果现在资源不够了，简单啊，给topic增加partition，然后做数据迁移，增加机器，不就可以存放更多数据，提供更高的吞吐量了？")]),a._v(" "),r("h2",{attrs:{id:"_3-2-数据落地"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_3-2-数据落地"}},[a._v("#")]),a._v(" 3.2 数据落地")]),a._v(" "),r("p",[a._v("那肯定要了，落磁盘，才能保证别进程挂了数据就丢了。那落磁盘的时候怎么落啊？顺序写，这样就没有磁盘随机读写的寻址开销，磁盘顺序读写的性能是很高的，这就是kafka的思路。")]),a._v(" "),r("h2",{attrs:{id:"_3-3-其次你考虑一下你的mq的可用性啊"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_3-3-其次你考虑一下你的mq的可用性啊"}},[a._v("#")]),a._v(" 3.3 其次你考虑一下你的mq的可用性啊")]),a._v(" "),r("p",[a._v("这个事儿，具体参考我们之前可用性那个环节讲解的kafka的高可用保障机制。多副本 -> leader & follower -> broker挂了重新选举leader即可对外服务。")]),a._v(" "),r("h2",{attrs:{id:"_3-4-支持数据0丢失"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_3-4-支持数据0丢失"}},[a._v("#")]),a._v(" 3.4 支持数据0丢失")]),a._v(" "),r("p",[a._v("可以的，参考我们之前说的那个kafka数据零丢失方案")]),a._v(" "),r("p",[a._v("其实一个mq肯定是很复杂的，面试官问你这个问题，其实是个开放题，他就是看看你有没有从架构角度整体构思和设计的思维以及能力。确实这个问题可以刷掉一大批人，因为大部分人平时不思考这些东西。")]),a._v(" "),r("h1",{attrs:{id:"参考"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#参考"}},[a._v("#")]),a._v(" 参考")]),a._v(" "),r("p",[a._v("《Java工程师面试突击第1季-中华石杉老师》")]),a._v(" "),r("h1",{attrs:{id:"x-交流学习"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#x-交流学习"}},[a._v("#")]),a._v(" X 交流学习")]),a._v(" "),r("p",[r("img",{attrs:{src:"https://upload-images.jianshu.io/upload_images/16782311-8d7acde57fdce062.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240",alt:""}})]),a._v(" "),r("h2",{attrs:{id:"java交流群"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#java交流群"}},[a._v("#")]),a._v(" "),r("a",{attrs:{href:"https://jq.qq.com/?_wv=1027&k=5UB4P1T",target:"_blank",rel:"noopener noreferrer"}},[a._v("Java交流群"),r("OutboundLink")],1)]),a._v(" "),r("h2",{attrs:{id:"博客"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#博客"}},[a._v("#")]),a._v(" "),r("a",{attrs:{href:"https://blog.csdn.net/qq_33589510",target:"_blank",rel:"noopener noreferrer"}},[a._v("博客"),r("OutboundLink")],1)]),a._v(" "),r("h2",{attrs:{id:"github"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#github"}},[a._v("#")]),a._v(" "),r("a",{attrs:{href:"https://github.com/Wasabi1234",target:"_blank",rel:"noopener noreferrer"}},[a._v("Github"),r("OutboundLink")],1)])])}),[],!1,null,null,null);t.default=s.exports}}]);
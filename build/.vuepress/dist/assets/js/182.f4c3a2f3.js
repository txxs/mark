(window.webpackJsonp=window.webpackJsonp||[]).push([[182],{558:function(a,s,t){"use strict";t.r(s);var e=t(13),r=Object(e.a)({},(function(){var a=this,s=a.$createElement,t=a._self._c||s;return t("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[t("p",[a._v("原文地址：")]),a._v(" "),t("p",[a._v("https://www.jianshu.com/p/5be9c56171dd")]),a._v(" "),t("h3",{attrs:{id:"吞吐量优先的并行收集器"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#吞吐量优先的并行收集器"}},[a._v("#")]),a._v(" 吞吐量优先的并行收集器")]),a._v(" "),t("p",[a._v("并行收集器主要以到达一定的吞吐量为目标，适用于后台处理")]),a._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[a._v("java -Xmx3550m-Xms3550m-Xss128k-XX:+UseParallelGC\n-XX:ParallelGCThreads=20\n-XX:+UseParallelGC:选择垃圾收集器为并行收集器。次配置仅对年轻代有效。即上述配置下，年轻代使用并行收集，而年老代仍旧使用串行收集。\n-XX：PARALLELgcThreads=20:配置并行收集器的线程数，即：同时多少个线程一起进行垃圾回收。此值最好配置与处理器数目相同。\n-XX:+UseParallelOldGC:配置年老代来及收集方式为并行收集，JDK6.0支持对年老代并行收集\n-XX:MaxGCPauseMillis=100:设置每次年轻代垃圾回收的最长时间，如果无法满足此时间，JVM会自动调整年轻代大小，以满足此值\n-XX:+UseAdaptiveSizePolicy:设置此选项以后，并行收集器会自动选择年轻代区大小和相应的Survivor区比例，以达到目标系统规定的最低响应时间或者收集频率等，此值建议使用并行收集器时，一直打开\n")])]),a._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[a._v("1")]),t("br"),t("span",{staticClass:"line-number"},[a._v("2")]),t("br"),t("span",{staticClass:"line-number"},[a._v("3")]),t("br"),t("span",{staticClass:"line-number"},[a._v("4")]),t("br"),t("span",{staticClass:"line-number"},[a._v("5")]),t("br"),t("span",{staticClass:"line-number"},[a._v("6")]),t("br"),t("span",{staticClass:"line-number"},[a._v("7")]),t("br")])]),t("h3",{attrs:{id:"响应时间优先的并发收集器"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#响应时间优先的并发收集器"}},[a._v("#")]),a._v(" 响应时间优先的并发收集器")]),a._v(" "),t("p",[a._v("并发收集器主要是保证系统的响应时间，减少垃圾收集时的停顿时间。适用于应用服务器、电信领域等。")]),a._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[a._v("-XX:CMSFullGCsBeforeCompaction=5\n-XX:+UseCMSCompactAtFullCollection\n-XX:CMSFullGCsBeforeCompaction:由于并发收集器不对内存空间进行压缩、整理、所以运行一段时间以后会产生“碎片”，使得运行效率降低。此值设置运行多少次GC以后对内存空间进行压缩、整理\n-XX:+UseCMSCompactAtFullCollection：打开对年老代的压缩。可能会影响性能，但是可以消除碎片\n")])]),a._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[a._v("1")]),t("br"),t("span",{staticClass:"line-number"},[a._v("2")]),t("br"),t("span",{staticClass:"line-number"},[a._v("3")]),t("br"),t("span",{staticClass:"line-number"},[a._v("4")]),t("br")])]),t("h3",{attrs:{id:"调优总结"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#调优总结"}},[a._v("#")]),a._v(" 调优总结：")]),a._v(" "),t("h4",{attrs:{id:"年轻代大小选择"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#年轻代大小选择"}},[a._v("#")]),a._v(" 年轻代大小选择")]),a._v(" "),t("p",[a._v("响应时间优先的应用：尽可能设置大，直到接近系统的最低响应时间限制（根据实际情况选择）。在此种情况下，年轻代收集发生的频率也是最小的。同时减少到达年老代的对象。\n吞吐量优先的应用：尽可能的设置大，可能到达Gbit的成都，因为对响应时间没有要求，垃圾收集可以并行进行，一般适合8核CPU以上应用。")]),a._v(" "),t("h4",{attrs:{id:"年老代大小选择"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#年老代大小选择"}},[a._v("#")]),a._v(" 年老代大小选择")]),a._v(" "),t("p",[a._v("响应时间优先的应用：年老代使用并发收集器，所以其大小需要小心设置，一般要考虑并发会话率和会话持续时间等一些参数。如果堆设置小了，可能会造成内存碎片、高回收频率以及应用暂停而使用传统的标记清除方式；如果堆大了，则需要较长的收集时间。最优化的方案，一般需要参考一下数据获得：")]),a._v(" "),t("p",[a._v("1、并发垃圾收集信息")]),a._v(" "),t("p",[a._v("2、持久代并发收集次数")]),a._v(" "),t("p",[a._v("3、传统GC信息")]),a._v(" "),t("p",[a._v("4、花在年轻代和年老代回收上的时间比例减少年轻代和年老代花费的时间，一般会提高应用的效率")]),a._v(" "),t("h4",{attrs:{id:"吞吐量优先的应用"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#吞吐量优先的应用"}},[a._v("#")]),a._v(" 吞吐量优先的应用")]),a._v(" "),t("p",[a._v("一般吞吐量优先的应用都有一个很大的年轻代和一个较小的年老代。原因是，这样可以尽可能回收掉大部分短期对象，减少中期对象，而年老代尽存放长期存活的对象")]),a._v(" "),t("h4",{attrs:{id:"较小堆引起的碎片问题"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#较小堆引起的碎片问题"}},[a._v("#")]),a._v(" 较小堆引起的碎片问题")]),a._v(" "),t("p",[a._v("因为年老代的并发收集器使用标记、清除算法，所以不会对堆进行压缩。当收集器回收时，他会把相邻的空间进行合并，这样可以分配给较大的对象。但是当堆空间较小时，运行一段时间以后，就会出现“碎片”，如果并发收集器找不到足够的空间，那么并发收集器将会停止，然后使用传统的标记、清除方式进行回收。如果出现“碎片”，可能需要进行如下配置：")]),a._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[a._v("-XX:+UseCMSCompactAtFullCollection:使用并发收集器时，开启对年老代的压缩\n-XX:CMSFullGCsBeforeCompaction=0:上面配置开启的情况下，这里设置多少次FullGc后，对年老代进行压缩\n")])]),a._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[a._v("1")]),t("br"),t("span",{staticClass:"line-number"},[a._v("2")]),t("br")])])])}),[],!1,null,null,null);s.default=r.exports}}]);
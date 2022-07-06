(window.webpackJsonp=window.webpackJsonp||[]).push([[177],{558:function(s,a,t){"use strict";t.r(a);var n=t(13),e=Object(n.a)({},(function(){var s=this,a=s.$createElement,t=s._self._c||a;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("p",[s._v("JDK 本身提供了很多方便的 JVM 性能调优监控工具，除了 jps、jstat、jinfo、jmap、jhat、jstack 等小巧的工具，还有集成式的 jvisualvm 和 jconsole。")]),s._v(" "),t("h3",{attrs:{id:"_1-jps"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-jps"}},[s._v("#")]),s._v(" （1）jps")]),s._v(" "),t("p",[t("strong",[s._v("jps（JVM Process Status Tool，虚拟机进程监控工具）")]),s._v("，这个命令可以列出正在运行的虚拟机进程，并显示虚拟机执行主类名称，以及这些进程的本地虚拟机唯一 ID。这个 ID 被称为本地虚拟机唯一 ID（local virtual Machine Identifier，简写为LVMID）。如果你在 linux 的一台服务器上使用 jps 得到的 LVMID 其实就是和 ps 命令得到的 PID 是一样的。")]),s._v(" "),t("p",[t("strong",[s._v("语法格式如下：")])]),s._v(" "),t("div",{staticClass:"language-shell line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-shell"}},[t("code",[s._v("jps "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("options"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("hostid"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br")])]),t("p",[s._v("如果不指定hostid就默认为当前主机或服务器。")]),s._v(" "),t("p",[t("strong",[s._v("options参数选项说明如下：")])]),s._v(" "),t("div",{staticClass:"language-shell line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-shell"}},[t("code",[s._v("-q 不输出类名、Jar名和传入main方法的参数\n-m 输出传入main方法的参数\n-l 输出main类或Jar的全限名\n-v 输出传入JVM的参数\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br")])]),t("p",[t("strong",[s._v("使用（查看所有java进程）")])]),s._v(" "),t("div",{staticClass:"language-shell line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-shell"}},[t("code",[s._v("jps -lv\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br")])]),t("p",[s._v("示例：")]),s._v(" "),t("div",{staticClass:"language-shell line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-shell"}},[t("code",[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("root@chengchi ~"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# jps")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("24804")]),s._v(" Jps\n"),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("1862")]),s._v(" mango.jar\n\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("root@chengchi ~"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# jps -lv")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("24787")]),s._v(" sun.tools.jps.Jps -Dapplication.home"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.171-8.b10.el7_5.x86_64 -Xms8m\n"),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("1862")]),s._v(" /home/www/api.chengchijinfu.com/mango_server/target/mango.jar -Dserver.port"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("8080")]),s._v(" -Dspring.profiles.active"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("prod\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br")])]),t("h3",{attrs:{id:"_2-jstat"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_2-jstat"}},[s._v("#")]),s._v(" （2）jstat")]),s._v(" "),t("p",[t("strong",[s._v("jstat（JVM Statistics Monitoring Tool，虚拟机统计信息监视工具）")]),s._v("，这个命令用于监视虚拟机各种运行状态信息。它可以显示本地或者远程虚拟机进程中的"),t("strong",[s._v("类装载、内存、垃圾收集、JIT编译等运行数据")]),s._v("，虽然没有GUI图形界面，只是提供了纯文本控制台环境的服务器上，但它是运行期间定位虚拟机性能问题的首选工具。")]),s._v(" "),t("p",[s._v("语法格式如下：")]),s._v(" "),t("div",{staticClass:"language-shell line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-shell"}},[t("code",[s._v("jstat "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("option vmid "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("interval "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("s "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v(" ms"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("count "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br")])]),t("p",[s._v("例如：需要每 1000 毫秒查询一次进程 16418 垃圾收集状况，一共查询 10 次，那命令如下：")]),s._v(" "),t("p",[t("img",{attrs:{src:"assets/tools_stat.png",alt:""}})]),s._v(" "),t("p",[s._v("参考："),t("a",{attrs:{href:"https://blog.csdn.net/zhaozheng7758/article/details/8623549",target:"_blank",rel:"noopener noreferrer"}},[s._v("jstat命令详解 - CSDN博客"),t("OutboundLink")],1)]),s._v(" "),t("h3",{attrs:{id:"_3-jinfo"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_3-jinfo"}},[s._v("#")]),s._v(" （3）jinfo")]),s._v(" "),t("p",[t("strong",[s._v("jinfo （Configuration Info for Java，配置信息工具）")]),s._v(" 这个命令可以实时地查看和调整虚拟机各项参数。")]),s._v(" "),t("p",[s._v("查看2788的MaxPerm大小可以用")]),s._v(" "),t("div",{staticClass:"language-shell line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-shell"}},[t("code",[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("root@Bill-8 bin"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# jinfo -flag MaxPermSize 2788")]),s._v("\n-XX:MaxPermSize"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("134217728")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br")])]),t("h3",{attrs:{id:"_4-jmap"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_4-jmap"}},[s._v("#")]),s._v(" （4）jmap")]),s._v(" "),t("p",[t("strong",[s._v("jmap（Memory Map for Java，内存映像工具）")]),s._v("，用于生成堆转存的快照，一般是 heapdump 或者 dump 文件。如果不适用 jmap 命令，可以使用 -XX:+HeapDumpOnOutOfMemoryError 参数，当虚拟机发生内存溢出的时候可以产生快照。或者使用kill -3 pid也可以产生。jmap 的作用并不仅仅是为了获取 dump 文件，它可以查询 finalize 执行队列，java 堆和永久代的详细信息，如空间使用率，当前用的哪种收集器。")]),s._v(" "),t("p",[t("strong",[s._v("jmap的命令格式：")])]),s._v(" "),t("div",{staticClass:"language-shell line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-shell"}},[t("code",[s._v("jmap "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("option"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" vmid\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br")])]),t("div",{staticClass:"language-shell line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-shell"}},[t("code",[s._v("jmap -J-d64 -heap "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("16418")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br")])]),t("h3",{attrs:{id:"_5-jhat"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_5-jhat"}},[s._v("#")]),s._v(" （5）jhat")]),s._v(" "),t("p",[t("strong",[s._v("jhat（虚拟机堆转储快照分析工具）")]),s._v("，这个工具是用来分析 jmap dump 出来的文件。\n由于这个工具功能比较简陋，运行起来也比较耗时，所以这个工具不推荐使用，推荐使用MAT。")]),s._v(" "),t("p",[s._v("例如分析dump 出来的 test.bin，命令如下：")]),s._v(" "),t("div",{staticClass:"language-shell line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-shell"}},[t("code",[s._v("jhat test.bin \n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br")])]),t("p",[s._v("它会在本地启动一个web服务，端口是7000，这样直接访问 127.0.0.1:7000就能看到分析结果了。")]),s._v(" "),t("h3",{attrs:{id:"_6-jstack"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_6-jstack"}},[s._v("#")]),s._v(" （6）jstack")]),s._v(" "),t("blockquote",[t("p",[s._v("阿里实习面试")])]),s._v(" "),t("p",[t("strong",[s._v("jstack（Java Stack Trace，Java堆栈跟踪工具）")]),s._v("，这个命令用于查看虚拟机当前时刻的线程快照（一般是threaddump 或者 javacore文件）。线程快照就是当前虚拟机内每一条线程正在执行的方法堆栈的集合。**生成线程快照的主要目的是：**定位线程出现长时间停顿的原因，入线程间死锁、死循环、请求外部资源导致的长时间等待都是导致线程长时间停顿的常见原因。线程出现停顿的时候通过jstack来查看各个线程的调用堆栈，就可以知道没有响应的线程到底在后台做些什么事情。")]),s._v(" "),t("p",[s._v("命令格式：")]),s._v(" "),t("div",{staticClass:"language-shell line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-shell"}},[t("code",[s._v("jstack "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("option"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" vmid\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br")])]),t("p",[s._v("使用：查看进程2849 的堆栈信息")]),s._v(" "),t("div",{staticClass:"language-shell line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-shell"}},[t("code",[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("root@Bill-8 yrd_soft"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# jstack 2849")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br")])]),t("h3",{attrs:{id:"_7-jconsole"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_7-jconsole"}},[s._v("#")]),s._v(" （7）jconsole")]),s._v(" "),t("blockquote",[t("p",[s._v("阿里面经")])]),s._v(" "),t("p",[s._v("JConsole 中，您将能够监视 JVM 内存的使用情况、线程堆栈跟踪、已装入的类和 VM 信息以及 CE MBean。")]),s._v(" "),t("p",[s._v("jconsole：一个 java GUI 监视工具，可以以图表化的形式显示各种数据。并可通过远程连接监视远程的服务器VM。用 Java 写的 GUI 程序，用来监控 VM，并可监控远程的 VM，非常易用，而且功能非常强。命令行里打 jconsole，选则进程就可以了。")]),s._v(" "),t("h3",{attrs:{id:"_8-jvisualvm"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_8-jvisualvm"}},[s._v("#")]),s._v(" （8）jvisualvm")]),s._v(" "),t("p",[s._v("jvisualvm 同 jconsole 都是一个基于图形化界面的、可以查看本地及远程的 JAVA GUI 监控工具，Jvisualvm 同 jconsole 的使用方式一样，直接在命令行打入 jvisualvm 即可启动，jvisualvm 界面更美观一些，数据更实时：")])])}),[],!1,null,null,null);a.default=e.exports}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[173],{553:function(t,r,a){"use strict";a.r(r);var v=a(13),e=Object(v.a)({},(function(){var t=this,r=t.$createElement,a=t._self._c||r;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("p",[t._v("原文地址：")]),t._v(" "),a("p",[t._v("https://juejin.im/post/5d5e30ae5188253da24d41e9")]),t._v(" "),a("p",[t._v("https://juejin.im/post/5bc4b71cf265da0ab3317729")]),t._v(" "),a("h3",{attrs:{id:"分类"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#分类"}},[t._v("#")]),t._v(" 分类")]),t._v(" "),a("p",[t._v("从所在区域角度上来说，可以分为内部内存和外部内存，其中内部的内存又包括了线程独占区和线程共享区。")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://txxs.github.io/pic/tofuturejavajvm/3-1.png",alt:"1"}})]),t._v(" "),a("p",[t._v("在JVM内部，从线程共享角度上来说，又可以分为线程独占区和线程共享区。\n线程独享区可以中包含以下三种数据区域：帮助记忆：（首先是虚拟机，有个栈，本地方法也必须得有，程序计数器，然后堆和方法区）")]),t._v(" "),a("ol",[a("li",[t._v("程序计数器（Program Counter Register）")]),t._v(" "),a("li",[t._v("虚拟机栈（VM Stack）")]),t._v(" "),a("li",[t._v("本地方法栈（Native Method Stack）")])]),t._v(" "),a("p",[t._v("线程共享区中包含以下两种数据区域：")]),t._v(" "),a("ol",[a("li",[t._v("方法区（Method Area）")]),t._v(" "),a("li",[t._v("堆（Heap）")])]),t._v(" "),a("p",[t._v("在JVM外部也就是本地内存中，包含了直接内存和元数据（Metadata），在JDK 1.8中，元数据就是我们之前的永久代（持久代）\n他们之间的区别是，JDK 7在持久代中的常量池在JDK 8移到了堆内存中，剩余部分移到了元数据中。")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://txxs.github.io/pic/tofuturejavajvm/3-2.png",alt:"1"}})]),t._v(" "),a("h3",{attrs:{id:"多线程的实现原理"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#多线程的实现原理"}},[t._v("#")]),t._v(" 多线程的实现原理")]),t._v(" "),a("p",[t._v("上面我们把运行时的数据区域分为了线程独占区和线程共享区，那么Java中的多线程是怎么实现的呢？这可以帮助我们对于线程独占区和共享区有更深的理解。\n在多个线程运行的时候，其实是把CPU的使用时间分割成了无数个小份，然后根据优先级去给这些线程分配时间，CPU在这些小时间块中快速切换，给用户的感受就是多线程同时在运行，如下图：")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://txxs.github.io/pic/tofuturejavajvm/3-3.png",alt:"1"}})]),t._v(" "),a("p",[t._v("通过这个图，我们可以清晰的看出是如何达到多线程的效果（其实在通信的时候也有同样的原理——时分多路复用）\n其实通俗一点来说，线程的独占区主要是为了控制方法的正常运行，而线程的共享区更类似于一个存储信息的仓库。\n打个简单的比方，现在有一个方法，我们使用两个线程同时去调用这个方法，属于该方法的信息就可以称之为独占区，而类中的变量，对象却可以被两个方法同时使用。\n两种异常\n在和JVM打交道的过程中，我们经常会遇到两种错误：StackOverflowError和OutOfMemoryError，\nStackOverflowError异常出现在线程独占区的本地方法栈和虚拟机栈中，而OutOfMemoryError会出现在除程序计数器外的所有区域。")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://txxs.github.io/pic/tofuturejavajvm/3-4.png",alt:"1"}})]),t._v(" "),a("h3",{attrs:{id:"另外一篇文章"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#另外一篇文章"}},[t._v("#")]),t._v(" 另外一篇文章")]),t._v(" "),a("p",[t._v("根据 JVM 规范，JVM 内存共分为虚拟机栈、堆、方法区、程序计数器、本地方法栈五个部分。")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://txxs.github.io/pic/tofuturejavajvm/3-5.png",alt:"1"}})]),t._v(" "),a("blockquote",[a("p",[t._v("内存空间(Runtime Data Area)中可以按照是否线程共享分为两块，线程共享的是方法区(Method Area)和堆(Heap)，线程独享的是虚拟机栈(VM Stack)，本地方法栈(Native Method Stack)和PC寄存器(Program Counter Register)。")])]),t._v(" "),a("h4",{attrs:{id:"虚拟机栈-线程私有"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#虚拟机栈-线程私有"}},[t._v("#")]),t._v(" 虚拟机栈（线程私有）")]),t._v(" "),a("p",[t._v("每个线程有一个私有的栈，随着线程的创建而创建。栈里面存放着一种叫做“栈帧”的东西，每个方法在执行的时候会创建一个栈帧，存储了局部变量表(基本数据类型和对象引用)，操作数栈，动态连接，方法出口等信息。\n每个方法从调用到执行完毕，对应一个栈帧在虚拟机栈中的入栈和出栈。\n通常所说的栈，一般是指虚拟机栈中的局部变量表部分。局部变量表所需的内存在编译期间完成分配。\n栈的大小可以固定也可以动态扩展，当扩展到无法申请足够的内存，则OutOfMemoryError。")]),t._v(" "),a("h3",{attrs:{id:"本地方法栈-线程私有"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#本地方法栈-线程私有"}},[t._v("#")]),t._v(" 本地方法栈（线程私有）")]),t._v(" "),a("p",[t._v("和虚拟机栈类似，主要为虚拟机使用到的Native方法服务。\n也会抛出StackOverflowError和OutOfMemoryError。")]),t._v(" "),a("h4",{attrs:{id:"pc寄存器-线程私有"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#pc寄存器-线程私有"}},[t._v("#")]),t._v(" PC寄存器（线程私有）")]),t._v(" "),a("p",[t._v("PC寄存器，也叫程序计数器。JVM支持多个线程同时运行，每个线程都有自己的程序计数器。倘若当前执行的是JVM方法，则该寄存器中保存当前执行指令的地址；倘若执行的是native方法，则PC寄存器为空。\n这个内存区域是唯一一个在虚拟机中没有规定任何OutOfMemoryError情况的区域。")]),t._v(" "),a("h4",{attrs:{id:"堆-线程共享"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#堆-线程共享"}},[t._v("#")]),t._v(" 堆（线程共享）")]),t._v(" "),a("p",[t._v("堆内存是JVM所有线程共享的部分，在虚拟机启动的时候就已经创建。\n和程序开发密切相关，应用系统对象都保存在Java堆中。所有的对象和数组都在堆上进行分配。这部分空间可通过GC进行回收。\n对分代GC来说，堆也是分代的，是GC的主要工作区间。\n当申请不到空间时，会抛出OutOfMemoryError")]),t._v(" "),a("h4",{attrs:{id:"方法区-线程共享"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#方法区-线程共享"}},[t._v("#")]),t._v(" 方法区（线程共享）")]),t._v(" "),a("p",[t._v("方法区也是所有线程共享的。主要用于存储类的信息、常量池、方法数据、方法代码等。方法区逻辑上属于堆的一部分，但是为了与堆进行区分，通常又叫“非堆”。\n这个区域的内存回收目标主要针对常量池的回收和对类型的卸载。\n当方法区无法满足内存分配需求时，则抛出OutOfMemoryError异常。\n在HotSpot虚拟机中，用永久代来实现方法区，将GC分代收集扩展至方法区，但是这样容易遇到内存溢出的问题。\nJDK1.7中，已经把放在永久代的字符串常量池移到堆中。\nJDK1.8撤销永久代，引入元空间。")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://txxs.github.io/pic/tofuturejavajvm/3-6.png",alt:"1"}})])])}),[],!1,null,null,null);r.default=e.exports}}]);
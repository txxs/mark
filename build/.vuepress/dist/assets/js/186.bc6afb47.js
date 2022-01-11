(window.webpackJsonp=window.webpackJsonp||[]).push([[186],{563:function(t,a,v){"use strict";v.r(a);var _=v(13),s=Object(_.a)({},(function(){var t=this,a=t.$createElement,v=t._self._c||a;return v("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[v("p",[t._v("愿无地址：\nhttps://zackku.com/jvm-gc-base/")]),t._v(" "),v("p",[t._v("垃圾回收（GC）是JVM的一大杀器，它使程序员可以更高效地专注于程序的开发设计，而不用过多地考虑对象的创建销毁等操作。但是这并不是说程序员不需要了解GC。GC只是Java编程中一项自动化工具，任何一个工具都有它适用的范围，当超出它的范围的时候，可能它将不是那么自动，而是需要人工去了解与适应地适用。")]),t._v(" "),v("p",[t._v("拥有一定工作年限的程序员，在工作期间肯定会经常碰到像内存溢出、内存泄露、高并发的场景。这时候在应对这些问题或场景时，如果对GC不了解，很可能会成为个人的发展瓶颈。")]),t._v(" "),v("p",[t._v("接下来的两文将详细学习下JVM中垃圾回收（GC）的各个知识要点。本文先从GC的算法开始先了解，铺垫好基础，下一篇再详细讲JVM具体的GC实现。")]),t._v(" "),v("h3",{attrs:{id:"gc对象搜索算法"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#gc对象搜索算法"}},[t._v("#")]),t._v(" GC对象搜索算法")]),t._v(" "),v("p",[t._v("垃圾回收，第一件事就是要搞清楚哪些东西是垃圾，而后才能对这些垃圾进行回收。")]),t._v(" "),v("p",[t._v("那么有什么办法识别对象是否为无用的垃圾呢？狭义地，怎么判断对象是否没被引用呢？")]),t._v(" "),v("p",[t._v("通常有以下两种算法去识别判断")]),t._v(" "),v("h4",{attrs:{id:"引用计数算法"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#引用计数算法"}},[t._v("#")]),t._v(" 引用计数算法")]),t._v(" "),v("p",[t._v("这个算法非常简单。给对象一个计数器，每当这个对象被引用了，计数器值加一；引用失效，则减一。但这个对象计数值为0的时候，证明是无用对象，可以被GC程序回收掉。这种算法比较广泛应用在一些脚本语言上，如FLASH、PYTHON等。\n但是引用计数算法无法解决对象间相互引用的问题。当a对象引用了b对象，b对象也引用了a对象，这样a、b两个对象的计数器值都不会为0，即使这两个对象都被其他对象所引用，最终导致这些对象一直无法被回收。这种情况往往会出现在比较复杂的编程语言中。")]),t._v(" "),v("p",[v("img",{attrs:{src:"https://txxs.github.io/pic/tofuturejavajvm/2-1.png",alt:"1"}})]),t._v(" "),v("h4",{attrs:{id:"可达性分析算法"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#可达性分析算法"}},[t._v("#")]),t._v(" 可达性分析算法")]),t._v(" "),v("p",[t._v("可达性分析算法（GC roots算法），广泛应用于主流的商用语言。设置一个根节点，从图论角度来看，只要从该节点可达一个对象，证明这个对象是存活的（被引用）。")]),t._v(" "),v("p",[v("img",{attrs:{src:"https://txxs.github.io/pic/tofuturejavajvm/2-2.png",alt:"1"}})]),t._v(" "),v("p",[t._v("通常地，GC会包含以下区域的对象：")]),t._v(" "),v("ul",[v("li",[t._v("虚拟机栈（栈帧中的本地变量表）中引用的对象；")]),t._v(" "),v("li",[t._v("本地方法栈中JNI（即一般说的Native方法）引用的对象；")]),t._v(" "),v("li",[t._v("方法区中类静态和常量属性引用的对象；")])]),t._v(" "),v("p",[t._v("垃圾回收算法")]),t._v(" "),v("p",[t._v("了解完垃圾是怎么找出来后，接下来看看它们是怎么被清除的。以下介绍几种清除的算法。")]),t._v(" "),v("h3",{attrs:{id:"标记-清除算法-mark-sweep"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#标记-清除算法-mark-sweep"}},[t._v("#")]),t._v(" 标记-清除算法（Mark-Sweep）")]),t._v(" "),v("p",[t._v("标记-清除，顾名思义，先标记垃圾，再清除。它是GC最基础的算法，后续很多算法都是基于它上面去改进的。\n标记的过程在上面搜索GC对象已经介绍过了。被标记的对象，在统一GC的时候会把标记的对象清除掉。这个算法比较简单，不做过多赘述。")]),t._v(" "),v("p",[v("img",{attrs:{src:"https://txxs.github.io/pic/tofuturejavajvm/2-3.png",alt:"1"}})]),t._v(" "),v("p",[t._v("这个算法有一个很明显的缺点，就是在垃圾回收后会产生大量不连续的碎片空间，导致程序要申请较大的对象时常无法找到合适的内存空间，迫使再次GC。")]),t._v(" "),v("h3",{attrs:{id:"复制算法"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#复制算法"}},[t._v("#")]),t._v(" 复制算法")]),t._v(" "),v("p",[t._v("复制算法的存在，正是为了解决内存碎片问题。并且这个算法也是分代算法的基础。")]),t._v(" "),v("p",[v("img",{attrs:{src:"https://txxs.github.io/pic/tofuturejavajvm/2-4.png",alt:"1"}})]),t._v(" "),v("p",[t._v("将内存分为大小相等的两块，每次程序只使用其中一块，当GC发生的时候，把存活的对象复制到另外一块内存中，整齐的排列，然后清空原来的那块内存。")]),t._v(" "),v("p",[t._v("可以看到，这种算法有点新生代转移到老年代的感觉。")]),t._v(" "),v("p",[t._v("缺点：")]),t._v(" "),v("p",[t._v("把内存可使用的空间减少了一半，造成空间的浪费。\n对象存活数量较多的时候，复制性能比较差\n这种缺点，在老年代中，对象存活率比较高的场景下是非常场景间。")]),t._v(" "),v("h3",{attrs:{id:"标记-整理算法-mark-compact"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#标记-整理算法-mark-compact"}},[t._v("#")]),t._v(" 标记-整理算法（Mark-Compact）")]),t._v(" "),v("p",[t._v("针对复制算法的两个缺点，在老年代一般会用这种标记-整理算法。")]),t._v(" "),v("p",[v("img",{attrs:{src:"https://txxs.github.io/pic/tofuturejavajvm/2-5.png",alt:"1"}})]),t._v(" "),v("p",[t._v("把存活的对象移到内存的一段，然后把剩余的空间全部清空掉。")]),t._v(" "),v("h3",{attrs:{id:"分代收集算法"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#分代收集算法"}},[t._v("#")]),t._v(" 分代收集算法")]),t._v(" "),v("p",[t._v("分代算法并不是一个特定的算法，也没有什么新的内容。而是把内存分成多个区域，一般为新生代、老年代等。然后根据不同区域不同的特点，用不同回收算法去回收垃圾。")]),t._v(" "),v("p",[t._v("例如新生代，对象存活率低，比较适用复制算法。老年代存活率高，比较适用Mark-Compact算法。")]),t._v(" "),v("p",[t._v("目前几乎所有的商业虚拟机都是采用分代收集的。具体不同的收集器在下一文再详细说明。")])])}),[],!1,null,null,null);a.default=s.exports}}]);
### CMS和G1的区别

原文地址：
``
https://blog.csdn.net/xzp_12345/article/details/81839026
http://www.woowen.com/java/2016/12/10/G1%20CMS%E5%8C%BA%E5%88%AB/
https://www.jianshu.com/p/bdd6f03923d1
https://huzb.me/2019/02/21/CMS-G1%E5%92%8CZGC/
``

1.新生代

 Serial (第一代)
 PraNew (第二代)
 Parallel Scavenge (第三代)
 G1收集器(第四代)

2.老年代

 Serial Old (第一代)
 Parallel Old (第二代)
 CMS (第三代)
 G1收集器 (第四代)

就目前而言、CMS还是默认首选的GC策略、可能在以下场景下G1更适合：

 服务端多核CPU、JVM内存占用较大的应用（至少大于4G）
 应用在运行过程中会产生大量内存碎片、需要经常压缩空间
 想要更可控、可预期的GC停顿周期，防止高并发下应用雪崩现象



区别一： 使用范围不一样

CMS收集器是老年代的收集器，可以配合新生代的Serial和ParNew收集器一起使用

G1收集器收集范围是老年代和新生代。不需要结合其他收集器使用

区别二： STW的时间

CMS收集器以最小的停顿时间为目标的收集器。

G1收集器可预测垃圾回收的停顿时间（建立可预测的停顿时间模型）


区别三： 回收算法（垃圾碎片）

CMS收集器是使用“标记-清除”算法进行的垃圾回收，容易产生内存碎片

G1收集器使用的是“标记-整理”算法，进行了空间整合，降低了内存空间碎片。


区别四： 垃圾回收的过程不一样（https://www.cnblogs.com/aspirant/p/8663897.html）

|序号|CMS收集器|G1收集器（mix GC的过程）|
|-|-|-|
|1|初始标记（Stop the World）|初始标记（Stop the World）|
|2|并发标记|并发标记|
|3|重新标记 （Stop the World）|最终标记（Stop the World）|
|4|并发清除|筛选回收(stop the world事件 根据用户期望的GC停顿时间回收)|
                          

CMS：

1、初始标记(STW)：标记Gc root根对象，及新生代应用的老年代对象，并作标记。时间快；

2、并发标记：标记线程和用户线程并发执行，标记出根对象的可达路径。从初始标记开始找出所有存活对象(耗时长)。

3、重新标记(STW)：从root开始重新扫描直接，间接关联对象,以及上述时间内程序产生的新垃圾对象(远比并发标记时间短)。

4、并发清除：清理垃圾对象。

优点：

并发收集、低停顿。

缺点：

1、内存碎片：由于基于标记清除，因此有内存碎片。

2、cpu敏感：由于并发执行，占用一定的内存cpu，吞吐量会下降

3、浮动垃圾：由于并发处理，用户线程正在使用垃圾无法收集，因此比较早(68%)就要启动收回,回收失败会导致降级为串行收集，有比较大的STW。

G1:

1、初始标记(STW)：标记Gc root根对象并发标记。时间快；

2、根区域扫描（root region scan）：根分区扫描，所有新复制到Survivor分区的对象，都需要被扫描并标记成根，这个过程称为根分区扫描(Root Region Scanning)。

2、并发标记：标记线程和用户线程并发执行，标记出根对象的可达路径。从初始标记开始找出所有存活对象(耗时长)。

3、重新标记(STW)：从root开始重新扫描直接，间接关联对象,以及上述时间内程序产生的新垃圾对象(远比并发标记时间短)。

4、筛选回收(清除)：筛选回收阶段首先对各个Region的回收价值和成本进行排序，根据用户所期望的GC停顿时间来制定回收计划。

优点：

1、可根据用户设置停顿时间，制定回收计划(但是也可能存在超出用户的停顿时间).

2、无内存碎片：与CMS的“标记--清理”算法不同，G1从整体来看是基于“标记整理”算法实现的收集器；从局部上来看是基于“复制”算法实现的。

区别五：GC策略（mix GC也会回收老年代）

G1:
Young GC，发生于新生代空间不足时，在分配一般对象（非巨型对象）时，当所有eden region使用达到最大阀值并且无法申请足够内存时，会触发一次YoungGC。每次younggc会回收所有Eden以及Survivor区，并且将存活对象复制到Old区以及另一部分的Survivor区。

YoungGC的回收过程如下：

```
 根扫描,跟CMS类似，Stop the world，扫描GC Roots对象。
 处理Dirty card,更新RSet.
 扫描RSet,扫描RSet中所有old区对扫描到的young区或者survivor去的引用。
 拷贝扫描出的存活的对象到survivor2/old区
 处理引用队列，软引用，弱引用，虚引用
```


Mixed GC，当堆中内存使用超过整个堆大小的 InitiatingHeapOccupancyPercent（默认 45）时启动。 回收全部新生代，并根据预期停顿时间回收部分收益较高的老年代。当越来越多的对象晋升到老年代old region时，为了避免堆内存被耗尽，虚拟机会触发一个混合的垃圾收集器，即mixed gc，该算法并不是一个old gc，除了回收整个young region，还会回收一部分的old region，这里需要注意：是一部分老年代，而不是全部老年代，可以选择哪些old region进行收集，从而可以对垃圾回收的耗时时间进行控制。

Full GC（JDK 9 引入），发生于老年代空间不足时，相当于执行一次 STW 的 full gc。

CMS中,GC的策略分为,Young GC,Old GC,Full GC

G1中,GC的策略分为,Young GC,Mixed GC,Full GC(G1就是为了避免full GC的发生)


区别六：堆(Heap)空间分配不同

CMS 将堆逻辑上分成Eden,Survivor(S0,S1),Old,并且他们是固定大小JVM启动的时候就已经设定不能改变,并且是连续的内存块

G1 将堆分成多个大小相同的Region(区域),默认2048个,在1Mb到32Mb之间大小,逻辑上分成Eden,Survivor,Old,巨型,空闲,他们不是固定大小,会根据每次GC的信息做出调整


区别六：压缩策略不同

CMS中不启用压缩会产生很多内存碎片,当产生很多内存碎片的时候,找不到空间来分配剩余的对象,或者设定参数,使它合并相邻的的空闲内存,当合并超过一定次数后触发Full GC,进行压缩

G1中每次回收过程中,将多个Region拷贝到空闲Region的时候都会进行压缩

区别七：Full GC

导致CMS Full GC的可能原因主要有两个：Promotion Failure和Concurrent Mode Failure，前者是在年轻代晋升的时候老年代没有足够的连续空间容纳，很有可能是内存碎片导致的；后者是在并发过程中jvm觉得在并发过程结束前堆就会满了，需要提前触发Full GC。CMS的Full GC是一个多线程STW的Mark-Compact过程，，需要尽量避免或者降低频率。

G1的初衷就是要避免Full GC的出现，Full GC会会对所有region做Evacuation-Compact，而且是单线程的STW，非常耗时间。导致G1 Full GC的原因可能有两个：1. Evacuation的时候没有足够的to-space来存放晋升的对象；2. 并发处理过程完成之前空间耗尽。这两个原因跟CMS类似。


区别八：Write Barrier

Write Barrier可以理解为在写的时候插入一条特定的操作。
在CMS中老年代引用年轻代的时候就是通过触发一个Write Barrier来更新Card Table的标志位。这是一个同步操作，在更新引用的时候顺带执行，只需要两个指令，引入的消耗不大。
G1比较复杂，在两个地方用到了Write Barrier，分别是更新RSet的rememberd set Write Barrier和记录引用变化的Concurrent Marking Write Barrier，前者发生在引用更新之后，称为Post Write Barrier，后者发生在引用变化之前，称为Pre Write Barrier。G1为了提高性能，这两个Write Barrier都是先放到队列中，再异步进行处理。具体可以参考Garbage-First Garbage Collection 论文笔记


区别九：

CMS yong gc

eden不足

CMS fullGC条件

https://blog.csdn.net/chenleixing/article/details/46706039

1、System.gc()方法的调用

2、老年代代空间不足

3、永生区空间不足

4、CMS GC时出现promotion failed和concurrent mode failure

> 对于采用CMS进行老年代GC的程序而言，尤其要注意GC日志中是否有promotion failed和concurrent mode failure两种状况，当这两种状况出现时可能会触发Full GC。

> promotion failed是在进行Minor GC时，survivor space放不下、对象只能放入老年代，而此时老年代也放不下造成的；

> concurrent mode failure是在执行CMS GC的过程中同时有对象要放入老年代，而此时老年代空间不足造成的（有时候“空间不足”是CMS GC时当前的浮动垃圾过多导致暂时性的空间不足触发Full GC）。

> 对措施为：增大survivor space、老年代空间或调低触发并发GC的比率，但在JDK 5.0+、6.0+的版本中有可能会由于JDK的bug29导致CMS在remark完毕

5、统计得到的Minor GC晋升到旧生代的平均大小大于老年代的剩余空间

g1: young 

eden区不足

mixed gc

mixed gc中也有一个阈值参数 -XX:InitiatingHeapOccupancyPercent，当老年代大小占整个堆大小百分比达到该阈值时，会触发一次mixed gc.

当并发标记完成后，会再触发一个young GC，然后再出发一个mixed GC。mixed GC与young GC主要有2点不同，mixed GC会回收包括Eden和old区的对象，二者触发的条件不一样。

GC分类：

Minor GC 会清理年轻代的内存。(正常情况大部分年轻代对象朝生夕灭，基本都不存在伊甸区拷贝更不说去老年代了)

Major GC 是清理老年代。

Full GC 是清理整个堆空间—包括年轻代和老年代

 

评价垃圾回收质量的两个指标：

停顿时间

吞吐量



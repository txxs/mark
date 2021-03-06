0. JVM组成

- Class loader(类加载器)：根据给定的全限定名类名(如：java.lang.Object)来装载class文件到运行时数据区中的方法区；
- Execution engine（执行引擎）：执行引擎也叫解释器，负责解释命令，交由操作系统执行；
- Native Interface(本地接口)：与native libraries交互，是其它编程语言交互的接口。
- Runtime data area(运行时数据区域)：这就是我们常说的JVM的内存，我们所有所写的程序都被加载到这里，之后才开始运行。
- 过程：首先通过编译器把 Java 代码转换成字节码，类加载器（ClassLoader）再把字节码加载到内存中，将其放在运行时数据区（Runtime data area）的方法区内；特定的命令解析器执行引擎（Execution Engine），将字节码翻译成底层系统指令，再交由 CPU 去执行，而这个过程中需要调用其他语言的本地库接口（Native Interface）来实现整个程序的功能。

1.0. 什么是类的加载
- 类的加载指的是将类的.class文件中的二进制数据读入到内存中，将其放在运行时数据区的方法区内，然后在堆区创建一个 java.lang.Class对象，用来封装类在方法区内的数据结构。
- 类加载器并不需要等到某个类被“首次主动使用”时再加载它，JVM规范允许类加载器在预料某个类将要被使用时就预先加载它.
- 加载.class文件的方式：从本地系统中直接加载;通过网络下载.class文件;从zip，jar等归档文件中加载.class文件;将Java源文件动态编译为.class文件

1.1. 类加载过程
- 加载：通过一个类的全限定名来获取其定义的二进制字节流。
- 验证：确保被加载的类的正确性，进行四个验证：文件格式验证；元数据验证；字节码验证；符号引用验证；
- 准备：为类的静态变量分配内存，并将其初始化为默认值。
- 解析：把类中的符号引用转换为直接引用。解析阶段是虚拟机将常量池内的符号引用替换为直接引用的过程，解析动作主要针对类或接口、字段、类方法、接口方法、方法类型、方法句柄和调用点限定符7类符号引用进行。
- 初始化：初始化，为类的静态变量赋予正确的初始值，JVM负责对类进行初始化，主要对类变量进行初始化。
- 使用：
- 结束生命周期：在如下几种情况下，Java虚拟机将结束生命周期：执行了 System.exit()方法；程序正常执行结束；程序在执行过程中遇到了异常或错误而异常终止；由于操作系统出现错误而导致Java虚拟机进程终止

1.2. 类加载有三种方式：
- 命令行启动应用时候由JVM初始化加载
- 通过Class.forName()方法动态加载，将类的.class文件加载到jvm中之外，还会对类进行解释，执行类中的static块。
- 通过ClassLoader.loadClass()方法动态加载，只干一件事情，就是将.class文件加载到jvm中，不会执行static中的内容,只有在newInstance才会去执行static块。

1.3. 双亲加载模型
- 当 AppClassLoader加载一个class时，它首先不会自己去尝试加载这个类，而是把类加载请求委派给父类加载器ExtClassLoader去完成。
- 当 ExtClassLoader加载一个class时，它首先也不会自己去尝试加载这个类，而是把类加载请求委派给BootStrapClassLoader```去完成。默认去加载 JAVA_HOME/lib/ext 目录下的 jar
- 如果 BootStrapClassLoader加载失败（例如在 $JAVA_HOME/jre/lib里未查找到该class），会使用 ExtClassLoader来尝试加载；默认会去加载 JAVA_HOME/lib 目录下的 jar
- 若ExtClassLoader也加载失败，则会使用 AppClassLoader来加载，如果 AppClassLoader也加载失败，User ClassLoader（用户自定义类加载器）：。还找不到则会报出异常 ClassNotFoundException。
- 双亲加载原因：避免类的重复加载
- 双亲加载原因：保护程序安全，防止核心 API 被随意篡改，避免用户自己编写的类动态替换 Java 的一些核心类。

1.4. 自定义类加载器
- 自定义类加载器一般都是继承自ClassLoader类，从上面对loadClass方法来分析来看，我们只需要重写 findClass 方法即可。


1.5. static的加载顺序
- 非继承： static代码块–>普通代码块–>类构造方法。
- 继承：父类static代码块–>子类static代码块–>父类普通代码块–>父类构造方法–>子类普通代码块–>子类构造方法。

1.6. 对象的创建过程（更详细）
- 类加载检查：虚拟机遇到一条new指令时，首先将去检查这个指令的参数是否能在常量池中定位到这个类的符号引用，并且检查这个符号引用代表的类是否已被加载过、解析和初始化过。如果没有，那必须先执行相应的类加载过程。
- 分配内存： 在类加载检查通过后，接下来虚拟机将为新生对象分配内存。
- 初始化零值： 内存分配完成后，虚拟机需要将分配到的内存空间都初始化为零值。
- 设置对象头： 初始化零值完成之后，虚拟机要对对象进行必要的设置，例如这个对象是那个类的实例、如何才能找到类的元数据信息、对象的哈希吗、对象的 GC 分代年龄等信息。
- 执行 init 方法： 在上面工作都完成之后，从虚拟机的视角来看，一个新的对象已经产生了，但从 Java 程序的视角来看，对象创建才刚开始， 方法还没有执行，所有的字段都还为零。

2.0. JMM

- 线程独有的内存区域：程序计数器， 记录每个线程当前执行的指令信。eg：当前执行到哪一条指令，下一条该取哪条指令。分支、循环、跳转、异常处理、线程恢复等基础功能都需要依赖这个计数器来完成。
- 线程独有的内存区域：虚拟机栈，记录每个栈帧（Frame）中的局部变量、方法返回地址等。Java虚拟机都会同步创建一个栈帧（Stack Frame）用于存储局部变量表、操作数栈、动态连接、方法出口等信息。
- 线程独有的内存区域：本地（原生）方法栈，顾名思义就是调用操作系统原生本地方法时，所需要的内存区域。

- 线程共享的内存区域：Heap：即鼎鼎大名的堆内存区，也是 GC 垃圾回收的主站场，用于存放类的实例对象及 Arrays 实例等。 （注：Heap 被所有线程共享，严格来说并不严谨。事实上，由于 TLAB 的存在，为了防止并发对象分配时，多个对象分配到同一块内存。heap 中的 TLAB 区域，在分配时，是被线程独占写入的。）
- 线程共享的内存区域：方法区，主要存放类结构、类成员定义、static 静态成员等。
- 线程共享的内存区域：运行时常量池，比如字符串、int -128~127 范围的值等，它是 Method Area 中的一部分。

- JDK1.6时期和我们上面讲的JVM内存区域是一致的： JDK 1.6内存区域；JDK1.7时发生了一些变化，将字符串常量池、静态变量，存放在堆上 JDK 1.7内存区域；在JDK1.8时彻底干掉了方法区，而在直接内存中划出一块区域作为「元空间」，运行时常量池、类常量池都移动到元空间。（客观上使用永久代来实现方法区的决定的设计导致了Java应用更容易遇到内存溢出的问题（永久代有-XX：MaxPermSize的上限，即使不设置也有默认大小，而J9和JRockit只要没有触碰到进程可用内存的上限，例如32位系统中的4GB限制，就不会出问题），而且有极少数方法 （例如String::intern()）会因永久代的原因而导致不同虚拟机下有不同的表现。
  ）

- 除程序计数器不会抛出 StackOverflowError 或 OutOfMemoryError，其它 5 个区域，当请求分配的内存不足时，均会抛出 OutOfMemoryError（即：OOM），其中 thread 独立的 JVM Stack 区及 Native Method Stack 区还会抛出 StackOverflowError。

2.1. 如何判断对象是垃圾？

- 引用计数法：在 Java 中，引用和对象是有关联的。如果要操作对象则必须用引用进行。因此，很显然一个简单的办法是通过引用计数来判断一个对象是否可以回收。简单说，即一个对象如果没有任何与之关联的引用，即他们的引用计数都不为 0，则说明对象不太可能再被用到，那么这个对象就是可回收对象。
- 如果 A 引用 B，B 又引用 A（发生了循环引用问题），这 2 个对象是否能被 GC回收？关键不是在于 A、B 之间是否有引用，而是 A、B 是否可以一直向上追溯到 GC Roots。如果与 GC Roots 没有关联，则会被回收；否则，将继续存活。
- 可达性分析：为了解决引用计数法的循环引用问题，Java 使用了可达性分析的方法。通过一系列的“GC roots”对象作为起点搜索。如果在“GC roots”和一个对象之间没有可达路径，则称该对象是不可达的。要注意的是，不可达对象不等价于可回收对象，不可达对象变为可回收对象至少要经过两次标记过程。两次标记后仍然是可回收对象，则将面临回收。GC ROOT 的对象包括：

    - 虚拟机栈（栈帧中本地变量表）中引用的对象；
    - 方法区中类静态属性引用的对象；
    - 方法区中常量引用的对象；
    - 本地方法栈中JNI（Native方法）引用的对象。

2.2. 一次完整的GC流程是怎样的
- Java堆 = 老年代 + 新生代
- 新生代 = Eden + S0 + S1
- 当 Eden 区的空间满了， Java虚拟机会触发一次 Minor GC，以收集新生代的垃圾，存活下来的对象，则会转移到 Survivor区。
- 大对象（需要大量连续内存空间的Java对象，如那种很长的字符串）直接进入老年态；
- 如果对象在Eden出生，并经过第一次Minor GC后仍然存活，并且被Survivor容纳的话，年龄设为1，每熬过一次Minor GC，年龄+1，若年龄超过一定限制（15），则被晋升到老年态。即长期存活的对象进入老年态。
- 老年代满了而无法容纳更多的对象，Minor GC 之后通常就会进行Full GC，Full GC 清理整个内存堆 – 包括年轻代和年老代。
- Major GC 发生在老年代的GC，清理老年区，经常会伴随至少一次Minor GC，比Minor GC慢10倍以上。

2.3. 常用的 GC 算法及其优缺点
- 标记清除法：黑色区域表示待清理的垃圾对象，标记出来后直接清空；优：简单快速；缺：产生很多内存碎片。
- 标记复制法：思路也很简单，将内存对半分，总是保留一块空着，将左侧存活的对象复制到右侧，然后左侧全部清空。优：避免了内存碎片问题；缺：内存浪费很严重，相当于只能使用 50% 的内存。
- 标记-整理：将垃圾对象清理掉后，同时将剩下的存活对象进行整理挪动（类似于 windows 的磁盘碎片整理），保证它们占用的空间连续。优：节约了内存，并避免了内存碎片问题。缺：整理过程会降低 GC 的效率。
- 分代收集算法：咱们以 Hotspot 为例（JDK 7）进行讲解，如下图所示，可以将内存分成了三大块：年青代（Young Genaration）、老年代（Old Generation）、永久代（Permanent Generation）。其中 Young Genaration 更是又细为分 eden、S0、S1 三个区。

2.4. 8种垃圾回收器
- Serial 收集器：单线程用标记-复制算法，快刀斩乱麻，单线程的好处避免上下文切换，早期的机器，大多是单核，也比较实用。但执行期间会发生 STW（Stop The World）
- ParNew 收集器：是 Serial 的多线程版本，也同样会 STW，在多核机器上会更适用。
- Parallel Scavenge 收集器：ParNew 的升级版本，主要区别在于提供了两个参数：-XX:MaxGCPauseMillis 最大垃圾回收停顿时间；-XX:GCTimeRatio 垃圾回收时间与总时间占比。通过这 2 个参数，可以适当控制回收的节奏，更关注于吞吐率，即总时间与垃圾回收时间的比例。
- Serial Old 收集器：所以老年代的收集，通常会采用“标记-整理”法。从名字就可以看出来，这是单线程（串行）的， 依然会有 STW。
- Parallel Old 收集器：一句话：Serial Old 的多线程版本
- CMS 收集器：是一种以获得最短回收停顿时间为目标的收集器，标记清除算法，运作过程：初始标记，并发标记，重新标记，并发清除，收集结束会产生大量空间碎片。
    - 初始标记：标记 GC ROOT 能关联到的对象，需要 STW；
    - 并发标记：从 GCRoots 的直接关联对象开始遍历整个对象图的过程，不需要 STW；
    - 重新标记：为了修正并发标记期间，因用户程序继续运作而导致标记产生改变的标记，需要 STW；
    - 并发清除：清理删除掉标记阶段判断的已经死亡的对象，不需要 STW。
    - 重置：CMS内部重置回收器状态，准备进入下一个并发回收周期。

- G1收集器： 标记整理算法实现，运作流程主要包括以下：初始标记，并发标记，最终标记，筛选标记。不会产生空间碎片，可以精确地控制停顿。
  -G1 不再坚持固定大小和固定数量的分代区域划分，而是把连续的 Java 堆划分为多个大小相等的独立区域（Region），每个 Region 都可以根据需要，扮演新生代的 Eden 空间、Survivor 空间，或者老年代空间。
    - Region 中还有一类特殊的 Humongous 区域，专门来存储大对象（大小超过一个 Region 容量的一半）。而对于超过整个 Region 的超大对象，将会被存在 N 个连续的 Humongous Region 中（G1 的大多数行为都把 Humongous Region 作为老年代的一部分看待）。
    - G1 收集器之所以能建立可预测的停顿时间模型，是因为它将 Region 作为单次回收的最小单元（每次收集到的内存空间都是 Region 大小的整数倍），这样可以有计划地避免整个 Java 堆进行全区域垃圾收集。更具体的处理思路：让 G1 收集器去跟踪各个 Region 中的垃圾堆积的“价值”大小，然后在后台维护一个优先级列表，每次根据用户设定的收集停顿时间，优先处理回收价值收益最大的那些 Region（这就是“Garbage First”名字的由来）。
    - G1 收集器之前的其他所有收集器（包括 CMS 收集器），垃圾收集的目标范围要么是整个新生代（Minor GC），或者整个老年代（Major GC），抑或整个 Java 堆（Full GC）。而 G1 跳出了这个樊笼：它可以面向堆内存中任何部分来组成回收集（Collection Set，一般称 CSet）进行回收。衡量标准不再是它属于哪个分代，而是哪块内存中存放的垃圾数量最多、回收收益最大。这就是 G1 收集器的 Mixed GC 模式。

- 初始标记：标记 GC ROOT 能关联到的对象，需要 STW；
- 并发标记：从 GCRoots 的直接关联对象开始遍历整个对象图的过程，扫描完成后还会重新处理并发标记过程中产生变动的对象；
- 最终标记：短暂暂停用户线程，再处理一次，需要 STW；
- 筛选回收：更新 Region 的统计数据，对每个 Region 的回收价值和成本排序，根据用户设置的停顿时间制定回收计划。再把需要回收的 Region 中存活对象复制到空的 Region，同时清理旧的 Region。需要 STW。


2.5. CMS的缺点
- 会产生空间碎片。CMS 垃圾回收器采用的基础算法是 Mark-Sweep，没有内存整理的过程，所以经过 CMS 收集的堆会产生空间碎片。
- 对CPU资源非常敏感。为了让应用程序不停顿，CMS 线程需要和应用程序线程并发执行，这样就需要有更多的 CPU，同时会使得总吞吐量降低。
- CMS无法处理浮动垃圾，所以一般需要更大的堆空间。因为CMS在标记阶段应用程序的线程还是在执行的，那么就会有堆空间继续分配的情况，为了保证在CMS回收完堆之前还有空间分配给正在运行的应用程序，必须预留一部分空间。

2.6. CMSGC造成内存碎片的解决方法
- 增大Xmx或者减少Xmn
- 在应用访问量最低的时候，在程序中主动调用System.gc()，比如每天凌晨。
- 在应用启动并完成所有初始化工作后，主动调用System.gc()，它可以将初始化的数据压缩到一个单独的chunk中，以腾出更多的连续内存空间给新生代晋升使用。
- 降低-XX:CMSInitiatingOccupancyFraction参数以提早执行CMSGC动作，虽然CMSGC不会进行内存碎片的压缩整理，但它会合并老生代中相邻的free空间。这样就可以容纳更多的新生代晋升行为。


2.6. CMS收集器和G1收集器的区别：
- CMS收集器是老年代的收集器，可以配合新生代的Serial和ParNew收集器一起使用；
- G1收集器收集范围是老年代和新生代，不需要结合其他收集器使用；
- CMS收集器以最小的停顿时间为目标的收集器；
- G1收集器可预测垃圾回收的停顿时间
- CMS收集器是使用“标记-清除”算法进行的垃圾回收，容易产生内存碎片
- G1收集器使用的是“标记-整理”算法，进行了空间整合，降低了内存空间碎片。


2.7. 年轻代GC（Minor GC）触发机制
- 当年轻代空间不足时，就会触发Minor GC，这里的年轻代满指的是Eden代满，Survivor满不会引发GC。(每次Minor GC会清理年轻代的内存，Survivor是被动GC，不会主动GC)
- 因为Java对象大多都具备“朝生夕灭”的特性，所以Minor GC非常频繁，一般回收速度也比较快。
- Minor GC会引发STW（Stop The World），暂停其他用户的线程，等垃圾回收结束，用户线程才恢复运行。

2.8. 老年代GC(Major GC/Full GC)触发机制
- 指发生在老年代的GC，对象从老年代消失时，Major GC或者Full GC发生了；
- 出现了Major GC，经常会伴随至少一次的Minor GC（不是绝对的，在Parallel Scavenge收集器的收集策略里就有直接进行Major GC的策略选择过程），也就是老年代空间不足时，会先尝试触发Minor GC。如果之后空间还不足，则触发Major GC；
- Major GC速度一般会比Minor GC慢10倍以上，STW时间更长；
- 如果Major GC后，内存还不足，就报OOM了。

2.9. Full GC触发机制
- 调用System.gc()时，系统建议执行Full GC，但是不必然执行；
- 老年代空间不足；
- 方法区空间不足；
- 通过Minor GC后进入老年代的平均大小小于老年代的可用内存；
- 由Eden区，Survivor S0（from）区向S1（to）区复制时，对象大小大于To Space可用内存，则把该对象转存到老年代，且老年代的可用内存小于该对象大小。

2.10. JVM参数
- -Xmx3550m： 最大堆大小为3550m。
- -Xms3550m： 设置初始堆大小为3550m。
- -Xmn2g： 设置年轻代大小为2g。
- -Xss128k： 每个线程的堆栈大小为128k。
- -XX:MaxPermSize： 设置持久代大小为16m。jdk8 开始，用 MetaSpace 区取代了 Perm 区（永久代），所以相应的 jvm 参数变成-XX:MetaspaceSize 及 -XX:MaxMetaspaceSize
- -XX:NewRatio=4: 设置年轻代（包括Eden和两个Survivor区）与年老代的比值（除去持久代）。
- -XX:SurvivorRatio=4： 设置年轻代中Eden区与Survivor区的大小比值。设置为4，则两个Survivor区与一个Eden区的比值为2:4，一个Survivor区占整个年轻代的1/6
- -XX:MaxTenuringThreshold=0： 设置垃圾最大年龄。如果设置为0的话，则年轻代对象不经过Survivor区，直接进入年老代。
- -XX:+UseParallelGC： 选择垃圾收集器为并行收集器。
- -XX:ParallelGCThreads=20： 配置并行收集器的线程数
- -XX:+UseConcMarkSweepGC： 设置年老代为并发收集。
- -XX:CMSFullGCsBeforeCompaction：由于并发收集器不对内存空间进行压缩、整理，所以运行一段时间以后会产生“碎片”，使得运行效率降低。此值设置运行多少次GC以后对内存空间进行压缩、整理。
- -XX:+UseCMSCompactAtFullCollection： 打开对年老代的压缩。可能会影响性能，但是可以消除碎片

3.0 死锁分析，jstack命令
- 现象：应用占用cpu高，gc无明显异常
- 分析：我们使用jps查找进程，再用jstack dump线程日志信息；我们全文搜索【deadlock】关键字，可以看到对象的信息和线程的信息，继续分析可以看到具体的代码是哪行有问题。
  引用自：https://blog.csdn.net/cool_summer_moon/article/details/105619353，这篇文章也不错：https://www.jb51.net/article/195797.htm

3.1. 内存泄露分析，jmap命令（用于产生快照数据）
- 怎么发现？频繁gc但是堆内存降不下来，进程内存爆了就有可能是发生内存泄漏了。
- jmap -heap pid 输出当前进程 JVM 堆新生代、老年代、持久代等请情况，GC 使用的算法等信息
- jmap -histo:live {pid} | head -n 10 输出当前进程内存中所有对象包含的大小
- dump heap。JDK自带的jmap工具，可以做这件事情。它的执行方法是：jmap -dump:format=b,file=heap.bin 。format=b的含义是，dump出来的文件时二进制格式。file-heap.bin的含义是，dump出来的文件名是heap.bin。就是JVM的进程号。
- 推荐Memory Analyzer 。Memory Analyzer，简称MAT，快速计算每个对象占用的内存大小、对象之间的引用关系。很容易看出，char[]的数量出其意料的多，占用90%以上的内存 。
  使用Path To GC Root功能，找到该char[]的引用路径，发现String对象是被一个HashMap中引用的 。
  放到HashMap中明明是split之后的String小对象，怎么会占用那么大空间呢？难道是String类的split方法有问题？

3.2. CPU占满分析
- top命令查看cpu占满的进程pid
- top -Hp pid 找到cpu占满的线程tip
- printf ‘%x’ tid 获取16进制的线程num
- jstack tid | grep -A 30 num (或者dump到文本进行分析)
- 引用自：https://www.jb51.net/article/194336.htm

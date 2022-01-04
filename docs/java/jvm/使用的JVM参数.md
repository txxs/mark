### CMS

-Xmx2048m 

-Xms2048m 

-verbose:gc 

-Xloggc:${logPath}/gc-${MOAPort}.log   日志地址

-XX:CMSInitiatingOccupancyFraction=80  表示老年代内存空间使用80%时开始执行CMS收集，防止过多的Full GC

-XX:+UseCMSCompactAtFullCollection 开启内存空间压缩和整理，防止过多内存碎片

-XX:+UseCMSInitiatingOccupancyOnly 

-XX:MaxTenuringThreshold=15 存活次数在串行和ParNew方式中可通过-XX:MaxTenuringThreshold来设置，ParallelScavenge则根据运行状态来决定。

-XX:-UseAdaptiveSizePolicy 

-XX:PermSize=256M 

-XX:MaxPermSize=512M 

-XX:SurvivorRatio=3  

-XX:+PrintGCDateStamps 

-XX:+UseConcMarkSweepGC

-XX:+PrintGCDetails 

-XX:+AlwaysPreTouch GC的时候,新生代的对象要晋升到老年代的时候,需要内存,这个时候操作系统才真正分配内存,这样就会加大young gc的停顿时间，这样JVM就会先访问所有分配给它的内存,让操作系统把内存真正的分配给JVM.后续JVM就可以顺畅的访问内存了。

-XX:PretenureSizeThreshold 设置大对象直接进入年老代的阈值。-XX:PretenureSizeThreshold只对串行回收器和ParNew有效，对ParallGC无效。默认该值为0，即不指定最大的晋升大小，一切由运行情况决定。


### G1

-Xmx4096m 

-Xms4096m 

-verbose:gc 

-Xloggc:$logPath/gc-22211.log  

-XX:+AlwaysPreTouch 

-XX:+UnlockExperimentalVMOptions

-XX:+UseG1GC 

-XX:+PrintGCDetails 

-XX:+HeapDumpOnOutOfMemoryError 

-XX:HeapDumpPath=$logPath 

-XX:+PrintGCDateStamps  

-XX:ParallelGCThreads=4 

-XX:ConcGCThreads=1 

-XX:G1ReservePercent=10 

-XX:-OmitStackTraceInFastThrow 

-XX:+UseCGroupMemoryLimitForHeap"













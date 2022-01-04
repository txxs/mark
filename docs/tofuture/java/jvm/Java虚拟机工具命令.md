JDK 本身提供了很多方便的 JVM 性能调优监控工具，除了 jps、jstat、jinfo、jmap、jhat、jstack 等小巧的工具，还有集成式的 jvisualvm 和 jconsole。



### （1）jps

**jps（JVM Process Status Tool，虚拟机进程监控工具）**，这个命令可以列出正在运行的虚拟机进程，并显示虚拟机执行主类名称，以及这些进程的本地虚拟机唯一 ID。这个 ID 被称为本地虚拟机唯一 ID（local virtual Machine Identifier，简写为LVMID）。如果你在 linux 的一台服务器上使用 jps 得到的 LVMID 其实就是和 ps 命令得到的 PID 是一样的。

**语法格式如下：**

```shell
jps [options] [hostid]
```

如果不指定hostid就默认为当前主机或服务器。

**options参数选项说明如下：**

```shell
-q 不输出类名、Jar名和传入main方法的参数
-m 输出传入main方法的参数
-l 输出main类或Jar的全限名
-v 输出传入JVM的参数
```

**使用（查看所有java进程）**

```shell
jps -lv
```



示例：

```shell
[root@chengchi ~]# jps
24804 Jps
1862 mango.jar

[root@chengchi ~]# jps -lv
24787 sun.tools.jps.Jps -Dapplication.home=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.171-8.b10.el7_5.x86_64 -Xms8m
1862 /home/www/api.chengchijinfu.com/mango_server/target/mango.jar -Dserver.port=8080 -Dspring.profiles.active=prod
```



### （2）jstat

**jstat（JVM Statistics Monitoring Tool，虚拟机统计信息监视工具）**，这个命令用于监视虚拟机各种运行状态信息。它可以显示本地或者远程虚拟机进程中的**类装载、内存、垃圾收集、JIT编译等运行数据**，虽然没有GUI图形界面，只是提供了纯文本控制台环境的服务器上，但它是运行期间定位虚拟机性能问题的首选工具。

 语法格式如下：

```shell
jstat [option vmid [interval [s | ms] [count ] ] ]
```



例如：需要每 1000 毫秒查询一次进程 16418 垃圾收集状况，一共查询 10 次，那命令如下：

![](assets/tools_stat.png)

参考：[jstat命令详解 - CSDN博客](https://blog.csdn.net/zhaozheng7758/article/details/8623549)




### （3）jinfo

**jinfo （Configuration Info for Java，配置信息工具）** 这个命令可以实时地查看和调整虚拟机各项参数。 

查看2788的MaxPerm大小可以用 

```shell
[root@Bill-8 bin]# jinfo -flag MaxPermSize 2788
-XX:MaxPermSize=134217728
```



### （4）jmap

**jmap（Memory Map for Java，内存映像工具）**，用于生成堆转存的快照，一般是 heapdump 或者 dump 文件。如果不适用 jmap 命令，可以使用 -XX:+HeapDumpOnOutOfMemoryError 参数，当虚拟机发生内存溢出的时候可以产生快照。或者使用kill -3 pid也可以产生。jmap 的作用并不仅仅是为了获取 dump 文件，它可以查询 finalize 执行队列，java 堆和永久代的详细信息，如空间使用率，当前用的哪种收集器。

**jmap的命令格式：**

```shell
jmap [option] vmid
```



```shell
jmap -J-d64 -heap 16418
```



### （5）jhat

**jhat（虚拟机堆转储快照分析工具）**，这个工具是用来分析 jmap dump 出来的文件。
 由于这个工具功能比较简陋，运行起来也比较耗时，所以这个工具不推荐使用，推荐使用MAT。

例如分析dump 出来的 test.bin，命令如下：

```shell
jhat test.bin 
```

它会在本地启动一个web服务，端口是7000，这样直接访问 127.0.0.1:7000就能看到分析结果了。



### （6）jstack

> 阿里实习面试

**jstack（Java Stack Trace，Java堆栈跟踪工具）**，这个命令用于查看虚拟机当前时刻的线程快照（一般是threaddump 或者 javacore文件）。线程快照就是当前虚拟机内每一条线程正在执行的方法堆栈的集合。**生成线程快照的主要目的是：**定位线程出现长时间停顿的原因，入线程间死锁、死循环、请求外部资源导致的长时间等待都是导致线程长时间停顿的常见原因。线程出现停顿的时候通过jstack来查看各个线程的调用堆栈，就可以知道没有响应的线程到底在后台做些什么事情。

命令格式：

```shell
jstack [option] vmid
```

使用：查看进程2849 的堆栈信息

```shell
[root@Bill-8 yrd_soft]# jstack 2849
```

 



### （7）jconsole

> 阿里面经

JConsole 中，您将能够监视 JVM 内存的使用情况、线程堆栈跟踪、已装入的类和 VM 信息以及 CE MBean。

jconsole：一个 java GUI 监视工具，可以以图表化的形式显示各种数据。并可通过远程连接监视远程的服务器VM。用 Java 写的 GUI 程序，用来监控 VM，并可监控远程的 VM，非常易用，而且功能非常强。命令行里打 jconsole，选则进程就可以了。

 

### （8）jvisualvm

jvisualvm 同 jconsole 都是一个基于图形化界面的、可以查看本地及远程的 JAVA GUI 监控工具，Jvisualvm 同 jconsole 的使用方式一样，直接在命令行打入 jvisualvm 即可启动，jvisualvm 界面更美观一些，数据更实时：

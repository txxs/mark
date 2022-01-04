### 基本原理
MySQL复制过程分成三步：

- 1)、master将改变记录到二进制日志（binary log）。这些记录过程叫做二进制日志事件，binary log events；
- 2)、slave将master的binary log events拷贝到它的中继日志（relay log）；
- 3)、slave重做中继日志中的事件，将改变应用到自己的数据库中。 MySQL复制是异步的且串行化的。

简单来说: slave会从master读取binlog来进行数据同步


Mysql的复制（replication）是一个异步的复制。

### 实现整个复制操作主要由三个进程完成的，其中两个进程在Slave（Sql进程和IO进程），另外一个进程在 Master（IO进程）上。

要实施复制，首先必须打开Master端的binary log（bin-log）功能，否则无法实现。

因为整个复制过程实际上就是Slave从Master端获取该日志然后再在自己身上完全顺序的执行日志中所记录的各种操作。

### 复制的详细过程：

（1）Slave上面的IO进程连接上Master，并请求从指定日志文件的指定位置（或者从最开始的日志）之后的日志内容；

（2）Master接收到来自Slave的IO进程的请求后，通过负责复制的IO进程根据请求信息读取制定日志指定位置之后的日志信息，返回给Slave 的IO进程。返回信息中除了日志所包含的信息之外，还包括本次返回的信息已经到Master端的bin-log文件的名称以及bin-log的位置；

（3）Slave的IO进程接收到信息后，将接收到的日志内容依次添加到Slave端的relay-log文件的最末端，并将读取到的Master端的 bin-log的文件名和位置记录到master-info文件中，以便在下一次读取的时候能够清楚的高速Master“我需要从某个bin-log的哪个位置开始往后的日志内容，请发给我”；

（4）Slave的Sql进程检测到relay-log中新增加了内容后，会马上解析relay-log的内容成为在Master端真实执行时候的那些可执行的内容，并在自身执行。

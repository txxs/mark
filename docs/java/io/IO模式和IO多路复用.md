原文地址

https://juejin.im/post/5bf7b89e518825369c564059

### IO模式

- 阻塞IO (blocking IO)
- 非阻塞IO (nonblocking IO)
- IO多路复用 (IO multiplexing)
- 信号驱动IO (signal driven IO) 忽略
- 异步IO (asynchronous IO)

### IO请求流程

阶段1. 准备数据,这时数据可能还没有到达,如还没有收到一个完成的udp包,kernel需要等待.也就是 数据被拷贝到操作系统内核的缓冲区是需要一个过程的

阶段2. 拷贝数据到用户内存,对于synchronous IO 这一步需要用户进程去请求read操作,阻塞.对于asynchronous IO,这一步由kernel主动完成,非阻塞.

笔者的认知是:阻塞/非阻塞是指阶段1,synchronous/asynchronous是指阶段2

### 阻塞IO

或者说synchronous阻塞 IO,这里 1 2 阶段都是阻塞的

用户进程请求后等待阶段1阻塞,阶段1完成后等待阶段2仍然阻塞,整个过程只需要一次系统调用

### 非阻塞IO

或者说 synchronous非阻塞IO,这里2是阻塞的

用户进程轮询请求数据,没有数据时kernel返回错误状态,用户进程收到后会重试.

某次请求后如果数据到达,kernel返回数据到达状态,阶段1结束,用户进程调用read,将数据从kernel拷贝到用户内存

需要两次有效的系统调用

### IO多路复用

和阻塞IO一样是synchronous阻塞IO,这里的 1 2是阻塞的(今天看过java nio的实现,发现取决于使用的api,阶段1不一定阻塞,比如Selector.selectNow()是非阻塞的,Selector.select()和Selector.select(long timeout)是阻塞的) ,唯一的区别是一个用户进程负责多个socket,也是IO多路复用的优势
基本原理就是

select poll epoll请求数据,在阶段1被阻塞,当某个socket有数据到达了就通知用户进程
用户进程调用read操作,将数据从kernel拷贝到用户内存,在阶段2被阻塞

阻塞io只需要一次系统调用,IO多路复用需要两次,如果连接数不是很高时 select/epoll不一定比multi-threading+blocking IO更快

### 异步IO

asynchronous非阻塞 IO,完全的非阻塞

用户进程发起read操作后立即返回去做其他事,kernel收到asynchronous read后也立刻返回
在数据准备完成后,kernel将数据拷贝到用户内存,并发送给用户signa

理论上是这样,目前的实现不尽如人意,因此应用不多,参见
Linux AIO（异步IO）那点事儿

IO Model 比较

### IO多路复用的实现

select poll
select和poll都需要在返回后遍历文件描述符来获取已经就绪的socket,描述符越多效率越低,两者异同为

select有最大数量限制,poll没有,但是数量过大都会影响性能(遍历文件描述符)

select使用3个位图表示三种文件描述符,poll使用一个pollfd完成

### epoll
epoll是select和poll的增强版,epoll通过epoll_ctl()来注册一个文件描述符,一旦基于某个文件描述符就绪时,内核会采用类似callback的回调机制,迅速激活这个文件描述符,当进程调用epoll_wait()时便得到通知(不再需要遍历文件描述符,通过监听回调的机制,也是epoll的魅力)
epoll相比于select和poll的高效在于以下事实

同时连接的大量客户端在同一时刻可能只有很少处于就绪状态

如果同时处于就绪状态的客户端连接很多,那epoll相比select和poll也没什么优势了


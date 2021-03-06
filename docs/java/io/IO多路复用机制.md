原文地址：

### 用户空间与内核空间

对于一次IO访问（以read举例），数据会先被拷贝到操作系统内核的缓冲区中(通过DMA，不需要CPU)，然后才会从操作系统内核的缓冲区拷贝到应用程序的地址空间(需要CPU)。所以说，当一个read操作发生时，它会经历两个阶段：

1. 等待数据准备 (Waiting for the data to be ready)；对于一个socket接口上的操作，这一步骤关系到数据从网络到达，并将其复制到内核的缓冲区

2. 将数据从内核拷贝到进程中 (Copying the data from the kernel to the process)

### Blocking IO

传统的阻塞 I/O 模型工作方式：当线程使用 read 或者 write 对某一个文件描述符（File Descriptor 以下简称 FD)进行读写时，如果当前 FD 不可读或不可写，当前线程会被CPU挂起阻塞，一直等待数据准备完毕。

例如：tomcat服务器BIO模式，利用多线程 + 线程池 处理；即每一个socket连接创建一个独立的线程处理

```
{
 ExecutorService executor = Excutors.newFixedThreadPollExecutor(100);//线程池
 ServerSocket serverSocket = new ServerSocket();
 serverSocket.bind(8080);
 while(true){ //死循环等待新连接到来
 	Socket socket = serverSocket.accept();
 	executor.submit(new ConnectIOHandler(socket));//为新的连接创建新的线程
  }
}
class ConnectIOHandler extends Thread{
    private Socket socket;
    public ConnectIOnHandler(Socket socket){
       this.socket = socket;
    }
    public void run(){
      while(!socket.isClosed()){ // 死循环处理读写事件
          String someThing = socket.read()....//读取数据
          if(someThing!=null){
             ......//处理数据
             socket.write()....//写数据
          }
      }
    }
}
```
缺点

线程本身占用较大内存，像Java的线程栈，一般至少分配512K～1M的空间，如果系统中的线程数过千，恐怕整个JVM的内存都会被吃掉一半
线程的切换成本是很高的。操作系统发生线程切换的时候，需要保留线程的上下文，然后执行系统调用。如果线程数过高，可能执行线程切换的时间甚至会大于线程执行的时间

### IO多路复用(IO mutiplexing)

IO多路复用就通过一种机制，单个线程通过监视多个I/O流的状态来同时管理多个I/O流，一旦某个描述符就绪（一般是读就绪或者写就绪），能够通知程序进行相应的读写操作

当应用进程通过select读取文件(socket)，应用进程会被block，于此同时内核会“监视”所有通过select请求的文件读取(socket)，任何一个文件(socket)的数据被准备好，select就会返回，应用进程再调用read操作，把数据从内核中拷贝到应用进程。

### 优缺点

IO复用技术的优势在于，只需要使用一个线程就可以管理多个socket，系统不需要建立新的进程或者线程，也不必维护这些线程和进程，很大程度上减少了资源占用；适合于连接数多的场景(nginx，rpc，redis等)。

如果处理的连接数不是很高的话，使用select/epoll的web server不一定比使用multi-threading + blocking IO的web server性能更好，可能延迟还更大。select/epoll的优势并不是对于单个连接能处理得更快，而是在于能处理更多的连接

### select，poll，epoll

select，poll，epoll都是IO多路复用的实现机制。select，poll，epoll本质上都是同步I/O，因为它们都需要在读写事件就绪后自己负责进行读写，也就是说这个读写过程是阻塞的

注意: IO多路复用经常被称为异步非阻塞，这里的异步只是相对于以前同步阻塞而起的名称，并非实际情况下的unix异步模型，如果从Unix IO模型角度只能将IO多路复用称为非阻塞IO

对于IO多路复用，有两件事是必须要做的(对于监控可读事件而言)：

1. 准备好需要监控的fds集合

2. 探测并返回fds集合中哪些fd可读

### select

基本原理

单个进程就可以同时处理多个网络连接的IO请求（同时阻塞多个IO操作）。基本原理就是程序调用select()，然后整个程序就阻塞了，这时候，select会将需要监控的readfds集合拷贝到内核空间（假设监控的仅仅是socket可读），kernel就会轮询检查所有select负责的fd，当找到一个client中的数据准备就绪了，select就会返回，这个时候程序就会系统调用，将数据从kernel复制到进程缓冲区。

优缺点

select目前几乎在所有的平台上支持，其良好跨平台支持也是它的一个优点

每次调用select，都需要把fd集合从用户态拷贝到内核态，这个开销在fd很多时会很大

同时每次调用select都需要在内核遍历传递进来的所有fd，这个开销在fd很多时也很大

select支持的文件描述符数量太小了，默认是1024

### poll

基本原理

poll的原理与select非常相似，差别如下：

	1) 描述fd集合的方式不同，poll使用 pollfd 结构而不是select结构fd_set结构，所以poll是链式的，没有最大连接数的限制

	2) poll有一个特点是水平触发，也就是通知程序fd就绪后，这次没有被处理，那么下次poll的时候会再次通知该fd已经就绪。

优缺点

poll机制虽然改进了select的监控大小1024的限制，但以下两个性能问题还没有解决 :

fds集合整体仍然需要从用户空间拷贝到内核空间的问题，而不管这样的复制是不是有意义

当被监控的fds中某些有数据可读的时候，我们希望通知更加精细一点，就是我们希望能够从通知中得到有可读事件的fds列表，而不是需要遍历整个fds来收集。

### epoll

它是由Linux内核2.6推出的可伸缩的IO多路复用实现，目的是为了替代select()与poll()

事实上，同时连接的大量客户端在一时刻可能只有很少的处于就绪状态，因此随着监视的描述符数量的增长，select()与poll()的效率也会线性下降。

基本原理

select和poll都只提供了一个函数－select或者poll函数。而epoll提供了三个函数，分别如下：

int epoll_create(int size)：// 创建一个epoll的句柄，size用来告诉内核这个监听的数目一共有多大

int epoll_ctl(int epfd, int op, int fd, struct epoll_event *event)：// 注册描述符fd要监听的事件类型；epfd:是epoll_create()的返回值; fd:需要监听的文件描述符; epoll_event:告诉内核需要监听什么事

int epoll_wait(int epfd, struct epoll_event * events, int maxevents, int timeout)： // 等待epfd上的io事件，返回在events中发生的事件, 最多返回maxevents个事件

epoll执行过程:

	1) 首先执行epoll_create创建一个epoll句柄；并开辟epoll自己的内核高速cache区，在该缓冲区建立红黑树和就绪链表

	2) epoll_ctl执行add动作时除了将要监听的文件句柄放到红黑树上之外，还向内核注册了该文件句柄的回调函数(内核中断处理程序注册一个回调函数)，内核在检测到某句柄可读可写时（内核针对读缓冲区和写缓冲区来判断是否可读可写）则调用该回调函数，回调函数将文件句柄放到就绪链表(当一个socket上有数据到了，内核在把网卡上的数据copy到内核中后就来把socket插入到准备就绪链表里了)。

	3) epoll_wait只监控就绪链表就可以(利用schedule_timeout()实现睡一会，判断一会的效果)，如果就绪链表有文件句柄不为空，则表示该文件句柄可读可写，并返回到用户态（少量的拷贝）

	4) 由于内核不修改文件句柄的位置，因此只需要在第一次传入就可以重复监控，直到使用epoll_ctl删除，否则不需要重新传入，因此无多次拷贝
epoll_ctl通过(EPOLL_CTL_ADD、EPOLL_CTL_MOD、EPOLL_CTL_DEL)三个操作来分散对需要监控的fds集合的修改，做到了有变化才变更，将select/poll高频、大块内存拷贝(集中处理)变成epoll_ctl的低频、小块内存的拷贝(分散处理)，避免了大量的内存拷贝

优缺点

相比select/poll，epoll的优点如下：

没有最大并发连接的限制，能打开的FD的上限远大于1024 (在1GB内存的机器上大约是10万左右)

效率提升，不是轮询的方式，不会随着FD数目的增加效率下降。只有活跃可用的FD才会调用callback函数；即epoll最大的优点就在于它只管你“活跃”的连接，而跟连接总数无关，因此在实际的网络环境中，epoll的效率就会远远高于select和poll。

epoll内部使用了mmap共享了用户和内核的部分空间，避免了数据的来回拷贝

epoll 有个致命的缺点，只有linux支持

epoll的两种工作模式

支持边缘触发ET（edge trigger）与水平触发LT（level trigger）两种模式（poll()只支持水平触发）

LT模式：缺省的工作方式，并且同时支持block和no-block socket；当epoll_wait检测到描述符事件发生并将此事件通知应用程序，应用程序可以不立即处理该事件。下次调用epoll_wait时，会再次响应应用程序并通知此事件(清理就绪列表后，重新把句柄放回刚刚清空的就绪列表)

ET模式：高速工作方式，只支持no-block 
socket；当epoll_wait检测到描述符事件发生并将此事件通知应用程序，应用程序必须立即处理该事件。如果不处理，下次调用epoll_wait时，不会再次响应应用程序并通知此事件(only once)。所以在ET模式下，一般是通过while循环，一次性读完全部数据．epoll默认使用的是LT．

ET模式在很大程度上减少了epoll事件被重复触发的次数，因此效率要比LT模式高。epoll工作在ET模式的时候，必须使用非阻塞套接口，以避免由于一个文件句柄的阻塞读/阻塞写操作把处理多个文件描述符的任务饿死。


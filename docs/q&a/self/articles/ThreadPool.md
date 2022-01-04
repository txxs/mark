# 线程池

------------
### 几个关键问题
> 引用自：https://blog.csdn.net/ShiXueTanLang/article/details/78888262
源码执行流程：

![图片](https://txxs.github.io/pic/q&a/WX20210805-175031@2-8x.png)

> 这篇文章不错：https://zhuanlan.zhihu.com/p/346719067
1. 池化原理是什么
   
   用户线程提交任务，线程池根据任务的数量动态调整Worker的数量，即：任务和任务处理器分离，任务器的数量根据任务动态调整，同时为了保护任务器，也设置了一些拒绝策略；任务器是自执行的，可以不断的从队列中获取任务自动执行，直到全部处理完成。

   或者是：线程池为什么可以复用？线程池可以把线程和任务进行解耦，线程归线程，任务归任务，摆脱了之前通过Thread创建线程时的一个线程必须对应一个任务的限制。在线程池中，同一个线程可以从BlockingQueue中不断提取新任务来执行，其核心原理在于线程池对 Thread 进行了封装，并不是每次执行任务都会调用Thread.start()来创建新线程，而是让每个线程去执行一个“循环任务”，在这个“循环任务”中，不停地检查是否还有任务等待被执行，如果有则直接去执行这个任务，也就是调用任务的run方法，把run方法当作和普通方法一样的地位去调用，相当于把每个任务的 run() 方法串联了起来，所以线程数量并不增加。

> 引用自：https://www.jianshu.com/p/02f58d26edd9
2. 线程池流程

    - step1.调用ThreadPoolExecutor的execute提交线程，首先检查CorePool，如果CorePool内的线程小于CorePoolSize，新创建线程执行任务。
    - step2.如果当前CorePool内的线程大于等于CorePoolSize，那么将任务加入到BlockingQueue。等待核心线程的执行。
    - step3.如果不能加入BlockingQueue，在小于MaxPoolSize的情况下创建线程执行任务。非核心线程继续执行，同时会提交第一个任务执行，然后再从队列中获取数据执行。
    - step4.如果线程数大于等于MaxPoolSize，那么执行拒绝策略。


3. 为什么可以返回，FutrueTask的执行原理

   > 这篇文章中如何使用FutrueTask：https://blog.csdn.net/u012881584/article/details/85121144

   ![图片](https://txxs.github.io/pic/q&a/WX20210805-175031@2-9x.png)
   异步执行的核心是FutureTask，FutureTask中有一个全局变量state，通过这个值来界定任务是否已经执行完毕；同时定义了线程执行的结果：outcome；同时定义了用于保存由于调用Future.get方法而阻塞的线程的堆：WaitNode waiters；通过上面的demo可以看到主线程在新建完FutureTask后一直阻塞等待结果，任务线程负责执行任务，并将最后结果塞回到输出outcome字段，并通知等待线程，由于可以由多个线程阻塞等待，在内部实现中使用等待链表和LockSupport的park/unpark操作来进行不同线程之间的同步操作，大致流程如下所示。

    1. 在主线程/其他等待线程中可以调用awaitDone，该逻辑会自旋并调用park进行阻塞等待，如果任务还未完成则放入等待链中；
    2. 执行线程执行完任务后遍历等待链表，对每个节点进行unpark操作;
    3. 在awaitDone()逻辑中会收到unpark同步信号，唤醒对应的线程已执行完任务。

       ![图片](https://txxs.github.io/pic/q&a/WX20210805-175031@2-10x.png)

   > 引用自：https://blog.csdn.net/maoyeqiu/article/details/119533120
   > 这篇文章也不错：https://zhuanlan.zhihu.com/p/40047276
   > 这里有伪代码：https://blog.csdn.net/lovezhaohaimig/article/details/80636212

### 线程池

> 参考：https://segmentfault.com/a/1190000013344834，https://github.com/aCoder2013/blog/issues/28?hmsr=toutiao.io&utm_campaign=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io；https://mp.weixin.qq.com/s/hQrzpraJIzdp5WOTz1jaNg

> 此处有更详细的源码解析：https://mp.weixin.qq.com/s/z2V9YqI7zuLHW4D0HM7yzg

0. 线程池核心的代码解读

   ![图片](https://txxs.github.io/pic/q&a/WX20210805-175031@2-3x.png)

我们首先要了解的线程池里面的状态控制的参数 ctl，线程池的ctl是一个原子的 AtomicInteger。这个ctl包含两个参数 ：
- workerCount 激活的线程数
- runState 当前线程池的状态

它的低29位用于存放当前的线程数, 因此一个线程池在理论上最大的线程数是 536870911（5亿多）; 高 3 位是用于表示当前线程池的状态, 其中高三位的值和状态对应如下:
- 111: RUNNING
- 000: SHUTDOWN
- 001: STOP
- 010: TIDYING
- 110: TERMINATED
```
public class ThreadPoolExecutor extends AbstractExecutorService {

    private final AtomicInteger ctl = new AtomicInteger(ctlOf(RUNNING, 0));
    private static final int COUNT_BITS = Integer.SIZE - 3;
    private static final int CAPACITY   = (1 << COUNT_BITS) - 1;

    // runState is stored in the high-order bits
    private static final int RUNNING    = -1 << COUNT_BITS;
    private static final int SHUTDOWN   =  0 << COUNT_BITS;
    private static final int STOP       =  1 << COUNT_BITS;
    private static final int TIDYING    =  2 << COUNT_BITS;
    private static final int TERMINATED =  3 << COUNT_BITS;

    // Packing and unpacking ctl
    private static int runStateOf(int c)     { return c & ~CAPACITY; }
    private static int workerCountOf(int c)  { return c & CAPACITY; }
    private static int ctlOf(int rs, int wc) { return rs | wc; }

    private final ReentrantLock mainLock = new ReentrantLock();
	private final HashSet<Worker> workers = new HashSet<Worker>();
	private final Condition termination = mainLock.newCondition();
	private int largestPoolSize;
	private long completedTaskCount;
```
Worker
下面看一下Worker类，也就是这个类实际负责执行任务，Worker类继承自AbstractQueuedSynchronizer，AQS可以理解为一个同步框架，提供了一些通用的机制，利用模板方法模式，让你能够原子的管理同步状态、blocking和unblocking线程、以及队列，具体的内容之后有时间会再写，还是比较复杂的。这里Worker对AQS的使用相对比较简单，使用了状态变量state表示是否获得锁，0表示解锁、1表示已获得锁，同时通过exclusiveOwnerThread存储当前持有锁的线程。另外再简单提一下，比如说CountDownLatch, 也是基于AQS框架实现的，countdown方法递减state，await阻塞等待state为0。构造函数主要是做三件事：1.设置同步状态state为-1，同步状态大于0表示就已经获取了锁，2.设置将当前任务task设置为firstTask，3.利用Worker本身对象this和ThreadFactory创建线程对象。


```
private final class Worker extends AbstractQueuedSynchronizer implements Runnable{
      
        /** Thread this worker is running in.  Null if factory fails. */
        final Thread thread;

        /** Initial task to run.  Possibly null. */
        Runnable firstTask;

        /** Per-thread task counter */
        volatile long completedTasks;

        Worker(Runnable firstTask) {
            setState(-1); // inhibit interrupts until runWorker
            this.firstTask = firstTask;
            this.thread = getThreadFactory().newThread(this);
        }

        /** Delegates main run loop to outer runWorker  */
        public void run() {
            runWorker(this);
        }
       protected boolean isHeldExclusively() {
            return getState() != 0;
        }

        protected boolean tryAcquire(int unused) {
            if (compareAndSetState(0, 1)) {
                setExclusiveOwnerThread(Thread.currentThread());
                return true;
            }
            return false;
        }

        protected boolean tryRelease(int unused) {
            setExclusiveOwnerThread(null);
            setState(0);
            return true;
        }

        public void lock()        { acquire(1); }
        public boolean tryLock()  { return tryAcquire(1); }
        public void unlock()      { release(1); }
        public boolean isLocked() { return isHeldExclusively(); }

        void interruptIfStarted() {
            Thread t;
            if (getState() >= 0 && (t = thread) != null && !t.isInterrupted()) {
                try {
                    t.interrupt();
                } catch (SecurityException ignore) {
                }
            }
        }
    }
```
注意这里Worker初始化的时候，会通过setState(-1)将state设置为-1，并在runWorker()方法中置为0，Worker是利用state这个变量来表示锁的状态，那么加锁的操作就是通过CAS将state从0改成1，那么初始化的时候改成-1，也就是表示在Worker启动之前，都不允许加锁操作，我们再看interruptIfStarted()以及interruptIdleWorkers()方法，这两个方法在尝试中断Worker之前，都会先加锁或者判断state是否大于0，因此这里的将state设置为-1，就是为了禁止中断操作，并在runWorker中置为0，也就是说只能在Worker启动之后才能够中断Worker。

submit最终都是到execute方法，execute可以说是线程池最核心的一个方法。
```
    public void execute(Runnable command) {
        if (command == null)
            throw new NullPointerException();
        int c = ctl.get();
        /*
            获取当前worker的数目，如果小于corePoolSize那么就扩容，
            这里不会判断是否已经有core线程，而是只要小于corePoolSize就会直接增加worker
         */
        if (workerCountOf(c) < corePoolSize) {
            /*
                调用addWorker(Runnable firstTask, boolean core)方法扩容
                firstTask表示为该worker启动之后要执行的第一个任务，core表示要增加的为core线程
             */
            if (addWorker(command, true))
                return;
            //如果增加失败了那么重新获取ctl的快照,比如可能线程池在这期间关闭了
            c = ctl.get();
        }
        /*
             如果当前线程池正在运行中，并且将任务丢到队列中成功了，
             那么就会进行一次double check,看下在这期间线程池是否关闭了，
             如果关闭了，比如处于SHUTDOWN状态，如上文所讲的，SHUTDOWN状态的时候，
             不再接受新任务，remove成功后调用拒绝处理器。而如果仍然处于运行中的状态，
             那么这里就double check下当前的worker数，如果为0，有可能在上述逻辑的执行
             过程中，有worker销毁了，比如说任务抛出了未捕获异常等，那么就会进行一次扩容，
             但不同于扩容core线程，这里由于任务已经丢到队列中去了，因此就不需要再传递firstTask了，
             同时要注意，这里扩容的是非core线程
             workQueue 是任务队列，比如：LinkedListQueue
         */
        if (isRunning(c) && workQueue.offer(command)) {
            int recheck = ctl.get();
            if (! isRunning(recheck) && remove(command))
                reject(command);
            else if (workerCountOf(recheck) == 0)
                addWorker(null, false);
        }
        else if (!addWorker(command, false))
            /*
                如果在上一步中，将任务丢到队列中失败了，那么就进行一次扩容，
                这里会将任务传递到firstTask参数中，并且扩容的是非core线程，
                如果扩容失败了，那么就执行拒绝策略。
             */
            reject(command);
    }
```

然后看一下核心的addWorker方法：


```
    private boolean addWorker(Runnable firstTask, boolean core) {
        retry:
        for (;;) {
            int c = ctl.get();
            //获取当前线程池的状态
            int rs = runStateOf(c);

            /*
                如果状态为大于SHUTDOWN, 比如说STOP，STOP上文说过队列中的任务不处理了，也不接受新任务，
                因此可以直接返回false不扩容了，如果状态为SHUTDOWN并且firstTask为null，同时队列非空，
                那么就可以扩容
             */
            if (rs >= SHUTDOWN &&
                ! (rs == SHUTDOWN &&
                    firstTask == null &&
                    ! workQueue.isEmpty()))
                return false;

            for (;;) {
                int wc = workerCountOf(c);
                /*
                    若worker的数目大于CAPACITY则直接返回，
                    然后根据要扩容的是core线程还是非core线程，进行判断worker数目
                    是否超过设置的值，超过则返回
                 */
                if (wc >= CAPACITY ||
                    wc >= (core ? corePoolSize : maximumPoolSize))
                    return false;
                /*
                    通过CAS的方式自增worker的数目，成功了则直接跳出循环
                 */
                if (compareAndIncrementWorkerCount(c))
                    break retry;
                //重新读取状态变量，如果状态改变了，比如线程池关闭了，那么就跳到最外层的for循环，
                //注意这里跳出的是retry。
                c = ctl.get();  // Re-read ctl
                if (runStateOf(c) != rs)
                    continue retry;
                // else CAS failed due to workerCount change; retry inner loop
            }
        }

        boolean workerStarted = false;
        boolean workerAdded = false;
        Worker w = null;
        try {
            //创建Worker
            w = new Worker(firstTask);
            final Thread t = w.thread;
            if (t != null) {
                final ReentrantLock mainLock = this.mainLock;
                mainLock.lock();
                try {
                    /*
                        获取锁，并判断线程池是否已经关闭
                     */
                    int rs = runStateOf(ctl.get());

                    if (rs < SHUTDOWN ||
                        (rs == SHUTDOWN && firstTask == null)) {
                        if (t.isAlive()) // 若线程已经启动了，比如说已经调用了start()方法，那么就抛异常，
                            throw new IllegalThreadStateException();
                        //添加到workers中
                        workers.add(w);
                        int s = workers.size();
                        if (s > largestPoolSize) //更新largestPoolSize
                            largestPoolSize = s;
                        workerAdded = true;
                    }
                } finally {
                    mainLock.unlock();
                }
                if (workerAdded) {
                    //若Worker创建成功，则启动线程，这么时候worker就会开始执行任务了
                    t.start();
                    workerStarted = true;
                }
            }
        } finally {
            if (! workerStarted)
                //添加失败
                addWorkerFailed(w);
        }
        return workerStarted;
    } 

    private void addWorkerFailed(Worker w) {
        final ReentrantLock mainLock = this.mainLock;
        mainLock.lock();
        try {
            if (w != null)
                workers.remove(w);
            decrementWorkerCount();
            //每次减少worker或者从队列中移除任务的时候都需要调用这个方法
            tryTerminate();
        } finally {
            mainLock.unlock();
        }
    }
```

先看看 addWork() 的两个参数，第一个是需要提交的线程 Runnable firstTask，第二个参数是 boolean 类型，表示是否为核心线程。execute() 中有三处调用了 addWork() 我们逐一分析：

- 第一次，条件 if (workerCountOf(c) < corePoolSize) 这个很好理解，工作线程数少于核心线程数，提交任务。所以 addWorker(command, true)。
- 第二次，如果 workerCountOf(recheck) == 0 如果worker的数量为0，那就 addWorker(null,false)。为什么这里是 null ？之前已经把 command 提交到阻塞队列了 workQueue.offer(command) 。所以提交一个空线程，直接从阻塞队列里面取就可以了。
- 第三次，如果线程池没有 RUNNING 或者 offer 阻塞队列失败，addWorker(command,false)，很好理解，对应的就是，阻塞队列满了，将任务提交到，非核心线程池。与最大线程池比较。

> 引用：https://www.wangt.cc/2021/06/%E5%85%A8%E9%9D%A2%E8%AE%B2%E8%A7%A3%E7%BA%BF%E7%A8%8B%E6%B1%A0%E5%8E%9F%E7%90%86%EF%BC%81/
Worker的销毁过程，在运行woker的过程中，如果没有任务了就执行销毁
```
    final void runWorker(Worker w) {
        Thread wt = Thread.currentThread();
        Runnable task = w.firstTask;
        w.firstTask = null;
        w.unlock(); // allow interrupts
        boolean completedAbruptly = true;
        try {
            while (task != null || (task = getTask()) != null) {
                w.lock();
                // If pool is stopping, ensure thread is interrupted;
                // if not, ensure thread is not interrupted.  This
                // requires a recheck in second case to deal with
                // shutdownNow race while clearing interrupt
                if ((runStateAtLeast(ctl.get(), STOP) ||
                     (Thread.interrupted() &&
                      runStateAtLeast(ctl.get(), STOP))) &&
                    !wt.isInterrupted())
                    wt.interrupt();
                try {
                    beforeExecute(wt, task);
                    Throwable thrown = null;
                    try {
                        task.run();
                    } catch (RuntimeException x) {
                        thrown = x; throw x;
                    } catch (Error x) {
                        thrown = x; throw x;
                    } catch (Throwable x) {
                        thrown = x; throw new Error(x);
                    } finally {
                        afterExecute(task, thrown);
                    }
                } finally {
                    task = null;
                    w.completedTasks++;
                    w.unlock();
                }
            }
            completedAbruptly = false;
        } finally {
            processWorkerExit(w, completedAbruptly);
        }
    }


    private void processWorkerExit(Worker w, boolean completedAbruptly) {
        if (completedAbruptly) // If abrupt, then workerCount wasn't adjusted
            decrementWorkerCount();

        final ReentrantLock mainLock = this.mainLock;
        mainLock.lock();
        try {
            completedTaskCount += w.completedTasks;
            workers.remove(w);
        } finally {
            mainLock.unlock();
        }

        tryTerminate();

        int c = ctl.get();
        if (runStateLessThan(c, STOP)) {
            if (!completedAbruptly) {
                int min = allowCoreThreadTimeOut ? 0 : corePoolSize;
                if (min == 0 && ! workQueue.isEmpty())
                    min = 1;
                if (workerCountOf(c) >= min)
                    return; // replacement not needed
            }
            addWorker(null, false);
        }
    }
```
0.1 添加线程池的代码流程

![图片](https://txxs.github.io/pic/q&a/WX20210805-175031@2-5x.png)

更详细的过程图

![图片](https://txxs.github.io/pic/q&a/WX20210805-175031@2-6x.png)

> 最后图引用自（特别好）：https://www.jianshu.com/p/634160933511

业务主流程

![图片](https://txxs.github.io/pic/q&a/WX20210805-175031@2-7x.png)
	```
	以下这两个类尤其关键：
	private final BlockingQueue<Runnable> workQueue;
	private final HashSet<Worker> workers = new HashSet<Worker>();
	```
	主流程：首先判断是否增加核心线程，添加完直接return；如果不是核心线程，则直接进入队列workQueue，然后再增加Worker（非核心的）。
	Worker流程：Worker的核心逻辑是通过while循环+BlockingQueue的阻塞机制来实现对任务的执行，同时通过自身继承的AQS机制保证任务执行的线程安全。Worker是自我运行的，通过getTask()方法不断从队列中获取任务，addWork只是增加了处理问题的能力，而实际上的任务还是要从队列中获取。但是第一次执行AddWorker的时候会传入第一线程，其他时候不传递，因此Worker中的第一个任务不是从队列中获取的，可以直接执行。
    注意：第二步不是增加非核心的work而是先添加阻塞队列，然后再从z






> 引用自：https://mp.weixin.qq.com/s/HWoyHgZiUz7pqFhYxfLDNA
1. 为什么要有线程池
   
    1. 线程是一个重资源，JVM 中的线程与操作系统的线程是一对一的关系，所以在JVM中每创建一个线程就需要调用操作系统提供的API创建线程，赋予资源，并且销毁线程同样也需要系统调用。而系统调用就意味着上下文切换等开销，并且线程也是需要占用内存的，而内存也是珍贵的资源。
    2. 在单核时代，如果是纯运算的操作是不需要多线程的，一个线程一直执行运算即可。但如果这个线程正在等待 I/O 操作，此时 CPU 就处于空闲状态，这就浪费了 CPU 的算力，因此有了多线程，在某线程等待 I/O 等操作的时候，另一个线程顶上，充分利用 CPU，提高处理效率。
    3. 在多核时代，随着CPU的发展，核心数越来越多，能同时运行的线程数也提升了，此时的多线程不仅是为了提高单核CPU的利用率，也是为了充分利用多个核心。
    4. CPU的核心数有限，同时能运行的线程数有限，所以需要根据调度算法切换执行的线程，而线程的切换需要开销，比如替换寄存器的内容、高速缓存的失效等等。如果线程数太多，切换的频率就变高，可能使得多线程带来的好处抵不过线程切换带来的开销，得不偿失。因为线程数太少无法充分利用 CPU ，太多的话由于上下文切换的消耗又得不偿失，所以我们需要评估系统所要承载的并发量和所执行任务的特性，得出大致需要多少个线程数才能充分利用 CPU，因此需要控制线程数量。
    
2. 什么是线程池？

线程池的本质是一个典型的生产者-消费者模式。线程池内部会有一个队列来存储我们提交的任务，而内部线程不断地从队列中索取任务来执行，这就是线程池最原始的执行机制。
    ![图片](https://txxs.github.io/pic/q&a/WX20210729-102013@2-1x.png)

3. 手写一个线程池？

手写线程池：一个任务队列（放任务，新增的任务放在这里），一个线程列表（放线程，初始化的时候初始），放入线程池的线程，放入开始就开始启动，不断的动任务队列里取任务运行
```
@Slf4j
public class YesThreadPool {

    BlockingQueue<Runnable> taskQueue;  //存放任务的阻塞队列
    List<YesThread> threads; //线程列表

    YesThreadPool(BlockingQueue<Runnable> taskQueue, int threadSize) {
        this.taskQueue = taskQueue;
        threads = new ArrayList<YesThread>(threadSize);
        for(int i =0; i< threadSize; i++){
            YesThread thread = new YesThread("yes-task-thread-" + i);
            thread.start();
            threads.add(thread);
        }
    }
    //提交任务只是往任务队列里面塞任务
    public void execute(Runnable task) throws InterruptedException {
        taskQueue.put(task);
    }

    class YesThread extends Thread { //自定义一个线程
        public YesThread(String name) {
            super(name);
        }
        @Override
        public void run() {
            while (true) { //死循环
                Runnable task = null;
                try {
                    task = taskQueue.take(); //不断从任务队列获取任务
                } catch (InterruptedException e) {
                }
                task.run(); //执行
            }
        }
    }
}
```


4. 当一个线程进入线程池会发什么？

    线程池把任务的提交和任务的执行剥离开来，当一个任务被提交到线程池之后：
    
    - 如果此时线程数小于核心线程数，那么就会新起一个线程来执行当前的任务。
    - 如果此时线程数大于核心线程数，那么就会将任务塞入阻塞队列中，等待被执行。等待核心线程执行
    - 如果阻塞队列满了，并且此时线程数小于最大线程数，那么会创建新线程来执行当前任务。
    - 如果阻塞队列满了，并且此时线程数大于最大线程数，那么会采取拒绝策略。

    ![图片](https://txxs.github.io/pic/q&a/WX20210805-175031@2-4x.png)
   
    - 以下过程尤为关键
    - 当提交任务后,,线程池首先会检查当前线程数,如果当前线程数小于核心线程数,则新建线程并执行任务.
    - 随着任务不断增加,线程数达到了核心线程数的数量,此时任务依然在增加,那么新来的任务将会放到workQueue等待队列中,等核心线程执行完任务后重新从队列中提取出等待被执行的任务
    - 如果已经达到了核心线程数,且任务队列也满了,则线程池就会继续创建线程来执行任务,如果任务不断提交,线程池会持续创建线程直到达到maximumPoolSize最大线程数,当达到了最大线程数后,任务仍不断提交,那么此时就超过了线程池的最大处理能力,这个时候线程池就会拒绝处理这些任务,处理策略就是handler.
    
    从上述可知，线程池里的线程不是一开始就直接拉满的，是根据任务量开始慢慢增多的，这就算一种懒加载，到用的时候再创建线程，节省资源。此时线程数小于核心线程数，并且线程都处于空闲状态，现提交一个任务，是新起一个线程还是给之前创建的线程？```线程池会新起一个线程来执行这个新任务，不管老线程是否空闲。```

5. 你是如何理解核心线程的?

线程池默认是懒创建线程。而最大线程数其实是为了应付突发状况。看到这里你可能会觉得核心线程在线程池里面会有特殊标记？并没有，不论是核心还是非核心线程，在线程池里面都是一视同仁，当淘汰的时候不会管是哪些线程，反正留下核心线程数个线程即可。线程池其实想要的只是核心线程数个线程，但是又预留了一些数量来预防突发状况，当突发状况过去之后，线程池希望只维持核心线程数的线程，所以就弄了个 KeepAliveTime，当线程数大于核心数之后，如果线程空闲了一段时间（KeepAliveTime），就回收线程，直到数量与核心数持平。


> 需要这个图：https://mp.weixin.qq.com/s?__biz=MzUzNjAxODg4MQ==&mid=2247485666&idx=1&sn=281374a2c8b286fe9c993e2f4698a261&chksm=fafde24ccd8a6b5ad998f2e893045bb387b3e26b9c7e20802b12b8a2fb2f32dca3db1c2fcf51&token=17809850&lang=zh_CN#rd
6. 线程池继承结构

	- 最顶层的Executor只提供了一个最简单的void execute(Runnable command)方法，然后是ExecutorService，ExecutorService提供了一些管理相关的方法，例如关闭、判断当前线程池的状态等，另外不同于Executor#execute，ExecutorService提供了一系列方法，可以将任务包装成一个Future，从而使得任务提交方可以跟踪任务的状态。而父类AbstractExecutorService则提供了一些默认的实现。
	- Executor 是一个接口（主要用于定义规范），定义了 execute 方法，用于接收 Runnable 对象。
	- ExecutorService 也是一个接口，继承了 Executor 接口，增加了更多方法，相当于扩展了 Executor 接口的功能，例如定义了 submit() 系列方法，支持任务执行后得到返回结果。
	- AbstractExecutorService 是一个抽象类，实现了 ExecutorService 接口中的部分方法，例如提供了任务提交的 submit 方法的默认实现，而 submit 方法最终会调用 execute 方法。不过 AbstractExecutorService 并没有实现 execute 方法，相当于为子类留了个口子，让子类去灵活扩展（钩子函数）
	- ThreadPoolExecutor 继承 AbstractExecutorService 抽象类，并实现了 execute 等一系列方法。研发人员可以通过 Executors 工厂类来创建线程池并返回一个ExecutorService 对象，而内部几乎全是对 ThreadPoolExecutor 的封装。
	- ScheduledExecutorService 接口继承了 ExecutorService，增加定时调度的方法，使其成为一个可定时调度任务的接口，相当于扩展了 ExecutorService 的功能。ScheduledThreadPoolExecutor 类继承自 ThreadPoolExecutor 类，并且实现了 ScheduledExecutorService 接口，变成一个可定时调度任务的线程池。
    
7. 线程池核心的三个类

	- ThreadPoolExecutor:提供线程数相关的控制（最核心）
	- DelegatedExecutorService:仅暴露ExecutorService自身的方法，保证线程数不变来实现语义场景，它仅仅是包装了ExecutorService的方法，交由传入的ExecutorService来执行。
	- ScheduledExecutorService：提供延迟或者定期执行的功能：提供一系列的schedule方法，使得任务可以延迟或者周期性的执行，对应schedule方法会返回ScheduledFuture以供确认是否执行以及是否要取消。它的实现ScheduledThreadPoolExecutor也支持立即执行由submit提交的任务，仅支持相对延迟时间，比如距离现在5分钟后执行。类似Timer也可以管理延迟任务和周期任务，但是存在一些缺陷：所有的定时任务只有一个线程，如果某个任务执行时间长，将影响其它TimerTask的精确性，ScheduledExecutorService的多线程机制可弥补。TimerTask抛出未检查的异常，将终止线程执行，此时会错误的认为任务都取消了。
		1. 可以使用try-catch-finally对相应执行快处理；
		2. 通过execute执行的方法可以设置```UncaughtExceptionHandler```来接收未捕获的异常，并作出处理;
		3. 通过submit执行的，将被封装层ExecutionException重新抛出
    
8. ThreadPoolExecutor构造方法
    ```
    public ThreadPoolExecutor(
       int corePoolSize,
       int maximumPoolSize,
       long keepAliveTime,
       TimeUnit unit,
       BlockingQueue<Runnable> workQueue,
       ThreadFactory threadFactory,
       RejectedExecutionHandler handler)
    ```
    - poolSize：线程池中当前线程的数量，当该值为0的时候，意味着没有任何线程，线程池会终止；同一时刻，poolSize不会超过maximumPoolSize。
    - corePoolSize，线程池核心线程数量：线程池在完成初始化之后，默认情况下，线程池中不会有任何线程，线程池会等有任务来的时候再去创建线程。核心线程创建出来后即使超出了线程保持的存活时间配置也不会销毁，核心线程只要创建就永驻了，就等着新任务进来进行处理。
    - maximumPoolSize，线程池最大线程数量：核心线程忙不过来且任务存储队列满了的情况下，还有新任务进来的话就会继续开辟线程，但是也不是任意的开辟线程数量，线程数（包含核心线程）达到maximumPoolSize后就不会产生新线程了，就会执行拒绝策略。
    - keepAliverTime，当活跃线程数大于核心线程数时，空闲的多余线程最大存活时间：如果线程池当前的线程数多于corePoolSize，那么如果多余的线程空闲时间超过keepAliveTime，那么这些多余的线程（超出核心线程数的那些线程）就会被回收。
    - unit，存活时间的单位：比如：TimeUnit.MILLISECONDS、TimeUnit.SECONDS。
    - workQueue，存放任务的队列，阻塞队列类型：核心线程数满了后还有任务继续提交到线程池的话，就先进入workQueue。
    - workQueue通常情况下有如下选择：
    
        1. ArrayBlockingQueue：是一个基于数组结构的有界阻塞队列，此队列按 FIFO（先进先出）原则对元素进行排序。初始化时需指定队列的容量 capacity。
        2. LinkedBlockingQueue：一个基于链表结构的阻塞队列，此队列按FIFO （先进先出） 排序元素，吞吐量通常要高于ArrayBlockingQueue。静态工厂方法Executors.newFixedThreadPool()使用了这个队列
        3. SynchronousQueue：一个不存储元素的阻塞队列（SynchronousQueue 也可以存储数据，且是无锁实现，只是size()方法直接返回0而已。）。每个插入操作必须等到另一个线程调用移除操作，否则插入操作一直处于阻塞状态，吞吐量通常要高于LinkedBlockingQueue，静态工厂方法Executors.newCachedThreadPool使用了这个队列。同步队列，阻塞队列的特殊版，即没有容量的阻塞队列，随进随出，不做停留。
        4. PriorityBlockingQueue：一个具有优先级的无限阻塞队列(优先级通过参数Comparator实现)。优先级阻塞队列，这是一个无界队列，不遵循FIFO，而是根据任务自身的优先级顺序来执行，初始化可不指定容量，默认11（既然有容量，怎么还是无界的呢？因为它添加元素时会进行扩容）。
        5. DelayedWorkQueu队列的特点是内部的任务并不是按照放入的时间排序,而是会按照延迟的时间长短对任务进行排序,内部采用的是“堆”数据结构.而且它也是一个无界队列.
           ![图片](https://txxs.github.io/pic/q&a/WX20210805-175031@2-1x.png)
    
    - threadFactory：当线程池需要新的线程时，会用threadFactory来生成新的线程，默认采用的是DefaultThreadFactory，主要负责创建线程。newThread()方法。创建出来的线程都在同一个线程组且优先级也是一样的。
    - handler：拒绝策略，任务量超出线程池的配置限制或执行shutdown还在继续提交任务的话，会执行handler的逻辑。默认采用的是AbortPolicy，遇到上面的情况，线程池将直接采取直接拒绝策略，也就是直接抛出异常。RejectedExecutionException

9. Executors创建线程池的快捷方法
    
    FixedThreadPool：这个线程池的核心线程数和最大线程数是一样的,所以可以看作是固定线程数的线程池,特点是当线程达到核心线程数后,如果任务队列满了,也不会创建额外的非核心线程去执行任务,而是执行拒绝策略.
   
    CachedThreadPool：这个线程池叫做缓存线程池,特点是线程数几乎是可以无限增加的(最大值是Integer.MAX_VALUE,基本不会达到),当线程闲置时还可以进行回收,而且它采用的存储任务的队列是SynchronousQueue队列,队列容量是0,实际不存储任务,只负责对任务的中转和传递,所以来一个任务线程池就看是否有空闲的线程,有的话就用空闲的线程去执行任务,否则就创建一个线程去执行,效率比较高.
    
    ScheduledThreadPool：通过这个线程池的名字可以看出,它支持定时或者周期性执行任务,实现这种功能的方法主要有三种:
        ```
        ScheduledExecutorService service = Executors.newScheduledThreadPool(10);
        service.schedule(new Task(), 10, TimeUnit.SECONDS);
        service.scheduleAtFixedRate(new Task(), 10, 10, TimeUnit.SECONDS);
        service.scheduleWithFixedDelay(new Task(), 10, 10, TimeUnit.SECONDS);
        ```
    第一种是schedule,通过延迟指定时间后执行一次任务,代码中设置的是10秒,所以10秒后执行一次任务就结束.
    
        第二种是scheduleAtFixedRate,通过名称我们可以看出,第二种是以固定频率去执行任务,它的第二个参数initialDelay表示第一次延迟时间,第三个参数period表示周期,总体按照上面的代码意思就是,第一次延迟10秒后执行任务,然后,每次延迟10秒执行一次任务.第三种方法是scheduleWithFixeddelay这种与第二种方法类似,也是周期执行任务,不同的是对周期的定义,之前的scheduleAtFixedRate是以任务的开始时间为起点开始计时,时间到了就开始执行第二次任务,而不管任务需要多久执行,而scheduleWithFixeddelay是以任务结束的时间作为下一次循环开始的时间起点.
    
    SingleThreadExecutor：第四种线程池中只有一个线程去执行任务,如果执行任务过程中发生了异常,则线程池会创建一个新线程来执行后续任务,这个线程因为只有一个线程,所以可以保证任务执行的有序性.
    
    SingleThreadScheduleExecutor：这个线程池它和ScheduledThreadPool很相似,只不过它的内部也只有一个线程,他只是将核心线程数设置为了1,如果执行期间发生异常,同样会创建一个新线程去执行任务.
    
    ForkJoinPool：最后一种线程池是ForkJoinPool,这个线程池是来支持将一个任务拆分成多个“小任务”并行计算，这个线程池是在jdk1.7之后加入的,它主要用于实现“分而治之”的算法，特别是分治之后递归调用的函数，本文只是对ForkJoinPool做了简单的介绍,我们先来介绍一下ForkJoinPool和之前的线程池主要的两个特点。剩下的看：https://zhuanlan.zhihu.com/p/346719067

10. 线程池的流程运转原理

    提交一个任务到线程池中，线程池的处理流程如下：
    
    1. 判断线程池里的核心线程是否都在执行任务，如果不是（核心线程空闲或者还有核心线程没有被创建）则创建一个新的工作线程来执行任务。如果核心线程都在执行任务，则进入下个流程。
    2. 线程池判断工作队列是否已满，如果工作队列没有满，则将新提交的任务存储在这个工作队列里。如果工作队列满了，则进入下个流程。
    3. 判断线程池里的线程是否都处于工作状态[线程数量是否达到最大值]，如果没有，则创建一个新的工作线程来执行任务。如果已经满了，则交给饱和策略来处理这个任务。
    4. 其他的参数都比较容易理解，所以我们来着重看下拒绝策略handler这个参数，其类型为RejectedExecutionHandler，当线程池达到最大值并且线程数也达到最大值时才会工作，当队列和线程池都满了，说明线程池处于饱和状态，那么必须对新提交的任务采用一种特殊的策略来进行处理。这个策略默认配置是AbortPolicy，表示无法处理新的任务而抛出异常。JAVA提供了4种策略：
    
        - AbortPolicy：直接抛出异常，如果线程数达到最大，且工作队列也满，此时再进来任务，则抛出 RejectedExecutionException（系统会停止运行，但是不会退出）
        - CallerRunsPolicy：只用调用所在的线程运行任务，让新来的任务返回到调用它的线程中去执行（比如main线程调用了executors.execute(task)，那么就会将task返回到main线程中去执行）
        - DiscardOldestPolicy：丢弃队列里最近的一个任务，并执行当前任务。如果线程数达到最大，且工作队列也满，此时再进来任务，则丢掉最先进入队列的任务（有点残忍了），并再次插入任务
        - DiscardPolicy：不处理，丢弃掉。如果线程数达到最大，且工作队列也满，此时再进来任务，则直接丢掉（看任务的重要程度，不重要的任务可以用这个策略）
          
          ![图片](https://txxs.github.io/pic/q&a/WX20210805-175031@2-2x.png)

11. 线程池的底层原理（还需要再深入）

Java线程的实现是通过调用native方法调用操作系统的pthread API，由内核线程统一管理。一个实现了Runnable的类只是标识可用多线程运行，真正产生大开销的是new Thread()时进行的内核调用。而线程池技术将worker线程缓存下来进行重用。

12. ForkJoinPool的原理（需要再次理解）
    本质上将一个任务进一步细分，内部使用“工作窃取”算法，让任务在各个CPU上尽可能均衡。
    1. 每个工作线程都有自己的工作队列WorkQueue；
    2. 这是一个双端队列，它是线程私有的；
    3. ForkJoinTask中fork的子任务，将放入运行该任务的工作线程的队头，工作线程将以LIFO的顺序来处理工作队列中的任务；
    4. 为了最大化地利用CPU，空闲的线程将从其它线程的队列中“窃取”任务来执行；
    5. 从工作队列的尾部窃取任务，以减少竞争；
    6. 双端队列的操作：push()/pop()仅在其所有者工作线程中调用，poll()是由其它线程窃取任务时调用的；
    7. 当只剩下最后一个任务时，还是会存在竞争，是通过CAS来实现的；

13. corePoolSize=0会怎么样

    这是newCachePool中默认的创建方式：
    ```
     public static ExecutorService newCachedThreadPool() {
            return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                          60L, TimeUnit.SECONDS,
                                          new SynchronousQueue<Runnable>());
        }
    ```
    在1.6版本之后，如果corePoolSize=0，提交任务时如果线程池为空，则会立即创建一个线程来执行任务（先排队再获取）；如果提交任务的时候，线程池不为空，则先在等待队列中排队，只有队列满了才会创建新线程。所以，优化在于，在队列没有满的这段时间内，会有一个线程在消费提交的任务；1.6之前的实现是，必须等队列满了之后，才开始消费。

    另外一个解释：创建可缓冲的线程池。没有大小限制。由于corePoolSize为0所以任务会放入SynchronousQueue队列中，SynchronousQueue只能存放大小为1，所以会立刻新起线程，由于maxumumPoolSize为Integer.MAX_VALUE所以可以认为大小为2147483647。受内存大小限制。

14. 线程池创建之后，会立即创建核心线程么

    不会。从上面的源码可以看出，在刚刚创建ThreadPoolExecutor的时候，线程并不会立即启动，而是要等到有任务提交时才会启动，除非调用了prestartCoreThread/prestartAllCoreThreads事先启动核心线程。

15. 核心线程永远不会销毁么

    在JDK1.6之前，线程池会尽量保持corePoolSize个核心线程，即使这些线程闲置了很长时间。这一点曾被开发者诟病，所以从JDK1.6开始，提供了方法allowsCoreThreadTimeOut，如果传参为true，则允许闲置的核心线程被终止。请注意这种策略和corePoolSize=0的区别。我总结的区别是：corePoolSize=0：在一般情况下只使用一个线程消费任务，只有当并发请求特别多、等待队列都满了之后，才开始用多线程。allowsCoreThreadTimeOut=true && corePoolSize>1：在一般情况下就开始使用多线程（corePoolSize个），当并发请求特别多，等待队列都满了之后，继续加大线程数。但是当请求没有的时候，允许核心线程也终止。所以corePoolSize=0的效果，基本等同于allowsCoreThreadTimeOut=true && corePoolSize=1，但实现细节其实不同。

16. keepAliveTime=0会怎么样

    在JDK1.8中，keepAliveTime=0表示非核心线程执行完立刻终止。默认情况下，keepAliveTime小于0，初始化的时候才会报错；但如果allowsCoreThreadTimeOut，keepAliveTime必须大于0，不然初始化报错。

17. 怎么进行异常处理

    - 如果我们使用execute()提交任务，我们一般要在Runable任务的代码加上try-catch进行异常处理。如果我们使用submit()提交任务，我们一般要在主线程中，对Future.get()进行try-catch进行异常处理。不论是用execute还是submit，都可以自己在业务代码上加try-catch进行异常处理。我一般喜欢使用这种方式，因为我喜欢对不同业务场景的异常进行差异化处理，至少打不一样的日志吧。
    - 如果是execute，还可以自定义线程池，继承ThreadPoolExecutor并复写其afterExecute(Runnable r, Throwable t)方法。
    - 或者实现Thread.UncaughtExceptionHandler接口，实现void uncaughtException(Thread t, Throwable e);方法，并将该handler传递给线程池的ThreadFactory。
    - 但是注意，afterExecute和UncaughtExceptionHandler都不适用submit。因为通过上面的FutureTask.run()不难发现，它自己对Throwable进行了try-catch，封装到了outcome属性，所以底层方法execute的Worker是拿不到异常信息的。

18. shutdown和shutdownNow的区别

    shutdown => 平缓关闭，等待所有已添加到线程池中的任务执行完再关闭；shutdownNow => 立刻关闭，停止正在执行的任务，并返回队列中未执行的任务。

19. submit和executor区别

    - execute和submit都属于线程池的方法，execute只能提交Runnable类型的任务，而submit既能提交Runnable类型任务也能提交Callable类型任务。
    - execute会直接抛出任务执行时的异常，submit会吃掉异常，可通过Future的get方法[会阻塞]将任务执行时的异常重新抛出。
    - execute所属顶层接口是Executor,submit所属顶层接口是ExecutorService，实现类ThreadPoolExecutor重写了execute方法,抽象类AbstractExecutorService重写了submit方法。
    - execute方法，适用于不需要关注返回值的场景，只需要将线程丢到线程池中去执行就可以了。而submit()方法，适用于需要关注返回值的场景，不过最终会调用execute()方法。考虑到性能提升，如果不需要关注返回值，则建议直接调用 execute() 方法，因为那样会屏蔽很多中间调度。
    
    submit和execute由于参数不同有四种实现形式，如下所示，本文主要研究这四种形式在各自使用场景下的区别和联系

    	- 这种提交的方式会返回一个Future对象，这个Future对象代表这线程的执行结果，当主线程调用Future的get方法的时候会获取到从线程中返回的结果数据。如果在线程的执行过程中发生了异常，get会获取到异常的信息。<T> Future<T> submit(Callable<T> task);
    	- 当线程正常结束的时候调用Future的get方法会返回result对象，当线程抛出异常的时候会获取到对应的异常的信息。<T> Future<T> submit(Runnable task, T result);
    	- 提交一个Runable接口的对象，这样当调用get方法的时候，如果线程执行成功会直接返回null，如果线程执行异常会返回异常的信息，Future<?> submit(Runnable task);
    	- void execute(Runnable command);execute提交的方式只能提交一个Runnable的对象，且该方法的返回值是void，也即是提交后如果线程运行后，和主线程就脱离了关系了，当然可以设置一些变量来获取到线程的运行结果。并且当线程的执行过程中抛出了异常通常来说主线程也无法获取到异常的信息的，只有通过ThreadFactory主动设置线程的异常处理类才能感知到提交的线程中的异常信息。

20.线程池状态与线程数量用一个ctl变量表示的好处？

    线程池状态和线程数量合二为一，用一个原子变量来表示，来减少锁竞争，提高并发效率。

21. Worker类为什么不用重入锁
    
    Worker实现了两个接口，一个是AQS同步器接口，一个是Runnable，AQS是为了实现自己的同步策略，这里思考一下，为什么不直接用ReentrantLock呢？这是因为线程执行任务时是不允许其它锁重入进来的，而前者可重入，所以不可用。
    
22. 线程池的使用原则
    
    - 一定要传递threadFactory这个参数，定义有意义的线程名
    - 尽量避免局部变量创建线程池：引入线程池的目的提高资源复用，如果在局部变量创建线程池，基本上达不到提高资源复用，而且很有可能因为忘记调用shutdown出现资源泄漏。
    - 最好能设计一个可监控的线程池：handler的监控。一旦任务进入handler说明此时线程池数目在max的时候都处理不过来了，服务肯定会收到影响。这种情况要及时处理；workQueue的大小。如果workQueue里面有挤压，说明线程数在core任务处理不过来，要注意这种情况对服务带来的影响；监控activeCount的数目。这样可以了解设置的参数是否合理，比如core设置的太大，浪费资源；监控通过线程池创建的线程总数。在创建线程时候+1，销毁的时候-1，这样可以监控是否有资源泄漏。ThreadPoolExecutor提供了beforeExecute, afterExecute 等钩子方法，我们可以可以在钩子方法中对线程池任务的执行时间上报CAT
    
            - 引用自：https://mp.weixin.qq.com/s/_HhyDPRA2xMVH0u196UVlw
            - active/coreSize ：活动线程数和核心线程数的比值， 其中active = executor.getActiveCount()，表示所有运行中的工作线程的数量，这个比值反应线程池的线程活跃状态，如果一直维持在一个很低的水平，则说明线程池需要进行缩容；如果长时间维持一个很大的数值，说明活跃度好，线程池利用率高。
            - active/maxSize ：活动线程数和最大线程数的比值，这个值可以配合上面的 active/coreSize 来看，当active/coreSize大于100%的时候，如果active/maxSize维持在一个较低的值，则说明当前线程池的负载偏低，如果大于60%或者更高，则说明线程池过载，需要及时调整线程池容量配置。
            - completedTaskCount：执行完毕的工作线程的总数，包含历史所有。
            - largestPoolSize：历史上线程池容量触达过的最大值
            - rejectCount：被拒绝的线程的数量，如果大量线程被拒绝，则说明当前线程池已经溢出了，需要及时调整线程池配置
            - queueSize：队列中工作线程的数量，如果大量的线程池在排队，说明coreSize已经不够用了，可以根据实际情况来调整，对于执行时间要求很严格的业务场景，可能需要通过提升coreSize来减少排队情况。
    
        - 线程池大小和队列设置原则，避免任务堆积：（因素：处理时间 + 线程数 + CPU数量）核心接口以及没有突发流量情况下，我通过给出的建议是使用SynchronousQueue这个队列，并且maxPoolSize尽量大一些；当使用有界队列的时候，corePoolSize设置的应该尽可能和maximumPoolSize相等，并且针对队列应该设置监控；还有可以根据任务特点来设置线程数。比如任务要是IO密集型线程池大小可以设置的大一些；要是CPU密集型设置小一点，可以简单设置为cpu ~ cpu *2。
    
23. 真的有核心线程与非核心线程之分吗？
    
    其实是没有区别的，他们都是一样的线程，线程池源码中并没有核心线程这个标记，只是有一个核心线程数量，在这个数量之前创建先线程和在这个数量之后创建线程，默认在这个数量之后创建的线程会在keepAliveTime空闲时间内销毁，我们为了方便记忆，而将其称为非核心线程
    
> 引用自：https://zhuanlan.zhihu.com/p/106530162
24. 工作窃取算法
    
    工作窃取核心思想是，自己的活干完了去看看别人有没有没干完的活，如果有就拿过来帮他干。
    大多数实现机制是：为每个工作者程分配一个双端队列(本地队列)用于存放需要执行的任务，当自己的队列没有数据的时候从其它工作者队列中获得一个任务继续执行。
    
25. FutureTask是阻塞的吗
    
    向线程池中提交任务的submit方法不是阻塞方法，而Future.get方法是一个阻塞方法，当submit提交多个任务时，只有所有任务都完成后，才能使用get按照任务的提交顺序得到返回结果，所以一般需要使用future.isDone先判断任务是否全部执行完成，完成后再使用future.get得到结果。（也可以用get (long timeout, TimeUnit unit)方法可以设置超时时间，防止无限时间的等待）
    三段式的编程：1.启动多线程任务2.处理其他事3.收集多线程任务结果，Future虽然可以实现获取异步执行结果的需求，但是它没有提供通知的机制，要么使用阻塞，在future.get()的地方等待future返回的结果，这时又变成同步操作；要么使用isDone()轮询地判断Future是否完成，这样会耗费CPU的资源。

26. 高并发、任务执行时间短的业务怎样使用线程池？并发不高、任务执行时间长的业务怎样使用线程池？并发高、业务执行时间长的业务怎样使用线程池？

    - 高并发、任务执行时间短的业务，线程池线程数可以设置为CPU核数+1，减少线程上下文的切换
    - 并发不高、任务执行时间长的业务要区分开看：
        - 假如是业务时间长集中在IO操作上，也就是IO密集型的任务，因为IO操作并不占用CPU，所以不要让所有的CPU闲下来，可以适当加大线程池中的线程数目，让CPU处理更多的业务
        - 假如是业务时间长集中在计算操作上，也就是计算密集型任务，这个就没办法了，和（1）一样吧，线程池中的线程数设置得少一些，减少线程上下文的切换
    - 并发高、业务执行时间长，解决这种类型任务的关键不在于线程池而在于整体架构的设计，看看这些业务里面某些数据是否能做缓存是第一步，增加服务器是第二步，至于线程池的设置，设置参考（2）。最后，业务执行时间长的问题，也可能需要分析一下，看看能不能使用中间件对任务进行拆分和解耦。



27. 计算线程数量（和26核心一样）

    一般多线程执行的任务类型可以分为 CPU 密集型和 I/O 密集型，根据不同的任务类型，我们计算线程数的方法也不一样。
	    - CPU 密集型任务：这种任务消耗的主要是 CPU 资源，可以将线程数设置为 N（CPU核心数）+1，比CPU核心数多出来的一个线程是为了防止线程偶发的缺页中断，或者其它原因导致的任务暂停而带来的影响。一旦任务暂停，CPU 就会处于空闲状态，而在这种情况下多出来的一个线程就可以充分利用 CPU 的空闲时间。当线程数量太小，同一时间大量请求将被阻塞在线程队列中排队等待执行线程，此时 CPU 没有得到充分利用；当线程数量太大，被创建的执行线程同时在争取 CPU 资源，又会导致大量的上下文切换，从而增加线程的执行时间，影响了整体执行效率。
	    - I/O 密集型任务：这种任务应用起来，系统会用大部分的时间来处理 I/O 交互，而线程在处理 I/O 的时间段内不会占用 CPU 来处理，这时就可以将CPU交出给其它线程使用。因此在I/O密集型任务的应用中，我们可以多配置一些线程，具体的计算方法是 2N。
	    - 通过一个线程池实现向用户定时推送消息的业务，我们又该如何设置线程池的数量呢？此时我们可以参考以下公式来计算线程数：线程数 =N（CPU 核数）*（1+WT（线程等待时间）/ST（线程时间运行时间））。我们可以通过 JDK 自带的工具 VisualVM 来查看 WT/ST 比例。综合来看，我们可以根据自己的业务场景，从“N+1”和“2N”两个公式中选出一个适合的，计算出一个大概的线程数量，之后通过实际压测，逐渐往“增大线程数量”和“减小线程数量”这两个方向调整，然后观察整体的处理时间变化，最终确定一个具体的线程数量。
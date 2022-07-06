(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{394:function(n,s,a){"use strict";a.r(s);var e=a(13),t=Object(e.a)({},(function(){var n=this,s=n.$createElement,a=n._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":n.$parent.slotKey}},[a("h3",{attrs:{id:"_1、两个线程实现交替运行-以交替打印奇偶"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1、两个线程实现交替运行-以交替打印奇偶"}},[n._v("#")]),n._v(" 1、两个线程实现交替运行-以交替打印奇偶")]),n._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[n._v('public class Work2 {\n    static final Object object = new Object();\n\n    public static void main(String[] args) {\n\n        Thread t1 = new Thread(new Runnable() {\n            @Override\n            public void run() {\n                synchronized (object) {\n                    for (int i = 1; i < 10; i += 2) {\n                        System.out.println(Thread.currentThread().getName() + "    " + i);\n                        object.notify();\n                        try {\n                            object.wait();\n                        } catch (InterruptedException e) {\n                            e.printStackTrace();\n                        }\n                    }\n                }\n            }\n        }, "t1");\n        Thread t2 = new Thread(new Runnable() {\n            @Override\n            public void run() {\n                synchronized (object) {\n                    for (int i = 2; i < 10; i += 2) {\n                        System.out.println(Thread.currentThread().getName() + "     " + i);\n                        object.notify();\n                        try {\n                            object.wait();\n                        } catch (InterruptedException e) {\n                            e.printStackTrace();\n                        }\n                    }\n                }\n            }\n        }, "t2");\n        t1.start();\n        t2.start();\n    }\n}\n')])]),n._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[n._v("1")]),a("br"),a("span",{staticClass:"line-number"},[n._v("2")]),a("br"),a("span",{staticClass:"line-number"},[n._v("3")]),a("br"),a("span",{staticClass:"line-number"},[n._v("4")]),a("br"),a("span",{staticClass:"line-number"},[n._v("5")]),a("br"),a("span",{staticClass:"line-number"},[n._v("6")]),a("br"),a("span",{staticClass:"line-number"},[n._v("7")]),a("br"),a("span",{staticClass:"line-number"},[n._v("8")]),a("br"),a("span",{staticClass:"line-number"},[n._v("9")]),a("br"),a("span",{staticClass:"line-number"},[n._v("10")]),a("br"),a("span",{staticClass:"line-number"},[n._v("11")]),a("br"),a("span",{staticClass:"line-number"},[n._v("12")]),a("br"),a("span",{staticClass:"line-number"},[n._v("13")]),a("br"),a("span",{staticClass:"line-number"},[n._v("14")]),a("br"),a("span",{staticClass:"line-number"},[n._v("15")]),a("br"),a("span",{staticClass:"line-number"},[n._v("16")]),a("br"),a("span",{staticClass:"line-number"},[n._v("17")]),a("br"),a("span",{staticClass:"line-number"},[n._v("18")]),a("br"),a("span",{staticClass:"line-number"},[n._v("19")]),a("br"),a("span",{staticClass:"line-number"},[n._v("20")]),a("br"),a("span",{staticClass:"line-number"},[n._v("21")]),a("br"),a("span",{staticClass:"line-number"},[n._v("22")]),a("br"),a("span",{staticClass:"line-number"},[n._v("23")]),a("br"),a("span",{staticClass:"line-number"},[n._v("24")]),a("br"),a("span",{staticClass:"line-number"},[n._v("25")]),a("br"),a("span",{staticClass:"line-number"},[n._v("26")]),a("br"),a("span",{staticClass:"line-number"},[n._v("27")]),a("br"),a("span",{staticClass:"line-number"},[n._v("28")]),a("br"),a("span",{staticClass:"line-number"},[n._v("29")]),a("br"),a("span",{staticClass:"line-number"},[n._v("30")]),a("br"),a("span",{staticClass:"line-number"},[n._v("31")]),a("br"),a("span",{staticClass:"line-number"},[n._v("32")]),a("br"),a("span",{staticClass:"line-number"},[n._v("33")]),a("br"),a("span",{staticClass:"line-number"},[n._v("34")]),a("br"),a("span",{staticClass:"line-number"},[n._v("35")]),a("br"),a("span",{staticClass:"line-number"},[n._v("36")]),a("br"),a("span",{staticClass:"line-number"},[n._v("37")]),a("br"),a("span",{staticClass:"line-number"},[n._v("38")]),a("br"),a("span",{staticClass:"line-number"},[n._v("39")]),a("br"),a("span",{staticClass:"line-number"},[n._v("40")]),a("br"),a("span",{staticClass:"line-number"},[n._v("41")]),a("br")])]),a("h3",{attrs:{id:"_2、生产者消费者"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2、生产者消费者"}},[n._v("#")]),n._v(" 2、生产者消费者")]),n._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[n._v('https://juejin.im/entry/596343686fb9a06bbd6f888c\n\n/**\n * 生产者和消费者，wait()和notify()的实现\n * @author ZGJ\n * @date 2017年6月22日\n */\npublic class Test1 {\n    private static Integer count = 0;\n    private static final Integer FULL = 10;\n    private static String LOCK = "lock";\n    \n    public static void main(String[] args) {\n        Test1 test1 = new Test1();\n        new Thread(test1.new Producer()).start();\n        new Thread(test1.new Consumer()).start();\n        new Thread(test1.new Producer()).start();\n        new Thread(test1.new Consumer()).start();\n        new Thread(test1.new Producer()).start();\n        new Thread(test1.new Consumer()).start();\n        new Thread(test1.new Producer()).start();\n        new Thread(test1.new Consumer()).start();\n    }\n    class Producer implements Runnable {\n        @Override\n        public void run() {\n            for (int i = 0; i < 10; i++) {\n                try {\n                    Thread.sleep(3000);\n                } catch (Exception e) {\n                    e.printStackTrace();\n                }\n                synchronized (LOCK) {\n                    while (count == FULL) {\n                        try {\n                            LOCK.wait();\n                        } catch (Exception e) {\n                            e.printStackTrace();\n                        }\n                    }\n                    count++;\n                    System.out.println(Thread.currentThread().getName() + "生产者生产，目前总共有" + count);\n                    LOCK.notifyAll();\n                }\n            }\n        }\n    }\n    class Consumer implements Runnable {\n        @Override\n        public void run() {\n            for (int i = 0; i < 10; i++) {\n                try {\n                    Thread.sleep(3000);\n                } catch (InterruptedException e) {\n                    e.printStackTrace();\n                }\n                synchronized (LOCK) {\n                    while (count == 0) {\n                        try {\n                            LOCK.wait();\n                        } catch (Exception e) {\n                        }\n                    }\n                    count--;\n                    System.out.println(Thread.currentThread().getName() + "消费者消费，目前总共有" + count);\n                    LOCK.notifyAll();\n                }\n            }\n        }\n    }\n}\n\n\n另外一个方式\n\nimport java.util.concurrent.locks.Condition;\nimport java.util.concurrent.locks.Lock;\nimport java.util.concurrent.locks.ReentrantLock;\n/**\n * 生产者和消费者，ReentrantLock的实现\n * \n * @author ZGJ\n * @date 2017年6月22日\n */\npublic class Test2 {\n    private static Integer count = 0;\n    private static final Integer FULL = 10;\n    //创建一个锁对象\n    private Lock lock = new ReentrantLock();\n    //创建两个条件变量，一个为缓冲区非满，一个为缓冲区非空\n    private final Condition producerlock = lock.newCondition();\n    private final Condition consumerlock = lock.newCondition();\n    public static void main(String[] args) {\n        Test2 test2 = new Test2();\n        new Thread(test2.new Producer()).start();\n        new Thread(test2.new Consumer()).start();\n        new Thread(test2.new Producer()).start();\n        new Thread(test2.new Consumer()).start();\n        new Thread(test2.new Producer()).start();\n        new Thread(test2.new Consumer()).start();\n        new Thread(test2.new Producer()).start();\n        new Thread(test2.new Consumer()).start();\n    }\n    class Producer implements Runnable {\n        @Override\n        public void run() {\n            for (int i = 0; i < 10; i++) {\n                try {\n                    Thread.sleep(3000);\n                } catch (Exception e) {\n                    e.printStackTrace();\n                }\n                //获取锁\n                lock.lock();\n                try {\n                    while (count == FULL) {\n                        try {\n                            producerlock.await();\n                        } catch (InterruptedException e) {\n                            e.printStackTrace();\n                        }\n                    }\n                    count++;\n                    System.out.println(Thread.currentThread().getName()\n                            + "生产者生产，目前总共有" + count);\n                    //唤醒消费者\n                    consumerlock.signal();\n                } finally {\n                    //释放锁\n                    lock.unlock();\n                }\n            }\n        }\n    }\n    class Consumer implements Runnable {\n        @Override\n        public void run() {\n            for (int i = 0; i < 10; i++) {\n                try {\n                    Thread.sleep(3000);\n                } catch (InterruptedException e1) {\n                    e1.printStackTrace();\n                }\n                lock.lock();\n                try {\n                    while (count == 0) {\n                        try {\n                            consumerlock.await();\n                        } catch (Exception e) {\n                            e.printStackTrace();\n                        }\n                    }\n                    count--;\n                    System.out.println(Thread.currentThread().getName()\n                            + "消费者消费，目前总共有" + count);\n                    producerlock.signal();\n                } finally {\n                    lock.unlock();\n                }\n            }\n        }\n    }\n}\n\n')])]),n._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[n._v("1")]),a("br"),a("span",{staticClass:"line-number"},[n._v("2")]),a("br"),a("span",{staticClass:"line-number"},[n._v("3")]),a("br"),a("span",{staticClass:"line-number"},[n._v("4")]),a("br"),a("span",{staticClass:"line-number"},[n._v("5")]),a("br"),a("span",{staticClass:"line-number"},[n._v("6")]),a("br"),a("span",{staticClass:"line-number"},[n._v("7")]),a("br"),a("span",{staticClass:"line-number"},[n._v("8")]),a("br"),a("span",{staticClass:"line-number"},[n._v("9")]),a("br"),a("span",{staticClass:"line-number"},[n._v("10")]),a("br"),a("span",{staticClass:"line-number"},[n._v("11")]),a("br"),a("span",{staticClass:"line-number"},[n._v("12")]),a("br"),a("span",{staticClass:"line-number"},[n._v("13")]),a("br"),a("span",{staticClass:"line-number"},[n._v("14")]),a("br"),a("span",{staticClass:"line-number"},[n._v("15")]),a("br"),a("span",{staticClass:"line-number"},[n._v("16")]),a("br"),a("span",{staticClass:"line-number"},[n._v("17")]),a("br"),a("span",{staticClass:"line-number"},[n._v("18")]),a("br"),a("span",{staticClass:"line-number"},[n._v("19")]),a("br"),a("span",{staticClass:"line-number"},[n._v("20")]),a("br"),a("span",{staticClass:"line-number"},[n._v("21")]),a("br"),a("span",{staticClass:"line-number"},[n._v("22")]),a("br"),a("span",{staticClass:"line-number"},[n._v("23")]),a("br"),a("span",{staticClass:"line-number"},[n._v("24")]),a("br"),a("span",{staticClass:"line-number"},[n._v("25")]),a("br"),a("span",{staticClass:"line-number"},[n._v("26")]),a("br"),a("span",{staticClass:"line-number"},[n._v("27")]),a("br"),a("span",{staticClass:"line-number"},[n._v("28")]),a("br"),a("span",{staticClass:"line-number"},[n._v("29")]),a("br"),a("span",{staticClass:"line-number"},[n._v("30")]),a("br"),a("span",{staticClass:"line-number"},[n._v("31")]),a("br"),a("span",{staticClass:"line-number"},[n._v("32")]),a("br"),a("span",{staticClass:"line-number"},[n._v("33")]),a("br"),a("span",{staticClass:"line-number"},[n._v("34")]),a("br"),a("span",{staticClass:"line-number"},[n._v("35")]),a("br"),a("span",{staticClass:"line-number"},[n._v("36")]),a("br"),a("span",{staticClass:"line-number"},[n._v("37")]),a("br"),a("span",{staticClass:"line-number"},[n._v("38")]),a("br"),a("span",{staticClass:"line-number"},[n._v("39")]),a("br"),a("span",{staticClass:"line-number"},[n._v("40")]),a("br"),a("span",{staticClass:"line-number"},[n._v("41")]),a("br"),a("span",{staticClass:"line-number"},[n._v("42")]),a("br"),a("span",{staticClass:"line-number"},[n._v("43")]),a("br"),a("span",{staticClass:"line-number"},[n._v("44")]),a("br"),a("span",{staticClass:"line-number"},[n._v("45")]),a("br"),a("span",{staticClass:"line-number"},[n._v("46")]),a("br"),a("span",{staticClass:"line-number"},[n._v("47")]),a("br"),a("span",{staticClass:"line-number"},[n._v("48")]),a("br"),a("span",{staticClass:"line-number"},[n._v("49")]),a("br"),a("span",{staticClass:"line-number"},[n._v("50")]),a("br"),a("span",{staticClass:"line-number"},[n._v("51")]),a("br"),a("span",{staticClass:"line-number"},[n._v("52")]),a("br"),a("span",{staticClass:"line-number"},[n._v("53")]),a("br"),a("span",{staticClass:"line-number"},[n._v("54")]),a("br"),a("span",{staticClass:"line-number"},[n._v("55")]),a("br"),a("span",{staticClass:"line-number"},[n._v("56")]),a("br"),a("span",{staticClass:"line-number"},[n._v("57")]),a("br"),a("span",{staticClass:"line-number"},[n._v("58")]),a("br"),a("span",{staticClass:"line-number"},[n._v("59")]),a("br"),a("span",{staticClass:"line-number"},[n._v("60")]),a("br"),a("span",{staticClass:"line-number"},[n._v("61")]),a("br"),a("span",{staticClass:"line-number"},[n._v("62")]),a("br"),a("span",{staticClass:"line-number"},[n._v("63")]),a("br"),a("span",{staticClass:"line-number"},[n._v("64")]),a("br"),a("span",{staticClass:"line-number"},[n._v("65")]),a("br"),a("span",{staticClass:"line-number"},[n._v("66")]),a("br"),a("span",{staticClass:"line-number"},[n._v("67")]),a("br"),a("span",{staticClass:"line-number"},[n._v("68")]),a("br"),a("span",{staticClass:"line-number"},[n._v("69")]),a("br"),a("span",{staticClass:"line-number"},[n._v("70")]),a("br"),a("span",{staticClass:"line-number"},[n._v("71")]),a("br"),a("span",{staticClass:"line-number"},[n._v("72")]),a("br"),a("span",{staticClass:"line-number"},[n._v("73")]),a("br"),a("span",{staticClass:"line-number"},[n._v("74")]),a("br"),a("span",{staticClass:"line-number"},[n._v("75")]),a("br"),a("span",{staticClass:"line-number"},[n._v("76")]),a("br"),a("span",{staticClass:"line-number"},[n._v("77")]),a("br"),a("span",{staticClass:"line-number"},[n._v("78")]),a("br"),a("span",{staticClass:"line-number"},[n._v("79")]),a("br"),a("span",{staticClass:"line-number"},[n._v("80")]),a("br"),a("span",{staticClass:"line-number"},[n._v("81")]),a("br"),a("span",{staticClass:"line-number"},[n._v("82")]),a("br"),a("span",{staticClass:"line-number"},[n._v("83")]),a("br"),a("span",{staticClass:"line-number"},[n._v("84")]),a("br"),a("span",{staticClass:"line-number"},[n._v("85")]),a("br"),a("span",{staticClass:"line-number"},[n._v("86")]),a("br"),a("span",{staticClass:"line-number"},[n._v("87")]),a("br"),a("span",{staticClass:"line-number"},[n._v("88")]),a("br"),a("span",{staticClass:"line-number"},[n._v("89")]),a("br"),a("span",{staticClass:"line-number"},[n._v("90")]),a("br"),a("span",{staticClass:"line-number"},[n._v("91")]),a("br"),a("span",{staticClass:"line-number"},[n._v("92")]),a("br"),a("span",{staticClass:"line-number"},[n._v("93")]),a("br"),a("span",{staticClass:"line-number"},[n._v("94")]),a("br"),a("span",{staticClass:"line-number"},[n._v("95")]),a("br"),a("span",{staticClass:"line-number"},[n._v("96")]),a("br"),a("span",{staticClass:"line-number"},[n._v("97")]),a("br"),a("span",{staticClass:"line-number"},[n._v("98")]),a("br"),a("span",{staticClass:"line-number"},[n._v("99")]),a("br"),a("span",{staticClass:"line-number"},[n._v("100")]),a("br"),a("span",{staticClass:"line-number"},[n._v("101")]),a("br"),a("span",{staticClass:"line-number"},[n._v("102")]),a("br"),a("span",{staticClass:"line-number"},[n._v("103")]),a("br"),a("span",{staticClass:"line-number"},[n._v("104")]),a("br"),a("span",{staticClass:"line-number"},[n._v("105")]),a("br"),a("span",{staticClass:"line-number"},[n._v("106")]),a("br"),a("span",{staticClass:"line-number"},[n._v("107")]),a("br"),a("span",{staticClass:"line-number"},[n._v("108")]),a("br"),a("span",{staticClass:"line-number"},[n._v("109")]),a("br"),a("span",{staticClass:"line-number"},[n._v("110")]),a("br"),a("span",{staticClass:"line-number"},[n._v("111")]),a("br"),a("span",{staticClass:"line-number"},[n._v("112")]),a("br"),a("span",{staticClass:"line-number"},[n._v("113")]),a("br"),a("span",{staticClass:"line-number"},[n._v("114")]),a("br"),a("span",{staticClass:"line-number"},[n._v("115")]),a("br"),a("span",{staticClass:"line-number"},[n._v("116")]),a("br"),a("span",{staticClass:"line-number"},[n._v("117")]),a("br"),a("span",{staticClass:"line-number"},[n._v("118")]),a("br"),a("span",{staticClass:"line-number"},[n._v("119")]),a("br"),a("span",{staticClass:"line-number"},[n._v("120")]),a("br"),a("span",{staticClass:"line-number"},[n._v("121")]),a("br"),a("span",{staticClass:"line-number"},[n._v("122")]),a("br"),a("span",{staticClass:"line-number"},[n._v("123")]),a("br"),a("span",{staticClass:"line-number"},[n._v("124")]),a("br"),a("span",{staticClass:"line-number"},[n._v("125")]),a("br"),a("span",{staticClass:"line-number"},[n._v("126")]),a("br"),a("span",{staticClass:"line-number"},[n._v("127")]),a("br"),a("span",{staticClass:"line-number"},[n._v("128")]),a("br"),a("span",{staticClass:"line-number"},[n._v("129")]),a("br"),a("span",{staticClass:"line-number"},[n._v("130")]),a("br"),a("span",{staticClass:"line-number"},[n._v("131")]),a("br"),a("span",{staticClass:"line-number"},[n._v("132")]),a("br"),a("span",{staticClass:"line-number"},[n._v("133")]),a("br"),a("span",{staticClass:"line-number"},[n._v("134")]),a("br"),a("span",{staticClass:"line-number"},[n._v("135")]),a("br"),a("span",{staticClass:"line-number"},[n._v("136")]),a("br"),a("span",{staticClass:"line-number"},[n._v("137")]),a("br"),a("span",{staticClass:"line-number"},[n._v("138")]),a("br"),a("span",{staticClass:"line-number"},[n._v("139")]),a("br"),a("span",{staticClass:"line-number"},[n._v("140")]),a("br"),a("span",{staticClass:"line-number"},[n._v("141")]),a("br"),a("span",{staticClass:"line-number"},[n._v("142")]),a("br"),a("span",{staticClass:"line-number"},[n._v("143")]),a("br"),a("span",{staticClass:"line-number"},[n._v("144")]),a("br"),a("span",{staticClass:"line-number"},[n._v("145")]),a("br"),a("span",{staticClass:"line-number"},[n._v("146")]),a("br"),a("span",{staticClass:"line-number"},[n._v("147")]),a("br"),a("span",{staticClass:"line-number"},[n._v("148")]),a("br"),a("span",{staticClass:"line-number"},[n._v("149")]),a("br"),a("span",{staticClass:"line-number"},[n._v("150")]),a("br"),a("span",{staticClass:"line-number"},[n._v("151")]),a("br"),a("span",{staticClass:"line-number"},[n._v("152")]),a("br"),a("span",{staticClass:"line-number"},[n._v("153")]),a("br"),a("span",{staticClass:"line-number"},[n._v("154")]),a("br"),a("span",{staticClass:"line-number"},[n._v("155")]),a("br"),a("span",{staticClass:"line-number"},[n._v("156")]),a("br"),a("span",{staticClass:"line-number"},[n._v("157")]),a("br"),a("span",{staticClass:"line-number"},[n._v("158")]),a("br"),a("span",{staticClass:"line-number"},[n._v("159")]),a("br"),a("span",{staticClass:"line-number"},[n._v("160")]),a("br"),a("span",{staticClass:"line-number"},[n._v("161")]),a("br"),a("span",{staticClass:"line-number"},[n._v("162")]),a("br"),a("span",{staticClass:"line-number"},[n._v("163")]),a("br"),a("span",{staticClass:"line-number"},[n._v("164")]),a("br")])]),a("h3",{attrs:{id:"_3、手写线程池"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_3、手写线程池"}},[n._v("#")]),n._v(" 3、手写线程池")]),n._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[n._v('https://blog.csdn.net/cheidou123/article/details/78700302\npackage doThreadPool;\n \nimport java.util.ArrayList;\nimport java.util.HashSet;\nimport java.util.concurrent.BlockingQueue;\nimport java.util.concurrent.LinkedBlockingQueue;\n \nimport antlr.collections.List;\n \npublic class ThreadExcutor {\n   private volatile boolean RUNNING=true;\n   //阻塞队列\n   private static BlockingQueue<Runnable> queue=null;\n   //对于一个final变量，如果是基本数据类型的变量，则其数值一旦在初始化之后便不能更改；如果是引用类型的变量，则在对其初始化之后便不能再让其指向另一个对象。\n   private final HashSet<Worker> workers = new HashSet<Worker>();\n   \n   private final ArrayList<Thread> threadList = new ArrayList<Thread>();\n   \n   \n   int poolSize = 0;\n   \n   int coreSize = 0;\n \n   boolean shutdown = false;\n   \n   //构造函数,\n   public ThreadExcutor(int poolSize){\n       this.poolSize = poolSize;\n       queue = new LinkedBlockingQueue<Runnable>(poolSize);\n   }\n   \n   public void exec(Runnable runnable) {\n       if (runnable == null) throw new NullPointerException();\n       if(coreSize < poolSize){         \n           addThread(runnable);                \n       }else{\n           //System.out.println("offer" +  runnable.toString() + "   " + queue.size());\n           try {\n               queue.put(runnable);                //coreSize>poolSzie 加入阻塞队列中去\n           } catch (InterruptedException e) {\n               e.printStackTrace();\n           }\n       }\n   }\n   \n   public void addThread(Runnable runnable){\n       coreSize ++;                                 //正在工作的线程+1\n       Worker worker = new Worker(runnable);        //\n       workers.add(worker);                         \n       Thread t = new Thread(worker);              \n       threadList.add(t);                          \n       try {\n           t.start();\n       }catch (Exception e){\n           e.printStackTrace();\n       }\n \n   }\n \n   public void shutdown() {\n       RUNNING = false;\n       if(!workers.isEmpty()){\n           for (Worker worker : workers){\n               worker.interruptIfIdle();\n           }\n       }\n       shutdown = true;\n       Thread.currentThread().interrupt();\n   }\n\t\n   class  Worker implements Runnable{\n \n       public Worker(Runnable runnable){\n           queue.offer(runnable);                  //将这个runable将入到队列中去\n       }\n \n       @Override\n       public void run() {\n           while (true && RUNNING){\n               if(shutdown == true){\n                   Thread.interrupted();\n               }\n               Runnable task = null;\n               try {\n                   task = getTask();\n                   task.run();\n               } catch (InterruptedException e) {\n                   e.printStackTrace();\n               }\n           }\n       }\n \n       public Runnable getTask() throws InterruptedException {\n           return queue.take();                   \n       }\n \n       public void interruptIfIdle() {\n           for (Thread thread :threadList) {\n               System.out.println(thread.getName() + " interrupt");\n               thread.interrupt();\n           }\n       }\n\t\n}}\n')])]),n._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[n._v("1")]),a("br"),a("span",{staticClass:"line-number"},[n._v("2")]),a("br"),a("span",{staticClass:"line-number"},[n._v("3")]),a("br"),a("span",{staticClass:"line-number"},[n._v("4")]),a("br"),a("span",{staticClass:"line-number"},[n._v("5")]),a("br"),a("span",{staticClass:"line-number"},[n._v("6")]),a("br"),a("span",{staticClass:"line-number"},[n._v("7")]),a("br"),a("span",{staticClass:"line-number"},[n._v("8")]),a("br"),a("span",{staticClass:"line-number"},[n._v("9")]),a("br"),a("span",{staticClass:"line-number"},[n._v("10")]),a("br"),a("span",{staticClass:"line-number"},[n._v("11")]),a("br"),a("span",{staticClass:"line-number"},[n._v("12")]),a("br"),a("span",{staticClass:"line-number"},[n._v("13")]),a("br"),a("span",{staticClass:"line-number"},[n._v("14")]),a("br"),a("span",{staticClass:"line-number"},[n._v("15")]),a("br"),a("span",{staticClass:"line-number"},[n._v("16")]),a("br"),a("span",{staticClass:"line-number"},[n._v("17")]),a("br"),a("span",{staticClass:"line-number"},[n._v("18")]),a("br"),a("span",{staticClass:"line-number"},[n._v("19")]),a("br"),a("span",{staticClass:"line-number"},[n._v("20")]),a("br"),a("span",{staticClass:"line-number"},[n._v("21")]),a("br"),a("span",{staticClass:"line-number"},[n._v("22")]),a("br"),a("span",{staticClass:"line-number"},[n._v("23")]),a("br"),a("span",{staticClass:"line-number"},[n._v("24")]),a("br"),a("span",{staticClass:"line-number"},[n._v("25")]),a("br"),a("span",{staticClass:"line-number"},[n._v("26")]),a("br"),a("span",{staticClass:"line-number"},[n._v("27")]),a("br"),a("span",{staticClass:"line-number"},[n._v("28")]),a("br"),a("span",{staticClass:"line-number"},[n._v("29")]),a("br"),a("span",{staticClass:"line-number"},[n._v("30")]),a("br"),a("span",{staticClass:"line-number"},[n._v("31")]),a("br"),a("span",{staticClass:"line-number"},[n._v("32")]),a("br"),a("span",{staticClass:"line-number"},[n._v("33")]),a("br"),a("span",{staticClass:"line-number"},[n._v("34")]),a("br"),a("span",{staticClass:"line-number"},[n._v("35")]),a("br"),a("span",{staticClass:"line-number"},[n._v("36")]),a("br"),a("span",{staticClass:"line-number"},[n._v("37")]),a("br"),a("span",{staticClass:"line-number"},[n._v("38")]),a("br"),a("span",{staticClass:"line-number"},[n._v("39")]),a("br"),a("span",{staticClass:"line-number"},[n._v("40")]),a("br"),a("span",{staticClass:"line-number"},[n._v("41")]),a("br"),a("span",{staticClass:"line-number"},[n._v("42")]),a("br"),a("span",{staticClass:"line-number"},[n._v("43")]),a("br"),a("span",{staticClass:"line-number"},[n._v("44")]),a("br"),a("span",{staticClass:"line-number"},[n._v("45")]),a("br"),a("span",{staticClass:"line-number"},[n._v("46")]),a("br"),a("span",{staticClass:"line-number"},[n._v("47")]),a("br"),a("span",{staticClass:"line-number"},[n._v("48")]),a("br"),a("span",{staticClass:"line-number"},[n._v("49")]),a("br"),a("span",{staticClass:"line-number"},[n._v("50")]),a("br"),a("span",{staticClass:"line-number"},[n._v("51")]),a("br"),a("span",{staticClass:"line-number"},[n._v("52")]),a("br"),a("span",{staticClass:"line-number"},[n._v("53")]),a("br"),a("span",{staticClass:"line-number"},[n._v("54")]),a("br"),a("span",{staticClass:"line-number"},[n._v("55")]),a("br"),a("span",{staticClass:"line-number"},[n._v("56")]),a("br"),a("span",{staticClass:"line-number"},[n._v("57")]),a("br"),a("span",{staticClass:"line-number"},[n._v("58")]),a("br"),a("span",{staticClass:"line-number"},[n._v("59")]),a("br"),a("span",{staticClass:"line-number"},[n._v("60")]),a("br"),a("span",{staticClass:"line-number"},[n._v("61")]),a("br"),a("span",{staticClass:"line-number"},[n._v("62")]),a("br"),a("span",{staticClass:"line-number"},[n._v("63")]),a("br"),a("span",{staticClass:"line-number"},[n._v("64")]),a("br"),a("span",{staticClass:"line-number"},[n._v("65")]),a("br"),a("span",{staticClass:"line-number"},[n._v("66")]),a("br"),a("span",{staticClass:"line-number"},[n._v("67")]),a("br"),a("span",{staticClass:"line-number"},[n._v("68")]),a("br"),a("span",{staticClass:"line-number"},[n._v("69")]),a("br"),a("span",{staticClass:"line-number"},[n._v("70")]),a("br"),a("span",{staticClass:"line-number"},[n._v("71")]),a("br"),a("span",{staticClass:"line-number"},[n._v("72")]),a("br"),a("span",{staticClass:"line-number"},[n._v("73")]),a("br"),a("span",{staticClass:"line-number"},[n._v("74")]),a("br"),a("span",{staticClass:"line-number"},[n._v("75")]),a("br"),a("span",{staticClass:"line-number"},[n._v("76")]),a("br"),a("span",{staticClass:"line-number"},[n._v("77")]),a("br"),a("span",{staticClass:"line-number"},[n._v("78")]),a("br"),a("span",{staticClass:"line-number"},[n._v("79")]),a("br"),a("span",{staticClass:"line-number"},[n._v("80")]),a("br"),a("span",{staticClass:"line-number"},[n._v("81")]),a("br"),a("span",{staticClass:"line-number"},[n._v("82")]),a("br"),a("span",{staticClass:"line-number"},[n._v("83")]),a("br"),a("span",{staticClass:"line-number"},[n._v("84")]),a("br"),a("span",{staticClass:"line-number"},[n._v("85")]),a("br"),a("span",{staticClass:"line-number"},[n._v("86")]),a("br"),a("span",{staticClass:"line-number"},[n._v("87")]),a("br"),a("span",{staticClass:"line-number"},[n._v("88")]),a("br"),a("span",{staticClass:"line-number"},[n._v("89")]),a("br"),a("span",{staticClass:"line-number"},[n._v("90")]),a("br"),a("span",{staticClass:"line-number"},[n._v("91")]),a("br"),a("span",{staticClass:"line-number"},[n._v("92")]),a("br"),a("span",{staticClass:"line-number"},[n._v("93")]),a("br"),a("span",{staticClass:"line-number"},[n._v("94")]),a("br"),a("span",{staticClass:"line-number"},[n._v("95")]),a("br"),a("span",{staticClass:"line-number"},[n._v("96")]),a("br"),a("span",{staticClass:"line-number"},[n._v("97")]),a("br"),a("span",{staticClass:"line-number"},[n._v("98")]),a("br"),a("span",{staticClass:"line-number"},[n._v("99")]),a("br"),a("span",{staticClass:"line-number"},[n._v("100")]),a("br"),a("span",{staticClass:"line-number"},[n._v("101")]),a("br"),a("span",{staticClass:"line-number"},[n._v("102")]),a("br"),a("span",{staticClass:"line-number"},[n._v("103")]),a("br"),a("span",{staticClass:"line-number"},[n._v("104")]),a("br"),a("span",{staticClass:"line-number"},[n._v("105")]),a("br")])])])}),[],!1,null,null,null);s.default=t.exports}}]);
# JVM

------------

看到这里：https://toutiao.io/search?page=3&q=jvm&utf8=%E2%9C%93

这篇文章以下没有看：https://segmentfault.com/a/1190000021084737?hmsr=toutiao.io&utm_campaign=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io

这篇文章也不错：https://mp.weixin.qq.com/s/Z_PbwpRA6aZ-hX2OY1KMbA?

---

JVM的体系结构如下，其中GC的作用区是红色框框中的内容

   ![图片](https://txxs.github.io/pic/q&a/WX20210705-101618@2x.png)

或者这个：

   ![图片](https://txxs.github.io/pic/q&a/WX20210716-113420@2-6x.png)

### 一、JVM类的加载机制

>  问题来自：https://mp.weixin.qq.com/s/jhDgLnKodhmVeoBHp5IFCw
1. Java为什么能在不同的机器上运行？
    我们都知道 Java 源文件，通过编译器，能够生产相应的.Class 文件，也就是字节码文件，而字节码文件又通过 Java 虚拟机中的解释器，编译成特定机器上的机器码 。
    
    ![图片](https://txxs.github.io/pic/q&a/170867cb6af0a72e.png)
    
    每一种平台的解释器是不同的，但是实现的虚拟机是相同的，这也就是 Java 为什么能够跨平台的原因了，当一个程序从开始运行，这时虚拟机就开始实例化了，多个程序启动就会存在多个虚拟机实例。程序退出或者关闭，则虚拟机实例消亡，多个虚拟机实例之间数据不能共享。
    
    ![图片](https://txxs.github.io/pic/q&a/170867cb6af0a72f.png)

    这个也不错：
    
    ![图片](https://txxs.github.io/pic/q&a/WX20210716-113420@2-7x.png)
    
2. 什么是类的加载

	类的加载指的是将类的.class文件中的二进制数据读入到内存中，将其放在运行时数据区的方法区内，然后在堆区创建一个 java.lang.Class对象，用来封装类在方法区内的数据结构。类的加载的最终产品是位于堆区中的 Class对象， Class对象封装了类在方法区内的数据结构，并且向Java程序提供了访问方法区内的数据结构的接口。类加载器并不需要等到某个类被“首次主动使用”时再加载它，JVM规范允许类加载器在预料某个类将要被使用时就预先加载它，如果在预先加载的过程中遇到了.class文件缺失或存在错误，类加载器必须在程序首次主动使用该类时才报告错误（LinkageError错误）如果这个类一直没有被程序主动使用，那么类加载器就不会报告错误。 加载.class文件的方式：

		- 从本地系统中直接加载
		- 通过网络下载.class文件
		- 从zip，jar等归档文件中加载.class文件
		- 从专有数据库中提取.class文件
		- 将Java源文件动态编译为.class文件


3. 类加载机制

   ![图片](https://txxs.github.io/pic/q&a/WX20210705-101618@20a.png)

	- ```启动类加载器：Bootstrap ClassLoader```，负责加载存放在JDK\jre\lib(JDK代表JDK的安装目录，下同)下，或被-Xbootclasspath参数指定的路径中的，并且能被虚拟机识别的类库

	- ```扩展类加载器：Extension ClassLoader```，该加载器由sun.misc.Launcher$ExtClassLoader实现，它负责加载DK\jre\lib\ext目录中，或者由java.ext.dirs系统变量指定的路径中的所有类库（如javax.*开头的类），开发者可以直接使用扩展类加载器。

	- ```应用程序类加载器：Application ClassLoader```，该类加载器由sun.misc.Launcher$AppClassLoader来实现，它负责加载用户类路径（ClassPath）所指定的类，开发者可以直接使用该类加载器

	父类委托，先让父类加载器试图加载该类，只有在父类加载器无法加载该类时才尝试从自己的类路径中加载该类。缓存机制，缓存机制将会保证所有加载过的Class都会被缓存，当程序中需要使用某个Class时，类加载器先从缓存区寻找该Class，只有缓存区不存在，系统才会读取该类对应的二进制数据，并将其转换成Class对象，存入缓存区。这就是为什么修改了Class后，必须重启JVM，程序的修改才会生效。全盘负责，当一个类加载器负责加载某个Class时，该Class所依赖的和引用的其他Class也将由该类加载器负责载入，除非显示使用另外一个类加载器来载入。


> 以下内容来自：https://mp.weixin.qq.com/s/ih_pEy3AiUvxDX2dxqFoKw
> https://mp.weixin.qq.com/s?__biz=MzI4NDY5Mjc1Mg==&mid=2247483934&idx=1&sn=41c46eceb2add54b7cde9eeb01412a90&chksm=ebf6da61dc81537721d36aadb5d20613b0449762842f9128753e716ce5fefe2b659d8654c4e8&scene=21#wechat_redirect

4. 类加载过程

   ![图片](https://txxs.github.io/pic/q&a/WX20210705-101618@20b.png)

	一个类从被加载到虚拟机内存中开始，到从内存中卸载，整个生命周期需要经过七个阶段：加载 （Loading）、验证（Verification）、准备（Preparation）、解析（Resolution）、初始化 （Initialization）、使用（Using）和卸载（Unloading），其中验证、准备、解析三个部分统称为连接（Linking）。

	- 加载：通过一个类的全限定名来获取其定义的二进制字节流。将这个字节流所代表的静态存储结构转化为方法区的运行时数据结构。在Java堆中生成一个代表这个类的 java.lang.Class对象，作为对方法区中这些数据的访问入口。相对于类加载的其他阶段而言，加载阶段（准确地说，是加载阶段获取类的二进制字节流的动作）是可控性最强的阶段，因为开发人员既可以使用系统提供的类加载器来完成加载，也可以自定义自己的类加载器来完成加载。加载阶段完成后，虚拟机外部的二进制字节流就按照虚拟机所需的格式存储在方法区之中，而且在Java堆中也创建一个 java.lang.Class类的对象，这样便可以通过该对象访问方法区中的这些数据。

	- 验证：确保被加载的类的正确性。验证是连接阶段的第一步，这一阶段的目的是为了确保Class文件的字节流中包含的信息符合当前虚拟机的要求，并且不会危害虚拟机自身的安全。验证阶段是非常重要的，但不是必须的，它对程序运行期没有影响，如果所引用的类经过反复验证，那么可以考虑采用 -Xverifynone参数来关闭大部分的类验证措施，以缩短虚拟机类加载的时间。验证阶段大致会完成4个阶段的检验动作：
		- 文件格式验证：验证字节流是否符合Class文件格式的规范；例如：是否以 0xCAFEBABE开头、主次版本号是否在当前虚拟机的处理范围之内、常量池中的常量是否有不被支持的类型。
		- 元数据验证：对字节码描述的信息进行语义分析（注意：对比javac编译阶段的语义分析），以保证其描述的信息符合Java语言规范的要求；例如：这个类是否有父类，除了 java.lang.Object之外。
		- 字节码验证：通过数据流和控制流分析，确定程序语义是合法的、符合逻辑的。
		- 符号引用验证：确保解析动作能正确执行。

	- 准备：为类的静态变量分配内存，并将其初始化为默认值。准备阶段是正式为类变量分配内存并设置类变量初始值的阶段，这些内存都将在方法区中分配。对于该阶段有以下几点需要注意：
		- 这时候进行内存分配的仅包括类变量（static），而不包括实例变量，实例变量会在对象实例化时随着对象一块分配在Java堆中。
		- 这里所设置的初始值通常情况下是数据类型默认的零值（如0、0L、null、false等），而不是被在Java代码中被显式地赋予的值。

		- 假设一个类变量的定义为： publicstaticintvalue=3；那么变量value在准备阶段过后的初始值为0，而不是3，因为这时候尚未开始执行任何Java方法，而把value赋值为3的 publicstatic指令是在程序编译后，存放于类构造器 <clinit>（）方法之中的，所以把value赋值为3的动作将在初始化阶段才会执行。

		- 对基本数据类型来说，对于类变量（static）和全局变量，如果不显式地对其赋值而直接使用，则系统会为其赋予默认的零值，而对于局部变量来说，在使用前必须显式地为其赋值，否则编译时不通过。

		- 对于同时被static和final修饰的常量，必须在声明的时候就为其显式地赋值，否则编译时不通过；而只被final修饰的常量则既可以在声明时显式地为其赋值，也可以在类初始化时显式地为其赋值，总之，在使用前必须为其显式地赋值，系统不会为其赋予默认零值。

		-对于引用数据类型reference来说，如数组引用、对象引用等，如果没有对其进行显式地赋值而直接使用，系统都会为其赋予默认的零值，即null。如果在数组初始化时没有对数组中的各元素赋值，那么其中的元素将根据对应的数据类型而被赋予默认的零值。

		- 如果类字段的字段属性表中存在 ConstantValue属性，即同时被final和static修饰，那么在准备阶段变量value就会被初始化为ConstValue属性所指定的值。假设上面的类变量value被定义为： publicstaticfinalintvalue=3；译时Javac将会为value生成ConstantValue属性，在准备阶段虚拟机就会根据 ConstantValue的设置将value赋值为3。我们可以理解为static final常量在编译期就将其结果放入了调用它的类的常量池中。

	- 解析：把类中的符号引用转换为直接引用。解析阶段是虚拟机将常量池内的符号引用替换为直接引用的过程，解析动作主要针对类或接口、字段、类方法、接口方法、方法类型、方法句柄和调用点限定符7类符号引用进行。符号引用就是一组符号来描述目标，可以是任何字面量。直接引用就是直接指向目标的指针、相对偏移量或一个间接定位到目标的句柄。

	- 初始化：初始化，为类的静态变量赋予正确的初始值，JVM负责对类进行初始化，主要对类变量进行初始化。在Java中对类变量进行初始值设定有两种方式：
		- 声明类变量是指定初始值
		- 使用静态代码块为类变量指定初始值
		JVM初始化步骤

			- 假如这个类还没有被加载和连接，则程序先加载并连接该类
			- 假如该类的直接父类还没有被初始化，则先初始化其直接父类
			- 假如类中有初始化语句，则系统依次执行这些初始化语句

	- 结束生命周期：在如下几种情况下，Java虚拟机将结束生命周期
		- 执行了 System.exit()方法
		- 程序正常执行结束
		- 程序在执行过程中遇到了异常或错误而异常终止
		- 由于操作系统出现错误而导致Java虚拟机进程终止

	- 哪些情况需要立即初始化

		- 1）遇到new、getstatic、putstatic或invokestatic这四条字节码指令时，如果类型没有进行过初始化，则需要先触发其初始化阶段。
		- 2）使用java.lang.reflect包的方法对类型进行反射调用的时候，如果类型没有进行过初始化，则需要先触发其初始化。
		- 3）当初始化类的时候，如果发现其父类还没有进行过初始化，则需要先触发其父类的初始化。
		- 4）当虚拟机启动时，用户需要指定一个要执行的主类（包含main()方法的那个类），虚拟机会先初始化这个主类。
		- 5）当使用JDK 7新加入的动态语言支持时，如果一个java.lang.invoke.MethodHandle实例最后的解析结果为REF_getStatic、REF_putStatic、REF_invokeStatic、REF_newInvokeSpecial四种类型的方法句柄，并且这个方法句柄对应的类没有进行过初始化，则需要先触发其初始化。
		- 6）当一个接口中定义了JDK 8新加入的默认方法（被default关键字修饰的接口方法）时，如果有这个接口的实现类发生了初始化，那该接口要在其之前被初始化。

5. 类加载有三种方式：
	- 命令行启动应用时候由JVM初始化加载
	- 通过Class.forName()方法动态加载
	- 通过ClassLoader.loadClass()方法动态加载

6. Class.forName()和ClassLoader.loadClass()区别
	- Class.forName()：将类的.class文件加载到jvm中之外，还会对类进行解释，执行类中的static块；
	- ClassLoader.loadClass()：只干一件事情，就是将.class文件加载到jvm中，不会执行static中的内容,只有在newInstance才会去执行static块。
	- Class.forName(name,initialize,loader)带参函数也可控制是否加载static块。并且只有调用了newInstance()方法采用调用构造函数，创建类的对象 。

7. 双亲委派模型
	双亲委派模型的工作流程是：如果一个类加载器收到了类加载的请求，它首先不会自己去尝试加载这个类，而是把请求委托给父加载器去完成，依次向上，因此，所有的类加载请求最终都应该被传递到顶层的启动类加载器中，只有当父加载器在它的搜索范围中没有找到所需的类时，即无法完成该加载，子加载器才会尝试自己去加载该类。双亲委派机制:

		- 当 AppClassLoader加载一个class时，它首先不会自己去尝试加载这个类，而是把类加载请求委派给父类加载器ExtClassLoader去完成。
		- 当 ExtClassLoader加载一个class时，它首先也不会自己去尝试加载这个类，而是把类加载请求委派给BootStrapClassLoader```去完成。
		- 如果 BootStrapClassLoader加载失败（例如在 $JAVA_HOME/jre/lib里未查找到该class），会使用 ExtClassLoader来尝试加载；
		- 若ExtClassLoader也加载失败，则会使用 AppClassLoader来加载，如果 AppClassLoader也加载失败，则会报出异常 ClassNotFoundException。

	双亲委派模型意义：
		- 系统类防止内存中出现多份同样的字节码
		- 保证Java程序安全稳定运行
		
	类加载器自顶向下可以分为：
        - Bootstrap ClassLoader（启动类加载器）：默认会去加载 JAVA_HOME/lib 目录下的 jar；
        - Extention ClassLoader（扩展类加载器）：默认去加载 JAVA_HOME/lib/ext 目录下的 jar；
        - Application ClassLoader（应用程序类加载器）：比如我们的 Web 应用，会加载 Web 程序中 ClassPath 下的类；
        - User ClassLoader（用户自定义类加载器）：由用户自己定义。
    
      ![图片](https://txxs.github.io/pic/q&a/WX20210705-101618@20d.png)
       
	源码分析：
	```
	public Class<?> loadClass(String name)throws ClassNotFoundException {
        return loadClass(name, false);
	}

	protected synchronized Class<?> loadClass(String name, boolean resolve)throws ClassNotFoundException {
	        // 首先判断该类型是否已经被加载
	        Class c = findLoadedClass(name);
	        if (c == null) {
	            //如果没有被加载，就委托给父类加载或者委派给启动类加载器加载
	            try {
	                if (parent != null) {
	                     //如果存在父类加载器，就委派给父类加载器加载
	                    c = parent.loadClass(name, false);
	                } else {
	                //如果不存在父类加载器，就检查是否是由启动类加载器加载的类，通过调用本地方法native Class findBootstrapClass(String name)
	                    c = findBootstrapClass0(name);
	                }
	            } catch (ClassNotFoundException e) {
	             // 如果父类加载器和启动类加载器都不能完成加载任务，才调用自身的加载功能
	                c = findClass(name);
	            }
	        }
	        if (resolve) {
	            resolveClass(c);
	        }
	        return c;
	    }
	```
8. 自定义类加载器

	通常情况下，我们都是直接使用系统类加载器。但是，有的时候，我们也需要自定义类加载器。比如应用是通过网络来传输 Java类的字节码，为保证安全性，这些字节码经过了加密处理，这时系统类加载器就无法对其进行加载，这样则需要自定义类加载器来实现。自定义类加载器一般都是继承自ClassLoader类，从上面对loadClass方法来分析来看，我们只需要重写 findClass 方法即可。下面我们通过一个示例来演示自定义类加载器的流程：
	```
	public class MyClassLoader extends ClassLoader {
	    private String root;

	    protected Class<?> findClass(String name) throws ClassNotFoundException {
	        byte[] classData = loadClassData(name);
	        if (classData == null) {
	            throw new ClassNotFoundException();
	        } else {
	            return defineClass(name, classData, 0, classData.length);
	        }
	    }

	    private byte[] loadClassData(String className) {
	        String fileName = root + File.separatorChar
	                + className.replace('.', File.separatorChar) + ".class";
	        try {
	            InputStream ins = new FileInputStream(fileName);
	            ByteArrayOutputStream baos = new ByteArrayOutputStream();
	            int bufferSize = 1024;
	            byte[] buffer = new byte[bufferSize];
	            int length = 0;
	            while ((length = ins.read(buffer)) != -1) {
	                baos.write(buffer, 0, length);
	            }
	            return baos.toByteArray();
	        } catch (IOException e) {
	            e.printStackTrace();
	        }
	        return null;
	    }

	    public String getRoot() {
	        return root;
	    }

	    public void setRoot(String root) {
	        this.root = root;
	    }

	    public static void main(String[] args)  {

	        MyClassLoader classLoader = new MyClassLoader();
	        classLoader.setRoot("E:\\temp");

	        Class<?> testClass = null;
	        try {
	            testClass = classLoader.loadClass("com.neo.classloader.Test2");
	            Object object = testClass.newInstance();
	            System.out.println(object.getClass().getClassLoader());
	        } catch (ClassNotFoundException e) {
	            e.printStackTrace();
	        } catch (InstantiationException e) {
	            e.printStackTrace();
	        } catch (IllegalAccessException e) {
	            e.printStackTrace();
	        }
	    }
	}
	```
 > 这篇文章不错：https://mp.weixin.qq.com/s/ih_pEy3AiUvxDX2dxqFoKw
9. 知道new一个对象的过程吗？
   
      ![图片](https://txxs.github.io/pic/q&a/WX20210705-101618@20c.png)
      
       当虚拟机遇见 new 关键字时候，实现判断当前类是否已经加载。如果类没有加载，首先执行类的加载机制，加载完成后再为对象分配空间、初始化等。首先校验当前类是否被加载，如果没有加载，执行类加载机制；
   
       1. 加载：就是从字节码加载成二进制流的过程；
       2. 验证：当然加载完成之后，当然需要校验 class 文件是否符合虚拟机规范，跟我们接口请求一样，第一件事情当然是先做个参数校验了；
       3. 准备：为静态变量、常量赋默认值；
       4. 解析：把常量池中符号引用(以符号描述引用的目标)替换为直接引用(指向目标的指针或者句柄等)的过程；
       5. 初始化：执行 static 代码块 (cinit) 进行初始化，如果存在父类，先对父类进行初始化。
   
       注意：静态代码块是绝对线程安全的，只能隐式被 Java 虚拟机在类加载过程中初始化调用！(此处该有问题：static 代码块线程安全吗？)当类加载完成之后，紧接着就是对象分配内存空间和初始化的过程：
   
       1. 首先为对象分配合适大小的内存空间；
       2. 接着为实例变量赋默认值；
       3. 设置对象的头信息，对象 hashcode、GC 分代年龄、元数据信息等；
       4. 执行构造函数 (init) 初始化。


> 引用自：https://www.kancloud.cn/luoyoub/jvm-note/2255983

>  引用自：https://mp.weixin.qq.com/s/LcJkvrMMZU0-RrZvQXp_hw
10. HotSpot、JRockit与J9并称三大主流JVM：

    - HotSpot VM：从JDK1.3开始使用，到现在OpenJDK中也在使用。采用解释器与即时编译器并存的架构，拥有成熟的热点代码探测技术和GC机制。所谓热点探测技术有以下两个方面的体现：一、通过计数器找到最具编译价值的代码，触发即时编译或者栈上替换功能--机器指令（cpu可以直接执行的指令）本地缓存；二、即时编译器和解释器协同工作，在最优化的程序响应时间与最佳执行性能之间平衡。
    
         ![图片](https://txxs.github.io/pic/q&a/WX20210714-110743@21x.png)
    
      Java代码执行流程
      
         ![图片](https://txxs.github.io/pic/q&a/WX20210714-110743@22x.png)
         
            - 第一步：*.java-->*.class（编译期）
            - 第二步：从*.class文件将其中的内容加载到内存（类加载）（运行期）
            - 第三步：执行代码（运行期）
    
         ![图片](https://txxs.github.io/pic/q&a/WX20210714-110743@23x.png)
    
    - JRockit VM:最初属于BEA公司，2008年被Oracle收购。它专注于服务器端应用，所以不太关注程序的启动速度，里边不包含解析器，号称是世界上最快的JVM。它提供的Mission Control服务套件，是一组以极低的开销来监控、管理和分析生产环境中的应用程序的工具。它包括三个独立的应用程序：内存泄漏监测器（Memory Leak Detector）、JVM运行时分析器（Runtime Analyzer）和管理控制台（Management Console）。
    
    - J9 VM：J9是IBM开发的一个高度模块化的JVM，在许多平台上，IBM J9 VM都只能跟IBM产品一起使用。2017年IBM发布开源的OpenJ9，并贡献给 Eclipse 基金会。

11. static的加载顺序

    - 非继承： static代码块–>普通代码块–>类构造方法。
    - 继承：父类static代码块–>子类static代码块–>父类普通代码块–>父类构造方法–>子类普通代码块–>子类构造方法。
    
12. Java 进程究竟能创建多少线程，到底有哪些因素决定了能创建多少线程？

    /proc/sys/vm/max_map_count，默认值是 65530，可以通过修改上面的文件来改变这个阈值，如果要修改或者查看可以通过/proc/sys/kernel/threads-max来操作， 这个值是受到物理内存的限制，在fork_init的时候就计算好了。

13. 为什么要使用PC寄存器记录当前线程的执行地址呢？
    JVM的多线程是通过CPU时间片轮转（即线程轮流切换并分配处理器执行时间）算法来实现的。也就是说，某个线程在执行过程中可能会因为时间片耗尽而被挂起，而另一个线程获取到时间片开始执行。当被挂起的线程重新获取到时间片的时候，它要想从被挂起的地方继续执行，就必须知道它上次执行到哪个位置，这时候就需要PC寄存器来记录某个线程的字节码执行位置，如果虚拟机是单线程也就没必要用程序计数器记录每个线程的位置了。

14. PC寄存器为什么会被设定为线程私有呢？
    由于jvm的多线程是通过线程轮流切换并分配处理器执行时间的方式来实现的，在任何一个确定的时刻，一个处理器都只会执行一条线程中的指令。因此为了能够准确的记录各个线程正在执行的当前字节码指令地址，最好的办法自然就是为每一个线程都分配一个PC寄存器。这样各条线程之间计数器互不影响，独立存储。

15. Java方法有两种返回函数的方式
    一种是正常的函数返回，使用return指令（包含void返回类型）;一种是抛出异常（指的是未处理的异常，如果是try...catch过了，算第一种）。不管使用哪种方式，都会导致栈帧出栈。不同线程中所包含的栈帧是不允许存在互相引用的，即不可能在一个栈帧之中引用另外一个线程的栈帧。

> 引用自： https://blog.csdn.net/wowwilliam0/article/details/81383676
16. Class文件结构
  
    Class文件是一组以8字节为基础单位的二进制流，各个数据项目严格按照顺序紧凑排列在class文件中，中间没有任何分隔符，这使得class文件中存储的内容几乎是全部程序运行的程序。在class文件中，主要分为魔数、Class文件的版本号、常量池、访问标志、类索引（还包括父类索引和接口索引集合）、字段表集合、方法表集合、属性表集合。

17. Java对象的组成

    - 对象头：Mark Word、指向类的指针、数组长度（只有数组对象才有）。
    - 实例数据：对象的实例数据就是在java代码中能看到的属性和他们的值。
    - 对齐填充字节：因为JVM要求java的对象占的内存大小应该是8bit的倍数，所以后面有几个字节用于把对象的大小补齐至8bit的倍数，没有特别的功能。
    
    ![图片](https://txxs.github.io/pic/q&a/WX20210716-113420@2-9x.png)

> 这篇文章不错：https://segmentfault.com/a/1190000020540570?hmsr=toutiao.io&utm_campaign=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io
18. Java 对象的访问

    - 访问方式：直接指针访问和句柄访问
    - 访问效率：直接指针访问效率高（hotspot采用这种方式）
    - 垃圾回收：句柄访问效率高，垃圾回收只用更新句柄池，而直接指针访问方式则要更新 reference地址
    
    - 以下两个知识点来自：https://mp.weixin.qq.com/s/lryDeCfiacRxCMpzEmyoLA
    - 句柄： 如果使用句柄的话，那么Java堆中将会划分出一块内存来作为句柄池，reference 中存储的就是对象的句柄地址，而句柄中包含了对象实例数据与类型数据各自的具体地址信息；
    - 直接指针： 如果使用直接指针访问，那么 Java 堆对象的布局中就必须考虑如何放置访问类型数据的相关信息，而reference 中存储的直接就是对象的地址。
    
19. 后端编译优化

    https://mp.weixin.qq.com/s/GO2fAeGgaB2jIC02gWp5Aw
    
20. ClassLoader的工作原理
    类加载分为装载、链接、初始化三步。
    
    装载：通过类的全限定名和ClassLoader加载类，主要是将指定的.class文件加载至JVM。当类被加载以后，在JVM内部就以“类的全限定名+ClassLoader实例ID”来标明类。在内存中，ClassLoader实例和类的实例都位于堆中，它们的类信息都位于方法区。装载过程采用了一种被称为“双亲委派模型（Parent Delegation Model）”的方式，当一个ClassLoader要加载类时，它会先请求它的双亲ClassLoader（其实这里只有两个ClassLoader，所以称为父ClassLoader可能更容易理解）加载类，而它的双亲ClassLoader会继续把加载请求提交再上一级的ClassLoader，直到启动类加载器。只有其双亲ClassLoader无法加载指定的类时，它才会自己加载类。双亲委派模型是JVM的第一道安全防线，它保证了类的安全加载，这里同时依赖了类加载器隔离的原理：不同类加载器加载的类之间是无法直接交互的，即使是同一个类，被不同的ClassLoader加载，它们也无法感知到彼此的存在。这样即使有恶意的类冒充自己在核心包（例如java.lang）下，由于它无法被启动类加载器加载，也造成不了危害。
    由此也可见，如果用户自定义了类加载器，那就必须自己保障类加载过程中的安全。
    
    链接：链接的任务是把二进制的类型信息合并到JVM运行时状态中去。
    链接分为以下三步：验证：校验.class文件的正确性，确保该文件是符合规范定义的，并且适合当前JVM使用。准备：为类分配内存，同时初始化类中的静态变量赋值为默认值。解析（可选）：主要是把类的常量池中的符号引用解析为直接引用，这一步可以在用到相应的引用时再解析。
    
    初始化：初始化类中的静态变量，并执行类中的static代码、构造函数。

21. 类初始化的时机：
    JVM规范严格定义了何时需要对类进行初始化：
    
        - 通过new关键字、反射、clone、反序列化机制实例化对象时。
        - 调用类的静态方法时。
        - 使用类的静态字段或对其赋值时。
        - 通过反射调用类的方法时。
        - 初始化该类的子类时（初始化子类前其父类必须已经被初始化）。
        - JVM启动时被标记为启动类的类（简单理解为具有main方法的类）。
        

> 引用自：https://mp.weixin.qq.com/s/tsHR_ZkbrBpKYIQy9mde1A
22. VM在什么情况下会加载一个类？

	也就是说，啥时候会从“.class”字节码文件中加载这个类到JVM内存里来。其实答案非常简单，就是在你的代码中用到这个类的时候。首先你的代码中包含“main()”方法的主类一定会在JVM进程启动之后被加载到内存，开始执行你的“main()”方法中的代码。接着遇到你使用了别的类，比如“ReplicaManager”，此时就会从对应的“.class”字节码文件加载对应的类到内存里来。

23. 什么时候会初始化一个类？

	一般来说有以下一些时机：比如“new ReplicaManager()”来实例化类的对象了，此时就会触发类的加载到初始化的全过程，把这个类准备好，然后再实例化一个对象出来；或者是包含“main()”方法的主类，必须是立马初始化的。此外，这里还有一个非常重要的规则，就是如果初始化一个类的时候，发现他的父类还没初始化，那么必须先初始化他的父类。



> 引用自：https://droidyue.com/blog/2019/01/06/how-java-handle-uncaught-exceptions/?hmsr=toutiao.io&utm_campaign=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io
24. 线程发生了未捕获异常，JVM怎么处理

	分发Throwable实例：当线程A中出现了未捕获异常时，JVM会调用线程A的dispatchUncaughtException(Throwable)方法。

	获取未捕获异常处理者：每个线程会有一个变量(uncaughtExceptionHandler)来保存未捕获异常的处理者；在线程需要确定Throwable分发目标的处理者时，优先获取当前线程中uncaughtExceptionHandler变量；如果出问题线程的uncaughtExceptionHandler为null（即没有显式设置异常处理者），则使用自己所在的ThreadGroup来作为未捕获异常处理者。

	如果Throwable分发给ThreadGroup：ThreadGroup会尝试转给它的父ThreadGroup（如果存在的话）；如果上面没有找到对应的ThreadGroup，则尝试获取Thread.getDefaultUncaughtExceptionHandler()并分发。


> 引用自：https://blog.csdn.net/cool_summer_moon/article/details/105643109
25. 死锁分析，jstack命令

	1. 现象：应用占用cpu高，gc无明显异常
	2. 分析：我们使用jps查找进程，再用jstack dump线程日志信息；我们全文搜索【deadlock】关键字，可以看到对象的信息和线程的信息，继续分析可以看到具体的代码是哪行有问题。


> 引用自：https://blog.csdn.net/cool_summer_moon/article/details/105619353，这篇文章也不错：https://www.jb51.net/article/195797.htm
26. CPU占满分析
	1. top命令查看cpu占满的进程pid
	2. top -Hp pid 找到cpu占满的线程tip
	3. printf ‘%x’ tid 获取16进制的线程num
	4. jstack tid | grep -A 30 num (或者dump到文本进行分析)


> 引用自：https://www.jb51.net/article/194336.htm
27. 内存泄露分析，jmap命令（用于产生快照数据）

	怎么发现？频繁gc但是堆内存降不下来，进程内存爆了就有可能是发生内存泄漏了。
	1. dump heap。JDK自带的jmap工具，可以做这件事情。它的执行方法是：jmap -dump:format=b,file=heap.bin <pid> 。format=b的含义是，dump出来的文件时二进制格式。file-heap.bin的含义是，dump出来的文件名是heap.bin。<pid>就是JVM的进程号。
	2. 推荐Memory Analyzer 。Memory Analyzer，简称MAT，快速计算每个对象占用的内存大小、对象之间的引用关系。很容易看出，char[]的数量出其意料的多，占用90%以上的内存 。
	3. 使用Path To GC Root功能，找到该char[]的引用路径，发现String对象是被一个HashMap中引用的 。
	4. 放到HashMap中明明是split之后的String小对象，怎么会占用那么大空间呢？难道是String类的split方法有问题？

> 引用自：https://zhuanlan.zhihu.com/p/51909016
28. JVM之类的热替换原理

	JVM原生支持的类热替换的一种方法，其实就是利用Instrumention 和 ClassFileTransformer 来达到真正类的热替换。所谓类的热替换，本质上，就是触发了类的重新加载，并在类加载过程中，通过Hook方法，修改类的字节码，并基于修改后的字节码，重新初始化类而已。
	热替换的核心就在于Instrumentation的两个方法：
	```
	 void addTransformer(ClassFileTransformer transformer, boolean canRetransform);
	 void retransformClasses(Class<?>... classes) throws UnmodifiableClassException;
	```
	addTransformer（）用来注册类的修改器；retransformClasses（）会让类重新加载，从而使得注册的类修改器能够重新修改类的字节码。check_shared_class_file_load_hook（）中会解析新返回的类字节码，构造出新的类new_ik，最后，基于修改后的字节码构造出来的新类new_ik 会被返回给上一层，完成类的链接等任务，最终实现了类的热替换。


> 引用自：https://mp.weixin.qq.com/s/JdgkZUyeyaIdtsiKlxz3wg
29. 字符串对象在JVM中是如何存放的
   
    	字符串对象在JVM中可能有两个存放的位置：字符串常量池或堆内存。
    
    		- 使用常量字符串初始化的字符串对象，它的值存放在字符串常量池中
    		- 使用字符串构造方法创建的字符串对象，它的值存放在堆内存中
    
    	String提供了一个API——java.lang.String.intern()，这个API可以手动将一个字符串对象的值转移到字符串常量池中。在1.7之前，字符串常量池是在PermGen区域，这个区域的大小是固定的——不能在运行时根据需要扩大，也不能被垃圾收集器回收，因此如果程序中有太多的字符串调用了intern方法的话，就可能造成OOM。在1.7以后，字符串常量池移到了堆内存中，并且可以被垃圾收集器回收，这个改动降低了字符串常量池OOM的风险。
    
    
    	字符串常量池在JVM内部就是一个HashTable，也就是上面代码中的StringTable。在Java应用恰当得使用String.intern()方法有助于节省内存空间，但是在使用的时候，也需要注意，因为StringTable的大小是固定的，如果常量池中的字符串过多，会影响程序运行效率。

> 引用自：https://mp.weixin.qq.com/s/lryDeCfiacRxCMpzEmyoLA
30. 对象的创建过程（更详细）

	①类加载检查： 虚拟机遇到一条 new 指令时，首先将去检查这个指令的参数是否能在常量池中定位到这个类的符号引用，并且检查这个符号引用代表的类是否已被加载过、解析和初始化过。如果没有，那必须先执行相应的类加载过程。

	②分配内存： 在类加载检查通过后，接下来虚拟机将为新生对象分配内存。对象所需的内存大小在类加载完成后便可确定，为对象分配空间的任务等同于把一块确定大小的内存从 Java 堆中划分出来。分配方式有 “指针碰撞” 和 “空闲列表” 两种，选择那种分配方式由 Java 堆是否规整决定，而Java堆是否规整又由所采用的垃圾收集器是否带有压缩整理功能决定。（指针碰撞：如果Java堆的内存是规整，即所有用过的内存放在一边，而空闲的的放在另一边。分配内存时将位于中间的指针指示器向空闲的内存移动一段与对象大小相等的距离，这样便完成分配内存工作。空闲列表：如果Java堆的内存不是规整的，则需要由虚拟机维护一个列表来记录那些内存是可用的，这样在分配的时候可以从列表中查询到足够大的内存分配给对象，并在分配后更新列表记录。）

	内存分配的两种方式：（补充内容，需要掌握）

	选择以上两种方式中的哪一种，取决于 Java 堆内存是否规整。而 Java 堆内存是否规整，取决于 GC 收集器的算法是"标记-清除"，还是"标记-整理"（也称作"标记-压缩"），值得注意的是，复制算法内存也是规整的

	在创建对象的时候有一个很重要的问题，就是线程安全，因为在实际开发过程中，创建对象是很频繁的事情，作为虚拟机来说，必须要保证线程是安全的，通常来讲，虚拟机采用两种方式来保证线程安全：

		- CAS+失败重试： CAS 是乐观锁的一种实现方式。所谓乐观锁就是，每次不加锁而是假设没有冲突而去完成某项操作，如果因为冲突失败就重试，直到成功为止。虚拟机采用 CAS 配上失败重试的方式保证更新操作的原子性。
		- TLAB： 为每一个线程预先在Eden区分配一块儿内存，JVM在给线程中的对象分配内存时，首先在TLAB分配，当对象大于TLAB中的剩余内存或TLAB的内存已用尽时，再采用上述的CAS进行内存分配（TLAB的全称是Thread Local Allocation Buffer，即线程本地分配缓存区，这是一个线程专用的内存分配区域。TLAB的本质其实是三个指针管理的区域：start，top 和 end，每个线程都会从Eden分配一块空间，例如说100KB，作为自己的TLAB，其中 start 和 end 是占位用的，标识出 eden 里被这个 TLAB 所管理的区域，卡住eden里的一块空间不让其它线程来这里分配。）

	③初始化零值： 内存分配完成后，虚拟机需要将分配到的内存空间都初始化为零值（不包括对象头），这一步操作保证了对象的实例字段在 Java 代码中可以不赋初始值就直接使用，程序能访问到这些字段的数据类型所对应的零值。

	④设置对象头： 初始化零值完成之后，虚拟机要对对象进行必要的设置，例如这个对象是那个类的实例、如何才能找到类的元数据信息、对象的哈希吗、对象的 GC 分代年龄等信息。 这些信息存放在对象头中。 另外，根据虚拟机当前运行状态的不同，如是否启用偏向锁等，对象头会有不同的设置方式。

	⑤执行 init 方法： 在上面工作都完成之后，从虚拟机的视角来看，一个新的对象已经产生了，但从 Java 程序的视角来看，对象创建才刚开始，<init> 方法还没有执行，所有的字段都还为零。所以一般来说，执行 new 指令之后会接着执行 <init> 方法，把对象按照程序员的意愿进行初始化，这样一个真正可用的对象才算完全产生出来。

31. JVM虚拟机栈中局部变量表存放的是什么

	局部变量表主要存放了编译器可知的各种数据类型（boolean、byte、char、short、int、float、long、double）、对象引用（reference类型，它不同于对象本身，可能是一个指向对象起始地址的引用指针，也可能是指向一个代表对象的句柄或其他与此对象相关的位置）。

### 二、JVM内存结构

1. 一个线程OOM后，其他线程还能运行吗？

    原文：https://blog.csdn.net/qq_33589510/article/details/118306769
    
    OOM分很多类型，主要分为以下三种：
    
    > 堆溢出（“java.lang.OutOfMemoryError: Java heap space”）
    > 永久代溢出（“java.lang.OutOfMemoryError:Permgen space”）
    > 不能创建线程（“java.lang.OutOfMemoryError:Unable to create new native thread”）
    
        - 堆溢出：Java堆内存的OOM是实际应用中最常见的内存溢出异常场景。出现Java堆内存溢出时，异常堆栈信息“java.lang.OutOfMemoryError”会跟随进一步提示“Java heap space”。那既然发生了，如何解决这个内存区域的异常呢？一般先通过内存映像分析工具（如jprofile）对Dump出来的堆转储快照进行分析。第一步首先确认内存中导致OOM的对象是否是必要的，即先分清楚到底是内存泄漏（Memory Leak）还是内存溢出（Memory Overflow）。若是内存泄漏，可查看泄漏对象到GC Roots的引用链，找到泄漏对象是通过怎样的引用路径、与哪些GC Roots相关联，才导致垃圾收集器无法回收它们，根据泄漏对象的类型信息以及它到GC Roots引用链的信息，一般可以比较准确地定位到这些对象创建的位置，进而找出产生内存泄漏的代码的具体位置。若不是内存泄漏，即就是内存中的对象确实都必须存活，则应：1.检查JVM堆参数（-Xmx与-Xms）的设置，与机器内存对比，看是否还有向上调整的空间；2.再检查代码是否存在某些对象生命周期过长、持有状态时间过长、存储结构设计不合理等情况，尽量减少程序运 行期的内存消耗。以上是处理Java堆内存问题的简略思路。
    
        - 栈溢出：堆的使用大小，突然抖动！说明当一个线程抛OOM后，它所占据的内存资源会全部被释放掉，而不会影响其他线程的正常运行！所以一个线程溢出后，进程里的其他线程还能照常运行。发生OOM的线程一般情况下会死亡，也就是会被终结掉，该线程持有的对象占用的heap都会被gc了，释放内存。因为发生OOM之前要进行gc，就算其他线程能够正常工作，也会因为频繁gc产生较大的影响。堆溢出和栈溢出，结论是一样的。
    
        - 本地方法栈溢出：由于HotSpot JVM并不区分虚拟机栈和本地方法栈，因此HotSpot的-Xoss参数（设置本地方法栈的大小）虽然存在，但无任何效果，栈容量只能由-Xss参数设定。关于虚拟机栈和本地方法栈，《Java虚拟机规范》描述如下异常：若线程请求的栈深度大于虚拟机所允许的最大深度，将抛出StackOverflowError异常。若虚拟机的栈内存允许动态扩展，当扩展栈容量无法申请到足够的内存时，将抛出 OutOfMemoryError异常《Java虚拟机规范》明确允许JVM实现自行选择是否支持栈的动态扩展，而HotSpot虚拟机的选择是不支持扩展，所以除非在创建线程申请内存时就因无法获得足够内存而出现OOM，否则在线程运行时是不会因为扩展而导致内存溢出的，只会因为栈容量无法容纳新的栈帧而导致StackOverflowError。
    
        - 方法区和运行时常量池溢出：运行时常量池是方法区的一部分，所以这两个区域的溢出测试可以放到一起。HotSpot从JDK 7开始逐步“去永久代”，在JDK 8中完全使用元空间代替永久代，那么方法区使用“永久代”还是“元空间”来实现，对程序有何影响呢。String::intern()是一个本地方法：若字符串常量池中已经包含一个等于此String对象的字符串，则返回代表池中这个字符串的String对象的引用；否则，会将此String对象包含的字符串添加到常量池，并且返回此String对象的引用。限制永久代的大小，即可间接限制其中常量池的容量，
    
    此题的答案为一个线程溢出后，进程里的其他线程还能照常运行。注意了，这个例子我只演示了堆溢出的情况。如果是栈溢出，结论也是一样的，大家可自行通过代码测试。总结：其实发生OOM的线程一般情况下会死亡，也就是会被终结掉，该线程持有的对象占用的heap都会被gc了，释放内存。因为发生OOM之前要进行gc，就算其他线程能够正常工作，也会因为频繁gc产生较大的影响。

> 问题来自：https://mp.weixin.qq.com/s/jhDgLnKodhmVeoBHp5IFCw    
2. JVM的虚拟线程都有哪些

    这里所说的线程指程序执行过程中的一个线程实体。JVM 允许一个应用并发执行多个线程 。Hotspot JVM 中的 Java 线程与原生操作系统线程有直接的映射关系。当线程本地存储、缓冲区分配、同步对象、栈、程序计数器等准备好以后，就会创建一个操作系统原生线程。Java 线程结束，原生线程随之被回收。操作系统负责调度所有线程，并把它们分配到任何可用的 CPU 上。当原生线程初始化完毕，就会调用 Java 线程的 run() 方法。当线程结束时，会释放原生线程和 Java 线程的所有资源。
    Hotspot JVM 后台运行的系统线程主要有下面几个：

        - 虚拟机线程:这个线程等待 JVM 到达安全点操作出现。这些操作必须要在独立的线程里执行，因为当堆修改无法进行时，线程都需要 JVM位于安全点。这些操作的类型有：stop-the-world 垃圾回收、线程栈dump、线程暂停、线程偏向锁（biased  locking）解除。
        - 周期性任务线程:这线程负责定时器事件（也就是中断），用来调度周期性操作的执行。
        - GC 线程  :这些线程支持 JVM 中不同的垃圾回收活动。
        - 编译器线程:这些线程在运行时将字节码动态编译成本地平台相关的机器码。
        - 信号分发线程:这个线程接收发送到 JVM 的信号并调用适当的 JVM 方法处理。
> 问题来自：https://mp.weixin.qq.com/s/jhDgLnKodhmVeoBHp5IFCw         
3. JVM内存概览
    
    ![图片](https://txxs.github.io/pic/q&a/170867cb6af0a72g.png)
        - JVM 内存区域主要分为线程私有区域【程序计数器、虚拟机栈、本地方法区】、线程共享区域【JAVA 堆、方法区】、直接内存。
        - 线程私有数据区域生命周期与线程相同, 依赖用户线程的启动/结束 而 创建/销毁(在 HotspotVM 内, 每个线程都与操作系统的本地线程直接映射, 因此这部分内存区域的存/否跟随本地线程的生/死对应)。
        - 线程共享区域随虚拟机的启动/关闭而创建/销毁。
         
    ![图片](https://txxs.github.io/pic/q&a/70867cb6af0a72h.png)
        
    - ```程序计数器( 线程私有）```
        - 一块较小的内存空间, 是当前线程所执行的字节码的行号指示器，每条线程都要有一个独立的程序计数器，这类内存也称为“线程私有”的内存。
        - 正在执行 java 方法的话，计数器记录的是虚拟机字节码指令的地址（当前指令的地址）。如果还是 Native 方法，则为空。
        - 这个内存区域是唯一一个在虚拟机中没有规定任OutOfMemoryError 情况的区域。
    
    - ```JAVA虚拟机栈( 线程私有)```
        - 是描述java方法执行的内存模型，每个方法在执行的同时都会创建一个栈帧（Stack Frame）用于存储局部变量表、操作数栈、动态链接、方法出口等信息。每一个方法从调用直至执行完成的过程，就对应着一个栈帧在虚拟机栈中入栈到出栈的过程。
        - 栈帧（ Frame）是用来存储数据和部分过程结果的数据结构，同时也被用来处理动态链接(Dynamic Linking)、 方法返回值和异常分派（ Dispatch Exception）。栈帧随着方法调用而创建，随着方法结束而销毁——无论方法是正常完成还是异常完成（抛出了在方法内未被捕获的异常）都算作方法结束。
    
        ![图片](https://txxs.github.io/pic/q&a/170867cb6af0a72i.png)
    
    - ```本地方法区(线程私有）```
        - 本地方法区和Java Stack(虚拟机栈)作用类似, 区别是虚拟机栈为执行Java方法服务, 而本地方法栈则为Native方法服务, 如果一个VM实现使用 C-linkage 模型来支持 Native 调用, 那么该栈将会是一个C 栈，但 HotSpot VM 直接就把本地方法栈和虚拟机栈合二为一。
    
    - ```堆（Heap- 线程共享）运行时数据区```
        - 是被线程共享的一块内存区域，创建的对象和数组都保存在Java堆内存中，也是垃圾收集器进行垃圾收集的最重要的内存区域。由于现代VM采用分代收集算法, 因此Java堆从GC的角度还可以细分为: 新生代(Eden区、From Survivor区 和To Survivor区 )和老年代(jdk1.7)。
    
    - ```方法区/ 永久代 （线程共享）```
        - 即我们常说的永久代(Permanent Generation), 用于存储被 JVM 加载的类信息、常量、静态变量、即时编译器编译后的代码等数据. HotSpot VM把GC分代收集扩展至方法区, 即使用Java堆的永久代来实现方法区, 这样 HotSpot 的垃圾收集器就可以像管理 Java 堆一样管理这部分内存,而不必为方法区开发专门的内存管理器(永久带的内存回收的主要目标是针对常量池的回收和类型的卸载, 因此收益一般很小)。
    
    - ```运行时常量池```
        - （Runtime Constant Pool）是方法区的一部分。Class 文件中除了有类的版本、字段、方法、接口等描述等信息外，还有一项信息是常量池（Constant Pool Table），用于存放编译期生成的各种字面量和符号引用，这部分内容将在类加载后存放到方法区的运行时常量池中。Java 虚拟机对 Class 文件的每一部分（自然也包括常量池）的格式都有严格的规定，每一个字节用于存储哪种数据都必须符合规范上的要求，这样才会被虚拟机认可、装载和执行。
    
    - ```直接内存```
        - 直接内存并不是 JVM 运行时数据区的一部分, 但也会被频繁的使用: 在 JDK 1.4 引入的 NIO 提供了基于 Channel 与 Buffer 的 IO 方式, 它可以使用 Native 函数库直接分配堆外内存, 然后使用DirectByteBuffer 对象作为这块内存的引用进行操作， 这样就避免了在 Java堆和 Native 堆中来回复制数据, 因此在一些场景中可以显著提高性能。
        
4. Java堆从GC的角度还可以细分为: 新生代(Eden区、From Survivor区和To Survivor区)和老年代

     ![图片](https://txxs.github.io/pic/q&a/170867cb6af0a72k.png)

    - ```新生代```

        - 是用来存放新生的对象。一般占据堆的1/3空间。由于频繁创建对象，所以新生代会频繁触发MinorGC 进行垃圾回收。新生代又分为 Eden 区、ServivorFrom、ServivorTo 三个区。
        - Eden区：Java新对象的出生地（如果新创建的对象占用内存很大，则直接分配到老年代）。当Eden区内存不够的时候就会触发MinorGC，对新生代区进行一次垃圾回收。
        - ServivorFrom：上一次 GC 的幸存者，作为这一次 GC 的被扫描者。
        - ServivorTo：保留了一次 MinorGC 过程中的幸存者。
        - MinorGC 的过程：（复制->清空->互换）MinorGC 采用复制算法。
        - eden、servicorFrom复制到ServicorTo，年龄+1：首先，把Eden和ServivorFrom区域中存活的对象复制到 ServicorTo区域（如果有对象的年龄以及达到了老年的(默认15岁，可以通过-XXMaxTenuringThreshold设置)，则赋值到老年代区），同时把这些对象的年龄+1（如果 ServicorTo 不够位置了就放到老年区）。

    - ```老年代```
        - 主要存放应用程序中生命周期长的内存对象。
        - 老年代的对象比较稳定，所以MajorGC不会频繁执行。在进行MajorGC前一般都先进行了一次MinorGC，使得有新生代的对象晋身入老年代，导致空间不够用时才触发。当无法找到足够大的连续空间分配给新创建的较大对象时也会提前触发一次MajorGC 进行垃圾回收腾出空间。
        - MajorGC采用标记清除算法：首先扫描一次所有老年代，标记出存活的对象，然后回收没有标记的对象。MajorGC的耗时比较长，因为要扫描再回收。MajorGC会产生内存碎片，为了减少内存损耗，我们一般需要进行合并或者标记出来方便下次直接分配。当老年代也满了装不下的时候，就会抛出 OOM（Out of Memory）异常。

    - ```永久代```
        -指内存的永久保存区域，主要存放 Class 和 Meta（元数据）的信息,Class 在被加载的时候被放入永久区域，它和和存放实例的区域不同,GC 不会在主程序运行期对永久区域进行清理。所以这也导致了永久代的区域会随着加载的 Class 的增多而胀满，最终抛出 OOM 异常。
    
    - ```JAVA8 与元数据```
        - 在Java8中，永久代已经被移除，被一个称为“元数据区”（元空间）的区域所取代。元空间的本质和永久代类似，元空间与永久代之间最大的区别在于：元空间并不在虚拟机中，而是使用本地内存。因此，默认情况下，元空间的大小仅受本地内存限制。类的元数据放入 nativememory, 字符串池和类的静态变量放入 java 堆中，这样可以加载多少类的元数据就不再由MaxPermSize 控制, 而由系统的实际可用空间来控制。        
 
> 以下来自于：https://mp.weixin.qq.com/s/1S0M_nf2RL2wzh815Z09jQ       
5. 内存分配策略是什么样子的？
 
 	1. 优先分配到Eden；
 	2. 大对象直接分配到老年代：尽量避免程序中出现过多的大对象；
 	3. 长期存活的对象分配到老年代；
 	4. 动态对象年龄判断：如果Survivor区中相同年龄的所有对象大小的总和大于Survivor空间的一半，年龄大于或等于该年龄的对象可以直接进入到老年代。无需等到MaxTenuringThreshold中要求的年龄；
       
       
> 以下内容来自 https://mp.weixin.qq.com/s/q5vnsqU9ElSZBU5B57takw         

6. 程序计数器

    程序计数器（Program Counter Register）也被称为PC寄存器。它可以看作是当前线程所执行的字节码的行号指示器。在Java虚拟机的概念模型里，字节码解释器工作时就是通过改变这个计数器的值来选取下一条需要执行的字节码指令，它是程序控制流的指示器，分支、循环、跳转、异常处理、线程恢复等基础功能都需要依赖这个计数器来完成。每一条 Java虚拟机线程都有自己的程序计数器。在任意时刻，一条 Java 虚拟机线程只会执行一个方法的代码，这个正在被线程执行的方法称为该线程的当前方法如果这个方法不是 native 的，那 PC 寄存器就保存 Java 虚拟机正在执行的字节码指令的地址，如果该方法是 native 的，那 PC 寄存器的值是 undefined。

7. Java虚拟机栈
Java虚拟机栈```是线程私有的```，它具有和线程相同的生命周期。Java虚拟机栈描述的是Java方法执行的线程内存模型：每个方法被执行的时候，Java虚拟机都会同步创建一个栈帧（Stack Frame）用于存储局部变量表、操作数栈、动态连接、方法出口等信息。每一个方法被调用直至执行完毕的过程，就对应着一个栈帧在虚拟机栈中从入栈到出栈的过程。Java内存区域可以粗略地划分为堆内存（Heap）和栈内存（Stack），其中，“栈”通常就是指这里讲的虚拟机栈，或者更多的情况下只是指虚拟机栈中局部变量表部分。「局部变量表」是Java虚拟机栈中需要重点注意的区域，它存放了编译期可知的各种Java虚拟机基本数据类型（boolean、byte、char、short、int、 float、long、double）、对象引用（reference类型）和returnAddress 类型（指向了一条字节码指令的地址）。这些数据类型在局部变量表中的存储空间以局部变量槽（Slot）来表示，其中64位长度的long和 double类型的数据会占用两个变量槽，其余的数据类型只占用一个。局部变量表所需的内存空间在编译期间完成分配，当进入一个方法时，这个方法需要在栈帧中分配多大的局部变量空间是完全确定 的，在方法运行期间不会改变局部变量表的大小。

  ![图片](https://txxs.github.io/pic/q&a/WX20210712-103708@2x.png)

    Java 虚拟机栈可能发生如下异常情况：
    
    - 如果线程请求分配的栈容量超过 Java 虚拟机栈允许的最大容量时，Java 虚拟机将会抛出一个 StackOverflowError 异常。
    - 如果 Java 虚拟机栈可以动态扩展，并且扩展的动作已经尝试过，但是目前无法申请到足够的内存去完成扩展，或者在建立新的线程时没有足够的内存去创建对应的虚拟机栈，那 Java 虚拟机将会抛出一个 OutOfMemoryError 异常。
    

8. 本地方法栈
    本地方法栈（Native Method Stacks）与虚拟机栈所发挥的作用是非常相似的，其区别只是虚拟机栈为虚拟机执行Java方法（也就是字节码）服务，而本地方法栈则是为虚拟机使用到的本地（Native）方法服务。Java 虚拟机规范允许本地方法栈被实现成固定大小的或者是根据计算动态扩展和收缩的。本地方法栈可能发生如下异常情况：
    - 如果线程请求分配的栈容量超过本地方法栈允许的最大容量时，Java 虚拟机将会抛出一个StackOverflowError 异常。
    - 如果本地方法栈可以动态扩展，并且扩展的动作已经尝试过，但是目前无法申请到足够的内存去完成扩展，或者在建立新的线程时没有足够的内存去创建对应的本地方法栈，那 Java 虚拟机将会抛出一个 OutOfMemoryError 异常。

9. 方法区
    方法区（Method Area）也是线程共享的，它用于存储已被虚拟机加载的类型信息、常量、静态变量、即时编译器编译后的代码缓存等数据。虽然《Java虚拟机规范》中把方法区描述为堆的一个逻辑部分，但是它却有一个别名叫作“非堆”（Non-Heap），目的是与Java堆区分开来。

  ![图片](https://txxs.github.io/pic/q&a/WX20210712-103708@2x1.png)

    《Java虚拟机规范》对方法区的约束是非常宽松的，除了和Java堆一样不需要连续的内存和可以选择固定大小或者可扩展外，甚至还可以选择不实现垃圾收集。相对而言，垃圾收集行为在这个区域的确是比较少出现的，但并非数据进入了方法区就如永久代的名字一样“永久”存在了。这区域的内存回收目标主要是针对常量池的回收和对类型的卸载，一般来说这个区域的回收效果比较难令人满意，尤其是类型的卸载，条件相当苛刻，但是这部分区域的回收有时又确实是必要的。以前Sun公司的Bug列表中，曾出现过的若干个严重的Bug就是由于低版本的HotSpot虚拟机对此区域未完全回收而导致内存泄漏。根据《Java虚拟机规范》的规定，如果方法区无法满足新的内存分配需求时，将抛出OutOfMemoryError异常。

   > 值得一提的是：很多人都更愿意把方法区称呼为“永久代”（Permanent Generation），或将两者混为一谈。本质上这两者并不是等价的，因为仅仅是当时的HotSpot虚拟机设计团队选择把收集器的分代设计扩展至方法区，或者说使用永久代来实现方法区而已，这样使得 HotSpot的垃圾收集器能够像管理Java堆一样管理这部分内存，省去专门为方法区编写内存管理代码的工作。但是对于其他虚拟机实现，譬如BEA JRockit、IBM J9等来说，是不存在永久代的概念的。

10. 运行时常量池
    运行时常量池（Runtime Constant Pool）是方法区的一部分。Class文件中除了有类的版本、字段、方法、接口等描述信息外，还有一项信息是常量池表（Constant Pool Table），用于存放编译期生成的各种字面量与符号引用，这部分内容将在类加载后存放到方法区的运行时常量池中。ava虚拟机对于Class文件每一部分（自然也包括常量池）的格式都有严格规定，如每一个字节用于存储哪种数据都必须符合规范上的要求才会被虚拟机认可、加载和执行，但对于运行时常量池，《Java虚拟机规范》并没有做任何细节的要求，不同提供商实现的虚拟机可以按照自己的需要来实现这个内存区域，不过一般来说，除了保存Class文件中描述的符号引用外，还会把由符号引用翻译出来的直接引用也存储在运行时常量池中。运行时常量池相对于Class文件常量池的另外一个重要特征是具备动态性，Java语言并不要求常量 一定只有编译期才能产生，也就是说，并非预置入Class文件中常量池的内容才能进入方法区运行时常量池，运行期间也可以将新的常量放入池中，这种特性被开发人员利用得比较多的便是String类的intern()方法。既然运行时常量池是方法区的一部分，自然受到方法区内存的限制，当常量池无法再申请到内存时会抛出OutOfMemoryError异常。

11. 直接内存
    直接内存（Direct Memory）并不是虚拟机运行时数据区的一部分，也不是《Java虚拟机规范》中定义的内存区域。在JDK 1.4中新加入了NIO（New Input/Output）类，引入了一种基于通道（Channel）与缓冲区 （Buffer）的I/O方式，它可以使用Native函数库直接分配堆外内存，然后通过一个存储在Java堆里面的 DirectByteBuffer对象作为这块内存的引用进行操作。这样能在一些场景中显著提高性能，因为避免了 在Java堆和Native堆中来回复制数据。显然，本机直接内存的分配不会受到Java堆大小的限制，但是，既然是内存，则肯定还是会受到 本机总内存（包括物理内存、SWAP分区或者分页文件）大小以及处理器寻址空间的限制，一般服务器管理员配置虚拟机参数时，会根据实际内存去设置-Xmx等参数信息，但经常忽略掉直接内存，使得 各个内存区域总和大于物理内存限制（包括物理的和操作系统级的限制），从而导致动态扩展时出现 OutOfMemoryError异常。

12. jdk1.6/1.7/1.8内存区域变化

    在上一节提到了，HotSpot虚拟机是是Sun/OracleJDK和OpenJDK中的默认Java虚拟机，是JVM应用最广泛的一种实现。上面提到，Java虚拟机规范对方法区的约束很宽松，而且HotSpot虚拟机在这一区域发生过一些bug，所以HotSpot的方法区经历了一些变迁，我们来看看HotSpot虚拟机内存区域的变迁。
    
    JDK1.6时期和我们上面讲的JVM内存区域是一致的：
      ![JDK 1.6内存区域](https://txxs.github.io/pic/q&a/WX20210712-103708@2x2.png)
    
    JDK1.7时发生了一些变化，将字符串常量池、静态变量，存放在堆上
      ![JDK 1.7内存区域](https://txxs.github.io/pic/q&a/WX20210712-103708@2x3.png)
    
    在JDK1.8时彻底干掉了方法区，而在直接内存中划出一块区域作为「元空间」，运行时常量池、类常量池都移动到元空间。
      ![图片](https://txxs.github.io/pic/q&a/WX20210712-103708@2x4.png)
    
    方法区为什么被替代了呢？当然，或者更准确的说法应该是「永久代」为什么被替换了？——Java虚拟机规范规定的方法区只是换种方式实现。```有客观和主观两个原因```。
    
        - 客观上使用永久代来实现方法区的决定的设计导致了Java应用更容易遇到内存溢出的问题（永久代有-XX：MaxPermSize的上限，即使不设置也有默认大小，而J9和JRockit只要没有触碰到进程可用内存的上限，例如32位系统中的4GB限制，就不会出问题），而且有极少数方法 （例如String::intern()）会因永久代的原因而导致不同虚拟机下有不同的表现。
    
        - 主观上当Oracle收购BEA获得了JRockit的所有权后，准备把JRockit中的优秀功能，譬如Java Mission Control管理工具，移植到HotSpot 虚拟机时，但因为两者对方法区实现的差异而面临诸多困难。考虑到HotSpot未来的发展，在JDK 6的 时候HotSpot开发团队就有放弃永久代，逐步改为采用本地内存（Native Memory）来实现方法区的计划了，到了JDK 7的HotSpot，已经把原本放在永久代的字符串常量池、静态变量等移出，而到了 JDK 8，终于完全废弃了永久代的概念，改用与JRockit、J9一样在本地内存中实现的元空间（Meta-space）来代替，把JDK 7中永久代还剩余的内容（主要是类型信息）全部移到元空间中。
    

13. 线程内容划分： 
    线程独享：线程创建时，相应的区域分配内存，线程销毁时，释放相应内存。

        - PC Register：也称为程序计数器， 记录每个线程当前执行的指令信。eg：当前执行到哪一条指令，下一条该取哪条指令。
        - JVM Stack：也称为虚拟机栈，记录每个栈帧（Frame）中的局部变量、方法返回地址等。注：这里出现了一个新名词“栈帧”，它的结构如下：线程中每次有方法调用时，会创建Frame，方法调用结束时Frame销毁。
        - Native Method Stack：本地(原生)方法栈，顾名思义就是调用操作系统原生本地方法时，所需要的内存区域。

    线程共享：

        - Heap：即鼎鼎大名的堆内存区，也是GC垃圾回收的主站场，用于存放类的实例对象及Arrays实例等。虚拟机启动时创建，虚拟机退出时释放。
        - Method Area：方法区，主要存放类结构、类成员定义，static静态成员等。虚拟机启动时创建，虚拟机退出时释放。
        - Runtime Constant Pool：运行时常量池，比如：字符串，int -128~127范围的值等，它是Method Area中的一部分。

    上述6个区域，除了PC Register区不会抛出StackOverflowError或OutOfMemoryError ，其它5个区域，当请求分配的内存不足时，均会抛出OutOfMemoryError（即：OOM），其中thread独立的JVM Stack区及Native Method Stack区还会抛出StackOverflowError。

14. JVM 由哪些组成？

	类加载器子系统、运行时数据区（内存空间）、执行引擎以及与本地方法接口。

15. 运行时数据区有哪些组成？

	由方法区、堆、Java栈、PC寄存器、本地方法栈组成，其中内存空间中方法区和堆是所有Java线程共享的，而Java栈、本地方法栈、PC寄存器则由每个线程私有。4个部分组成：

		- PC寄存器/程序计数器：线程私有；记录指令执行的位置，这里不会出现 OutOfMemoryError
		- Java栈：线程私有，生命周期和线程一致，存储方法参数、局部变量、中间运算结果，会出现异常：如果线程请求的栈深度大于虚拟机所允许的深度，将抛出StackOverflowError异常；如果虚拟机可以动态扩展，如果扩展时无法申请到足够的内存，就会抛出OutOfMemoryError异常。
		- 本地方法栈：存储了本地方法调用的状态。区别不过是Java栈为JVM执行Java方法服务，而本地方法栈为JVM执行Native方法服务。本地方法栈也会抛出StackOverflowError和OutOfMemoryError异常。在Sun JDK中，本地方法栈和Java栈是同一个。
		- 堆：堆是JVM所管理的内存中最大的一块，是被所有Java线程锁共享的，不是线程安全的，也会有 StackOverflowError和OutOfMemoryError异常
		方法区：线程共享；类型信息和类的静态变量都存储在方法区中。
		
16. 启动类加载器是通过什么方式初始化加载的？
    
    它不是Java类，因此它不需要被别人加载，它嵌套在Java虚拟机内核里面，也就是JVM启动的时候Bootstrap就已经启动，它是用C++写的二进制代码（不是字节码）
    
17. 说一下类加载的流程是怎么样的？
        
        - 装载：通过类的全限定名和ClassLoader加载类，主要是将指定的.class文件加载至JVM
        - 校验：校验.class文件的正确性，确保该文件是符合规范定义的，并且适合当前JVM使用
        - 准备：为类分配内存，同时初始化类中的静态变量赋值为默认值
        - 解析：主要是把类的常量池中的符号引用解析为直接引用，这一步可以在用到相应的引用时再解析
        - 初始化：初始化类中的静态变量，并执行类中的static代码、构造函数
        
18.  CPU 读取缓存优先级？
    寄存器》高速缓存》内存

> 来自：https://mp.weixin.qq.com/s/CMvhvV5kwzijq2t9eqlsoA 
19. 元空间等的形象化描述
    一、元数据空间：方法元空间(方法区)在JVM启动的时候被创建，是被各个线程共享的内存空间，用于存放类和方法的元数据以及常量池，比如Class和Method。在实际的开发中，经常因为加载的类太多，进而导致内存溢出问题，这样可以对元空间的大小进行扩展。元空间存放加载的类信息，当类被实例化时，堆中存储实例化的对象信息，并且通过对象类型数据的指针找到类。
    
      ![图片](https://txxs.github.io/pic/q&a/WX20210725-165415@2-1x.png)
    
    二、堆空间：JVM启动时创建堆区，是内存管理的核心区，通常情况下也是最大的内存空间，是被所有线程共享的，几乎所有的对象实例都要在堆中分配内存，所以这里也是垃圾回收的重点空间。栈是JVM运行时的单位，堆是存储单位，当栈中方法结束，相关对象失去所有引用后，不会马上被移除堆空间，要等到垃圾收集器运行的时候。
    
      ![图片](https://txxs.github.io/pic/q&a/WX20210725-165415@2-2x.png)
    
    三、虚拟机栈：虚拟机栈(Java栈)在每个线程创建时都会生成一个虚拟机栈，栈的内部是一个个栈帧单元，对应Java方法的调用，其生命周期和线程周期保持一致。用来存储方法的局部遍历，部分执行结果，方法的调用和返回。栈帧是方法执行的数据集，维持执行过程中的各种数据信息，执行的方法依次入栈，栈顶存放当前要执行的方法，执行结束后出栈，对于栈没有垃圾回收问题。
    
      ![图片](https://txxs.github.io/pic/q&a/WX20210725-165415@2-3x.png)
    
    四、程序计数器：JVM中程序计数寄存器用来存储下一条将要执行指令的地址，执行引擎获取到指令后进行执行，是线程私有的。它可以看作是当前线程所执行的字节码的行号指示器。线程在获取CPU的时间段内执行代码，但是线程随时可能没有执行完就被挂起，等到线程A再次获取CPU执行时，CPU 得知道执行到线程A的哪一个指令，程序计数器会存储该动作。
    
      ![图片](https://txxs.github.io/pic/q&a/WX20210725-165415@2-4x.png)

> 引自：https://mp.weixin.qq.com/s/2oLX-i5zbTNayjJzAOSN8A
20. OOM 溢出的场景

    1. Java中的堆存储的都是对象实例，当我们不断的创建对象，而GC的时候又不能回收，当存储的对象大小超过了-Xmx的值，这时候则会出现OutOfMemoryError.[-XX:+HeapDumpOnOutOfMemoryError]参数可以让jvm出现内存溢出的时候dump出内存堆转储快照。当生产环境发生OOM，比较常见的一个原因是发生了内存泄漏，用工具可以分析出泄露的对象到GC Root的引用链，从而定位到问题代码。假如经过分析后发现内存中的对象都是“必须存活”的对象，这时候就要思考下项目中是否把“-Xms跟-Xmx”设置得太小了。
    2. 在jvm的方法区中，它主要存放了类的信息，常量，静态变量等。在jdk8以前是通过“-XX:PermSize，-XX:MaxPermSize”来调整这个区域的值，但是从8开始呢，永久代的概念被MetaSpace（元空间）代替了，对应的参数也变成了“-XX:MetaspaceSize，-XX:MaxMetaspaceSize”。这个问题的话，一般来说根据情况调整方法区的大小就行了，网上也有人说可以去掉MetaSpace的的大小限制，但是不建议这么干，毕竟不可控的事情我们要少点干，很容易给自己埋雷。
    3. 栈溢出：对于我们来说，还有一个熟悉的错误，那就是“StackOverflowError”，它是由线程请求的栈深度超过了jvm允许的最大范围而产生的。“-Xss”参数可以设置栈容量。一般来说此类问题多出现在存在递归的地方，要从代码里重新审视递归未结束的原因，若递归的方法没问题可以根据实际情况调整“-Xss”参数的大小。还有一些代码的循坏依赖也会造成此类情况。











### 三、回收算法

> 来自：https://mp.weixin.qq.com/s?__biz=MzI2OTQxMTM4OQ==&mid=2247486633&idx=1&sn=07336f531f3977522c457f237a08fe49&chksm=eae1f9fbdd9670ed3f87a1769f4461ca3959c6dc00e35b42a87de6cfa5392d4c2761687354d6#rd
0. 概要
当新对象产生时，存放在Eden，当Eden放不下时触发Minor GC，将Eden中存活的对象复制到一Survivor中。继续存放对象到Eden，当Eden放不下时触发Minor GC，将Eden和非空闲Survivor中存活的对象复制到空闲Survivor中，往复操作。每经过一次Minor GC，对象的年龄加1，当对象年龄达到阀值（默认15）进入Tenured。如果在Minor GC期间发现存活对象无法放入空闲的Survivor区，则会通过空间分配担保机制使对象提前进入Tenured。如果在Survivor空间中的相同年龄的所有对象大小的总和大于Survivor空间的一半，年龄大于和等于该年的对象就可以直接进入老年代，无需等到指定的阀值。

> 问题来自：https://mp.weixin.qq.com/s/jhDgLnKodhmVeoBHp5IFCw 和 https://mp.weixin.qq.com/s/OtSksYVDccMToWnzdfD7Mg           
1. 如何确定垃圾
    ![图片](https://txxs.github.io/pic/q&a/170867cb6af0a72l.png)
    
    - 引用计数法：在 Java 中，引用和对象是有关联的。如果要操作对象则必须用引用进行。因此，很显然一个简单的办法是通过引用计数来判断一个对象是否可以回收。简单说，即一个对象如果没有任何与之关联的引用，即他们的引用计数都不为 0，则说明对象不太可能再被用到，那么这个对象就是可回收对象。
    - 可达性分析：为了解决引用计数法的循环引用问题，Java 使用了可达性分析的方法。通过一系列的“GC roots”对象作为起点搜索。如果在“GC roots”和一个对象之间没有可达路径，则称该对象是不可达的。要注意的是，不可达对象不等价于可回收对象，不可达对象变为可回收对象至少要经过两次标记过程。两次标记后仍然是可回收对象，则将面临回收。GC ROOT 的对象包括：
                  
            - 虚拟机栈（栈帧中本地变量表）中引用的对象；
            - 方法区中类静态属性引用的对象；
            - 方法区中常量引用的对象；
            - 本地方法栈中JNI（Native方法）引用的对象。
            
         > 注：在可达性分析算法中不可达的对象，并不是直接被回收，这时它们处于缓刑状态，至少需要进行两次标记才会确定该对象是否被回收：第一次标记：如果对象在进行可达性分析后发现没有与GC Roots相连接的引用链，那它将会被第一次标记；第二次标记：第一次标记后接着会进行一次筛选，筛选的条件是此对象是否有必要执行finalize()方法（该方法可将此对象与GC Roots建立联系）。在finalize()方法中没有重新与引用链建立关联关系的，将被进行第二次标记。第二次标记成功的对象将真的会被回收，如果对象在finalize()方法中重新与引用链建立了关联关系，那么将会逃离本次回收，继续存活。                                                                                                                                                                  
                                                                                                                                               
                                                                                                                                                                                        
2. 垃圾回收算法有哪些

    - 标记清除算法（Mark-Sweep）:最基础的垃圾回收算法，分为两个阶段，标注和清除。标记阶段标记出所有需要回收的对象，清除阶段回收被标记的对象所占用的空间。如图，从图中我们就可以发现，该算法最大的问题是内存碎片化严重，后续可能发生大对象不能找到可利用空间的问题。
    
    ![图片](https://txxs.github.io/pic/q&a/170867cb6af0a72m.png)
    
    - 复制算法（copying ）:为了解决 Mark-Sweep 算法内存碎片化的缺陷而被提出的算法。按内存容量将内存划分为等大小的两块。每次只使用其中一块，当这一块内存满后将尚存活的对象复制到另一块上去，把已使用的内存清掉，如图：这种算法虽然实现简单，内存效率高，不易产生碎片，但是最大的问题是可用内存被压缩到了原本的一半。且存活对象增多的话，Copying 算法的效率会大大降低。
    
    ![图片](https://txxs.github.io/pic/q&a/170867cb6af0a72n.png)
    
    - 标记整理算法(Mark-Compact):结合了以上两个算法，为了避免缺陷而提出。标记阶段和Mark-Sweep算法相同，标记后不是清理对象，而是将存活对象移向内存的一端。然后清除端边界外的对象。如图：
    
    ![图片](https://txxs.github.io/pic/q&a/170867cb6af0a72o.png)
    
    - 分代收集算法:分代收集法是目前大部分 JVM 所采用的方法，其核心思想是根据对象存活的不同生命周期将内存划分为不同的域，一般情况下将 GC 堆划分为老生代(Tenured/Old Generation)和新生(YoungGeneration)。老生代的特点是每次垃圾回收时只有少量对象需要被回收，新生代的特点是每次垃圾回收时都有大量垃圾需要被回收，因此可以根据不同区域选择不同的算法。
    
    - 新生代与复制算法:目前大部分 JVM 的 GC 对于新生代都采取 Copying 算法，因为新生代中每次垃圾回收都要回收大部分对象，即要复制的操作比较少，但通常并不是按照 1：1 来划分新生代。一般将新生代划分为一块较大的 Eden 空间和两个较小的 Survivor 空间(From Space, To Space)，每次使用Eden 空间和其中的一块 Survivor 空间，当进行回收时，将该两块空间中还存活的对象复制到另一块 Survivor 空间中。
    
    ![图片](https://txxs.github.io/pic/q&a/170867cb6af0a72p.png)
    
    - 老年代与标记复制算法:而老年代因为每次只回收少量对象(特点)，因而采用 Mark-Compact 算法。
    
        - JAVA 虚拟机提到过的处于方法区的永生代(Permanet Generation)，它用来存储 class 类，常量，方法描述等。对永生代的回收主要包括废弃常量和无用的类。
        - 对象的内存分配主要在新生代的Eden Space 和Survivor Space 的 From Space(Survivor 目前存放对象的那一块)，少数情况会直接分配到老生代。
        - 当新生代的Eden Space 和 From Space 空间不足时就会发生一次 GC，进行 GC 后，EdenSpace 和 From Space 区的存活对象会被挪到 To Space，然后将 Eden Space 和 FromSpace 进行清理。
        - 如果To Space 无法足够存储某个对象，则将这个对象存储到老生代。
        - 在进行 GC 后，使用的便是 Eden Space 和 To Space 了，如此反复循环。
        - 当对象在 Survivor 区躲过一次 GC 后，其年龄就会+1。默认情况下年龄到达 15 的对象会被移到老生代中。

3. 分代收集算法 VS 分区收集算法

    - 分代收集算法：当前主流 JVM 垃圾收集都采用”分代收集”(Generational Collection)算法,这种算法会根据对象存活周期的不同将内存划分为几块,如JVM中的新生代、老年代、永久代，这样就可以根据各年代特点分别采用最适当的GC算法。
    - 在新生代-复制算法：每次垃圾收集都能发现大批对象已死, 只有少量存活. 因此选用复制算法, 只需要付出少量存活对象的复制成本就可以完成收集。
    - 在老年代-标记整理算法：因为对象存活率高、没有额外空间对它进行分配担保, 就必须采用“标记—清理”或“标记—整理”算法来进行回收, 不必进行内存复制, 且直接腾出空闲内存。
    - 分区收集算法：分区算法则将整个堆空间划分为连续的不同小区间, 每个小区间独立使用, 独立回收. 这样做的好处是可以控制一次回收多少个小区间 , 根据目标停顿时间, 每次合理地回收若干个小区间(而不是整个堆), 从而减少一次 GC 所产生的停顿。

4. GC垃圾收集器
    Java 堆内存被划分为新生代和年老代两部分，新生代主要使用复制和标记-清除垃圾回收算法 ,年老代主要使用标记-整理垃圾回收算法，因此java虚拟中针对新生代和年老代分别提供了多种不同的垃圾收集器，JDK1.6 中 Sun HotSpot 虚拟机的垃圾收集器如下：
    
    ![图片](https://txxs.github.io/pic/q&a/170867cb6af0a72q.png)
    
    - Serial垃圾收集器（单线程、复制算法 ）: Serial（英文连续）是最基本垃圾收集器，使用复制算法，曾经是JDK1.3.1之前新生代唯一的垃圾收集器。Serial是一个单线程的收集器，它不但只会使用一个 CPU 或一条线程去完成垃圾收集工作，并且在进行垃圾收集的同时，必须暂停其他所有的工作线程，直到垃圾收集结束。Serial 垃圾收集器虽然在收集垃圾过程中需要暂停所有其他的工作线程，但是它简单高效，对于限定单个CPU 环境来说，没有线程交互的开销，可以获得最高的单线程垃圾收集效率，因此 Serial垃圾收集器依然是 java 虚拟机运行在Client模式下默认的新生代垃圾收集器。
    
    - ParNew垃圾收集器（Serial+ 多线程 ）: ParNew 垃圾收集器其实是 Serial 收集器的多线程版本，也使用复制算法，除了使用多线程进行垃圾收集之外，其余的行为和 Serial 收集器完全一样，ParNew 垃圾收集器在垃圾收集过程中同样也要暂停所有其他的工作线程。ParNew 收集器默认开启和 CPU 数目相同的线程数，可以通过-XX:ParallelGCThreads 参数来限制垃圾收集器的线程数。【Parallel：平行的】ParNew虽然是除了多线程外和Serial收集器几乎完全一样，但是ParNew垃圾收集器是很多java虚拟机运行在 Server 模式下新生代的默认垃圾收集器。
    
    - Parallel Scavenge收集器（多线程复制算法、高效）:Parallel Scavenge收集器也是一个新生代垃圾收集器，同样使用复制算法，也是一个多线程的垃圾收集器，它重点关注的是程序达到一个可控制的吞吐量（Thoughput，CPU 用于运行用户代码的时间/CPU 总消耗时间，即吞吐量=运行用户代码时间/(运行用户代码时间+垃圾收集时间)），高吞吐量可以最高效率地利用 CPU 时间，尽快地完成程序的运算任务，主要适用于在后台运算而不需要太多交互的任务。自适应调节策略也是 Parallel Scavenge 收集器与 ParNew 收集器的一个重要区别。
    
    - Serial Old收集器(单线程标记整理算法）:Serial Old是Serial垃圾收集器年老代版本，它同样是个单线程的收集器，使用标记-整理算法，这个收集器也主要是运行在 Client 默认的java虚拟机默认的年老代垃圾收集器。在 Server 模式下，主要有两个用途：
       1. 在 JDK1.5 之前版本中与新生代的 Parallel Scavenge 收集器搭配使用。
       2. 作为年老代中使用CMS收集器的后备垃圾收集方案。
    新生代 Serial 与年老代 Serial Old 搭配垃圾收集过程图：
    
    ![图片](https://txxs.github.io/pic/q&a/170867cb6af0a72r.png)
    
    -  新生代 Parallel Scavenge 收集器与 ParNew 收集器工作原理类似，都是多线程的收集器，都使用的是复制算法，在垃圾收集过程中都需要暂停所有的工作线程。新生代 ParallelScavenge/ParNew 与年老代 Serial Old 搭配垃圾收集过程图： 
    
    ![图片](https://txxs.github.io/pic/q&a/170867cb6af0a72s.png)
    
    - Parallel Old  收集器（多线程标记整理算法）:Parallel Old收集器是Parallel Scavenge的年老代版本，使用多线程的标记-整理算法，在JDK1.6才开始提供。在 JDK1.6 之前，新生代使用 ParallelScavenge 收集器只能搭配年老代的 Serial Old 收集器，只能保证新生代的吞吐量优先，无法保证整体的吞吐量，Parallel Old 正是为了在年老代同样提供吞吐量优先的垃圾收集器，如果系统对吞吐量要求比较高，可以优先考虑新生代 Parallel Scavenge和年老代 Parallel Old 收集器的搭配策略。新生代 Parallel Scavenge 和年老代 Parallel Old 收集器搭配运行过程图：
    
    ![图片](https://txxs.github.io/pic/q&a/170867cb6af0a72t.png)
    
    - CMS收集器 多线程标记清除算法）Concurrent mark sweep(CMS)收集器是一种年老代垃圾收集器，其最主要目标是获取最短垃圾回收停顿时间，和其他年老代使用标记-整理算法不同，它使用多线程的标记-清除算法。最短的垃圾收集停顿时间可以为交互比较高的程序提高用户体验。CMS工作机制相比其他的垃圾收集器来说更复杂，整个过程分为以下 4 个阶段：
         1.初始标记：只是标记一下 GC Roots 能直接关联的对象，速度很快，仍然需要暂停所有的工作线程。
         2.并发标记： 进行 GC Roots 跟踪的过程，和用户线程一起工作，不需要暂停工作线程。
         3.重新标记： 为了修正在并发标记期间，因用户程序继续运行而导致标记产生变动的那一部分对象的标记记录，仍然需要暂停所有的工作线程。
         4.并发清除： 清除 GC Roots 不可达对象，和用户线程一起工作，不需要暂停工作线程。由于耗时最长的并发标记和并发清除过程中，垃圾收集线程可以和用户现在一起并发工作，所以总体上来看CMS 收集器的内存回收和用户线程是一起并发地执行。
    
    ![图片](https://txxs.github.io/pic/q&a/170867cb6af0a72u.png)
    
    - G1 收集器:Garbage first 垃圾收集器是目前垃圾收集器理论发展的最前沿成果，相比与CMS收集器，G1收集器两个最突出的改进是：
    
        - 基于标记-整理算法，不产生内存碎片。可以非常精确控制停顿时间，在不牺牲吞吐量前提下，实现低停顿垃圾回收。
        - G1 收集器避免全区域垃圾收集，它把堆内存划分为大小固定的几个独立区域，并且跟踪这些区域的垃圾收集进度，同时在后台维护一个优先级列表，每次根据所允许的收集时间，优先回收垃圾最多的区域。区域划分和优先级区域回收机制，确保 G1 收集器可以在有限时间获得最高的垃圾收集效率。    
            
> 以下来自于：https://mp.weixin.qq.com/s/1S0M_nf2RL2wzh815Z09jQ       
6. 垃圾回收的方式

	- 新生代收集（Minor GC/Young GC）：只是新生代的垃圾收集；
	- 老年代收集（Major GC/Old GC）：只是老年代的垃圾收集；
	- 混合收集（Mixed GC）：收集整个新生代以及部分老年代的垃圾收集，只有G1 GC （按照region划分新生代和老年代的数据）会有这种行为。
	- 目前，只有CMS GC会有单独收集老年代的行为；很多时候Major GC会和Full GC 混淆使用，需要具体分辨是老年代回收还是整堆回收。
	- Full GC：整堆收集（Full GC）：整个java堆和方法区的垃圾收集。

6. 年轻代GC（Minor GC）触发机制

	- 当年轻代空间不足时，就会触发Minor GC，这里的年轻代满指的是Eden代满，Survivor满不会引发GC。(每次Minor GC会清理年轻代的内存，Survivor是被动GC，不会主动GC)
	- 因为Java对象大多都具备“朝生夕灭”的特性，所以Minor GC非常频繁，一般回收速度也比较快。
	- Minor GC会引发STW（Stop The World），暂停其他用户的线程，等垃圾回收结束，用户线程才恢复运行。

7. 老年代GC(Major GC/Full GC)触发机制

	- 指发生在老年代的GC，对象从老年代消失时，Major GC或者Full GC发生了；
	- 出现了Major GC，经常会伴随至少一次的Minor GC（不是绝对的，在Parallel Scavenge收集器的收集策略里就有直接进行Major GC的策略选择过程），也就是老年代空间不足时，会先尝试触发Minor GC。如果之后空间还不足，则触发Major GC；
	- Major GC速度一般会比Minor GC慢10倍以上，STW时间更长；
	- 如果Major GC后，内存还不足，就报OOM了。
	
	- 另外一种更详细的说法：https://mp.weixin.qq.com/s/W_URLiVuCFS58AiJS257vw
	- 没有配置 -XX:+DisableExplicitGC情况下System.gc()可能会触发FullGC；
    - Promotion failed；
    - concurrent mode failure；
    - Metaspace Space使用达到MaxMetaspaceSize阈值；
    - 执行jmap -histo:live或者jmap -dump:live；说明：统计发现之前YGC的平均晋升大小比目前old gen剩余的空间大，触发的是CMS GC；如果配置了CMS，并且Metaspace Space使用量达到MetaspaceSize阈值也是触发CMS GC；因为live参数会做一次fgc的动作，把某些死对象给回收掉了

8. Full GC触发机制

	- 调用System.gc()时，系统建议执行Full GC，但是不必然执行；
	- 老年代空间不足；
	- 方法区空间不足；
	- 通过Minor GC后进入老年代的平均大小小于老年代的可用内存；
	- 由Eden区，Survivor S0（from）区向S1（to）区复制时，对象大小大于To Space可用内存，则把该对象转存到老年代，且老年代的可用内存小于该对象大小。 

> 引用自：https://mp.weixin.qq.com/s/hXXcp7JiNxpFeUxSuHyXhQ

9. 说说有哪些垃圾回收算法？

    ```标记-清除```：统一标记出需要回收的对象，标记完成之后统一回收所有被标记的对象。而由于标记的过程需要遍历所有的GC ROOT，清除的过程也要遍历堆中所有的对象，所以标记-清除算法的效率低下，同时也带来了内存碎片的问题。

    ```复制算法```为了解决性能的问题，复制算法应运而生。它将内存分为大小相等的两块区域，每次使用其中的一块。当一块内存使用完之后，将还存活的对象拷贝到另外一块内存区域中，然后把当前内存清空。这样性能和内存碎片的问题得以解决。但是同时带来了另外一个问题，可使用的内存空间缩小了一半！因此，诞生了我们现在的常见的年轻代+老年代的内存结构：Eden+S0+S1 组成。因为根据 IBM 的研究显示，98%的对象都是朝生夕死，所以实际上存活的对象并不是很多，完全不需要用到一半内存浪费，所以默认的比例是 8:1:1。这样，在使用的时候只使用 Eden 区和 S0、S1 中的一个，每次都把存活的对象拷贝另外一个未使用的 Survivor 区，同时清空 Eden 和使用的 Survivor，这样下来内存的浪费就只有10%了。如果最后未使用的 Survivor 放不下存活的对象，这些对象就进入 Old 老年代了。注意：所以有一些初级点的问题会问你，为什么要分为 Eden 区和2个 Survior 区？有什么作用？就是为了节省内存和解决内存碎片的问题。这些算法都是为了解决问题而产生的，如果理解原因你就不需要死记硬背了。

    ```标记-整理```：针对老年代再用复制算法显然不合适，因为进入老年代的对象都存活率比较高了，这时候再频繁的复制对性能影响就比较大，而且也不会再有另外的空间进行兜底。所以针对老年代的特点，通过标记-整理算法，标记出所有的存活对象，让所有存活的对象都向一端移动，然后清理掉边界以外的内存空间。


10. 年轻代和老年代都有哪些垃圾回收器？
    ![图片](https://txxs.github.io/pic/q&a/WX20210705-101618@20e.png)

    年轻代的垃圾收集器包含有 Serial、ParNew、Parallell。老年代则包括 Serial Old 老年代版本、CMS、Parallel Old 老年代版本和 JDK11 中全新的 G1 收集器。

    - Serial：单线程版本收集器，进行垃圾回收的时候会 STW（Stop The World），也就是进行垃圾回收的时候其他的工作线程都必须暂停。
    - ParNew：Serial 的多线程版本，用于和 CMS 配合使用。
    - Parallel Scavenge：可以并行收集的多线程垃圾收集器。
    - Serial Old：Serial 的老年代版本，也是单线程。
    - Parallel Old：Parallel Scavenge 的老年代版本。
    - CMS（Concurrent Mark Sweep）：CMS 收集器是以获取最短停顿时间为目标的收集器。相对于其他的收集器 STW 的时间更短暂，可以并行收集是它的特点，同时它基于标记-清除算法。整个 GC 过程分为4步：

        - 初始标记：标记 GC ROOT 能关联到的对象，需要 STW；
        - 并发标记：从 GCRoots 的直接关联对象开始遍历整个对象图的过程，不需要 STW；
        - 重新标记：为了修正并发标记期间，因用户程序继续运作而导致标记产生改变的标记，需要 STW；
        - 并发清除：清理删除掉标记阶段判断的已经死亡的对象，不需要 STW。

    - 从整个过程来看，并发标记和并发清除的耗时最长，但是不需要停止用户线程。而初始标记和重新标记的耗时较短，但是需要停止用户线程。总体而言，整个过程造成的停顿时间较短，大部分时候是可以和用户线程一起工作的。
    - G1（Garbage First）：G1 收集器是 JDK9 的默认垃圾收集器，不再区分年轻代和老年代进行回收。


11. G1的原理了解吗？
    ![图片](https://txxs.github.io/pic/q&a/WX20210705-101618@20f.png)

    G1 作为JDK9之后的服务端默认收集器，不再区分年轻代和老年代进行垃圾回收。把内存划分为多个 Region，每个 Region 的大小可以通过 -XX：G1HeapRegionSize 设置，大小为1~32M。对于大对象的存储则衍生出 Humongous的概念。超过Region大小一半的对象会被认为是大对象，而超过整个Region大小的对象被认为是超级大对象，将会被存储在连续的N个Humongous Region中。G1在进行回收的时候会在后台维护一个优先级列表，每次根据用户设定允许的收集停顿时间优先回收收益最大的 Region。G1 的回收过程分为以下四个步骤：

        - 初始标记：标记 GC ROOT 能关联到的对象，需要 STW；
        - 并发标记：从 GCRoots 的直接关联对象开始遍历整个对象图的过程，扫描完成后还会重新处理并发标记过程中产生变动的对象；
        - 最终标记：短暂暂停用户线程，再处理一次，需要 STW；
        - 筛选回收：更新 Region 的统计数据，对每个 Region 的回收价值和成本排序，根据用户设置的停顿时间制定回收计划。再把需要回收的 Region 中存活对象复制到空的 Region，同时清理旧的 Region。需要 STW。

    总的来说除了并发标记之外，其他几个过程也还是需要短暂的 STW。G1 的目标是在停顿和延迟可控的情况下尽可能提高吞吐量。


12. 什么时候会触发YGC和FGC？对象什么时候会进入老年代？

    ![图片](https://txxs.github.io/pic/q&a/WX20210705-101618@20g.png)
    
        - 当一个新的对象来申请内存空间的时候，如果Eden区无法满足内存分配需求，则触发YGC。使用中的Survivor区和Eden区存活对象送到未使用的Survivor区。
        - 如果 YGC 之后还是没有足够空间，则直接进入老年代分配。如果老年代也无法分配空间，触发 FGC，FGC 之后还是放不下则报出 OOM 异常。
        - YGC 之后，存活的对象将会被复制到未使用的 Survivor 区。如果 S 区放不下，则直接晋升至老年代。
        - 而对于那些一直在 Survivor 区来回复制的对象，通过 -XX：MaxTenuringThreshold 配置交换阈值，默认15次。如果超过次数同样进入老年代。
        - 此外，还有一种动态年龄的判断机制，不需要等到MaxTenuringThreshold就能晋升老年代。如果在Survivor空间中相同年龄所有对象大小的总和大于Survivor空间的一半，年龄大于或等于该年龄的对象就可以直接进入老年代。


13. 频繁 FullGC 怎么排查？

    这种问题最好的办法就是结合有具体的例子举例分析，如果没有就说一般的分析步骤。发生FGC有可能是内存分配不合理，比如Eden区太小，导致对象频繁进入老年代，这时候通过启动参数配置就能看出来，另外有可能就是存在内存泄露，可以通过以下的步骤进行排查：

    1. jstat -gcutil 或者查看 gc.log 日志，查看内存回收情况。

   ![图片](https://txxs.github.io/pic/q&a/WX20210705-101618@20h.png)

   S0、S1 分别代表两个 Survivor 区占比；E 代表 Eden 区占比，图中可以看到使用了78%；O 代表老年代，M 代表元空间，YGC 发生54次，YGCT 代表 YGC 累计耗时，GCT 代表 GC 累计耗时。[GC 或 [FGC 开头代表垃圾回收的类型；

   ![图片](https://txxs.github.io/pic/q&a/WX20210705-101618@20i.png)
    ```
    PSYoungGen: 6130K->6130K(9216K)] 12274K->14330K(19456K), 0.0034895 secs 代表 YGC 前后内存使用情况；
    Times: user=0.02 sys=0.00, real=0.00 secs：user 表示用户态消耗的 CPU 时间，sys 表示内核态消耗的 CPU 时间，real 表示各种墙时钟的等待时间；
    ```
    这两张图只是举例并没有关联关系。比如你从图里面看能到是否进行 FGC、FGC 的时间花费多长；GC 后老年代，年轻代内存是否有减少；得到一些初步的情况来做出判断。
    2. dump 出内存文件在具体分析。
    比如通过 jmap 命令 jmap -dump:format=b,file=dumpfile pid。导出之后再通过 Eclipse Memory Analyzer 等工具进行分析，定位到代码、修复。这里还会可能存在一个提问的点，比如 CPU 飙高，同时 FGC 怎么办？办法比较类似：找到当前进程的 pid，top -p pid -H 查看资源占用，找到问题线程；

    ```
    printf “%x\n” pid，把线程 pid 转为16进制，比如 0x32d；
    jstack pid|grep -A 10 0x32d 查看线程的堆栈日志，还找不到问题继续下一步；
    dump 出内存文件用 MAT 等工具进行分析，定位到代码、修复。
    ```
14. 垃圾回收器介绍
    > https://mp.weixin.qq.com/s/v8UaNAl_cI963X-xuFmsOg
15. 如何判断对象是垃圾

    有两种经典的判断方法
    
      ![图片](https://txxs.github.io/pic/q&a/WX20210716-113420@2-1x.png)

    引用计数法，思路很简单，但是如果出现循环引用，即：A引用B，B又引用A，这种情况下就不好办了，所以JVM中使用了另一种称为“可达性分析”的判断方法：
         
       ![图片](https://txxs.github.io/pic/q&a/WX20210716-113420@2-2x.png)

    还是刚才的循环引用问题（也是某些公司面试官可能会问到的问题)，如果A引用B，B又引用A，这2个对象是否能被GC回收？ 答案：关键不是在于A、B之间是否有引用，而是A、B是否可以一直向上追溯到GC Roots。如果与GC Roots没有关联，则会被回收，否则将继续存活。

16. 哪些内存区域需要GC ?

    ![图片](https://txxs.github.io/pic/q&a/WX20210716-113420@2-3x.png)

    我们知道了thread独享的区域：PC Regiester、JVM Stack、Native Method Stack，其生命周期都与线程相同（即：与线程共生死），所以无需GC。线程共享的Heap区、Method Area则是GC关注的重点对象。

17. GC主要过程

    ![图片](https://txxs.github.io/pic/q&a/WX20210716-113420@2-4x.png)
    
18. ZGC
    https://mp.weixin.qq.com/s/9xGsz5TpTSN0LxeOdNV8zA

19. 空间分配担保

    由于发生 Minor GC 时，可能会有一部分对象进入老年代。最极端的情况就是：Minor GC 时新生代所有对象全都存活，需要老年代进行分配担保。因此，在发进行 Minor GC 之前，JVM 会先检查老年代的空间，流程如下：
    在执行Minor GC前, VM会首先检查Tenured是否有足够的空间存放新生代尚存活对象，由于新生代使用复制收集算法，为了提升内存利用率，只使用了其中一个Survivor作为轮换备份，因此当出现大量对象在Minor GC后仍然存活的情况时，就需要老年代进行分配担保，让Survivor无法容纳的对象直接进入老年代，但前提是老年代需要有足够的空间容纳这些存活对象。但存活对象的大小在实际完成GC前是无法明确知道的，因此Minor GC前，VM会先首先检查老年代连续空间是否大于新生代对象总大小或历次晋升的平均大小，如果条件成立, 则进行Minor GC，否则进行Full GC(让老年代腾出更多空间)。然而取历次晋升的对象的平均大小也是有一定风险的，如果某次Minor GC存活后的对象突增，远远高于平均值的话，依然可能导致担保失败(Handle Promotion Failure，老年代也无法存放这些对象了)，此时就只好在失败后重新发起一次Full GC(让老年代腾出更多空间)。

    ![图片](https://txxs.github.io/pic/q&a/WX20210716-113420@2-5x.png)

> 引用自：https://mp.weixin.qq.com/s/HezkHilqhLJh6gL3zvj6XA
20. 是不是所有的垃圾回收器都要停等
    迄今为止，所有收集器在根节点枚举这一步骤都是必须暂停用户线程的。即便是号称停顿时间可控、或者（几乎）不会发生停顿的 CMS、G1、ZGC 等收集器，枚举根节点时也必须要停顿。这也是导致垃圾收集过程必须停顿所有用户线程的一个重要原因。

21. 什么是安全点

    JVM进行垃圾回收是一个非常复杂的过程，如何进行垃圾标记、什么时候进行垃圾、如果进行垃圾回收等等都非常复杂，当前主流测JVM在垃圾回收时都会进行STW(stop the world)，即使宣称非常快的CMS垃圾回收期早期也会STW标记垃圾状态。那么这里有个问题，什么时候进行标记对象是否可以被回收呢？CPU在执行运算过程时需要把数据从内存中载入到寄存器，运算完后再从寄存器中载入到内存中，Java中对象地址也是这么个过程，设想如果一个Java线程分配一个对象，此时对象的地址还在寄存器中，这时候这个线程失去了CPU 时间片，而此时STW GC发现没有任何GC ROOTS与该对象关联起来，此时这个对象呗认为是垃圾并被回收了，之后CPU重新获得时间片后发现此时对象已经不存在了这时候程序就GG了。因此不是在任何时候都可以随便GC的，复杂的JVM早就考虑到这个问题，在JVM里面引入了一个叫安全点（Safe Point）的东西来避免这个问题。GC的目的是帮助我们回收不再使用的内存，在多线程环境下这种回收将会变得非常复杂，要安全地回收需要满足一下两个条件：
        
        - 堆内存的变化是受控制的，最好所有的线程全部停止。
        - 堆中的对象是已知的，不存在不再使用的对象很难找到或者找不到即堆中的对象状态都是可知的。

    为了准确安全地回收内存，JVM是在Safe Point点时才进行回收，所谓Safe Point就是Java线程执行到某个位置这时候JVM能够安全、可控的回收对象，这样就不会导致上所说的回收正在使用的对象。

22. 什么是安全区域

    安全点完美的解决了如何进入GC问题，实际情况可能比这个更复杂，但是如果程序长时间不执行，比如线程调用的sleep方法，这时候程序无法响应JVM中断请求这时候线程无法到达安全点，显然JVM也不可能等待程序唤醒，这时候就需要安全区域了。
    安全区域是指一段代码片中，引用关系不会发生变化，在这个区域任何地方GC都是安全的，安全区域可以看做是安全点的一个扩展。线程执行到安全区域的代码时，首先标识自己进入了安全区域，这样GC时就不用管进入安全区域的线层了，线层要离开安全区域时就检查JVM是否完成了GC Roots枚举，如果完成就继续执行，如果没有完成就等待直到收到可以安全离开的信号。

23. Java 内存模型（JMM）
	Java内存模型（Java Memory Model）描述了Java程序中各种变量（线程共享变量）的访问规则，以及在JVM中将变量存储到内存和从内存中读取出变量这样的底层细节。多个线程同时对主内存的一个共享变量进行读取和修改时，首先会读取这个变量到自己的工作内存中成为一个副本，对这个副本进行改动之后，再更新回主内存中变量所在的地方。（由于CPU时间片是以线程为最小单位，所以这里的工作内存实际上就是指的物理缓存，CPU运算时获取数据的地方；而主内存也就是指的是内存，也就是原始的共享变量存放的位置）JMM 关键技术点都是围绕多线程的原子性、可见性、有序性来建立的。
        - 原子性：原子性是指一个操作是不可中断的。即使是在多个线程一起执行的时候，一个操作一旦开始，就不会被其他线程干扰。
        - 可见性：可见性是指当一个线程修改了某一个共享变量的值，其他线程是否能够立即知道这个修改。在串行程序中是不存在可见性的问题，但在多线程场景就存在比较多的问题。
        - 有序性：按先后顺序执行。有序性问题的原因是因为程序在执行时，可能会进行指令重排，重排后的指令与原指令的顺序未必一致。
        ![图片](https://txxs.github.io/pic/q&a/WX20210716-113420@2-10x.png)
   所有的变量都存储在主内存中;每个线程都有自己独立的工作内存，里面保存该线程使用到的变量的副本.两条规定：
            - 线程对共享变量的所有操作都必须在自己的工作内存中进行，不能直接从主内存中读写
            - 不同线程之间无法直接访问其他线程工作内存中的变量，线程间变量值的传递需要功过主内存来完成。

24. 对于GC的误解

    - Old GC：截止Java发展到现在JDK9为止，只单独回收Old区的只有CMS GC，并且我们常说的CMS是指它的background collection模式，这个模式包含CMS GC完整的5个阶段：初始化标记，并发标记，重新标记，并发清理，并发重置。由CMS的5个阶段可知，仍然有两个阶段需要STW，所以CMS并不是完全并发，而是Mostly Concurrent Mark Sweep ，G1出来之前，CMS绝对是OLTP系统标配的垃圾回收器。

    - FullGC：有些地方称之为Major GC，Major GC通常是跟FullGC是等价的，都是收集整个GC堆。但因为HotSpot VM发展了这么多年，外界对各种名词的解读已经完全混乱了，当有人说“Major GC”的时候一定要问清楚他想要指的是上面的FullGC还是OldGC（参考R大的Major GC和Full GC的区别：https://www.zhihu.com/question/41922036/answer/93079526）。大家普遍对这个GC的误解绝对是最大的（我可以说至少有80%的人都有误解），首先对于ParallelOldGC即默认GC在Old满了以后触发的FullGC是没有问题的，jstat命令查看输出结果FGC的值也会相应的+1，即发生了一次FGC。FGC误解主要来自最常用的ParNew+CMS组合，很多人误解FullGC可能是受到jstat命令结果的影响，因为发生CMS GC时，FGC也会增大（但是会+2，这是因为CMS GC的初始化标记和重新标记都会完全的STW，从而FGC的值会+2）。但是，事实上这并没有发生FullGC。jstat命令结果中的FGC并不表示就一定发生了FullGC，很有可能只是发生了CMS GC而已。事实上，FullGC的触发条件非常苛刻，判断是否发生了FullGC最好的方法是通过GC日志，日志中如果有"full gc"的字样，就表示一定发生了Full GC。所以强烈建议生产环境开启GC日志，它的价值远大于它对性能的影响（不用权衡这个影响有多大，开启就对了）。

25. 健康的GC
    - YoungGC频率不超过2秒/次；
    - CMS GC频率不超过1天/次；
    - 每次YoungGC的时间不超过15ms；
    - FullGC频率尽可能完全杜绝；

26. FullGC的处理
    - 如果配置CMS，由于CMS采用标记清理算法，会有内存碎片的问题，推荐配置一个查看内存碎片程度的JVM参数：PrintFLSStatistics。
    - 如果配置ParallelOldGC，那么每次Old区满后，会触发FullGC，如果FullGC频率过高，也可以通过上面OldGC提及的排查方法；
    - 如果没有配置-XX:+DisableExplicitGC，即没有屏蔽System.gc()触发FullGC，那么可以通过排查GC日志中有System字样判断是否由System.gc()触发，日志样本如下：558082.666: [Full GC (System) [PSYoungGen: 368K->0K(42112K)] [PSOldGen: 36485K->32282K(87424K)] 36853K->32282K(129536K) [PSPermGen: 34270K->34252K(196608K)], 0.2997530 secs]或者通过jstat -gccause pid 2s pid判定，LGCC表示最近一次GC原因，如果为System.gc，表示由System.gc()触发，GCC表示当前GC原因，如果当前没有GC，那么就是No GC：


27. CMS的缺点

    - 会产生空间碎片。CMS 垃圾回收器采用的基础算法是 Mark-Sweep，没有内存整理的过程，所以经过 CMS 收集的堆会产生空间碎片。
    - 对CPU资源非常敏感。为了让应用程序不停顿，CMS 线程需要和应用程序线程并发执行，这样就需要有更多的 CPU，同时会使得总吞吐量降低。
    - CMS无法处理浮动垃圾，所以一般需要更大的堆空间。因为CMS 在标记阶段应用程序的线程还是在执行的，那么就会有堆空间继续分配的情况，为了保证在 CMS 回收完堆之前还有空间分配给正在运行的应用程序，必须预留一部分空间。
    
28. GC的分类
    - Young GC：只是负责回收年轻代对象的GC；
    - Old GC：只是负责回收老年代对象的GC；
    - Full GC：回收整个堆的对象，包括年轻代、老年代、持久带；
    - Mixed GC：回收年轻代和部分老年代的GC (G1)；

> 来自：https://mp.weixin.qq.com/s/nEV7iPB4kOYIQVHY8cYygA
29. 各种算法性能比较

  ![图片](https://txxs.github.io/pic/q&a/WX20210725-165415@2-5x.png)
  
30. G1 垃圾回收器的内存划分

    - G1 不再坚持固定大小和固定数量的分代区域划分，而是把连续的 Java 堆划分为多个大小相等的独立区域（Region），每个 Region 都可以根据需要，扮演新生代的 Eden 空间、Survivor 空间，或者老年代空间。
    - Region 中还有一类特殊的 Humongous 区域，专门来存储大对象（大小超过一个 Region 容量的一半）。
    - 而对于超过整个 Region 的超大对象，将会被存在 N 个连续的 Humongous Region 中（G1 的大多数行为都把 Humongous Region 作为老年代的一部分看待）。
    
    G1 收集器之所以能建立可预测的停顿时间模型，是因为它将 Region 作为单次回收的最小单元（每次收集到的内存空间都是 Region 大小的整数倍），这样可以有计划地避免整个 Java 堆进行全区域垃圾收集。更具体的处理思路：让 G1 收集器去跟踪各个 Region 中的垃圾堆积的“价值”大小，然后在后台维护一个优先级列表，每次根据用户设定的收集停顿时间，优先处理回收价值收益最大的那些 Region（这就是“Garbage First”名字的由来）。
    
    G1 收集器之前的其他所有收集器（包括 CMS 收集器），垃圾收集的目标范围要么是整个新生代（Minor GC），或者整个老年代（Major GC），抑或整个 Java 堆（Full GC）。而 G1 跳出了这个樊笼：它可以面向堆内存中任何部分来组成回收集（Collection Set，一般称 CSet）进行回收。衡量标准不再是它属于哪个分代，而是哪块内存中存放的垃圾数量最多、回收收益最大。这就是 G1 收集器的 Mixed GC 模式。
    
31. G1和CMS比较

    https://mp.weixin.qq.com/s/VdFBkAMuGVgiMI2ZxCmE-Q  
    
32. 让JVM按照预期GC：写出让JVM先3次YoungGC再1次CMS GC
    
    ```
    public class CmsGcTest {
    
        private static final int _1M = 1*1024*1024;
        private static final int _2M = 2*1024*1024;
    
        public static void main(String[] args) {
            ygc(3);
            cmsGc(1);
            // 在这里想怎么触发GC就怎么调用ygc()和cmsGc()两个方法
        }
    
        /**
         * @param n 预期发生n次young gc
         */
        private static void ygc(int n){
            for (int i=0; i<n; i++){
                // 由于Eden区设置为8M, 所以分配8个1M就会导致一次YoungGC
                for(int j=0; j<8; j++){
                    byte[] tmp = new byte[_1M];
                }
            }
        }
    
        /**
         * @param n 预期发生n次CMS gc
         */
        private static void cmsGc(int n){
            for (int i=0; i<n; i++){
                for(int j=0; j<3; j++) {
                    // 由于设置了-XX:PretenureSizeThreshold=2M, 所以分配的2M对象不会在Eden区分配而是直接在Old区分配
                    byte[] tmp = new byte[_2M];
                }
                try {
                    // sleep10秒是为了让CMS GC线程能够有足够的时间检测到Old区达到了触发CMS GC的条件并完成CMS GC, CMS GC线程默认2s扫描一次，可以通过参数CMSWaitDuration配置，例如-XX:CMSWaitDuration=3000
                    Thread.sleep(10000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    }
    ```
31. Minor GC的时间

    我们知道JVM GC可以分为MinorGC、MajorGC和FullGC,对于Mirnor GC来讲它的耗时主要由两个因素决定:
    
    - 复制活跃对象的时间
    - 扫描card table(老年代对象引用新生代对象)的时间
    
    Java虚拟机用了一个叫做CardTable(卡表)的数据结构来标记老年代的某一块内存区域中的对象是否持有新生代对象的引用,卡表的数量取决于老年代的大小和每张卡对应的内存大小，每张卡在卡表中对应一个比特位,当老年代中的某个对象持有了新生代对象的引用时,JVM就把这个对象对应的Card所在的位置标记为dirty(bit位设置为1)，这样在Minor GC时就不用扫描整个老年代，而是扫描Card为Dirty对应的那些内存区域。 

> 引用自：https://mp.weixin.qq.com/s?__biz=MzUyMDE1ODQ3NQ==&mid=2247483851&idx=1&sn=8cb444039449848531b7ca72c396e07e&chksm=f9efedafce9864b9dbb645863d7d3c8b34e83888d07e175dd9c931576db2ecc0aa90835fcf50&scene=21#wechat_redirect

32. CMS GC触发条件

    - foreground collector：foreground collector 触发条件比较简单，一般是遇到对象分配但空间不够，就会直接触发 GC，来立即进行空间回收。采用的算法是 mark sweep，不压缩。
    - background collector：说明 background collector 的触发条件之前，先来说下 background collector 的流程，它是通过 CMS 后台线程不断的去扫描，过程中主要是判断是否符合 background collector 的触发条件，一旦有符合的情况，就会进行一次 background 的 collect。
        1. 是否是并行 Full GC：指的是在 GC cause 是 gclocker 且配置了 GCLockerInvokesConcurrent 参数, 或者 GC cause 是javalangsystemgc（就是 System.gc()调用）and 且配置了 ExplicitGCInvokesConcurrent 参数，这时会触发一次 background collector。
        2. 根据统计数据动态计算（仅未配置 UseCMSInitiatingOccupancyOnly 时）未配置 UseCMSInitiatingOccupancyOnly 时，会根据统计数据动态判断是否需要进行一次 CMS GC。
        3. 根据 Old Gen 情况判断
        4. 根据增量 GC 是否可能会失败（悲观策略）什么意思呢？两代的 GC 体系中，主要指的是 Young GC 是否会失败。如果 Young GC 已经失败或者可能会失败，JVM 就认为需要进行一次 CMS GC。


> 这篇文章极其好：https://mp.weixin.qq.com/s?__biz=Mzg3NjU3NTkwMQ==&mid=2247505094&idx=1&sn=90cfd9f65006ba8c6d96ca4d629506cd&source=41#wechat_redirect

33. 并发标记要解决什么问题？

    刚刚我们谈到的可达性分析算法是需要一个理论上的前提的：该算法的全过程都需要基于一个能保障一致性的快照中才能够分析，这意味着必须全程冻结用户线程的运行。为了不冻结用户线程的运行，那我们就需要让垃圾回收线程和用户线程同时运行。所有我们来个反证法，先假设不并发标记，即只有垃圾回收线程在运行的流程是怎样的：第一步是需要找到根节点，也就是我们常说的根节点枚举。而在这个过程中，由于GCRoots是远远少于整个java堆中的全部对象的，而且在OopMap此类优化技巧的加持下，它带来的停顿时间是非常短暂且相对固定的，可以理解为不会随着堆里面的对象的增加而增加。接下来，我们需要从GC Roots往下继续遍历对象图，进行"标记"过程。而这一步的停顿时间必然是随着java堆中的对象增加而增加的。根节点的枚举阶段是不太耗时的，也不会随着java堆里面存储的对象增加而增加耗时。而"标记"过程的耗时是会随着java堆里面存储的对象增加而增加的。"标记"阶段是所有使用可达性分析算法的垃圾回收器都有的阶段。因此我们可以知道，如果能够削减"标记"过程这部分的停顿时间，那么收益将是可观的。并发标记要解决什么问题呢？就是要消减这一部分的停顿时间。那就是让垃圾回收器和用户线程同时运行，并发工作。也就是我们说的并发标记的阶段

34. 并发标记带来了什么问题？

    在说带来什么问题之前，我们必须得先搞清楚一个问题：为什么遍历对象图的时候必须在一个能保障一致性的快照中？为了说明这个问题，我们就要引入"三色标记"大法了。注意："三色标记"也是jvm的一个考点哦。什么是"三色标记"？在遍历对象图的过程中，把访问都的对象按照"是否访问过"这个条件标记成以下三种颜色：
    
    白色：表示对象尚未被垃圾回收器访问过。显然，在可达性分析刚刚开始的阶段，所有的对象都是白色的，若在分析结束的阶段，仍然是白色的对象，即代表不可达。
    
    黑色：表示对象已经被垃圾回收器访问过，且这个对象的所有引用都已经扫描过。黑色的对象代表已经扫描过，它是安全存活的，如果有其它的对象引用指向了黑色对象，无须重新扫描一遍。黑色对象不可能直接（不经过灰色对象）指向某个白色对象。
    
    灰色：表示对象已经被垃圾回收器访问过，但这个对象至少存在一个引用还没有被扫描过。
    
    在可达性分析的扫描过程中，如果只有垃圾回收线程在工作，那肯定不会有任何问题。但是垃圾回收器和用户线程同时运行呢？这个时候就有点意思了。垃圾回收器在对象图上面标记颜色，而同时用户线程在修改引用关系，引用关系修改了，那么对象图就变化了，这样就有可能出现两种后果：一种是把原本消亡的对象错误的标记为存活，这不是好事，但是其实是可以容忍的，只不过产生了一点逃过本次回收的浮动垃圾而已，下次清理就可以。一种是把原本存活的对象错误的标记为已消亡，这就是非常严重的后果了，一个程序还需要使用的对象被回收了，那程序肯定会因此发生错误。当面试官问你：为什么会产生浮动垃圾的时候，你就可以用上面的话来回答。但是大概率情况下面试官应该更加关心第二种情况。他可能会问：你刚刚说的第二种情况，"把原本存活的对象错误的标记为已消亡"能具体的说明一下吗？怎么消亡的？垃圾回收器是怎么解决这个问题的？所以接下来，我们主要分析一下并发标记的过程中"对象消失"的问题。具体"对象"是怎么没了的。如果用户线程在标记的时候，修改了引用关系，就会出现。```并发标记除了会产生浮动垃圾，还会出现"对象消失"的问题。```

35. 怎么解决"对象消失"问题呢？

    有一个大佬叫Wilson，他在1994年在理论上证明了，当且仅当以下两个条件同时满足时，会产生"对象消失"的问题，原来应该是黑色的对象被误标为了白色：条件一：赋值器插入了一条或者多条从黑色对象到白色对象的新引用。条件二：赋值器删除了全部从灰色对象到该白色对象的直接或间接引用。你在结合我们上面出现过的图捋一捋上面的这两个条件，是不是当且仅当的关系：由于两个条件之间是当且仅当的关系。所以，我们要解决并发标记时对象消失的问题，只需要破坏两个条件中的任意一个就行。于是产生了两种解决方案：增量更新（Incremental Update）和原始快照（Snapshot At The Beginning，SATB）。在HotSpot虚拟机中，CMS是基于增量更新来做并发标记的，G1则采用的是原始快照的方式。
    
    什么是增量更新呢？增量更新要破坏的是第一个条件（赋值器插入了一条或者多条从黑色对象到白色对象的新引用），当黑色对象插入新的指向白色对象的引用关系时，就将这个新插入的引用记录下来，等并发扫描结束之后，再将这些记录过的引用关系中的黑色对象为根，重新扫描一次。可以简化的理解为：黑色对象一旦插入了指向白色对象的引用之后，它就变回了灰色对象。

    什么是原始快照呢？原始快照要破坏的是第二个条件（赋值器删除了全部从灰色对象到该白色对象的直接或间接引用），当灰色对象要删除指向白色对象的引用关系时，就将这个要删除的引用记录下来，在并发扫描结束之后，再将这些记录过的引用关系中的灰色对象为根，重新扫描一次。需要注意的是，上面的介绍中无论是对引用关系记录的插入还是删除，虚拟机的记录操作都是通过写屏障实现的。写屏障也是一个重要的知识点，但是不是本文重点，就不进行详细介绍了。
    
    只是补充两点：
    
    1.这里的写屏障和我们常说的为了解决并发乱序执行问题的"内存屏障"不是一码事，需要区分开来。
    
    2.写屏障可以看作虚拟机层面对"引用类型字段赋值"这个动作的AOP切面，在引用对象赋值时会产生一个环形通知，供程序执行额外的动作，也就是说赋值的前后都在写屏障的覆盖范畴内。在赋值前的部分的写屏障叫做写前屏障(Pre-Write Barrier)，在赋值后的则叫作写后屏障(Post-Write Barrier)。
    
    所以，经过简单的推导我们可以知道：增量更新用的是写后屏障(Post-Write Barrier)，记录了所有新增的引用关系。原始快照用的是写前屏障(Pre-Write Barrier)，将所有即将被删除的引用关系的旧引用记录下来。
    
> 这篇文章不错：https://mp.weixin.qq.com/s/ATXwtH6wCLqTdbaRqXO2Ig
36. 垃圾回收算法的优缺点：
	标记-清除算法：标记无用对象，然后进行清除回收。标记-清除算法（Mark-Sweep）是一种常见的基础垃圾收集算法，它将垃圾收集分为两个阶段：

		- 标记阶段：标记出可以回收的对象。
		- 清除阶段：回收被标记的对象所占用的空间。

	标记-清除算法之所以是基础的，是因为后面讲到的垃圾收集算法都是在此算法的基础上进行改进的。

	优点：实现简单，不需要对象进行移动。

	缺点：标记、清除过程效率低，产生大量不连续的内存碎片，提高了垃圾回收的频率。

	复制算法：为了解决标记-清除算法的效率不高的问题，产生了复制算法。它把内存空间划为两个相等的区域，每次只使用其中一个区域。垃圾收集时，遍历当前使用的区域，把存活对象复制到另外一个区域中，最后将当前使用的区域的可回收的对象进行回收。

	优点：按顺序分配内存即可，实现简单、运行高效，不用考虑内存碎片。

	缺点：可用的内存大小缩小为原来的一半，对象存活率高时会频繁进行复制。

	标记-整理算法：在新生代中可以使用复制算法，但是在老年代就不能选择复制算法了，因为老年代的对象存活率会较高，这样会有较多的复制操作，导致效率变低。标记-清除算法可以应用在老年代中，但是它效率不高，在内存回收后容易产生大量内存碎片。因此就出现了一种标记-整理算法（Mark-Compact）算法，与标记-整理算法不同的是，在标记可回收的对象后将所有存活的对象压缩到内存的一端，使他们紧凑的排列在一起，然后对端边界以外的内存进行回收。回收后，已用和未用的内存都各自一边。

	优点：解决了标记-清理算法存在的内存碎片问题。

	缺点：仍需要进行局部对象移动，一定程度上降低了效率。

	分代收集算法：当前商业虚拟机都采用分代收集的垃圾收集算法。分代收集算法，顾名思义是根据对象的存活周期将内存划分为几块。一般包括年轻代、老年代 和 永久代


37. 详细介绍一下 CMS 垃圾回收器？
    CMS 是英文 Concurrent Mark-Sweep 的简称，是以牺牲吞吐量为代价来获得最短回收停顿时间的垃圾回收器。对于要求服务器响应速度的应用上，这种垃圾回收器非常适合。在启动 JVM 的参数加上“-XX:+UseConcMarkSweepGC”来指定使用 CMS 垃圾回收器。
    
    CMS 使用的是标记-清除的算法实现的，所以在 gc 的时候回产生大量的内存碎片，当剩余内存不能满足程序运行要求时，系统将会出现 Concurrent Mode Failure，临时 CMS 会采用 Serial Old 回收器进行垃圾清除，此时的性能将会被降低。

38. CMSGC造成内存碎片的解决方法
	我们知道，CMSGC在老生代回收时产生的内存碎片会导致老生代的利用率变低；或者可能在老生代总内存大小足够的情况下，却不能容纳新生代的晋升行为（由于没有连续的内存空间可用），导致触发FullGC。针对这个问题，Sun官方给出了以下的四种解决方法：

		- 增大Xmx或者减少Xmn
		- 在应用访问量最低的时候，在程序中主动调用System.gc()，比如每天凌晨。
		- 在应用启动并完成所有初始化工作后，主动调用System.gc()，它可以将初始化的数据压缩到一个单独的chunk中，以腾出更多的连续内存空间给新生代晋升使用。
		- 降低-XX:CMSInitiatingOccupancyFraction参数以提早执行CMSGC动作，虽然CMSGC不会进行内存碎片的压缩整理，但它会合并老生代中相邻的free空间。这样就可以容纳更多的新生代晋升行为。

39. 描述一下JVM加载Class文件的原理机制
	Java中的所有类，都需要由类加载器装载到JVM中才能运行。类加载器本身也是一个类，而它的工作就是把class文件从硬盘读取到内存中。在写程序的时候，我们几乎不需要关心类的加载，因为这些都是隐式装载的，除非我们有特殊的用法，像是反射，就需要显式的加载所需要的类。类装载方式，有两种 ：

		1. 隐式装载， 程序在运行过程中当碰到通过new 等方式生成对象时，隐式调用类装载器加载对应的类到jvm中，
		2. 显式装载， 通过class.forname()等方法，显式加载需要的类

	Java类的加载是动态的，它并不会一次性将所有类全部加载后再运行，而是保证程序运行的基础类(像是基类)完全加载到jvm中，至于其他类，则在需要的时候才加载。这当然就是为了节省内存开销。
	
### 四、内存调优
> 以下三个问题来自：https://help.aliyun.com/document_detail/148851.html
1. 堆大小典型配置参数（）

    |配置参数        |说明|示例|
    |---            |---|---|
    |-Xms           |设置JVM初始内存|-Xms3550m，设置JVM初始内存为3550 MB。此值建议与-Xmx相同，避免每次垃圾回收完成后JVM重新分配内存。|
    |-Xmx           |设置最大堆大小 |-Xmx3550m，设置JVM最大可用内存为3550 MB。|
    |-Xmn2g         |设置年轻代大小|-Xmn2g，设置年轻代大小为2GB。整个JVM内存大小=年轻代大小+年老代大小+持久代大小。持久代一般固定大小为64MB，所以增大年轻代后，将会减小年老代大小。此值对系统性能影响较大，Sun官方推荐配置为整个堆的3/8。|
    |-Xss|设置线程的堆栈大小|-Xss128k，设置每个线程的堆栈大小为128 KB。说明 JDK5.0版本以后每个线程堆栈大小为1 MB，JDK5.0以前版本每个线程堆栈大小为256KB。请依据应用的线程所需内存大小进行调整。在相同物理内存下，减小该值可以生成更多的线程。但是操作系统对一个进程内的线程个数有一定的限制，无法无限生成，一般在3000个~5000个左右。|
    |-XX:NewRatio=n|设置年轻代和年老代的比值。|-XX:NewRatio=4，设置年轻代（包括Eden和两个Survivor区）与年老代的比值（除去持久代）。如果设置为4，那么年轻代与年老代所占比值为1:4，年轻代占整个堆栈的1/5。|
    |-XX:SurvivorRatio=n|年轻代中Eden区与两个Survivor区的比值。|-XX:SurvivorRatio=4，设置年轻代中Eden区与Survivor区的大小比值。如果设置为4，那么两个Survivor区与一个Eden区的比值为2:4，一个Survivor区占整个年轻代的1/6。|
    |-XX:MaxPermSize=n|设置持久代大小|-XX:MaxPermSize=16m，设置持久代大小为16 MB。|
    |-XX:MaxTenuringThreshold=n|设置垃圾最大年龄|-XX:MaxTenuringThreshold=0，设置垃圾最大年龄。如果设置为0，那么年轻代对象不经过Survivor区，直接进入年老代。对于年老代比较多的应用，提高了效率。如果将此值设置为较大值，那么年轻代对象会在Survivor区进行多次复制，增加了对象在年轻代的存活时间，增加在年轻代即被回收的概率。|

2. 吞吐量优先的GC典型配置参数

    |配置参数        |说明|示例|
    |---            |---|---|
    |-XX:+UseParallelGC|选择垃圾收集器为并行收集器。|-Xmx3800m -Xms3800m -Xmn2g -Xss128k -XX:+UseParallelGC -XX:ParallelGCThreads=20，-XX:+UseParallelGC此配置仅对年轻代有效，即在示例配置下，年轻代使用并发收集，而年老代仍旧使用串行收集。|
    |-XX:ParallelGCThreads|配置并行收集器的线程数，即同时多少个线程一起进行垃圾回收。说明 此值建议配置与处理器数目相等。|-Xmx3800m -Xms3800m -Xmn2g -Xss128k -XX:+UseParallelGC -XX:ParallelGCThreads=20，-XX:ParallelGCThreads=20表示配置并行收集器的线程数为20个。|
    |-XX:+UseParallelOldGC|配置年老代垃圾收集方式为并行收集。说明 JDK6.0支持对年老代并行收集。|-Xmx3550m -Xms3550m -Xmn2g -Xss128k -XX:+UseParallelGC -XX:ParallelGCThreads=20 -XX:+UseParallelOldGC，-XX:+UseParallelOldGC表示对年老代进行并行收集。|
    |-XX:MaxGCPauseMillis|设置每次年轻代垃圾回收的最长时间，如果无法满足此时间，JVM会自动调整年轻代大小，以满足此值。|-Xmx3550m -Xms3550m -Xmn2g -Xss128k -XX:+UseParallelGC -XX:MaxGCPauseMillis=100，-XX:MaxGCPauseMillis=100设置每次年轻代垃圾回收的最长时间为100 ms。|
    |-XX:+UseAdaptiveSizePolicy|设置此选项后，并行收集器自动选择年轻代区大小和相应的Survivor区比例，以达到目标系统规定的最低响应时该间或者收集频率，该值建议使用并行收集器时，并且一直打开。|-Xmx3550m -Xms3550m -Xmn2g -Xss128k -XX:+UseParallelGC -XX:MaxGCPauseMillis=100 -XX:+Use|

3. 响应时间优先的GC典型配置参数

    |配置参数        |说明|示例|
    |---            |---|---|
    |-XX:+UseConcMarkSweepGC|设置年老代为并发收集。说明 配置了-XX:+UseConcMarkSweepGC，建议年轻代大小使用-Xmn设置。|-Xmx3550m -Xms3550m -Xmn2g -Xss128k -XX:ParallelGCThreads=20 -XX:+UseConcMarkSweepGC -XX:+UseParNewGC|
    |-XX:+UseParNewGC|设置年轻代为并行收集。可与CMS收集同时使用。JDK5.0以上版本，JVM根据系统配置自行设置，无需再设置此值。|-Xmx3550m -Xms3550m -Xmn2g -Xss128k -XX:ParallelGCThreads=20 -XX:+UseConcMarkSweepGC -XX:+UseParNewGC|
    |-XX:CMSFullGCsBeforeCompaction|由于并发收集器不对内存空间进行压缩、整理，所以运行一段时间以后会产生“碎片”，使得运行效率降低。此值设置运行多少次GC以后对内存空间进行压缩、整理。|-Xmx3550m -Xms3550m -Xmn2g -Xss128k -XX:+UseConcMarkSweepGC -XX:CMSFullGCsBeforeCompaction=5 -XX:+UseCMSCompactAtFullCollection，-XX:CMSFullGCsBeforeCompaction=5，表示运行GC5次后对内存空间进行压缩、整理。|
    |-XX:+UseCMSCompactAtFullCollection|	打开对年老代的压缩。说明 该值可能会影响性能，但是可以消除碎片。|-Xmx3550m -Xms3550m -Xmn2g -Xss128k -XX:+UseConcMarkSweepGC -XX:CMSFullGCsBeforeCompaction=5 -XX:+UseCMSCompactA|
    
        
4. 用于辅助的GC典型配置参数
    
    |配置参数        |说明|
    |---            |---|
    |-XX:+PrintGC|用于输出GC日志。|
    |-XX:+PrintGCDetails|用于输出GC日志。|
    |-XX:+PrintGCTimeStamps|用于输出GC时间戳（基准时间形式）。|
    |-XX:+PrintGCDateStamps|用于输出GC的时间戳（日期形式，例如2019-12-24T21:53:59.234+0800）。|
    |-XX:+PrintHeapAtGC|在进行GC前后打印出堆的信息。|
    |-Xloggc:../logs/gc.log|日志文件的输出路径。|
         

> 以下来自：https://mp.weixin.qq.com/s/FHY0MelBfmgdRpT4zWF9dQ    
5. CMS基本写法
    -XX:+UseConcMarkSweepGC -XX:CMSInitiatingOccupancyFraction=75 -XX:+UseCMSInitiatingOccupancyOnly。因为我们的监控系统会通过JMX监控内存达到90%的状况，所以设置让它75%就开始跑了，早点开始也能减少Full GC等意外情况(概念重申，这种主动的CMS GC，和JVM的老生代、永久代、堆外内存完全不能分配内存了而强制Full GC是不同的概念)。为了让这个设置生效，还要设置UseCMSInitiatingOccupancyOnly，否则75％只被用来做开始的参考值，后来还是JVM自己算。
     
6. -XX:MaxTenuringThreshold=2
    这是改动效果最明显的一个参数了。对象在Survivor区最多熬过多少次Young GC后晋升到年老代，JDK8里CMS 默认是6，其他如G1是15。Young GC是最大的应用停顿来源，而YGC后存活对象的多少又直接影响停顿的时间，所以如果清楚Young GC的执行频率和应用里大部分临时对象的最长生命周期，可以把它设的更短一点，让其实不是临时对象的新生代对象赶紧晋升到年老代，别呆着。用-XX:+PrintTenuringDistribution观察下，如果后面几代的大小总是差不多，证明过了某个年龄后的对象总能晋升到老生代，就可以把晋升阈值设小，比如JMeter里2就足够了。
    
7. -Xmn or -XX:NewSize or -XX:NewRatio

   JDK默认新生代占堆大小的1/3， 个人喜欢把对半分， 因为增大新生代能减少GC的频率，如果老生代里没多少长期对象的话，占2/3通常太多了。可以用-Xmn 直接赋值(等于-XX:NewSize and -XX:MaxNewSize同值的缩写)，或把NewRatio设为1来对半分。  
  
8. JVM调优有什么经验吗？

    要明白一点，所有的调优的目的都是为了用更小的硬件成本达到更高的吞吐，JVM 的调优也是一样。通过对垃圾收集器和内存分配的调优达到性能的最佳。简单的参数含义首先，需要知道几个主要的参数含义。
    
      ![图片](https://txxs.github.io/pic/q&a/WX20210705-101618@20o.png)
    
    ```
    -Xms 设置初始堆的大小，-Xmx 设置最大堆的大小；
    -XX:NewSize 年轻代大小，-XX:MaxNewSize 年轻代最大值，-Xmn 则是相当于同时配置 -XX:NewSize 和 -XX:MaxNewSize 为一样的值；
    -XX:NewRatio 设置年轻代和年老代的比值。如果为3，表示年轻代与老年代比值为 1:3，默认值为2；
    -XX:SurvivorRatio 年轻代和两个 Survivor 的比值。默认值为8，代表比值为 8:1:1；
    -XX:PretenureSizeThreshold 当创建的对象超过指定大小时，直接把对象分配在老年代；
    -XX:MaxTenuringThreshold 设定对象在 Survivor 复制的最大年龄阈值，超过阈值转移到老年代；
    -XX:MaxDirectMemorySize 当 Direct ByteBuffer 分配的堆外内存到达指定大小后，即触发 Full GC。
    ```
    
    ```
    为了打印日志方便排查问题最好开启GC日志。开启GC日志对性能影响微乎其微，但是能帮助我们快速排查定位问题。-XX:+PrintGCTimeStamps -XX:+PrintGCDetails -Xloggc:gc.log
    一般设置 -Xms=-Xmx。这样可以获得固定大小的堆内存，减少 GC 次数和耗时，可以使得堆相对稳定；
    -XX:+HeapDumpOnOutOfMemoryError 让 JVM 在发生内存溢出的时候自动生成内存快照，方便排查问题；
    -Xmn 设置新生代的大小。太小会增加 YGC，太大会减小老年代大小，一般设置为整个堆的1/4到1/3；
    设置 -XX:+DisableExplicitGC 禁止系统 System.gc()。防止手动误触发 FGC 造成问题。
    ```
> 以下引用自：https://dunwu.github.io/javacore/jvm/jvm-cli-tools.html#_2-2-jstat-%E4%BD%BF%E7%94%A8%E7%A4%BA%E4%BE%8B
9. jps	JVM进程状态工具。显示系统内的所有JVM进程。
	```
	列出本地Java进程
	$ jps
	18027 Java2Demo.JAR
	18032 jps
	18005 jstat
	```

	jstat	JVM统计监控工具。监控虚拟机运行时状态信息，它可以显示出 JVM 进程中的类装载、内存、GC、JIT编译等运行数据。
	```
	使用 jstat -gc pid time 命令可以查看 GC 统计信息。【示例】以 250 毫秒的间隔进行 7 个采样，并显示-gcutil 选项指定的输出。
	$ jstat -gcutil 21891 250 7
	  S0     S1     E      O      M     CCS    YGC     YGCT    FGC    FGCT     GCT
	  0.00  97.02  70.31  66.80  95.52  89.14      7    0.300     0    0.000    0.300
	  0.00  97.02  86.23  66.80  95.52  89.14      7    0.300     0    0.000    0.300
	  0.00  97.02  96.53  66.80  95.52  89.14      7    0.300     0    0.000    0.300
	 91.03   0.00   1.98  68.19  95.89  91.24      8    0.378     0    0.000    0.378
	 91.03   0.00  15.82  68.19  95.89  91.24      8    0.378     0    0.000    0.378
	 91.03   0.00  17.80  68.19  95.89  91.24      8    0.378     0    0.000    0.378
	 91.03   0.00  17.80  68.19  95.89  91.24      8    0.378     0    0.000    0.378

	S0C：年轻代中 To Survivor 的容量（单位 KB）；
	S1C：年轻代中 From Survivor 的容量（单位 KB）；
	S0U：年轻代中 To Survivor 目前已使用空间（单位 KB）；
	S1U：年轻代中 From Survivor 目前已使用空间（单位 KB）；
	EC：年轻代中 Eden 的容量（单位 KB）；
	EU：年轻代中 Eden 目前已使用空间（单位 KB）；
	OC：Old 代的容量（单位 KB）；
	OU：Old 代目前已使用空间（单位 KB）；
	MC：Metaspace 的容量（单位 KB）；
	MU：Metaspace 目前已使用空间（单位 KB）；
	YGC：从应用程序启动到采样时年轻代中 gc 次数；
	YGCT：从应用程序启动到采样时年轻代中 gc 所用时间 (s)；
	FGC：从应用程序启动到采样时 old 代（全 gc）gc 次数；
	FGCT：从应用程序启动到采样时 old 代（全 gc）gc 所用时间 (s)；
	GCT：从应用程序启动到采样时 gc 用的总时间 (s)。
	```
	jmap	JVM堆内存分析工具。用于打印JVM进程对象直方图、类加载统计。并且可以生成堆转储快照（一般称为heapdump或dump文件）。

	```
	-dump - 生成堆转储快照。-dump:live 只保存堆中的存活对象。
	-finalizerinfo - 显示在 F-Queue 队列等待执行 finalizer 方法的对象
	-heap - 显示 Java 堆详细信息。
	-histo - 显示堆中对象的统计信息，包括类、实例数量、合计容量。-histo:live 只统计堆中的存活对象。
	-permstat - to print permanent generation statistics
	-F - 当-dump 没有响应时，强制生成 dump 快照
	```

	```
	查看实例数最多的类
	$ jmap -histo 29527 | head -n 6

	 num     #instances         #bytes  class name
	----------------------------------------------
	   1:      13673280     1438961864  [C
	   2:       1207166      411277184  [I
	   3:       7382322      347307096  [Ljava.lang.Object;
	```

	```
	查看指定进程的堆信息。注意：使用 CMS GC 情况下，jmap -heap PID 的执行有可能会导致 java 进程挂起。
	$ jmap -heap 12379
	Attaching to process ID 12379, please wait...
	Debugger attached successfully.
	Server compiler detected.
	JVM version is 17.0-b16

	using thread-local object allocation.
	Parallel GC with 6 thread(s)

	Heap Configuration:
	   MinHeapFreeRatio = 40
	   MaxHeapFreeRatio = 70
	   MaxHeapSize      = 83886080 (80.0MB)
	   NewSize          = 1310720 (1.25MB)
	   MaxNewSize       = 17592186044415 MB
	   OldSize          = 5439488 (5.1875MB)
	   NewRatio         = 2
	   SurvivorRatio    = 8
	   PermSize         = 20971520 (20.0MB)
	   MaxPermSize      = 88080384 (84.0MB)

	Heap Usage:
	PS Young Generation
	Eden Space:
	   capacity = 9306112 (8.875MB)
	   used     = 5375360 (5.1263427734375MB)
	   free     = 3930752 (3.7486572265625MB)
	   57.761608714788736% used
	From Space:
	   capacity = 9306112 (8.875MB)
	   used     = 3425240 (3.2665634155273438MB)
	   free     = 5880872 (5.608436584472656MB)
	   36.80634834397007% used
	To Space:
	   capacity = 9306112 (8.875MB)
	   used     = 0 (0.0MB)
	   free     = 9306112 (8.875MB)
	   0.0% used
	PS Old Generation
	   capacity = 55967744 (53.375MB)
	   used     = 48354640 (46.11457824707031MB)
	   free     = 7613104 (7.2604217529296875MB)
	   86.39733629427693% used
	PS Perm Generation
	   capacity = 62062592 (59.1875MB)
	   used     = 60243112 (57.452308654785156MB)
	   free     = 1819480 (1.7351913452148438MB)
	   97.06831451706046% used
	```
	jstack	JVM栈查看工具。用于打印JVM进程的线程和锁的情况。并且可以生成线程快照（一般称为threaddump或javacore文件）。
	```
	jstack 通常会结合 top -Hp pid 或 pidstat -p pid -t 一起查看具体线程的状态，也经常用来排查一些死锁的异常。

	线程出现停顿的时候通过 jstack 来查看各个线程的调用堆栈，就可以知道没有响应的线程到底在后台做什么事情，或者等待什么资源。 如果 java 程序崩溃生成 core 文件，jstack 工具可以用来获得 core 文件的 java stack 和 native stack 的信息，从而可以轻松地知道 java 程序是如何崩溃和在程序何处发生问题。另外，jstack 工具还可以附属到正在运行的 java 程序中，看到当时运行的 java 程序的 java stack 和 native stack 的信息, 如果现在运行的 java 程序呈现 hung 的状态，jstack 是非常有用的。
	```
	jhat	用来分析 map生成的dump文件。
	jinfo	JVM信息查看工具。用于实时查看和调整JVM进程参数。
	```
	是 Java 配置信息工具。jinfo 用于实时查看和调整虚拟机运行参数。如传递给 Java 虚拟机的-X（即输出中的 jvm_args）、-XX参数（即输出中的 VM Flags），以及可在 Java 层面通过System.getProperty获取的-D参数（即输出中的 System Properties）。

	$ jinfo -sysprops 29527
	Attaching to process ID 29527, please wait...
	Debugger attached successfully.
	Server compiler detected.
	JVM version is 25.222-b10
	```
	jcmd	JVM命令行调试工具。用于向JVM进程发送调试命令。
	```
	jhat 与 jmap 搭配使用，用来分析 jmap 生成的 dump 文件。jhat 内置了一个微型的 HTTP/HTML 服务器，生成 dump 的分析结果后，可以在浏览器中查看。

	注意：一般不会直接在服务器上进行分析，因为 jhat 是一个耗时并且耗费硬件资源的过程，一般把服务器生成的 dump 文件，用 jvisualvm 、Eclipse Memory Analyzer、IBM HeapAnalyzer 等工具来分析。
	```
> 以下引自：https://www.cnblogs.com/wang-meng/p/71c2a5cba49794f5af38f243db4f70ab.html

> 这篇文章也不错：https://cloud.tencent.com/developer/article/1600345

> 这个也很好：https://blog.csdn.net/BigBug_500/article/details/107895601
10. Java线上问题排查思路

	一般分析CPU或者内存异常情况可以通过以下几步：
		- 查看日志
		- 查看CPU情况
		- 查看TCP情况
		- 查看java线程，jstack
		- 查看java堆，jmap
		- 通过MAT分析堆文件，寻找无法被回收的对象

	jmap分析：
		- jmap -heap pid 输出当前进程 JVM 堆新生代、老年代、持久代等请情况，GC 使用的算法等信息
		- jmap -histo:live {pid} | head -n 10 输出当前进程内存中所有对象包含的大小
		- jmap -dump:format=b,file=/usr/local/logs/gc/dump.hprof {pid} 以二进制输出档当前内存的堆情况，然后可以导入 MAT 等工具进行
		- dump分析：MAT(Memory Analyzer Tool)，一个基于 Eclipse 的内存分析工具，是一个快速、功能丰富的JAVA heap分析工具，它可以帮助我们查找内存泄漏和减少内存消耗。使用内存分析工具从众多的对象中进行分析，快速的计算出在内存中对象的占用大小，看看是谁阻止了垃圾收集器的回收工作，并可以通过报表直观的查看到可能造成这种结果的对象。

	某Java进程CPU占用率高，我们想要定位到其中CPU占用率最高的线程。
		- 先利用top命令找到CPU占用高的进程pid。也可以通过ps -ef | grep 应用名来快速定位自己应用的pid
		- 占用率最高的线程 ID 为29173，将其转换为 16 进制形式 (因为 java native 线程以 16 进制形式输出) ```printf '%x\n' 29173```。
		- 利用 jstack 打印出 java 线程调用栈信息 ```jstack 29080 | grep '0x71f5' -A 50 --color```

19. java Agent了解

    https://mp.weixin.qq.com/s/9xn9Ht4WO0Et_V7ZclsX_Q
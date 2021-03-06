### spring容器和springmvc容器区别

![1](https://txxs.github.io/pic/tofutureinterview/1-1.png)

web容器中有servlet容器，spring项目部署后存在spring容器和springmvc容器。其中spring控制service层和dao层的bean对象。springmvc容器控制controller层bean对象。servlet容器控制servlet对象。项目启动是，首先servlet初始化，初始化过程中通过web.xml中spring的配置加载spring配置，初始化spring容器和springmvc容器。待容器加载完成。servlet初始化完成，则完成启动。HTTP请求到达web容器后，会到达Servlet容器，容器通过分发器分发到具体的spring的Controller层。执行业务操作后返回结果。

Spring是父容器，SpringMVC是其子容器，并且在Spring父容器中注册的Bean对于SpringMVC容器中是可见的，而在SpringMVC容器中注册的Bean对于Spring父容器中是不可见的，也就是子容器可以看见父容器中的注册的Bean，反之就不行。

Spring提供的注解：@Controller，@Service，@Respository这三个注解，因为他们是继承自@Component。@Required、@Autowired、 @PostConstruct、@PersistenceContext、@Resource、@PreDestroy等注解。有时间还可以补充

SpringMVC提供的注解：@RequestMapping、@RequestBody、@ResponseBody、@RestController等

### 拦截器和过滤器

共同：他们都是用来检查程序的共同场景，只不过拦截器是面向Action的，过滤器是面向整个web应用的。

- 解决权限验证问题
- 解决乱码问题

### SpringMVC拦截器

实现SpringMVC拦截器的三个步骤

1. 创建一个实现HandlerInterceptor接口，并实现接口的方法的类
2. 将创建的拦截器注册到SpringMVC的配置文件中实现注册
```
<mvc：interceptors>
<bean class="路径下的类">
</mvc：interceptors>
```
3. 配置拦截器的拦截规则：

```
<mvc：interceptors>
   <mvc：interceptor>
          <mvc:mapping path="拦截的action">
          <bean class="路径下的类">
   </mvc：interceptor>
</mvc：interceptors>
```
拦截器中三个方法的介绍：

- preHandle()方法是否将当前请求拦截下来。（返回true请求继续运行，返回false请求终止（包括action层也会终止），Object arg代表被拦截的目标对象。）
- postHandle()方法的ModelAndView对象可以改变发往的视图或修改发往视图的信息。
- afterCompletion()方法表示视图显示之后在执行该方法。（一般用于资源的销毁）

### 过滤器

当浏览器发送请求给服务器的时候，先执行过滤器，然后才访问Web的资源。服务器响应Response，从Web资源抵达浏览器之前，也会途径过滤器。。

![1](https://txxs.github.io/pic/tofutureinterview/1-2.png)

实现一个简单的过滤器

```
    public class FilterDemo1 implements Filter {
        public void destroy() {
        }
    
        public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws ServletException, IOException {
    
            //执行这一句，说明放行（让下一个过滤器执行，如果没有过滤器了，就执行执行目标资源）
            chain.doFilter(req, resp);
        }
    
        public void init(FilterConfig config) throws ServletException {
            
        }
    }
```
过滤器的doFilter()方法是极其重要的，FilterChain接口是代表着所有的Filter，FilterChain中的doFilter()方法决定着是否放行下一个过滤器执行（如果没有过滤器了，就执行目标资源）。客户端发送http请求到Web服务器上，Web服务器执行过滤器，执行到”准备放行“时，就把字符串输出到控制台上，接着执行doFilter()方法，Web服务器发现没有过滤器了，就执行目标资源（也就是test.jsp）。目标资源执行完后，回到过滤器上，继续执行代码，然后输出”放行完成“

### 拦截器和过滤器的区别：

- 拦截器是基于java的反射机制的，而过滤器是基于函数回调。
- 拦截器不依赖与servlet容器，过滤器依赖与servlet容器。
- 拦截器只能对action请求起作用，而过滤器则可以对几乎所有的请求起作用。
- 拦截器可以访问action上下文、值栈 里的对象，而过滤器不能访问。
- 在action的生命周期中，拦截器可以多次被调用，而过滤器只能在容器初始化时被调用一次。
- 拦截器可以获取IOC容器中的各个bean，而过滤器就不行，这点很重要，在拦截器里注入一个service，可以调用业务逻辑。

### 如何自己实现Spring的 IOC依赖反转的功能

IOC是DI的原理。依赖注入是向某个类或方法注入一个值，其中所用到的原理就是控制反转。IoC（Inversion of Control）是指容器控制程序对象之间的关系，而不是传统实现中，由程序代码直接操控。控制权由应用代码中转到了外部容器，控制权的转移是所谓反转。依赖注入的思想是通过反射机制实现的，在实例化一个类时，它通过反射调用类中set方法将事先保存在HashMap中的类属性(至于是什么样的HashMap后面会提到)注入到类中。IoC的优点：降低了组件之间的耦合，降低了业务对象之间替换的复杂性，使之能够灵活的管理对象。

IOC 利用了反射，自己有个id,classtype,hashmap，所有的功能都在hashmap中，然后利用反射的Class.forName把把classtype转化成类，然后利用反射的setFieldValue()从hashMap中把属性和方法取出来，注入进去。最终把类创建出来

原文地址：https://xilidou.com/2018/01/08/spring-ioc/

自己博客中的文章：https://blog.csdn.net/maoyeqiu/article/details/49467643

1. 初始化 IoC 容器。
2. 读取配置文件。
3. 将配置文件转换为容器识别对的数据结构（这个数据结构在Spring中叫做 BeanDefinition
4. 利用数据结构依次实例化相应的对象
5. 注入对象之间的依赖关系

#### 具体过程

1. bean 定义了框架的数据结构

BeanDefinition 是我们项目的核心数据结构。用于描述我们需要 IoC 框架管理的对象。包含了对象的 name，class的名称。如果是接口的实现，还有该对象实现的接口。以及构造函数的传参的列表 constructorArgs 和需要注入的参数列表 `propertyArgs。

```
@Data
@ToString
public class BeanDefinition {
    private String name;
    private String className;
    private String interfaceName;
    private List<ConstructorArg> constructorArgs;
    private List<PropertyArg> propertyArgs;
}
```

2. 再看看我们的工具类包里面的对象：ClassUtils、BeanUtils、ReflectionUtils

ClassUtils 负责处理 Java 类的加载,代码如下：
```
public class ClassUtils {
    public static ClassLoader getDefultClassLoader(){
        return Thread.currentThread().getContextClassLoader();
    }
    public static Class loadClass(String className){
        try {
            return getDefultClassLoader().loadClass(className);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        return null;
    }
}
```

BeanUtils 负责处理对象的实例化，这里我们使用了 cglib 这个工具包，代码如下：

```
public class BeanUtils {
    public static <T> T instanceByCglib(Class<T> clz,Constructor ctr,Object[] args) {
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(clz);
        enhancer.setCallback(NoOp.INSTANCE);
        if(ctr == null){
            return (T) enhancer.create();
        }else {
            return (T) enhancer.create(ctr.getParameterTypes(),args);
        }
    }
}
```

ReflectionUtils 主要通过 Java 的反射原理来完成对象的依赖注入：
```
public class ReflectionUtils {

    public static void injectField(Field field,Object obj,Object value) throws IllegalAccessException {
        if(field != null) {
            field.setAccessible(true);
            field.set(obj, value);
        }
    }
}
```

3. 核心逻辑
我的 IoC 框架，目前只支持一种 ByName 的注入。所以我们的 BeanFactory 就只有一个方法：
```
public interface BeanFactory {
    Object getBean(String name) throws Exception;
}

public class BeanFactoryImpl implements BeanFactory{

    private static final ConcurrentHashMap<String,Object> beanMap = new ConcurrentHashMap<>();

    private static final ConcurrentHashMap<String,BeanDefinition> beanDefineMap= new ConcurrentHashMap<>();

    private static final Set<String> beanNameSet = Collections.synchronizedSet(new HashSet<>());

    @Override
    public Object getBean(String name) throws Exception {
        //查找对象是否已经实例化过
        Object bean = beanMap.get(name);
        if(bean != null){
            return bean;
        }
        //如果没有实例化，那就需要调用createBean来创建对象
        bean =  createBean(beanDefineMap.get(name));

        if(bean != null) {

            //对象创建成功以后，注入对象需要的参数
            populatebean(bean);

            //再把对象存入Map中方便下次使用。
            beanMap.put(name,bean;
        }

        //结束返回
        return bean;
    }

    protected void registerBean(String name, BeanDefinition bd){
        beanDefineMap.put(name,bd);
        beanNameSet.add(name);
    }

    private Object createBean(BeanDefinition beanDefinition) throws Exception {
        String beanName = beanDefinition.getClassName();
        Class clz = ClassUtils.loadClass(beanName);
        if(clz == null) {
            throw new Exception("can not find bean by beanName");
        }
        List<ConstructorArg> constructorArgs = beanDefinition.getConstructorArgs();
        if(constructorArgs != null && !constructorArgs.isEmpty()){
            List<Object> objects = new ArrayList<>();
            for (ConstructorArg constructorArg : constructorArgs) {
                objects.add(getBean(constructorArg.getRef()));
            }
            return BeanUtils.instanceByCglib(clz,clz.getConstructor(),objects.toArray());
        }else {
            return BeanUtils.instanceByCglib(clz,null,null);
        }
    }

    private void populatebean(Object bean) throws Exception {
        Field[] fields = bean.getClass().getSuperclass().getDeclaredFields();
        if (fields != null && fields.length > 0) {
            for (Field field : fields) {
                String beanName = field.getName();
                beanName = StringUtils.uncapitalize(beanName);
                if (beanNameSet.contains(field.getName())) {
                    Object fieldBean = getBean(beanName);
                    if (fieldBean != null) {
                        ReflectionUtils.injectField(field,bean,fieldBean);
                    }
                }
            }
        }
    }
}
```

首先我们看到在 BeanFactory 的实现中。我们有两 HashMap，beanMap 和 beanDefineMap。 beanDefineMap 存储的是对象的名称和对象对应的数据结构的映射。beanMap 用于保存 beanName和实例化之后的对象。容器初始化的时候，会调用 BeanFactoryImpl.registerBean 方法。把 对象的 BeanDefination 数据结构，存储起来。当我们调用 getBean() 的方法的时候。会先到 beanMap 里面查找，有没有实例化好的对象。如果没有，就会去beanDefineMap查找这个对象对应的 BeanDefination。再利用DeanDefination去实例化一个对象。对象实例化成功以后，我们还需要注入相应的参数，调用 populatebean()这个方法。在 populateBean 这个方法中，会扫描对象里面的Field，如果对象中的 Field 是我们IoC容器管理的对象，那就会调用 我们上文实现的 ReflectionUtils.injectField来注入对象。一切准备妥当之后，我们对象就完成了整个 IoC 流程。最后这个对象放入 beanMap 中,方便下一次使用。

4. 容器
我们所谓的容器，就是对BeanFactory的扩展，负责管理 BeanFactory。我们的这个IoC 框架使用 Json 作为配置文件，所以我们容器就命名为 JsonApplicationContext。当然之后你愿意实现 XML 作为配置文件的容器你就可以自己写一个 XmlApplicationContext，如果基于注解的容器就可以叫AnnotationApplcationContext。这些实现留个大家去完成。

```
public class JsonApplicationContext extends BeanFactoryImpl{
    private String fileName;
    public JsonApplicationContext(String fileName) {
        this.fileName = fileName;
    }
    public void init(){
        loadFile();
    }
    private void loadFile(){
        InputStream is = Thread.currentThread().getContextClassLoader().getResourceAsStream(fileName);
        List<BeanDefinition> beanDefinitions = JsonUtils.readValue(is,new TypeReference<List<BeanDefinition>>(){});
        if(beanDefinitions != null && !beanDefinitions.isEmpty()) {
            for (BeanDefinition beanDefinition : beanDefinitions) {
                registerBean(beanDefinition.getName(), beanDefinition);
            }
        }
    }
}
```
这个容器的作用就是 读取配置文件。将配置文件转换为容器能够理解的 BeanDefination。然后使用 registerBean 方法。注册这个对象。

### 如何实现AOP（核心是动态代理，容器是反射）

AOP面向方面编程基于IoC，是对OOP的有益补充，实现AOP的技术，主要分为两大类：一是采用动态代理技术，利用截取消息的方式，对该消息进行装饰，以取代原有对象行为的执行；二是采用静态织入的方式，引入特定的语法创建“方面”，从而使得编译器可以在编译期间织入有关“方面”的代码。

Spring实现AOP：JDK动态代理和CGLIB代理 JDK动态代理：其代理对象必须是某个接口的实现，它是通过在运行期间创建一个接口的实现类来完成对目标对象的代理；其核心的两个类是InvocationHandler和Proxy。 CGLIB代理：实现原理类似于JDK动态代理，只是它在运行期间生成的代理对象是针对目标类扩展的子类。CGLIB是高效的代码生成包，底层是依靠ASM（开源的java字节码编辑类库）操作字节码实现的，性能比JDK强；

AOP编程的目的是分离目标对象的业务代码与关注点代码，使得关注点代码只写一次，而在执行业务代码的时候会动态植入关注点代码。原文地址：http://www.voidcn.com/article/p-ndxwwotf-bqv.html

这篇文章也不错：https://www.iteye.com/blog/zk-chs-2266685

目标对象 IUserDao与UserDao
```
public interface IUserDao {
	void save();
	
	void find();
}

// 目标对象
public class UserDao implements IUserDao{
	@Override
	public void save() {
		System.out.println("模拟： 保存用户！");
	}

	@Override
	public void find() {
		System.out.println("查询");
	}

}
```

关注点代码类
```
@Component
public class MyAOP {

    //写关注点代码 关注点代码只写一次，之后通过代理对象动态植入到目标对象的业务代码中

    public void beginTransaction(){
        System.out.println("开启事务..");
    }

    public void commit(){
        System.out.println("提交事务..");
    }
}
```

代理工厂
```
public class ProxyObjectFactory {

    /**
     * 生成动态代理对象
     * @param target 目标对象
     * @param MyAop  提供关注点代码的对象
     * @return
     */
    public Object getProxyInstance(final Object target, final MyAOP MyAop){
        Object proxyInstance = Proxy.newProxyInstance(
                target.getClass().getClassLoader(),
                target.getClass().getInterfaces(),
                new InvocationHandler() {
                    @Override
                    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                        String methodName = method.getName();
                        Object result = null;
                        if("save".equals(methodName)){
                            MyAop.beginTransaction();
                            result = method.invoke(target, args);
                            MyAop.commit();
                        }else{
                            result = method.invoke(target, args);
                        }
                        return result;
                    }
                }
        );
        return proxyInstance;
    }
}
```
### 注解是怎么实现的

来源：https://www.cnblogs.com/lsx1993/p/4793124.html

annotation是挺简单的东西.其实就是个声明。然后通过反射去取那些声明了值。通过java的反射机制相关的API来访问Annotation信息。相关类（框架或工具中的类）根据这些信息来决定如何使用该程序元素或改变它们的行为。Java语言解释器在工作时会忽略这些Annotation，因此在JVM中这些Annotation是“不起作用”的，只能通过配套的工具才能对这些Annotation类型的信息进行访问和处理。

Spring容器根据注解的过滤规则扫描读取注解Bean定义类，并将其注册到Spring IoC容器中。SpringIoC容器通过Bean后置注解处理器解析Bean内部的注解。Spring实现@Autowire解析和注入的核心的类是通过AutowiredAnnotationBeanPostProcessor（注解处理器）来实现的。我们可以通过其方法列表看出，其中对字段的注入，对属性的注入，还有选择相应的构造方法来注入。

- 从构造方法的缓存中查询其构造方法
- 若缓存中不存在，则根据反射获取所有构造方法
- 遍历所有构造方法，查询器是否含有@Autowired属性
- 判断Autowired注解中指定了required属性 （required属性就是判断是否强依依赖）若存在required就使用默认构造方法。
- 返回指定的构造方法

处理器：

- 注册@Configuration处理器ConfigurationClassPostProcessor，
- 注册@Autowired、@Value、@Inject处理器AutowiredAnnotationBeanPostProcessor，
- 注册@Required处理器RequiredAnnotationBeanPostProcessor



自己博客中的：https://blog.csdn.net/maoyeqiu/article/details/49558725

```

@TesterInfo(
	priority = Priority.HIGH, 
	createdBy = "mkyong.com",  
	tags = {"sales","test" }
)
public class TestExample {
@Test
	void testA() {
	  if (true)
		throw new RuntimeException("This test always failed");
	}
}

//类上的注解
Class<TestExample> obj = TestExample.class;
	if (obj.isAnnotationPresent(TesterInfo.class)) {
 
		Annotation annotation = obj.getAnnotation(TesterInfo.class);
		TesterInfo testerInfo = (TesterInfo) annotation;


System.out.printf("%nPriority :%s", testerInfo.priority());
System.out.printf("%nCreatedBy :%s", testerInfo.createdBy());
System.out.printf("%nTags :");

//方法上的注解
for (Method method : obj.getDeclaredMethods()) {
		if (method.isAnnotationPresent(Test.class)) {
			Annotation annotation = method.getAnnotation(Test.class);
			Test test = (Test) annotation;
```


### 整个注入的过程，怎么实现管理的

核心IOC和AOP，这两个弄清楚了就好了，还有反射，反射是整个Spring的基础

### spring、jdk和springmvc注解

1. jdk

- @Override 表示当前方法覆盖了父类的方法
- @Deprecation 表示方法已经过时,方法上有横线，使用时会有警告。
- @SuppviseWarnings 表示关闭一些警告信息(通知java编译器忽略特定的编译警告)

https://juejin.im/post/5a619f886fb9a01c9f5b7e4f

- @Target 用于描述注解的使用范围,有一个枚举ElementType来指定
- @Retention 表示需要在什么级别保存该注释信息，用于描述注解的生命周期
- @Documented 如果用javadoc生成文档时，想把注解也生成文档，就带这个
- @Inherited 阐述了某个被标注的类型是被继承的

自己定义了一个注解类

```
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Dog {
    public String dog() default "";
}
```
复制代码我定义了一个Dog注解，它有一个属性为dog,是String类型的，默认值为"".我在使用的时候可以这样使用,@Dog(dog="小黄"),还可以直接这样使用@Dog,不指定dog属性，默认就是"" .


2. spring

原文地址：

https://blog.csdn.net/u010648555/article/details/76299467


@Component可以代替@Repository、@Service、@Controller，因为这三个注解是被@Component标注的。如下代码
```
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface Controller {
    String value() default "";
}
```

- @Autowired：属于Spring 的org.springframework.beans.factory.annotation包下,可用于为类的属性、构造器、方法进行注值,默认按照类型装配
- @Resource：不属于spring的注解，而是来自于JSR-250位于java.annotation包下，使用该annotation为目标bean指定协作者Bean。 
- @PostConstruct 和 @PreDestroy 方法 实现初始化和销毁bean之前进行的操作
- @Configuration
- @Bean

3. spring MVC

- @Controller 很明显是springmvc的
- @RequestMapping ： 这个注解用于将url映射到整个处理类或者特定的处理请求的方法
- @RequestParam ：将请求的参数绑定到方法中的参数上，有required参数，默认情况下，required=true，也就是改参数必须要传。
- @PathVariable ： 该注解用于方法修饰方法参数，会将修饰的方法参数变为可供使用的uri变量（可用于动态绑定）。
```
@RequestMapping(value="/happy/{dayid}",method=RequestMethod.GET)
public String findPet(@PathVariable String dayid, Model mode) {
//使用@PathVariable注解绑定 {dayid} 到String dayid
}
```
- @RequestBody ： @RequestBody是指方法参数应该被绑定到HTTP请求Body上。
```
@RequestMapping(value = "/something", method = RequestMethod.PUT)
public void handle(@RequestBody String body，@RequestBody User user){
   //可以绑定自定义的对象类型
}
```
- @ResponseBody ： @ResponseBody与@RequestBody类似，它的作用是将返回类型直接输入到HTTP response body中。
- @RestController ：控制器实现了REST的API，只为服务于JSON，XML或其它自定义的类型内容，@RestController用来创建REST类型的控制器，与@Controller类型。@RestController就是这样一种类型，它避免了你重复的写@RequestMapping与@ResponseBody。
- @ModelAttribute ：@ModelAttribute可以作用在方法或方法参数上，当它作用在方法上时，标明该方法的目的是添加一个或多个模型属性（model attributes）。

### 解释Spring支持的几种bean的作用域

Spring框架支持以下五种bean的作用域：

- singleton : bean在每个Spring ioc 容器中只有一个实例。
- prototype：一个bean的定义可以有多个实例。每次请求都会创建一个新的 bean 实例。
- request：每次http请求都会创建一个bean，该作用域仅在基于web的Spring ApplicationContext情形下有效。
- session：在一个HTTP Session中，一个bean定义对应一个实例。该作用域仅在基于web的Spring ApplicationContext情形下有效。
- global-session：在一个全局的HTTP Session中，一个bean定义对应一个实例。该作用域仅在基于web的Spring ApplicationContext情形下有效。

### Spring框架中的单例Beans是线程安全的么？

Spring框架中的单例bean不是线程安全的。Spring框架并没有对单例bean进行任何多线程的封装处理。关于单例bean的线程安全和并发问题需要开发者自行去搞定。最浅显的解决办法就是将多态bean的作用域由“singleton”变更为“prototype”。

在Bean对象中尽量避免定义可变的成员变量（不太现实）。

在类中定义一个ThreadLocal成员变量，将需要的可变成员变量保存在 ThreadLocal 中（推荐的一种方式）。

### Spring 框架中用到了哪些设计模式？
关于下面一些设计模式的详细介绍，可以看笔主前段时间的原创文章《面试官:“谈谈Spring中都用到了那些设计模式?”。》 。
 

- 工厂设计模式 : Spring使用工厂模式通过 BeanFactory、ApplicationContext 创建 bean 对象。
- 代理设计模式 : Spring AOP 功能的实现。
- 单例设计模式 : Spring 中的 Bean 默认都是单例的。
- 模板方法模式 : Spring 中 jdbcTemplate、hibernateTemplate 等以 Template 结尾的对数据库操作的类，它们就使用到了模板模式。
- 包装器设计模式 : 我们的项目需要连接多个数据库，而且不同的客户在每次访问中根据需要会去访问不同的数据库。这种模式让我们可以根据客户的需求能够动态切换不同的数据源。
- 观察者模式: Spring 事件驱动模型就是观察者模式很经典的一个应用。
- 适配器模式 :Spring AOP 的增强或通知(Advice)使用到了适配器模式、spring MVC 中也是用到了适配器模式适配Controller。


### @Component 和 @Bean 的区别是什么？

作用对象不同: @Component 注解作用于类，而@Bean注解作用于方法。
@Component通常是通过类路径扫描来自动侦测以及自动装配到Spring容器中（我们可以使用 @ComponentScan 注解定义要扫描的路径从中找出标识了需要装配的类自动装配到 Spring 的 bean 容器中）。@Bean 注解通常是我们在标有该注解的方法中定义产生这个 bean,@Bean告诉了Spring这是某个类的示例，当我需要用它的时候还给我。
@Bean 注解比 Component 注解的自定义性更强，而且很多地方我们只能通过 @Bean 注解来注册bean。比如当我们引用第三方库中的类需要装配到 Spring容器时，则只能通过 @Bean来实现。

### Spring 管理事务的方式有几种？

编程式事务，在代码中硬编码。(不推荐使用)

声明式事务，在配置文件中配置（推荐使用）

声明式事务又分为两种：

基于XML的声明式事务

基于注解的声明式事务

### Spring有几种配置方式？
将Spring配置到应用开发中有以下三种方式：

- 基于XML的配置
- 基于注解的配置
- 基于Java的配置

### 解释不同方式的自动装配

- no：默认的方式是不进行自动装配，通过显式设置ref 属性来进行装配。
- byName：通过参数名 自动装配，Spring容器在配置文件中发现bean的autowire属性被设置成byname，之后容器试图匹配、装配和该bean的属性具有相同名字的bean。
- byType:：通过参数类型自动装配，Spring容器在配置文件中发现bean的autowire属性被设置成byType，之后容器试图匹配、装配和该bean的属性具有相同类型的bean。如果有多个bean符合条件，则抛出错误。
- constructor：这个方式类似于byType， 但是要提供给构造器参数，如果没有确定的带参数的构造器参数类型，将会抛出异常。
- autodetect：首先尝试使用constructor来自动装配，如果无法工作，则使用byType方式。

### Spring主要模块

- Spring Core： 基础,可以说 Spring 其他所有的功能都需要依赖于该类库。主要提供 IOC 依赖注入功能。
- Spring Aspects  ： 该模块为与AspectJ的集成提供支持。
- Spring AOP ：提供了面向方面的编程实现。
- Spring JDBC : Java数据库连接。
- Spring JMS ：Java消息服务。
- Spring ORM : 用于支持Hibernate等ORM工具。
- Spring Web : 为创建Web应用程序提供支持。
- Spring Test : 提供了对 JUnit 和 TestNG 测试的支持。

### Spring AOP 和 AspectJ AOP 有什么区别？

Spring AOP 属于运行时增强，而 AspectJ 是编译时增强。 Spring AOP 基于代理(Proxying)，而 AspectJ 基于字节码操作(Bytecode Manipulation)。
 

Spring AOP 已经集成了 AspectJ ，AspectJ 应该算的上是 Java 生态系统中最完整的 AOP 框架了。AspectJ 相比于 Spring AOP 功能更加强大，但是 Spring AOP 相对来说更简单，如果我们的切面比较少，那么两者性能差异不大。但是，当切面太多的话，最好选择 AspectJ ，它比Spring AOP 快很多。

### Spring 是如何管理事务的？

spring的事务声明有两种方式，编程式和声明式。spring主要是通过“声明式事务”的方式对事务进行管理，即在配置文件中进行声明，通过AOP将事务切面切入程序，最大的好处是大大减少了代码量。

### Bean 是如何被管理的？
在Spring框架中，一旦把一个bean纳入到Spring IoC容器之中，这个bean的生命周期就会交由容器进行管理，一般担当管理者角色的是BeanFactory或ApplicationContext。认识一下Bean的生命周期活动，对更好的利用它有很大的帮助。

概括来说主要有四个阶段：实例化，初始化，使用，销毁。

### Spring中的自动装配有哪些限制？


- 如果使用了构造器注入或者setter注入，那么将覆盖自动装配的依赖关系。
- 基本数据类型的值、字符串字面量、类字面量无法使用自动装配来注入。
- 优先考虑使用显式的装配来进行更精确的依赖注入而不是使用自动装配。

### 你可以在Spring中注入一个null 和一个空字符串吗？
可以。

### Spring MVC 运行流程
第一步：发起请求到前端控制器(DispatcherServlet)

第二步：前端控制器请求HandlerMapping查找 Handler（ 可以根据xml配置、注解进行查找）

第三步：处理器映射器HandlerMapping向前端控制器返回Handler

第四步：前端控制器调用处理器适配器去执行Handler

第五步：处理器适配器去执行Handler

第六步：Handler执行完成给适配器返回ModelAndView

第七步：处理器适配器向前端控制器返回ModelAndView（ModelAndView是springmvc框架的一个底层对象，包括Model和view）

第八步：前端控制器请求视图解析器去进行视图解析（根据逻辑视图名解析成真正的视图(jsp)）

第九步：视图解析器向前端控制器返回View

第十步：前端控制器进行视图渲染（ 视图渲染将模型数据(在ModelAndView对象中)填充到request域）

第十一步：前端控制器向用户响应结果


### 1、@Resource和@Autowired区别

https://www.cnblogs.com/think-in-java/p/5474740.html

**@Resource默认根据byName注入，@Autowired默认根据byType注入**

@Resource和@Autowired都是做bean的注入时使用，其实@Resource并不是Spring的注解，它的包是javax.annotation.Resource，需要导入，但是Spring支持该注解的注入。
@Autowired为Spring提供的注解，需要导入包org.springframework.beans.factory.annotation.Autowired;只按照byType注入。@Autowired注解是按照类型（byType）装配依赖对象，默认情况下它要求依赖对象必须存在，如果允许null值，可以设置它的required属性为false。如果我们想使用按照名称（byName）来装配，可以结合@Qualifier注解一起使用。

@Resource默认按照ByName自动注入，由J2EE提供，需要导入包javax.annotation.Resource。@Resource有两个重要的属性：name和type，而Spring将@Resource注解的name属性解析为bean的名字，而type属性则解析为bean的类型。所以，如果使用name属性，则使用byName的自动注入策略，而使用type属性时则使用byType自动注入策略。如果既不制定name也不制定type属性，这时将通过反射机制使用byName自动注入策略。

### 2、@Component, @Service, @Controller, @Repository区别

https://blog.csdn.net/fansili/article/details/78740877

@Component, @Service, @Controller, @Repository是spring注解，注解后可以被spring框架所扫描并注入到spring容器来进行管理 
@Component是通用注解，其他三个注解是这个注解的拓展，并且具有了特定的功能 
@Repository注解在持久层中，具有将数据库操作抛出的原生异常翻译转化为spring的持久层异常的功能。 
@Controller层是spring-mvc的注解，具有将请求进行转发，重定向的功能。 
@Service层是业务逻辑层注解，这个注解只是标注该类处于业务逻辑层。 

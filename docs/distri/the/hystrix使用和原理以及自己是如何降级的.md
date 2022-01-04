

### 使用

https://blog.csdn.net/maoyeqiu/article/details/78522416

hystrix提供5部分的服务，分别是降级、隔离、熔断器、异常和缓存

1、 降级

```
@HystrixCommand(fallbackMethod = "fallback")


@HystrixCommand(
                commandProperties = {
                        @HystrixProperty(name = "execution.isolation.thread.timeoutInMilliseconds", value ="40000"),
                }
        )
```

2、隔离

```
        @HystrixCommand(
                //表示所属的group，一个group共用线程池,默认使用类名作为一个组,
				//同一个分组，使用相同的线程池，线程池的个数按照最小的定义限定，所以线程池定义一次就可以了，再次使用的时候直接定义分组
                //同一个分组，不同的线程池，按照不同的线程池来限定
                groupKey = "GroupOne",
                //线程池的名称
                threadPoolKey = "groupOnePoolE",
                fallbackMethod = "fallbackTest",
                commandProperties = {
                        @HystrixProperty(name = "execution.isolation.thread.timeoutInMilliseconds", value ="20000"),
                },
                //以下这些值，在分组的情况下有效
                threadPoolProperties = {
                        //核心线程数
                        @HystrixProperty(name = "coreSize", value = "3"),
                        //超过队列的个数会直接失败
                        @HystrixProperty(name = "maxQueueSize", value = "10"),
                        //队列小于最大值，拒绝请求
                        @HystrixProperty(name = "queueSizeRejectionThreshold", value = "3")
                        //总结：请求数目大于核心线程数+队列的拒绝数的时候就会失败，配置降级方法的时候，不会失败直接调用降级方法
                        //默认的情况下，以service的名称作为线程池的名称，使用HystrixCommand默认情况下coreSize为10，maxQueueSize使用LinkedBlockingQueue动态拓展，queueSizeRejectionThreshold默认大小值5
                }
```

3、熔断器

```
 @HystrixCommand(
                commandProperties = {
                        @HystrixProperty(name = "execution.isolation.thread.timeoutInMilliseconds", value ="11000"),
                        //是否开启熔断器
                        @HystrixProperty(name = "circuitBreaker.enabled", value ="true"),
                        //请求的失败数目超过这个之后，就会打开熔断器
                        @HystrixProperty(name = "circuitBreaker.requestVolumeThreshold", value ="5"),
                        //熔断器工作时间，默认5秒，超过这个时间便会放流量进去
                        @HystrixProperty(name = "circuitBreaker.sleepWindowInMilliseconds", value ="50000"),
                        //出错率超过75%，启动熔断器，默认50%
                        @HystrixProperty(name = "circuitBreaker.errorThresholdPercentage", value ="75"),
                }
        )

```

4、异常

```
        /**
         * 以下方式抛出RuntimeException异常的时候不会降级，而是直接按照异常进行处理，将异常抛给调用端
         * 如果没有在ignoreExceptions中添加RuntimeException，则会将异常按照降级方法进行处理
         * @return
         */
        @HystrixCommand(ignoreExceptions = {RuntimeException.class},fallbackMethod = "fallback")

```

### 原理

https://blog.csdn.net/maoyeqiu/article/details/78393330

针对造成服务雪崩的不同原因, 可以使用不同的应对策略:

- 流量控制

- 改进缓存模式

- 服务自动扩容

- 服务调用者降级服务

流量控制 的具体措施包括:

- 网关限流

- 用户交互限流

- 关闭重试



1、用户交互限流的具体措施有: 

- 采用加载动画,提高用户的忍耐等待时间. 

- 提交按钮添加强制等待时间机制.

2、改进缓存模式 的措施包括:

- 缓存预加载

- 同步改为异步刷新

3、服务自动扩容 的措施主要有:

- AWS的auto scaling

4、服务调用者降级服务 的措施包括:

- 资源隔离

- 对依赖服务进行分类

- 不可用服务的调用快速失败



### 自己如何实现降级的

1、比如一个红包是拆成一个1000份的，当进入奖池的人数，超多1000的时候，后边的人数只有一半的尾号的尾号放进来，超过10000的时候再放一半的尾号

2、在一开始的时候就开始按照一种规则降级，QPS超过5的时候，后边的请求直接放掉

3、所以最终的方案是：1000份的红包，先流入5000个进入奖池不限流，后边的请求，按照5S的QPS进行限制






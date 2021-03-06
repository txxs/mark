### Spring的事务的传递性

https://blog.csdn.net/john2522/article/details/64701506

所谓事务传播行为就是多个事务方法相互调用时，事务如何在这些方法间传播

- PROPAGATION_REQUIRED--支持当前事务，如果当前没有事务，就新建一个事务。这是最常见的选择。
- PROPAGATION_SUPPORTS--支持当前事务，如果当前没有事务，就以非事务方式执行。
- PROPAGATION_MANDATORY--支持当前事务，如果当前没有事务，就抛出异常。
- PROPAGATION_REQUIRES_NEW--新建事务，如果当前存在事务，把当前事务挂起，执行当前新建事务完成以后，上下文事务恢复再执行。
- PROPAGATION_NOT_SUPPORTED--以非事务方式执行操作，如果当前存在事务，就把当前事务挂起，执行当前逻辑，结束后恢复上下文的事务。
- PROPAGATION_NEVER--以非事务方式执行，如果当前存在事务，则抛出异常。


嵌套是子事务套在父事务中执行，子事务是父事务的一部分，在进入子事务之前，父事务建立一个回滚点，叫save point，然后执行子事务，这个子事务的执行也算是父事务的一部分，然后子事务执行结束，父事务继续执行。重点就在于那个save point。看几个问题就明了了：

1)如果子事务回滚，会发生什么？ 
父事务会回滚到进入子事务前建立的save point，然后尝试其他的事务或者其他的业务逻辑，父事务之前的操作不会受到影响，更不会自动回滚。

2)如果父事务回滚，会发生什么？ 
父事务回滚，子事务也会跟着回滚！为什么呢，因为父事务结束之前，子事务是不会提交的，我们说子事务是父事务的一部分，正是这个道理。那么：

3)事务的提交，是什么情况？ 
是父事务先提交，然后子事务提交，还是子事务先提交，父事务再提交？答案是第二种情况，还是那句话，子事务是父事务的一部分，由父事务统一提交。

https://www.iteye.com/topic/35907

PROPAGATION_REQUIRES_NEW 启动一个新的, 不依赖于环境的 "内部" 事务. 这个事务将被完全 commited 或 rolled back 而不依赖于外部事务, 它拥有自己的隔离范围, 自己的锁, 等等. 当内部事务开始执行时, 外部事务将被挂起, 内务事务结束时, 外部事务将继续执行.

另一方面, PROPAGATION_NESTED 开始一个 "嵌套的" 事务,  它是已经存在事务的一个真正的子事务. 潜套事务开始执行时,  它将取得一个 savepoint. 如果这个嵌套事务失败, 我们将回滚到此 savepoint. 潜套事务是外部事务的一部分, 只有外部事务结束后它才会被提交.

```
ServiceA {  
      
    /** 
     * 事务属性配置为 PROPAGATION_REQUIRED 
     */  
    void methodA() {  
        ServiceB.methodB();  
    }  
  
}  
  
ServiceB {  
      
    /** 
     * 事务属性配置为 PROPAGATION_REQUIRES_NEW 
     */   
    void methodB() {  
    }  
      
} 
```
这种情况下, 因为 ServiceB#methodB 的事务属性为 PROPAGATION_REQUIRES_NEW, 所以两者不会发生任何关系, ServiceA#methodA 和 ServiceB#methodB 不会因为对方的执行情况而影响事务的结果, 因为它们根本就是两个事务, 在 ServiceB#methodB 执行时 ServiceA#methodA 的事务已经挂起了。

```
ServiceA {  
      
    /** 
     * 事务属性配置为 PROPAGATION_REQUIRED 
     */  
    void methodA() {  
        ServiceB.methodB();  
    }  
  
}  
  
ServiceB {  
      
    /** 
     * 事务属性配置为 PROPAGATION_NESTED 
     */   
    void methodB() {  
    }  
      
}
```

ServiceB#methodB 的事务属性被配置为 PROPAGATION_NESTED, 此时两者之间又将如何协作呢? 从 Juergen Hoeller 的原话中我们可以找到答案, ServiceB#methodB 如果 rollback, 那么内部事务(即 ServiceB#methodB) 将回滚到它执行前的SavePoint, 而外部事务可以有以下两种处理方式:

1、如果 ServiceB.methodB（C方法在catch中） 失败, 那么执行 ServiceC.methodC(), 而 ServiceB.methodB 已经回滚到它执行之前的 SavePoint, 所以不会产生脏数据(相当于此方法从未执行过), 这种特性可以用在某些特殊的业务中, 而 PROPAGATION_REQUIRED 和 PROPAGATION_REQUIRES_NEW 都没有办法做到这一点

2、代码不做任何修改, 那么如果内部事务(即 ServiceB#methodB) rollback, 那么首先 ServiceB.methodB 回滚到它执行之前的 SavePoint(在任何情况下都会如此),外部事务(即 ServiceA#methodA) 将根据具体的配置决定自己是 commit 还是 rollback


### spring事务隔离级别

- ISOLATION_DEFAULT： 这是一个PlatfromTransactionManager默认的隔离级别，使用数据库默认的事务隔离级别.另外四个与JDBC的隔离级别相对应
- ISOLATION_READ_UNCOMMITTED： 这是事务最低的隔离级别，它充许令外一个事务可以看到这个事务未提交的数据。这种隔离级别会产生脏读，不可重复读和幻像读。
- ISOLATION_READ_COMMITTED： 保证一个事务修改的数据提交后才能被另外一个事务读取。另外一个事务不能读取该事务未提交的数据
- ISOLATION_REPEATABLE_READ：这种事务隔离级别可以防止脏读，不可重复读。但是可能出现幻像读。它除了保证一个事务不能读取另一个事务未提交的数据外，还保证了避免下面的情况产生(不可重复读)。
- ISOLATION_SERIALIZABLE 这是花费最高代价但是最可靠的事务隔离级别。事务被处理为顺序执行。
      除了防止脏读，不可重复读外，还避免了幻像读。

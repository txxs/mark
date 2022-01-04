### ArrayList集合加入1万条数据，应该怎么提高效率

ArrayList的默认初始容量为10，要插入大量数据的时候需要不断扩容，而扩容是非常影响性能的。因此，现在明确了10万条数据了，我们可以直接在初始化的时候就设置ArrayList的容量！

### Java中HashMap的key值要是为类对象则该类需要满足什么条件？

需要同时重写该类的hashCode()方法和它的equals()方法。

从源码可以得知，在插入元素的时候是先算出该对象的hashCode。如果hashcode相等话的。那么表明该对象是存储在同一个位置上的。

如果调用equals()方法，两个key相同，则替换元素

如果调用equals()方法，两个key不相同，则说明该hashCode仅仅是碰巧相同，此时是散列冲突，将新增的元素放在桶子上

一般来说，我们会认为：只要两个对象的成员变量的值是相等的，那么我们就认为这两个对象是相等的！因为，Object底层比较的是两个对象的地址，而对我们开发来说这样的意义并不大~这也就为什么我们要重写equals()方法

重写了equals()方法，就要重写hashCode()的方法。因为equals()认定了这两个对象相同，而同一个对象调用hashCode()方法时，是应该返回相同的值的！

### 并发集合类是什么？

Java1.5并发包（java.util.concurrent）包含线程安全集合类，允许在迭代时修改集合。

迭代器被设计为fail-fast的，会抛出ConcurrentModificationException。

一部分类为：

CopyOnWriteArrayList

ConcurrentHashMap

CopyOnWriteArraySet

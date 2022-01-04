
### 我们还是先来回顾一下COW：

> 如果有多个调用者（callers）同时请求相同资源（如内存或磁盘上的数据存储），他们会共同获取相同的指针指向相同的资源，直到某个调用者试图修改资源的内容时，系统才会真正复制一份专用副本（private copy）给该调用者，而其他调用者所见到的最初的资源仍然保持不变。优点是如果调用者没有修改该资源，就不会有副本（private copy）被建立，因此多个调用者只是读取操作时可以共享同一份资源。

参考自维基百科：https://zh.wikipedia.org/wiki/%E5%AF%AB%E5%85%A5%E6%99%82%E8%A4%87%E8%A3%BD

之前写博客的时候，如果是要看源码，一般会翻译一下源码的注释并用图贴在文章上的。Emmm，发现阅读体验并不是很好，所以我这里就直接概括一下源码注释说了什么吧。另外，如果使用IDEA的话，可以下一个插件Translation(免费好用).


概括一下CopyOnWriteArrayList源码注释介绍了什么：

1、CopyOnWriteArrayList是线程安全容器(相对于ArrayList)，底层通过复制数组的方式来实现。

2、CopyOnWriteArrayList在遍历的使用不会抛出ConcurrentModificationException异常，并且遍历的时候就不用额外加锁


看一下CopyOnWriteArrayList基本的结构

```
    /** 可重入锁对象 */
    final transient ReentrantLock lock = new ReentrantLock();

    /** CopyOnWriteArrayList底层由数组实现，volatile修饰 */
    private transient volatile Object[] array;

    /**
     * 得到数组
     */
    final Object[] getArray() {
        return array;
    }

    /**
     * 设置数组
     */
    final void setArray(Object[] a) {
        array = a;
    }

    /**
     * 初始化CopyOnWriteArrayList相当于初始化数组
     */
    public CopyOnWriteArrayList() {
        setArray(new Object[0]);
    }

 ```


看起来挺简单的，CopyOnWriteArrayList底层就是数组，加锁就交由ReentrantLock来完成。

### 常见方法的实现

根据上面的分析我们知道如果遍历Vector/SynchronizedList是需要自己手动加锁的。

CopyOnWriteArrayList使用迭代器遍历时不需要显示加锁，看看add()、clear()、remove()与get()方法的实现可能就有点眉目了。

首先我们可以看看add()方法

```
    public boolean add(E e) {

        // 加锁
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {

            // 得到原数组的长度和元素
            Object[] elements = getArray();
            int len = elements.length;

            // 复制出一个新数组
            Object[] newElements = Arrays.copyOf(elements, len + 1);

            // 添加时，将新元素添加到新数组中
            newElements[len] = e;

            // 将volatile Object[] array 的指向替换成新数组
            setArray(newElements);
            return true;
        } finally {
            lock.unlock();
        }
    }
 ```

通过代码我们可以知道：在添加的时候就上锁，并复制一个新数组，增加操作在新数组上完成，将array指向到新数组中，最后解锁。

再来看看size()方法：
```
    public int size() {

        // 直接得到array数组的长度
        return getArray().length;
    }
```
再来看看get()方法：
```
    public E get(int index) {
        return get(getArray(), index);
    }

    final Object[] getArray() {
        return array;
    }
```
那再来看看set()方法
```
public E set(int index, E element) {
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {

        // 得到原数组的旧值
        Object[] elements = getArray();
        E oldValue = get(elements, index);

        // 判断新值和旧值是否相等
        if (oldValue != element) {

            // 复制新数组，新值在新数组中完成
            int len = elements.length;
            Object[] newElements = Arrays.copyOf(elements, len);
            newElements[index] = element;

            // 将array引用指向新数组
            setArray(newElements);
        } else {
            // Not quite a no-op; enssures volatile write semantics
            setArray(elements);
        }
        return oldValue;
    } finally {
        lock.unlock();
    }
}

```
对于remove()、clear()跟set()和add()是类似的，这里我就不再贴出代码了。

总结：

在修改时，复制出一个新数组，修改的操作在新数组中完成，最后将新数组交由array变量指向。

写加锁，读不加锁

### 剖析为什么遍历时不用调用者显式加锁
常用的方法实现我们已经基本了解了，但还是不知道为啥能够在容器遍历的时候对其进行修改而不抛出异常。所以，来看一下他的迭代器吧：
```
    // 1. 返回的迭代器是COWIterator
    public Iterator<E> iterator() {
        return new COWIterator<E>(getArray(), 0);
    }


    // 2. 迭代器的成员属性
    private final Object[] snapshot;
    private int cursor;

    // 3. 迭代器的构造方法
    private COWIterator(Object[] elements, int initialCursor) {
        cursor = initialCursor;
        snapshot = elements;
    }

    // 4. 迭代器的方法...
    public E next() {
        if (! hasNext())
            throw new NoSuchElementException();
        return (E) snapshot[cursor++];
    }
```
    //.... 可以发现的是，迭代器所有的操作都基于snapshot数组，而snapshot是传递进来的array数组
到这里，我们应该就可以想明白了！CopyOnWriteArrayList在使用迭代器遍历的时候，操作的都是原数组！


### CopyOnWriteArrayList缺点

看了上面的实现源码，我们应该也大概能分析出CopyOnWriteArrayList的缺点了。

1、内存占用：如果CopyOnWriteArrayList经常要增删改里面的数据，经常要执行add()、set()、remove()的话，那是比较耗费内存的。

2、因为我们知道每次`add()、set()、remove()`这些增删改操作都要复制一个数组出来。

3、数据一致性：CopyOnWrite容器只能保证数据的最终一致性，不能保证数据的实时一致性。

从上面的例子也可以看出来，比如线程A在迭代CopyOnWriteArrayList容器的数据。线程B在线程A迭代的间隙中将CopyOnWriteArrayList部分的数据修改了(已经调用`setArray()`了)。但是线程A迭代出来的是原有的数据。

### CopyOnWriteSet

```
CopyOnWriteArraySet的原理就是CopyOnWriteArrayList。

    private final CopyOnWriteArrayList<E> al;

    public CopyOnWriteArraySet() {
        al = new CopyOnWriteArrayList<E>();
    }

```

参考资料：

《Java并发编程实战》

聊聊并发-Java中的Copy-On-Write容器：http://ifeve.com/java-copy-on-write/

Java 中的写时复制 (Copy on Write, COW)https://juejin.im/post/5bc3065ce51d450e8e7758b5

扩展阅读：

CopyOnWriteArrayList类set方法疑惑？http://ifeve.com/copyonwritearraylist-set/

Why setArray() method call required in CopyOnWriteArrayListhttps://stackoverflow.com/questions/28772539/why-setarray-method-call-required-in-copyonwritearraylist

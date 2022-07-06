(window.webpackJsonp=window.webpackJsonp||[]).push([[150],{531:function(s,n,a){"use strict";a.r(n);var e=a(13),t=Object(e.a)({},(function(){var s=this,n=s.$createElement,a=s._self._c||n;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h3",{attrs:{id:"我们还是先来回顾一下cow"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#我们还是先来回顾一下cow"}},[s._v("#")]),s._v(" 我们还是先来回顾一下COW：")]),s._v(" "),a("blockquote",[a("p",[s._v("如果有多个调用者（callers）同时请求相同资源（如内存或磁盘上的数据存储），他们会共同获取相同的指针指向相同的资源，直到某个调用者试图修改资源的内容时，系统才会真正复制一份专用副本（private copy）给该调用者，而其他调用者所见到的最初的资源仍然保持不变。优点是如果调用者没有修改该资源，就不会有副本（private copy）被建立，因此多个调用者只是读取操作时可以共享同一份资源。")])]),s._v(" "),a("p",[s._v("参考自维基百科：https://zh.wikipedia.org/wiki/%E5%AF%AB%E5%85%A5%E6%99%82%E8%A4%87%E8%A3%BD")]),s._v(" "),a("p",[s._v("之前写博客的时候，如果是要看源码，一般会翻译一下源码的注释并用图贴在文章上的。Emmm，发现阅读体验并不是很好，所以我这里就直接概括一下源码注释说了什么吧。另外，如果使用IDEA的话，可以下一个插件Translation(免费好用).")]),s._v(" "),a("p",[s._v("概括一下CopyOnWriteArrayList源码注释介绍了什么：")]),s._v(" "),a("p",[s._v("1、CopyOnWriteArrayList是线程安全容器(相对于ArrayList)，底层通过复制数组的方式来实现。")]),s._v(" "),a("p",[s._v("2、CopyOnWriteArrayList在遍历的使用不会抛出ConcurrentModificationException异常，并且遍历的时候就不用额外加锁")]),s._v(" "),a("p",[s._v("看一下CopyOnWriteArrayList基本的结构")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("    /** 可重入锁对象 */\n    final transient ReentrantLock lock = new ReentrantLock();\n\n    /** CopyOnWriteArrayList底层由数组实现，volatile修饰 */\n    private transient volatile Object[] array;\n\n    /**\n     * 得到数组\n     */\n    final Object[] getArray() {\n        return array;\n    }\n\n    /**\n     * 设置数组\n     */\n    final void setArray(Object[] a) {\n        array = a;\n    }\n\n    /**\n     * 初始化CopyOnWriteArrayList相当于初始化数组\n     */\n    public CopyOnWriteArrayList() {\n        setArray(new Object[0]);\n    }\n\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br"),a("span",{staticClass:"line-number"},[s._v("15")]),a("br"),a("span",{staticClass:"line-number"},[s._v("16")]),a("br"),a("span",{staticClass:"line-number"},[s._v("17")]),a("br"),a("span",{staticClass:"line-number"},[s._v("18")]),a("br"),a("span",{staticClass:"line-number"},[s._v("19")]),a("br"),a("span",{staticClass:"line-number"},[s._v("20")]),a("br"),a("span",{staticClass:"line-number"},[s._v("21")]),a("br"),a("span",{staticClass:"line-number"},[s._v("22")]),a("br"),a("span",{staticClass:"line-number"},[s._v("23")]),a("br"),a("span",{staticClass:"line-number"},[s._v("24")]),a("br"),a("span",{staticClass:"line-number"},[s._v("25")]),a("br"),a("span",{staticClass:"line-number"},[s._v("26")]),a("br"),a("span",{staticClass:"line-number"},[s._v("27")]),a("br")])]),a("p",[s._v("看起来挺简单的，CopyOnWriteArrayList底层就是数组，加锁就交由ReentrantLock来完成。")]),s._v(" "),a("h3",{attrs:{id:"常见方法的实现"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#常见方法的实现"}},[s._v("#")]),s._v(" 常见方法的实现")]),s._v(" "),a("p",[s._v("根据上面的分析我们知道如果遍历Vector/SynchronizedList是需要自己手动加锁的。")]),s._v(" "),a("p",[s._v("CopyOnWriteArrayList使用迭代器遍历时不需要显示加锁，看看add()、clear()、remove()与get()方法的实现可能就有点眉目了。")]),s._v(" "),a("p",[s._v("首先我们可以看看add()方法")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("    public boolean add(E e) {\n\n        // 加锁\n        final ReentrantLock lock = this.lock;\n        lock.lock();\n        try {\n\n            // 得到原数组的长度和元素\n            Object[] elements = getArray();\n            int len = elements.length;\n\n            // 复制出一个新数组\n            Object[] newElements = Arrays.copyOf(elements, len + 1);\n\n            // 添加时，将新元素添加到新数组中\n            newElements[len] = e;\n\n            // 将volatile Object[] array 的指向替换成新数组\n            setArray(newElements);\n            return true;\n        } finally {\n            lock.unlock();\n        }\n    }\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br"),a("span",{staticClass:"line-number"},[s._v("15")]),a("br"),a("span",{staticClass:"line-number"},[s._v("16")]),a("br"),a("span",{staticClass:"line-number"},[s._v("17")]),a("br"),a("span",{staticClass:"line-number"},[s._v("18")]),a("br"),a("span",{staticClass:"line-number"},[s._v("19")]),a("br"),a("span",{staticClass:"line-number"},[s._v("20")]),a("br"),a("span",{staticClass:"line-number"},[s._v("21")]),a("br"),a("span",{staticClass:"line-number"},[s._v("22")]),a("br"),a("span",{staticClass:"line-number"},[s._v("23")]),a("br"),a("span",{staticClass:"line-number"},[s._v("24")]),a("br")])]),a("p",[s._v("通过代码我们可以知道：在添加的时候就上锁，并复制一个新数组，增加操作在新数组上完成，将array指向到新数组中，最后解锁。")]),s._v(" "),a("p",[s._v("再来看看size()方法：")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("    public int size() {\n\n        // 直接得到array数组的长度\n        return getArray().length;\n    }\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br")])]),a("p",[s._v("再来看看get()方法：")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("    public E get(int index) {\n        return get(getArray(), index);\n    }\n\n    final Object[] getArray() {\n        return array;\n    }\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br")])]),a("p",[s._v("那再来看看set()方法")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("public E set(int index, E element) {\n    final ReentrantLock lock = this.lock;\n    lock.lock();\n    try {\n\n        // 得到原数组的旧值\n        Object[] elements = getArray();\n        E oldValue = get(elements, index);\n\n        // 判断新值和旧值是否相等\n        if (oldValue != element) {\n\n            // 复制新数组，新值在新数组中完成\n            int len = elements.length;\n            Object[] newElements = Arrays.copyOf(elements, len);\n            newElements[index] = element;\n\n            // 将array引用指向新数组\n            setArray(newElements);\n        } else {\n            // Not quite a no-op; enssures volatile write semantics\n            setArray(elements);\n        }\n        return oldValue;\n    } finally {\n        lock.unlock();\n    }\n}\n\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br"),a("span",{staticClass:"line-number"},[s._v("15")]),a("br"),a("span",{staticClass:"line-number"},[s._v("16")]),a("br"),a("span",{staticClass:"line-number"},[s._v("17")]),a("br"),a("span",{staticClass:"line-number"},[s._v("18")]),a("br"),a("span",{staticClass:"line-number"},[s._v("19")]),a("br"),a("span",{staticClass:"line-number"},[s._v("20")]),a("br"),a("span",{staticClass:"line-number"},[s._v("21")]),a("br"),a("span",{staticClass:"line-number"},[s._v("22")]),a("br"),a("span",{staticClass:"line-number"},[s._v("23")]),a("br"),a("span",{staticClass:"line-number"},[s._v("24")]),a("br"),a("span",{staticClass:"line-number"},[s._v("25")]),a("br"),a("span",{staticClass:"line-number"},[s._v("26")]),a("br"),a("span",{staticClass:"line-number"},[s._v("27")]),a("br"),a("span",{staticClass:"line-number"},[s._v("28")]),a("br"),a("span",{staticClass:"line-number"},[s._v("29")]),a("br")])]),a("p",[s._v("对于remove()、clear()跟set()和add()是类似的，这里我就不再贴出代码了。")]),s._v(" "),a("p",[s._v("总结：")]),s._v(" "),a("p",[s._v("在修改时，复制出一个新数组，修改的操作在新数组中完成，最后将新数组交由array变量指向。")]),s._v(" "),a("p",[s._v("写加锁，读不加锁")]),s._v(" "),a("h3",{attrs:{id:"剖析为什么遍历时不用调用者显式加锁"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#剖析为什么遍历时不用调用者显式加锁"}},[s._v("#")]),s._v(" 剖析为什么遍历时不用调用者显式加锁")]),s._v(" "),a("p",[s._v("常用的方法实现我们已经基本了解了，但还是不知道为啥能够在容器遍历的时候对其进行修改而不抛出异常。所以，来看一下他的迭代器吧：")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("    // 1. 返回的迭代器是COWIterator\n    public Iterator<E> iterator() {\n        return new COWIterator<E>(getArray(), 0);\n    }\n\n\n    // 2. 迭代器的成员属性\n    private final Object[] snapshot;\n    private int cursor;\n\n    // 3. 迭代器的构造方法\n    private COWIterator(Object[] elements, int initialCursor) {\n        cursor = initialCursor;\n        snapshot = elements;\n    }\n\n    // 4. 迭代器的方法...\n    public E next() {\n        if (! hasNext())\n            throw new NoSuchElementException();\n        return (E) snapshot[cursor++];\n    }\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br"),a("span",{staticClass:"line-number"},[s._v("15")]),a("br"),a("span",{staticClass:"line-number"},[s._v("16")]),a("br"),a("span",{staticClass:"line-number"},[s._v("17")]),a("br"),a("span",{staticClass:"line-number"},[s._v("18")]),a("br"),a("span",{staticClass:"line-number"},[s._v("19")]),a("br"),a("span",{staticClass:"line-number"},[s._v("20")]),a("br"),a("span",{staticClass:"line-number"},[s._v("21")]),a("br"),a("span",{staticClass:"line-number"},[s._v("22")]),a("br")])]),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[s._v("//.... 可以发现的是，迭代器所有的操作都基于snapshot数组，而snapshot是传递进来的array数组\n")])])]),a("p",[s._v("到这里，我们应该就可以想明白了！CopyOnWriteArrayList在使用迭代器遍历的时候，操作的都是原数组！")]),s._v(" "),a("h3",{attrs:{id:"copyonwritearraylist缺点"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#copyonwritearraylist缺点"}},[s._v("#")]),s._v(" CopyOnWriteArrayList缺点")]),s._v(" "),a("p",[s._v("看了上面的实现源码，我们应该也大概能分析出CopyOnWriteArrayList的缺点了。")]),s._v(" "),a("p",[s._v("1、内存占用：如果CopyOnWriteArrayList经常要增删改里面的数据，经常要执行add()、set()、remove()的话，那是比较耗费内存的。")]),s._v(" "),a("p",[s._v("2、因为我们知道每次"),a("code",[s._v("add()、set()、remove()")]),s._v("这些增删改操作都要复制一个数组出来。")]),s._v(" "),a("p",[s._v("3、数据一致性：CopyOnWrite容器只能保证数据的最终一致性，不能保证数据的实时一致性。")]),s._v(" "),a("p",[s._v("从上面的例子也可以看出来，比如线程A在迭代CopyOnWriteArrayList容器的数据。线程B在线程A迭代的间隙中将CopyOnWriteArrayList部分的数据修改了(已经调用"),a("code",[s._v("setArray()")]),s._v("了)。但是线程A迭代出来的是原有的数据。")]),s._v(" "),a("h3",{attrs:{id:"copyonwriteset"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#copyonwriteset"}},[s._v("#")]),s._v(" CopyOnWriteSet")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("CopyOnWriteArraySet的原理就是CopyOnWriteArrayList。\n\n    private final CopyOnWriteArrayList<E> al;\n\n    public CopyOnWriteArraySet() {\n        al = new CopyOnWriteArrayList<E>();\n    }\n\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br")])]),a("p",[s._v("参考资料：")]),s._v(" "),a("p",[s._v("《Java并发编程实战》")]),s._v(" "),a("p",[s._v("聊聊并发-Java中的Copy-On-Write容器：http://ifeve.com/java-copy-on-write/")]),s._v(" "),a("p",[s._v("Java 中的写时复制 (Copy on Write, COW)https://juejin.im/post/5bc3065ce51d450e8e7758b5")]),s._v(" "),a("p",[s._v("扩展阅读：")]),s._v(" "),a("p",[s._v("CopyOnWriteArrayList类set方法疑惑？http://ifeve.com/copyonwritearraylist-set/")]),s._v(" "),a("p",[s._v("Why setArray() method call required in CopyOnWriteArrayListhttps://stackoverflow.com/questions/28772539/why-setarray-method-call-required-in-copyonwritearraylist")])])}),[],!1,null,null,null);n.default=t.exports}}]);
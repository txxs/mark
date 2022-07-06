(window.webpackJsonp=window.webpackJsonp||[]).push([[54],{444:function(n,t,e){"use strict";e.r(t);var v=e(13),_=Object(v.a)({},(function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("ContentSlotsDistributor",{attrs:{"slot-key":n.$parent.slotKey}},[e("h3",{attrs:{id:"_20200820-为什么double会丢失精度"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_20200820-为什么double会丢失精度"}},[n._v("#")]),n._v(" 20200820 为什么double会丢失精度")]),n._v(" "),e("p",[n._v("不是所有的十进制数都能转化为有限位二进制数的。")]),n._v(" "),e("p",[n._v("1、任意十进制整数可以转化为有限位数的二进制整数。如123=64+32+16+8+2+1，转化为二进制整数是1111011。")]),n._v(" "),e("p",[n._v("2、能分解为以(1/2)^n为单位的十进制小数，可以转化为有限位数的二进制小数。如十进制数：13/16=0.8125，它可以是拆成：13/16=1/2+1/4+1/16，或者直接可以看作是13个1/16所组成。而1/2，1/4，1/16这些数都是符合(1/2)^n形式的数。所以13/16转化为4位二进制小数：0.1101。")]),n._v(" "),e("p",[n._v("3、上述情形以外的十进制数都不能转化为有限位数的二进制数。如十进制小数0.7，转化为二进制小数是：0.1011001100110......，循环节是0110。")]),n._v(" "),e("p",[n._v("当第三种情况的小数出现的时候，就会出现计算的精度误差，BigDecimal的原理很简单，就是将小数扩大N倍，转成整数后再进行计算，同时结合指数，得出没有精度损失的结果。")]),n._v(" "),e("p",[n._v("首先并不是所有的double都会丢失精度。丢失精度是因为：小数在转换为二进制小数的时候陷入了循环，类似于下边这样的：")]),n._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[n._v("double类型 0.3-0.1的情况。需要将0.3转成二进制在运算\n0.3 * 2 = 0.6 => .0 (.6)取0剩0.6\n0.6 * 2 = 1.2 => .01 (.2)取1剩0.2\n0.2 * 2 = 0.4 => .010 (.4)取0剩0.4\n0.4 * 2 = 0.8 => .0100 (.8) 取0剩0.8\n0.8 * 2 = 1.6 => .01001 (.6)取1剩0.6\n.............\n")])]),n._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[n._v("1")]),e("br"),e("span",{staticClass:"line-number"},[n._v("2")]),e("br"),e("span",{staticClass:"line-number"},[n._v("3")]),e("br"),e("span",{staticClass:"line-number"},[n._v("4")]),e("br"),e("span",{staticClass:"line-number"},[n._v("5")]),e("br"),e("span",{staticClass:"line-number"},[n._v("6")]),e("br"),e("span",{staticClass:"line-number"},[n._v("7")]),e("br")])]),e("p",[n._v("那怎么避免这个问题呢？")]),n._v(" "),e("ol",[e("li",[n._v("int resultInt = 10 -9; double result  = (double)resultInt / 100;//自己控制小数点")]),n._v(" "),e("li",[n._v("BigDecimal")])]),n._v(" "),e("p",[n._v("OK BigDecimal是怎么做到控制位数的呢，扩大N倍，看这篇文章：https://zhuanlan.zhihu.com/p/71796835")]),n._v(" "),e("p",[n._v("参考文章：\nhttps://www.jianshu.com/p/f9d22220cb23\nhttps://my.oschina.net/wangnian/blog/3064886\nhttps://www.zhihu.com/question/42024389 （陷入无限的循环）")]),n._v(" "),e("p",[n._v("https://blog.fundebug.com/2018/11/27/about-float-number-add/ 有图很好")]),n._v(" "),e("p",[n._v("对于十进制的5.25对应的二进制为：101.01，相当于：1.01012^2。所以，S为0，M为1.0101，E为2。\n而-5.25=-101.01=-1.01012^2.。所以S为1，M为1.0101，E为2。")]),n._v(" "),e("p",[n._v("Step 1 改写整数部分\n以数值5.2为例。先不考虑指数部分，我们先单纯的将十进制数改写成二进制。\n整数部分很简单，5.即101.。")]),n._v(" "),e("p",[n._v("Step 2 改写小数部分\n小数部分我们相当于拆成是2^-1一直到2^-N的和。例如：\n0.2 = 0.125+0.0625+0.007825+0.00390625即2^-3+2^-4+2^-7+2^-8….，也即.00110011001100110011。")]),n._v(" "),e("p",[n._v("或者换个更傻瓜的方式去解读十进制对二进制小数的改写转换，通常十进制的0.5也（也就是分数1/2），相当于二进制的0.1（同等于分数1/2），")]),n._v(" "),e("p",[n._v("我们可以把十进制的小数部分乘以2，取整数部分作为二进制的一位，剩余小数继续乘以2，直至不存在剩余小数为止。")]),n._v(" "),e("p",[n._v("例如0.2可以转换为：")]),n._v(" "),e("p",[n._v("0.2 x 2 = 0.4     0")]),n._v(" "),e("p",[n._v("0.4 x 2 = 0.8     0")]),n._v(" "),e("p",[n._v("0.8 x 2 = 1.6     1")]),n._v(" "),e("p",[n._v("0.6 x 2 = 1.2     1")]),n._v(" "),e("p",[n._v("0.2 x 2 = 0.4     0")]),n._v(" "),e("p",[n._v("0.4 x 2 = 0.8     0")]),n._v(" "),e("p",[n._v("0.8 x 2 = 1.6     1")]),n._v(" "),e("p",[n._v(".......")]),n._v(" "),e("p",[n._v("即：.0011001.......（它是一个无限循环的二进制数，明白为什么十进制小数转换成二进制小数的时候为什么会出现精度损失的情况了吗）")]),n._v(" "),e("p",[n._v("Step 3 规格化\n现在我们已经有了这么一串二进制101.00110011001100110011。然后我们要将它规格化，也叫Normalize。其实原理很简单就是保证小数点前只有一个bit。于是我们就得到了以下表示：1.0100110011001100110011 * 2^2。到此为止我们已经把改写工作完成，接下来就是要把bit填充到三个组成部分中去了。")]),n._v(" "),e("p",[n._v("Step 4 填充\n指数部分（Exponent）：之前说过需要以127作为偏移量调整。因此2的2次方，指数部分偏移成2+127即129，表示成10000001填入。\n整数部分（Mantissa）：除了简单的填入外，需要特别解释的地方是1.010011中的整数部分1在填充时被舍去了。因为规格化后的数值整部部分总是为1。那大家可能有疑问了，省略整数部分后岂不是1.010011和0.010011就混淆了么？其实并不会，如果你仔细看下后者：会发现他并不是一个规格化的二进制，可以改写成1.0011 * 2^-2。所以省略小数点前的一个bit不会造成任何两个浮点数的混淆。")]),n._v(" "),e("p",[n._v("三个主要成分是：")]),n._v(" "),e("ul",[e("li",[n._v("Sign（1bit）：表示浮点数是正数还是负数。0表示正数，1表示负数")]),n._v(" "),e("li",[n._v("Exponent（8bits）：指数部分。类似于科学技术法中的M*10^N中的N，只不过这里是以2为底数而不是10。需要注意的是，这部分中是以2^7-1即127，也即01111111代表2^0，转换时需要根据127作偏移调整。")]),n._v(" "),e("li",[n._v("Mantissa（23bits）：基数部分。浮点数具体数值的实际表示。")])]),n._v(" "),e("p",[n._v("一般我们把数字称为整数、小数等，但是在计算机里面我们却称呼小数为浮点数，而非小数，那么为什么叫浮点数，这就涉及到小数在计算机内的存储了。")]),n._v(" "),e("p",[n._v("早期计算机存储小数采用的是固定小数点（Fixed Point Number）的方式，比如规定前多少bit是整数部分，剩余bit是小数部分，但是这样的表示方法非常有限，于是后来出现了 IEEE浮点数算术标准，也就是小数点浮动变化，并不固定，这就是所谓的浮点数（Float Point Number）。")]),n._v(" "),e("p",[n._v("在计算机存储中，一般采用科学计数法存储，即用一个有效数字。一个基数（Base）、一个指数（Exponent）以及一个表示正负的符号来表达实数。浮点数利用指数达到了浮动小数点的效果，从而可以灵活地表达更大范围的实数。从逻辑上讲，其结构大概如下（原理参考IEEE标准）")]),n._v(" "),e("p",[n._v("https://www.cnblogs.com/yiyide266/p/7987037.html")]),n._v(" "),e("h3",{attrs:{id:"_20200824-包箱和拆箱"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_20200824-包箱和拆箱"}},[n._v("#")]),n._v(" 20200824 包箱和拆箱")]),n._v(" "),e("p",[n._v("https://my.oschina.net/u/4322392/blog/3405867/print\n基本类型与包装类型在某些操作符的作⽤下, 包装类型调⽤valueOf()⽅法将原始类型值转换成对应的包装类对象的过程, 称之为⾃动装箱; 反之调⽤xxxValue()⽅法将包装类对象转换成原始类型值的过程, 则称之为⾃动拆箱。")]),n._v(" "),e("p",[n._v("封箱：将⼀个基本数据类型的变量直接赋值给对应引⽤类型。是JDK1.5的新特性 之⼀。底层实现：⾃动封箱实际上是调⽤了静态⽅法valueOf() --\x3e Integer in = Integer.valueOf(i);valueOf返回⼀个Integer类型的实例。或者是类似于上⾯的⾃动调⽤Integer的构造⽅法实现⾃动封箱，Integer in = 1。")]),n._v(" "),e("p",[n._v("拆箱：JDK1.5的新特性之⼀。底层实现：实际上是调⽤了value()⽅法（xxx指的是对应 的基本数据类型）。---\x3e int i = in.intVlaue(); //value() 返回对应基本类型的值。整数的哈希码是⾃⼰本身。Integer底层对hashCode()⽅法做过重写。数值类型的哈希码是不变的。")]),n._v(" "),e("p",[n._v("包装类的缓冲机制\n包装类同String类相似，也是⾮可变类，其对象⼀经创建，就不能修改。并且，包装类也重写了\nequals⽅法，对于相同类型的两个包装类对象，只要两个对象所包装的基本数据类型的值是相等\n的，则equals⽅法就会返回true，否则返回false。\n在使⽤“==”⽐较两个包装类引⽤时，如果两个引⽤指向的地址相同（指向相同的对象），则结果为\ntrue，否则结果为false。\n包装类提供了对象的缓存，具体的实现⽅式为在类中预先创建频繁使⽤的包装类对象，当需要使⽤\n某个包装类的对象时，如果该对象封装的值在缓存的范围内，就返回缓存的对象，否则创建新的对\n2020/8/24 Java程序员⾯试，⾃动封箱/拆箱原理与包装类的缓冲机制你知道么？（转） - osc_xb895t4t的个⼈空间 - OSCHINA\nhttps://my.oschina.net/u/4322392/blog/3405867/print 4/5\n象并返回。\n在包装类中，缓存的基本数据类型值得范围如下：\n包装类型 基本数据类型 缓存对象（基本数据类型值）\nBoolean boolean true,false（全部值）\nByte byte -128~127（全部值）\nShort short -128~127\nCharacter char 0~127\nInteger int -128~127（默认为127）\nLong long -128~127\nFloat float ⽆缓存值\nDouble double ⽆缓存值")]),n._v(" "),e("p",[n._v("在jdk1.5及之后的版本中，Java在5⼤包装类中（Byte，Charactor，Short，Integer，Long）增加了相应的私有静态成员内部类为相应包装类对象提供缓存机制，Integer包装类的内部缓存类源码如下：正如源码中所指，在⾃动装箱的基础上，缓存机制才会发⽣作⽤；当包装类加载时，内部类会初始化⼀个⻓度为((high-low)+1)的包装类类型数组，low有固定值为-128,⽽high的默认值为127,还可以通过系统配置⽂件进⾏修改，⾃定义high的取值范围是127---------(Interger.MAX_VALUE+127),Integer.MAX_VALUE是int类型变量的最⼤正数取值；ʼ其缓存机制是：当通过⾃动装箱机制创建包装类对象时，⾸先会判断数值是否在-128----127的范围内，如果满⾜条件，则会从缓存中寻找指定数值，若找到缓存，则不会新建对象，只是指向指定数值对应的包装类对象，否则，新建对象。")])])}),[],!1,null,null,null);t.default=_.exports}}]);
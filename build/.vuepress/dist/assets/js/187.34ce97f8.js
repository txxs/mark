(window.webpackJsonp=window.webpackJsonp||[]).push([[187],{570:function(s,a,t){"use strict";t.r(a);var n=t(13),e=Object(n.a)({},(function(){var s=this,a=s.$createElement,t=s._self._c||a;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("p",[t("a",{attrs:{href:"#%E5%9B%9E%E9%A1%BE%E4%B8%80%E4%B8%8B%E7%B1%BB%E5%8A%A0%E8%BD%BD%E8%BF%87%E7%A8%8B"}},[s._v("回顾一下类加载过程")])]),s._v(" "),t("ul",[t("li",[t("a",{attrs:{href:"#%E7%B1%BB%E5%8A%A0%E8%BD%BD%E5%99%A8%E6%80%BB%E7%BB%93"}},[s._v("类加载器总结")])]),s._v(" "),t("li",[t("a",{attrs:{href:"#%E5%8F%8C%E4%BA%B2%E5%A7%94%E6%B4%BE%E6%A8%A1%E5%9E%8B"}},[s._v("双亲委派模型")]),s._v(" "),t("ul",[t("li",[t("a",{attrs:{href:"#%E5%8F%8C%E4%BA%B2%E5%A7%94%E6%B4%BE%E6%A8%A1%E5%9E%8B%E4%BB%8B%E7%BB%8D"}},[s._v("双亲委派模型介绍")])]),s._v(" "),t("li",[t("a",{attrs:{href:"#%E5%8F%8C%E4%BA%B2%E5%A7%94%E6%B4%BE%E6%A8%A1%E5%9E%8B%E5%AE%9E%E7%8E%B0%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90"}},[s._v("双亲委派模型实现源码分析")])]),s._v(" "),t("li",[t("a",{attrs:{href:"#%E5%8F%8C%E4%BA%B2%E5%A7%94%E6%B4%BE%E6%A8%A1%E5%9E%8B%E7%9A%84%E5%A5%BD%E5%A4%84"}},[s._v("双亲委派模型的好处")])]),s._v(" "),t("li",[t("a",{attrs:{href:"#%E5%A6%82%E6%9E%9C%E6%88%91%E4%BB%AC%E4%B8%8D%E6%83%B3%E8%A6%81%E5%8F%8C%E4%BA%B2%E5%A7%94%E6%B4%BE%E6%A8%A1%E5%9E%8B%E6%80%8E%E4%B9%88%E5%8A%9E"}},[s._v("如果我们不想要双亲委派模型怎么办？")])])])]),s._v(" "),t("li",[t("a",{attrs:{href:"#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B1%BB%E5%8A%A0%E8%BD%BD%E5%99%A8"}},[s._v("自定义类加载器")])]),s._v(" "),t("li",[t("a",{attrs:{href:"#%E6%8E%A8%E8%8D%90"}},[s._v("推荐")])])]),s._v(" "),t("blockquote",[t("p",[s._v("公众号JavaGuide 后台回复关键字“1”，免费获取JavaGuide配套的Java工程师必备学习资源(文末有公众号二维码)。")])]),s._v(" "),t("h2",{attrs:{id:"回顾一下类加载过程"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#回顾一下类加载过程"}},[s._v("#")]),s._v(" 回顾一下类加载过程")]),s._v(" "),t("p",[s._v("类加载过程："),t("strong",[s._v("加载->连接->初始化")]),s._v("。连接过程又可分为三步:"),t("strong",[s._v("验证->准备->解析")]),s._v("。")]),s._v(" "),t("p",[t("img",{attrs:{src:"https://my-blog-to-use.oss-cn-beijing.aliyuncs.com/2019-6/%E7%B1%BB%E5%8A%A0%E8%BD%BD%E8%BF%87%E7%A8%8B.png",alt:"类加载过程"}})]),s._v(" "),t("p",[s._v("一个非数组类的加载阶段（加载阶段获取类的二进制字节流的动作）是可控性最强的阶段，这一步我们可以去完成还可以自定义类加载器去控制字节流的获取方式（重写一个类加载器的 "),t("code",[s._v("loadClass()")]),s._v(" 方法）。数组类型不通过类加载器创建，它由 Java 虚拟机直接创建。")]),s._v(" "),t("p",[s._v("所有的类都由类加载器加载，加载的作用就是将 .class文件加载到内存。")]),s._v(" "),t("h2",{attrs:{id:"类加载器总结"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#类加载器总结"}},[s._v("#")]),s._v(" 类加载器总结")]),s._v(" "),t("p",[s._v("JVM 中内置了三个重要的 ClassLoader，除了 BootstrapClassLoader 其他类加载器均由 Java 实现且全部继承自"),t("code",[s._v("java.lang.ClassLoader")]),s._v("：")]),s._v(" "),t("ol",[t("li",[t("strong",[s._v("BootstrapClassLoader(启动类加载器)")]),s._v(" ：最顶层的加载类，由C++实现，负责加载 "),t("code",[s._v("%JAVA_HOME%/lib")]),s._v("目录下的jar包和类或者或被 "),t("code",[s._v("-Xbootclasspath")]),s._v("参数指定的路径中的所有类。")]),s._v(" "),t("li",[t("strong",[s._v("ExtensionClassLoader(扩展类加载器)")]),s._v(" ：主要负责加载目录 "),t("code",[s._v("%JRE_HOME%/lib/ext")]),s._v(" 目录下的jar包和类，或被 "),t("code",[s._v("java.ext.dirs")]),s._v(" 系统变量所指定的路径下的jar包。")]),s._v(" "),t("li",[t("strong",[s._v("AppClassLoader(应用程序类加载器)")]),s._v(" :面向我们用户的加载器，负责加载当前应用classpath下的所有jar包和类。")])]),s._v(" "),t("h2",{attrs:{id:"双亲委派模型"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#双亲委派模型"}},[s._v("#")]),s._v(" 双亲委派模型")]),s._v(" "),t("h3",{attrs:{id:"双亲委派模型介绍"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#双亲委派模型介绍"}},[s._v("#")]),s._v(" 双亲委派模型介绍")]),s._v(" "),t("p",[s._v("每一个类都有一个对应它的类加载器。系统中的 ClassLoder 在协同工作的时候会默认使用 "),t("strong",[s._v("双亲委派模型")]),s._v(" 。即在类加载的时候，系统会首先判断当前类是否被加载过。已经被加载的类会直接返回，否则才会尝试加载。加载的时候，首先会把该请求委派该父类加载器的 "),t("code",[s._v("loadClass()")]),s._v(" 处理，因此所有的请求最终都应该传送到顶层的启动类加载器 "),t("code",[s._v("BootstrapClassLoader")]),s._v(" 中。当父类加载器无法处理时，才由自己来处理。当父类加载器为null时，会使用启动类加载器 "),t("code",[s._v("BootstrapClassLoader")]),s._v(" 作为父类加载器。")]),s._v(" "),t("p",[t("img",{attrs:{src:"https://my-blog-to-use.oss-cn-beijing.aliyuncs.com/2019-6/classloader_WPS%E5%9B%BE%E7%89%87.png",alt:"ClassLoader"}})]),s._v(" "),t("p",[s._v("每个类加载都有一个父类加载器，我们通过下面的程序来验证。")]),s._v(" "),t("div",{staticClass:"language-java line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-java"}},[t("code",[t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("public")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("class")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("ClassLoaderDemo")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("public")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("static")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("void")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("main")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("String")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" args"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("System")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("out"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("println")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"ClassLodarDemo\'s ClassLoader is "')]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("+")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("ClassLoaderDemo")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("class")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("getClassLoader")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("System")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("out"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("println")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"The Parent of ClassLodarDemo\'s ClassLoader is "')]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("+")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("ClassLoaderDemo")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("class")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("getClassLoader")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("getParent")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("System")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("out"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("println")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"The GrandParent of ClassLodarDemo\'s ClassLoader is "')]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("+")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("ClassLoaderDemo")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("class")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("getClassLoader")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("getParent")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("getParent")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br")])]),t("p",[s._v("Output")]),s._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("ClassLodarDemo's ClassLoader is sun.misc.Launcher$AppClassLoader@18b4aac2\nThe Parent of ClassLodarDemo's ClassLoader is sun.misc.Launcher$ExtClassLoader@1b6d3586\nThe GrandParent of ClassLodarDemo's ClassLoader is null\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br")])]),t("p",[t("code",[s._v("AppClassLoader")]),s._v("的父类加载器为"),t("code",[s._v("ExtClassLoader")]),s._v(" "),t("code",[s._v("ExtClassLoader")]),s._v("的父类加载器为null，"),t("strong",[s._v("null并不代表"),t("code",[s._v("ExtClassLoader")]),s._v("没有父类加载器，而是 "),t("code",[s._v("BootstrapClassLoader")])]),s._v(" 。")]),s._v(" "),t("p",[s._v("其实这个双亲翻译的容易让别人误解，我们一般理解的双亲都是父母，这里的双亲更多地表达的是“父母这一辈”的人而已，并不是说真的有一个 Mother ClassLoader 和一个 Father ClassLoader 。另外，类加载器之间的“父子”关系也不是通过继承来体现的，是由“优先级”来决定。官方API文档对这部分的描述如下:")]),s._v(" "),t("blockquote",[t("p",[s._v("The Java platform uses a delegation model for loading classes. "),t("strong",[s._v('The basic idea is that every class loader has a "parent" class loader.')]),s._v(' When loading a class, a class loader first "delegates" the search for the class to its parent class loader before attempting to find the class itself.')])]),s._v(" "),t("h3",{attrs:{id:"双亲委派模型实现源码分析"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#双亲委派模型实现源码分析"}},[s._v("#")]),s._v(" 双亲委派模型实现源码分析")]),s._v(" "),t("p",[s._v("双亲委派模型的实现代码非常简单，逻辑非常清晰，都集中在 "),t("code",[s._v("java.lang.ClassLoader")]),s._v(" 的 "),t("code",[s._v("loadClass()")]),s._v(" 中，相关代码如下所示。")]),s._v(" "),t("div",{staticClass:"language-java line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-java"}},[t("code",[t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("private")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("final")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("ClassLoader")]),s._v(" parent"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v(" \n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("protected")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Class")]),t("span",{pre:!0,attrs:{class:"token generics"}},[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("<")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("?")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(">")])]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("loadClass")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("String")]),s._v(" name"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("boolean")]),s._v(" resolve"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("throws")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("ClassNotFoundException")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("synchronized")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("getClassLoadingLock")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("name"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n            "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 首先，检查请求的类是否已经被加载过")]),s._v("\n            "),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Class")]),t("span",{pre:!0,attrs:{class:"token generics"}},[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("<")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("?")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(">")])]),s._v(" c "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("findLoadedClass")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("name"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n            "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("c "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("==")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("null")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n                "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("long")]),s._v(" t0 "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("System")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("nanoTime")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n                "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("try")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n                    "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("parent "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("!=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("null")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//父加载器不为空，调用父加载器loadClass()方法处理")]),s._v("\n                        c "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" parent"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("loadClass")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("name"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("false")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n                    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("else")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//父加载器为空，使用启动类加载器 BootstrapClassLoader 加载")]),s._v("\n                        c "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("findBootstrapClassOrNull")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("name"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n                    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n                "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("catch")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("ClassNotFoundException")]),s._v(" e"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n                   "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//抛出异常说明父类加载器无法完成加载请求")]),s._v("\n                "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n                \n                "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("c "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("==")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("null")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n                    "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("long")]),s._v(" t1 "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("System")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("nanoTime")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n                    "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//自己尝试加载")]),s._v("\n                    c "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("findClass")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("name"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\n                    "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// this is the defining class loader; record the stats")]),s._v("\n                    "),t("span",{pre:!0,attrs:{class:"token class-name"}},[t("span",{pre:!0,attrs:{class:"token namespace"}},[s._v("sun"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("misc"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")])]),s._v("PerfCounter")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("getParentDelegationTime")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("addTime")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("t1 "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v(" t0"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n                    "),t("span",{pre:!0,attrs:{class:"token class-name"}},[t("span",{pre:!0,attrs:{class:"token namespace"}},[s._v("sun"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("misc"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")])]),s._v("PerfCounter")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("getFindClassTime")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("addElapsedTimeFrom")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("t1"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n                    "),t("span",{pre:!0,attrs:{class:"token class-name"}},[t("span",{pre:!0,attrs:{class:"token namespace"}},[s._v("sun"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("misc"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")])]),s._v("PerfCounter")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("getFindClasses")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("increment")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n                "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n            "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n            "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("resolve"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n                "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("resolveClass")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("c"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n            "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n            "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("return")]),s._v(" c"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br"),t("span",{staticClass:"line-number"},[s._v("10")]),t("br"),t("span",{staticClass:"line-number"},[s._v("11")]),t("br"),t("span",{staticClass:"line-number"},[s._v("12")]),t("br"),t("span",{staticClass:"line-number"},[s._v("13")]),t("br"),t("span",{staticClass:"line-number"},[s._v("14")]),t("br"),t("span",{staticClass:"line-number"},[s._v("15")]),t("br"),t("span",{staticClass:"line-number"},[s._v("16")]),t("br"),t("span",{staticClass:"line-number"},[s._v("17")]),t("br"),t("span",{staticClass:"line-number"},[s._v("18")]),t("br"),t("span",{staticClass:"line-number"},[s._v("19")]),t("br"),t("span",{staticClass:"line-number"},[s._v("20")]),t("br"),t("span",{staticClass:"line-number"},[s._v("21")]),t("br"),t("span",{staticClass:"line-number"},[s._v("22")]),t("br"),t("span",{staticClass:"line-number"},[s._v("23")]),t("br"),t("span",{staticClass:"line-number"},[s._v("24")]),t("br"),t("span",{staticClass:"line-number"},[s._v("25")]),t("br"),t("span",{staticClass:"line-number"},[s._v("26")]),t("br"),t("span",{staticClass:"line-number"},[s._v("27")]),t("br"),t("span",{staticClass:"line-number"},[s._v("28")]),t("br"),t("span",{staticClass:"line-number"},[s._v("29")]),t("br"),t("span",{staticClass:"line-number"},[s._v("30")]),t("br"),t("span",{staticClass:"line-number"},[s._v("31")]),t("br"),t("span",{staticClass:"line-number"},[s._v("32")]),t("br"),t("span",{staticClass:"line-number"},[s._v("33")]),t("br"),t("span",{staticClass:"line-number"},[s._v("34")]),t("br"),t("span",{staticClass:"line-number"},[s._v("35")]),t("br"),t("span",{staticClass:"line-number"},[s._v("36")]),t("br")])]),t("h3",{attrs:{id:"双亲委派模型的好处"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#双亲委派模型的好处"}},[s._v("#")]),s._v(" 双亲委派模型的好处")]),s._v(" "),t("ul",[t("li",[s._v("双亲委派模型保证了Java程序的稳定运行，可以避免类的重复加载（JVM 区分不同类的方式不仅仅根据类名，相同的类文件被不同的类加载器加载产生的是两个不同的类）。")]),s._v(" "),t("li",[s._v("也保证了 Java 的核心 API 不被篡改。如果没有使用双亲委派模型，而是每个类加载器加载自己的话就会出现一些问题，比如我们编写一个称为 "),t("code",[s._v("java.lang.Object")]),s._v(" 类的话，那么程序运行的时候，系统就会出现多个不同的 "),t("code",[s._v("Object")]),s._v(" 类。")])]),s._v(" "),t("h3",{attrs:{id:"如果我们不想用双亲委派模型怎么办"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#如果我们不想用双亲委派模型怎么办"}},[s._v("#")]),s._v(" 如果我们不想用双亲委派模型怎么办？")]),s._v(" "),t("p",[s._v("为了避免双亲委托机制，我们可以自己定义一个类加载器，然后重载 "),t("code",[s._v("loadClass()")]),s._v(" 即可。")]),s._v(" "),t("h2",{attrs:{id:"自定义类加载器"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#自定义类加载器"}},[s._v("#")]),s._v(" 自定义类加载器")]),s._v(" "),t("p",[s._v("除了 "),t("code",[s._v("BootstrapClassLoader")]),s._v(" 其他类加载器均由 Java 实现且全部继承自"),t("code",[s._v("java.lang.ClassLoader")]),s._v("。如果我们要自定义自己的类加载器，很明显需要继承 "),t("code",[s._v("ClassLoader")]),s._v("。")]),s._v(" "),t("h2",{attrs:{id:"推荐阅读"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#推荐阅读"}},[s._v("#")]),s._v(" 推荐阅读")]),s._v(" "),t("ul",[t("li",[t("a",{attrs:{href:"https://blog.csdn.net/xyang81/article/details/7292380",target:"_blank",rel:"noopener noreferrer"}},[s._v("https://blog.csdn.net/xyang81/article/details/7292380"),t("OutboundLink")],1)]),s._v(" "),t("li",[t("a",{attrs:{href:"https://juejin.im/post/5c04892351882516e70dcc9b",target:"_blank",rel:"noopener noreferrer"}},[s._v("https://juejin.im/post/5c04892351882516e70dcc9b"),t("OutboundLink")],1)]),s._v(" "),t("li",[t("a",{attrs:{href:"http://gityuan.com/2016/01/24/java-classloader/",target:"_blank",rel:"noopener noreferrer"}},[s._v("http://gityuan.com/2016/01/24/java-classloader/"),t("OutboundLink")],1)])])])}),[],!1,null,null,null);a.default=e.exports}}]);
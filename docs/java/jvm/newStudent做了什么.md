Student s = new Student(); 在内存中做了哪些事情

1. 加载 Student.class 文件进内存 
2. 在栈内存为 s 开辟空间 
3. 在堆内存为 Student 对象开辟空间 
4. 对 Student 对象的成员变量进行默认初始化 
5. 对 Student 对象的成员变量进行显示初始化 
6. 通过构造方法对 Student 对象的成员变量赋值 
7. Student 对象初始化完毕，把对象地址赋值给 s 变量 


总的来说就是：

加载类文件到内存

在对内存开辟空间

各种初始化

赋值

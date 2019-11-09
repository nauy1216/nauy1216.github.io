# 1、java准备

## 1.1 Java的知识体系 

### Java SE 

Java Standard Edition，Java标准版。

这是Java学习的基础 。其中包含了： 
Java基本语法 、Java基本类库 、 Java的开发环境 、 Java的运行环境。



### Java EE 

Java Enterprise Edition，Java企业版 。
**这是Java最擅长的方向，也是我们课程学习的重点** 。
着重于Java企业级应用程序的开发，即Web应用的开发 。



### Java ME 

Java Micro Edition，Java微型版。这是Java开发的另一个方向 ，着重于Java在小型移动设备上的开发。



## 1.2 Java的环境 

### JDK

**是整个Java的核心** ，包括了Java运行环境（Java Runtime Envirnment），一堆Java工具和Java基础的类库（rt.jar）。 




### 配置环境变量


### java和javac

cmd中，执行java命令与javac命令的区别：

**javac：是编译命令，将java源文件编译成.class字节码文件。**

例如：javac hello.java
将生成hello.class文件。

**java：是运行字节码文件；由java虚拟机对字节码进行解释和运行。**

例如：java hello


> 在命令行模式中，输入命令：javac 源文件名.java，对源代码进行编译，生成class字节码文件；
>
> 编译完成后，如果没有报错信息，输入命令：java Hello，对class字节码文件进行解释运行，打印“Hello World”。

```java
/**
 * 1、创建java项目
 * 2、创建Test.java文件
 * 3、点击run执行文件
 */
public class Test {
    public static void main(String[] args) {
        System.out.println("hello");
    }
}
```


# 2、java与面向对象

## 对象

什么是对象？

有属性、有行为的东西皆可称之为对象。

在java中的对象也是如此， java对象包括属性、方法。



## 类

类是某一类对象的统称。比如鸡、鸭、鹅皆是动物， 动物是一个类。既然鸡、鸭、鹅皆是动物， 鸡、鸭、鹅也应该有动物的所有特性及行为。  






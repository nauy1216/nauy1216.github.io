# 变量

## 1、什么是变量

> 程序是用来处理数据的， 而变量就是用来存储数据的。

- 每个变量在使用前都必须赋值，变量赋值后该变量才会被创建。

- 等号用来给变量赋值，左边的是变量名， 右边是存储在变量中的值。

  ```python
  变量名 = 值
  
  # 定义name变量
  name = 'liuchengyuan'
  
  # 使用变量
  print(name) # 输出liuchengyuan
  ```

示例：

```python
# 定义变量 价格
price = 7.5
# 定义变量 重量
weight = 2.5
# 使用变量计算金额
money = price * weight
# 将计算的价格打印出来
print(money) # 结果是18.75
```

## 2、变量的类型

1. 数字型
   - 整型
   - 浮点型
   - 布尔型
     - 真 True 非0
     - 假 False 0
   - 复数型
2. 非数字型
   - 字符串
   - 列表
   - 元组
   - 字典

```
name = "张三” # 字符串
age = 18 # 数值, 包括 int(整数) 和 float(小数)
gender = False #布尔值 包括 True 和 False两个值
```

> 判断变量的类型

下面的例子第一次打印时name的值是字符串‘123’，第二次打印时值是数字123。

在代码的运行过程中变量的类型是可以改变的。注意‘123’不是数字。

```
name = '123'
print(type(name)) # <class 'str'>

name = 123
print(type(name)) # <class 'int'>
```

## 3、变量的计算

> 数字型变量是可以直接计算的
>
> 注意： 在进行计算时 True 的值是1， False的值是0。
>
> 但是在流程控制的时候只要是非0都认为是True。

```
i = 10
f = 1.5
b = True
b1 = False

print(i + f) # 11.5
print(i + b) # 11
print(i + b1) # 10
print(f * b1) # 0.0`
```

下面都会输出hello

```
if 'd':
    print('hello')

if 5:
    print('hello')

if True:
    print('hello')
```



下面都不会输出hello

```
if False:
    print('hello')
if '':
    print('hello')
if None:
    print('hello')
```



> 字符串拼接

```
first_name = "zhang"
last_name = "san"
print(first_name + last_name) # zhangsan
```

重复使用

```
print('hello' * 2) # hellohello
```



## 4、变量的输入

```
password = input('请输入银行密码\n')
print('输入的密码是', password)
```

将输入的内容进行类型转换

```
password = input('请输入银行密码\n')
print('输入的密码是', password)
print('类型是', type(password))

password = int(password)
print('类型转换后', type(password))
```

## 5、格式化输出

```
print("整数 %d, 小数 %f, 字符串 %s" % (100,100,100))
```


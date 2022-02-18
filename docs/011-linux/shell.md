# Q&A
### 报错-bash: ./test: Permission denied
chmod +x ./test.sh
  

# 第一个程序
第一行指定`#!/bin/bash`。
`#! `是一个约定的标记，它告诉系统这个脚本需要什么解释器来执行，即使用哪一种` Shell`。
```shell
#!/bin/bash
echo "Hello World !"
```

# 执行脚本
### 1、作为可执行程序
```shell
chmod +x ./test.sh  #使脚本具有执行权限
./test.sh  #执行脚本
```

### 2、作为解释器参数
这种运行方式是，直接运行解释器，其参数就是 shell 脚本的文件名，如：
```shell
/bin/sh test.sh
/bin/php test.php
```
这种方式运行的脚本，不需要在第一行指定解释器信息，写了也没用。


# 变量
### 定义变量
1. 定义变量时，变量名不加美元符号。
    ```shell
    your_name="lcy"
    ```
2. 变量名和等号之间不能有空格。

### 使用变量
只要在变量名前面加美元符号即可。
```shell
  echo $your_name
  echo ${your_name}
```
1. 变量名外面的花括号是可选的，加不加都行，加花括号是为了帮助解释器识别变量的边界。
2. 已定义的变量，可以被重新定义。
```shell
your_name="tom"
echo $your_name
your_name="alibaba"
echo $your_name
```

### 只读变量
使用` readonly `命令可以将变量定义为只读变量，只读变量的值不能被改变。
```shell
readonly var1=hello

var2=world 
readonly var2
```

### 删除变量
使用 unset 命令可以删除变量。语法：
```shell
unset variable_name
```
1. 变量被删除后不能再次使用。
2. unset 命令不能删除只读变量。

### 变量类型
1. `局部变量` 局部变量在脚本或命令中定义，仅在当前shell实例中有效，其他shell启动的程序不能访问局部变量。
2. `环境变量` 所有的程序，包括shell启动的程序，都能访问环境变量，有些程序需要环境变量来保证其正常运行。必要的时候shell脚本也可以定义环境变量。
3. `shell变量` shell变量是由shell程序设置的特殊变量。shell变量中有一部分是环境变量，有一部分是局部变量，这些变量保证了shell的正常运行

# 字符串
字符串可以用单引号，也可以用双引号，也可以不用引号。
### 单引号
1. 单引号里的任何字符都会原样输出，单引号字符串中的变量是无效的；
2. 单引号字串中不能出现单独一个的单引号（对单引号使用转义符后也不行），但可成对出现，作为字符串拼接使用。

### 双引号
1. 双引号里可以有变量
2. 双引号里可以出现转义字符

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


### 字符串长度
```shell
var3="hello world shell!"
echo 字符串var3的长度：${#var3} # 输出 --> 字符串var3的长度：18
```

### 提取子字符串
```shell
var3="hello world shell!"
 # 输出 --> 前三个字符串hel
 # 和js中的slice方法的用法很像
echo 前三个字符串${var3:0:3}
```

### 查找子字符串？


# 数组
bash支持一维数组（不支持多维数组），并且没有限定数组的大小。
### 定义数组
在 Shell 中，用括号来表示数组，数组元素用"空格"符号分割开。
```shell
array_name=(value0 value1 value2 value3)
```

### 读取数组
通过下标读取元素。
```shell
arr_1=(h e l l o !)
echo ${arr_1[3]} # l
```
使用 @ 符号可以获取数组中的所有元素，例如：
```shell
echo ${arr_1[@]} # h e l l o !
```

### 获取数组的长度
```shell
# 取得数组元素的个数
echo ${#arr_1[@]} # 6
# 或者
echo ${#arr_1[*]} # 6
# 取得数组单个元素的长度
echo ${#arr_1[2]} # 1
```


# 获取参数
```shell
./test.sh a b c
```
我们可以在执行 Shell 脚本时，向脚本传递参数，脚本内获取参数的格式为：$n。n 代表一个数字，1 为执行脚本的第一个参数，2 为执行脚本的第二个参数，以此类推……

注意： 
- `$0` 为执行的文件名（包含文件路径）
```shell
echo $0 # ./test.sh
```
- `$#` 为传递给脚本的参数的个数
```shell
echo $# # 3
```
- `$*` 以一个单字符串显示所有向脚本传递的参数
```shell
echo $* # a b c
```

- `$$` 脚本当前运行的进程号
```shell
echo $$ # 2464

```

- `$@` 与`$*`相同，但是使用时加引号，并在引号中返回每个参数。
在对`$*`和`$@`进行遍历时会有不同，`$*`输出一次， `$@`输出多次。



# 运算符
### 算数运算符
- 原生bash不支持简单的数学运算，但是可以通过其他命令来实现，例如 awk 和 expr，expr 最常用。
- expr 是一款表达式计算工具，使用它能完成表达式的求值操作。

```shell
val=`expr 2 + 2`
echo "两数之和为 : $val" # 4
```
注意：
- 表达式和运算符之间要有空格，例如 `2+2` 是不对的，必须写成 `2 + 2`
- 完整的表达式要被\` \`包含，注意这个字符不是常用的单引号，在` Esc `键下边。
```shell
a=50
b=4

echo `expr $a + $b` # 54
echo `expr $a - $b` # 46
echo `expr $a \* $b` # 200 不能直接使用*，必须使用\*
echo `expr $a / $b` # 12, 而不是12.5
echo `expr $a % $b` # 2

if [ $a != $b ] # 注意这里的空格，不能写成[$a != $b]
then
   echo "a 不等于 b"
fi
```

### 关系运算符
- `-eq`	检测两个数是否相等，相等返回 true。 
- `-ne`	检测两个数是否不相等，不相等返回 true。 
- `-gt`	检测左边的数是否大于右边的，如果是，则返回 true。 
- `-lt`	检测左边的数是否小于右边的，如果是，则返回 true。 
- `-ge`	检测左边的数是否大于等于右边的，如果是，则返回 true。 
- `-le`	检测左边的数是否小于等于右边的，如果是，则返回 true。
```shell
a=50
b=4

if [ $a -lt $b]
then 
    echo a 小于 b
else 
    echo a 大于 b
fi
```
### 布尔运算符
- `-!	`非运算，表达式为 true 则返回 false，否则返回 true。
- `-o`	或运算，有一个表达式为 true 则返回 true。
- `-a`	与运算，两个表达式都为 true 才返回 true。

### 逻辑运算符
- &&	逻辑的 AND 
- ||	逻辑的 OR

### 字符串运算符
- =	检测两个字符串是否相等，相等返回 true。 
- !=	检测两个字符串是否不相等，不相等返回 true。 
- -z	检测字符串长度是否为0，为0返回 true。	 
- -n	检测字符串长度是否不为 0，不为 0 返回 true。 
- $	检测字符串是否为空，不为空返回 true。

### 文件测试运算符


# echo命令
- 将内容输出到文件
```shell
echo "It is a test" > test.txt # 如果不存在会创建test.txt文件，存在则覆盖内容。
```

# if语句
```shell
a=10
b=20
if [ $a == $b ]
then
   echo "a 等于 b"
elif [ $a -gt $b ]
then
   echo "a 大于 b"
elif [ $a -lt $b ]
then
   echo "a 小于 b"
else
   echo "没有符合的条件"
fi
```
- 如果 else 分支没有语句执行，就不要写这个 else。

# for 循环
for循环一般格式为：
```shell
for var in item1 item2 ... itemN
do
    command1
    command2
    ...
    commandN
done
```
写成一行
```shell
for var in item1 item2 ... itemN; do command1; command2… done;
```

示例：
```shell
for loop in 1 2 3 4 5
do
    echo "The value is: $loop"
done

a=1
while [ $a -le 5 ]
do 
    echo $a
    let "a++"
done
```

# while循环
```shell
a=1
while [ $a -le 5 ]
do 
    echo $a
    let "a++"
done
```

# until 循环
until 循环执行一系列命令直至条件为 true 时停止。
```shell
a=0

until [ ! $a -lt 10 ]
do
   echo $a
   a=`expr $a + 1`
done
```

# 多选择语句
```shell
echo '输入 1 到 4 之间的数字:'
echo '你输入的数字为:'
read aNum
case $aNum in
    1)  echo '你选择了 1'
    ;;
    2)  echo '你选择了 2'
    ;;
    3)  echo '你选择了 3'
    ;;
    4)  echo '你选择了 4'
    ;;
    *)  echo '你没有输入 1 到 4 之间的数字'
    ;;
esac
```
- 每个 case 分支用右圆括号开始
- 用两个分号 ;; 表示 break，即执行结束，跳出整个 case ... esac 语句。
- 如果无一匹配模式，使用星号 * 捕获该值，再执行后面的命令。

# 跳出循环
### break命令
break命令允许跳出所有循环（终止执行后面的所有循环）。
```shell
while :
do
    echo -n "输入 1 到 5 之间的数字:"
    read aNum
    case $aNum in
        1|2|3|4|5) echo "你输入的数字为 $aNum!"
        ;;
        *) echo "你输入的数字不是 1 到 5 之间的! 游戏结束"
            break
        ;;
    esac
done
```

### continue
continue命令与break命令类似，只有一点差别，它不会跳出所有循环，仅仅跳出当前循环。
```shell
while :
do
    echo -n "输入 1 到 5 之间的数字: "
    read aNum
    case $aNum in
        1|2|3|4|5) echo "你输入的数字为 $aNum!"
        ;;
        *) echo "你输入的数字不是 1 到 5 之间的!"
            continue
            echo "游戏结束"
        ;;
    esac
done
```

# 函数
### 定义
```shell
funWithReturn(){
    echo "这个函数会对输入的两个数字进行相加运算..."
    echo "输入第一个数字: "
    read aNum
    echo "输入第二个数字: "
    read anotherNum
    echo "两个数字分别为 $aNum 和 $anotherNum !"
    return $(($aNum+$anotherNum))
}
funWithReturn
echo ${?}!!!!
```
- 可以带function fun() 定义，也可以直接fun() 定义,不带任何参数。
- 参数返回，可以显示加：return 返回，如果不加，将以最后一条命令运行结果，作为返回值。 return后跟数值n(`0-255`)，超出范围将会溢出。
- 函数返回值在调用该函数后通过` $? `来获得。
- 所有函数在使用前必须定义。这意味着必须将函数放在脚本开始部分，直至shell解释器首次发现它时，才可以使用。
- 调用函数仅使用其函数名即可。

### 函数参数
```shell
funWithParam(){
    echo "第一个参数为 $1 !"
    echo "第二个参数为 $2 !"
    echo "第十个参数为 $10 !"
    echo "第十个参数为 ${10} !"
    echo "第十一个参数为 ${11} !"
    echo "参数总数有 $# 个!"
    echo "作为一个字符串输出所有参数 $* !"
}
funWithParam 1 23
```
- 调用函数时可以向其传递参数。在函数体内部，通过 $n 的形式来获取参数的值，例如，$1表示第一个参数，$2表示第二个参数...
- $10 不能获取第十个参数，获取第十个参数需要${10}。当n>=10时，需要使用${n}来获取参数。

# 输入/输出重定向
### command > file
将输出重定向到 file。
```shell
echo "who are you" > test.txt
who > test.txt
```
- 上面这个命令执行command1然后将输出的内容存入file1。
- 注意任何file1内的已经存在的内容将被新内容替代。

### command < file
- 从文件获取输入。
- 本来需要从键盘获取输入的命令会转移到文件读取内容。

### Here Document
Here Document 是 Shell 中的一种特殊的重定向方式，用来将输入重定向到一个交互式 Shell 脚本或程序。
```shell
wc -l << EOF
    今天是2022年02月21日
    今天好开心～～
    好好学习～～
EOF
```

### /dev/null 文件

# 文件包含
```shell
. filename   # 注意点号(.)和文件名中间有一空格
# 或
source filename
```
- Shell 也可以包含外部脚本。这样可以很方便的封装一些公用的代码作为一个独立的文件。

示例：
const.sh
```shell
#!/bin/bash
a=123
```
test.sh
```shell
#!/bin/bash
. ./const.sh

echo $a
```
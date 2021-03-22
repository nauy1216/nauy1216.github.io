### 2D变换

transform：参数是函数
rotate(90deg)
旋转。 参数的单位是角度。 90deg顺时针旋转90度， -90deg逆时针旋转90度。
注意：每次旋转都是从起始位置开始的不会叠加。

scale()
缩放。 取值为小数和整数。
scale(0.6,0.5);
第一个参数是横向 第二个参数是纵向（只有一个参数是x轴）。
scaleX()
scaleY()

skew()
倾斜。角度为正数时，下边界往右拉。 角度为负数时，下边界往左边拉。 右下角的度数是90-倾斜度数。
skew(10deg,10deg)第一个参数是x轴 第二个参数是y轴（只有一个参数是x轴）。
skewX()延X轴倾斜。
skewY()延Y轴倾斜。

translate()
平移。
translate(100px,100px); 第一个参数是x轴 第二个参数是y轴（一个参数是x轴）。
translateX()
translateY()

transform-orgin：
指定对象的转换基点。
用法：transform-orgin：10px 10px;
第一个参数是横轴坐标，第二个参数是纵轴坐标
在转换时 基准点是不会运动的。

注意：
transform 转换产生的移动平移不会脱离文档流，也不会占用其他元素的位置， 只会覆盖其他的元素。

矩阵函数： 标准下（包括Ie9+）
matrix(a,b,c,d,e,f)
初始情况下matrix(1,0,0,1,0,0)
通过矩阵实现缩放：
x轴缩放：
a=x*a
c=x*c
e=x*e
y轴缩放：
b=x*b
d=x*d
f=x*f

位移
x轴位移：e=e+x
y轴位移：f=f+x

倾斜
x：c=Math.tan(xdeg/180*Math.PI)
y：b=Math.tan(xdeg/180*Math.PI)
旋转（没试过）
a = Math.cos(deg/180*Math.PI)
b = Math.sin(deg/180*Math.PI)
c = -Math.sin(deg/180*Math.PI)
d = Math.cos(deg/180*Math.PI)

要实现复杂的效果通过多次使用matrix函数实现
transform:matrix(1,0,0,2,0,0) matrix(1,0,0,1,500,0);

两个问题：
1、IE678的兼容性怎么解决？
使用本身自带的filter
2、Ie下的旋转基点矫正？
在标准下旋转基点是不会运动的， 在IE下基点会运动。
解决：
第一步：用一个div包住旋转的对象， 对象相对于div定位
第二步：根据调整定位的left top 来调整基点的位置
left=（div的offsetWidth-对象的offsetWidth）/2
top =（div的offsetHeight-对象的offsetHeight）/2


# 2D变换transform
参数是函数。
### rotate(90deg)
旋转。 
1. 参数的单位是角度。 
2. 90deg顺时针旋转90度， -90deg逆时针旋转90度。
> 注意：每次旋转都是从起始位置开始的不会叠加。
<div class="box">
<div class="content"></div>
</div>
<style>
.box {
  display: inline-block;
  width: 100px;
  height: 100px;
  background: #e0e0e0;
}
.content {
  width: 100px;
  height: 100px;
  background: red;
  transform: rotate(45deg)
} 
</style>


### scale()
缩放。 
- 取值为小数和整数。
```css
scale(0.6,0.5);
```
- 第一个参数是横向 
- 第二个参数是纵向（只有一个参数是x轴）。
<div class="box1">
<div class="content1"></div>
</div>
<style>
.box1 {
  display: inline-block;
  width: 100px;
  height: 100px;
  background: #e0e0e0;
}
.content1 {
  width: 100px;
  height: 100px;
  background: red;
  transform: scale(0.5)
} 
</style>

### scaleX()
### scaleY()

### skew()
倾斜。
1. 角度为正数时，下边界往右拉。 
2. 角度为负数时，下边界往左边拉。 
3. 右下角的度数是90-倾斜度数。
```css
skew(10deg,10deg)
```
- 第一个参数是x轴 
- 第二个参数是y轴（只有一个参数是x轴）。

<div class="box2">
<div class="content2"></div>
</div>
<style>
.box2 {
  display: inline-block;
  width: 100px;
  height: 100px;
  background: #e0e0e0;
}
.content2 {
  width: 100px;
  height: 100px;
  background: red;
  transform: skew(-15deg);
} 
</style>

### skewX()
延X轴倾斜。
### skewY()
延Y轴倾斜。

### translate()
平移。
```css
translate(100px,100px); 
```
- 第一个参数是x轴 
- 第二个参数是y轴（一个参数是x轴）。

### translateX()
### translateY()

### transform-orgin
指定对象的转换基点。
```css
transform-orgin：10px 10px;
```
- 第一个参数是横轴坐标
- 第二个参数是纵轴坐标

在转换时, 基准点是不会运动的。

> 注意：transform 转换产生的移动平移不会脱离文档流，也不会占用其他元素的位置， 只会覆盖其他的元素。

### matrix(a,b,c,d,e,f)
矩阵函数： 标准下（包括Ie9+）

> 初始情况下matrix(1,0,0,1,0,0)

通过矩阵实现缩放：
- x轴缩放(scaleX)：
  - a=x*a
  - c=x*c
  - e=x*e
- y轴缩放(scaleY)：
  - b=x*b
  - d=x*d
  - f=x*f

通过矩阵实现位移：
- x轴位移(translateX)：
  - e=e+x
- y轴位移(translateY)：
  - f=f+x

通过矩阵实现倾斜：
- skewX(xdeg)：
  - c=Math.tan(xdeg/180*Math.PI)
- skewY(xdeg)：
  - b=Math.tan(xdeg/180*Math.PI)


通过矩阵实现旋转：
- rotate(deg)
  1. a = Math.cos(deg/180*Math.PI)
  2. b = Math.sin(deg/180*Math.PI)
  3. c = -Math.sin(deg/180*Math.PI)
  4. d = Math.cos(deg/180*Math.PI)

> 要实现复杂的效果通过多次使用matrix函数实现
```css
transform: matrix(1,0,0,2,0,0) matrix(1,0,0,1,500,0);
```


# 两个问题：
### 1. IE678的兼容性怎么解决？
使用本身自带的filter

### 2. Ie下的旋转基点矫正？

在标准下旋转基点是不会运动的， 在IE下基点会运动。
解决：
1. 第一步：用一个div包住旋转的对象， 对象相对于div定位
2. 第二步：根据调整定位的left top 来调整基点的位置
```css
left=（div的offsetWidth-对象的offsetWidth）/2
top =（div的offsetHeight-对象的offsetHeight）/2
```


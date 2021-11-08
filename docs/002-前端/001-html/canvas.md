[canvas api](https://www.canvasapi.cn/CanvasRenderingContext2D/clearRect#&syntax)



# 1、canvas

画布。所有画图设置都必须在在开始画之前设置好，所画图形有先后顺序。



# 2、用法

```html
<canvas  width="400px" height="400px">
    <span>您的浏览器不支持canvas</span>
</canvas> <!--默认：宽300 高150-->
```

> 注意：画布的尺寸只能在行内设置，用内部样式，会按比例缩放。

或者通过下面的方式进行设置尺寸。

```
var oC = document.getElementById('canvas')
oC.width = 1000
oC.height = 1000
```

如果想要画布的大小跟浏览器的大小一致可以这样设置

```css
<style>
    html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
    }
    canvas {
        background: #000000;
    }
</style>
```



```js
var oC = document.getElementById('canvas')
var width = document.body.offsetWidth
var height = document.body.offsetHeight
oC.width = width
oC.height = height
```



#   3、绘图环境

获取绘图上下文：`getContext('2d')`

> 1、画布的坐标轴：原点为左上角， x轴从左到右，y轴从上到下。

```js
var oC = document.querySelector('canvas');
var oGc = oC.getContext('2d');  
```



#   4、绘制方块

## 填充方块

```js
// left、 top、 width、 height，默认颜色是黑色。
oGc.fillRect(200,200,100,100);
```



## 带边框的方块

```js
// left、 top、 width、 height
// 默认边框1px黑色，绘图是以边框的中间往两边画。
// 左右边框中点距离就是width。  
oGc.strokeRect(0,0,100,100);
```



例子：

```js
// 获取画布及绘图上下文
var oC = document.getElementById('canvas')
var oGc = oC.getContext('2d')

// 设置画布
var width = document.body.offsetWidth
var height = document.body.offsetHeight
oC.width = width
oC.height = height

// 绘制矩形
oGc.fillRect(200,200,100,100)
oGc.strokeRect(400, 200, 100,100)
```



# 5、绘图设置

```js
//设置填充颜色,填充图片，线性渐变。。。。。
oGc.fillStyle="red";

//设置边框宽度
oGc.lineWidth=10;

//设置边框颜色
oGc.strokeStyle="red";
```



# 6、边界绘制

```js
oGc.lineJoin="round";//连接点样式
oGc.lineCap="square";//端点样式
```



# 7、绘制路径

用canvas绘制简单的图形，有点像用一支笔在纸上画画。通过不停调整落笔的位置、画各种各样的线条来勾勒出画的框架，再用各种颜色对封闭区间填充、对线条描边。在canvas中绘图的过程基本和这差不多。

canvas里有**路径**的概念。可以理解成通过画笔画出的任意线条，这些线条甚至不用相连。在没描边(stroke)或是填充（fill）之前，路径在canvas画布上是看不到的。



### moveTo(x, y)

将当前位置移动到坐标(x, y)。



### lineTo(x, y)

从当前位置向坐标(x, y)画一条直线路径。如果不存在当前位置，相当于执行moveTo(x, y)（在崭新的路径中没有执行过任何操作的情况下，默认是不存在当前位置的，所以一般在执行lineTo()之前，先执行moveTo()）



### stroke()

对当前路径中的线段或曲线进行描边。描边的颜色由strokeStyle决定，描边的粗细由lineWidth决定。另外与stroke相关的属性还有lineCap、lineJoin、miterLimit。

| 属性        | 说明                                                         |
| ----------- | ------------------------------------------------------------ |
| lineWidth   | 该值决定了再canvas中绘制线段的屏幕像素宽度。必须是个非负、非无穷的double值，默认值为1.0 |
| strokeStyle | 指定了对路径进行描边时所用的绘制风格，可以被设定成某个颜色、渐变、或者图案（渐变和图案后面再说，这篇只用到设置颜色） |
| lineCap     | 设置如何绘制线段的端点。有三个值可选：butt、round、和square。默认为butt |
| lineJoin    | 设置同一个路径中相连线段的交汇处如何绘制。有三个值可选：bevel、round、miter。默认为miter |
| miterLimit  | 当lineJoin设置为miter时有效，该属性设置两条线段交汇处最大渲染长度。 |



### fill()

填充当前路径。无论当前路径时封闭还是开放，浏览器都会将其当成封闭路径来填充，就好像填充前先执行了一次context.closePath()。可以通过设置fillStyle属性，指定后续图形填充操作中使用的颜色、渐变色或图案。



### beginPath()

在说明beginPath用途前先了解路径这一概念。**在任意时刻，canvas中只能有一条路径存在，被称为"当前路径"**(current path)。对一条路径进行描边(stroke)时，这条路径的所有线段、曲线都会被描边成指定颜色。这意味着，如果在同一路径上先画了条直线，描边成红色，再画一条曲线，再描边成黑色时，整条路径上的线都会用黑色再次描边，包括之前已经描成红色的直线。

比如想画一条垂直黑线和一条水平红线：

```js
var context = document.getElementById("canvas").getContext("2d");
context.lineWidth = 4;
// 画一条垂直黑色线段
context.strokeStyle = "black";
context.moveTo(100, 10);
context.lineTo(100, 100);
context.stroke();
// 画一条水平红色线段
context.strokeStyle = "red";
context.lineTo(190, 100);
context.stroke();
```

我们想要得到的结果是一条黑色的竖线和一条红色的横线， 但实际的效果却是都是红色。这并不是想要的结果，垂直黑线被用红色又描了一次边。



> 好在可以在当前路径上创建更多的“子路径”(subpath)，让在当前子路径上的绘制不对之前的路径产生影响。这就是beginPath()的作用。

> 在绘制时总是找到最后一次用**beginPath**定义的路径。如果不同的图形路径没有用 **beginPath**隔开，那就会重复画一遍之前的图形。导致后面一次的绘制覆盖前面的绘制。

每次使用beginPath重新定义路径后，都必须重新调用moveTo指定路径的起点。

```js
var context = document.getElementById("canvas").getContext("2d");
context.strokeStyle = "black";
context.lineWidth = 4;
context.lineCap = "square";
// 画一条垂直黑色线段
context.beginPath();
context.moveTo(100, 10);
context.lineTo(100, 100);
context.stroke();
// 画一条水平红色线段
context.beginPath();
context.moveTo(100, 100);
context.lineTo(190, 100);
context.strokeStyle = "red";
context.stroke();
```



### closePath()

当路径中的起始点和终止点不在同一点上时，执行closePath()会用一条直线将起始点和终止点相连。

```js
var context = document.getElementById("canvas").getContext("2d");
context.strokeStyle = "black";
context.lineWidth = 10;
context.moveTo(10, 10);
context.lineTo(100, 10);
context.lineTo(100, 100);
context.lineTo(10, 100);
context.closePath();
context.stroke();
```



### save() 与 restore()

保存当前Canvas画布状态并放在栈的最上面，可以使用restore()方法依次取出。

例子： 先存储默认的Canvas状态，画一个红色的矩形，再还原画一个矩形（这个矩形的颜色不是红色了），可以看到填充颜色变成了默认的黑色了。代码如下：

```
// 保存初始Canvas状态
context.save();
// 设置红色填充
context.fillStyle = 'red';
// 矩形填充
context.fillRect(20, 20, 100, 60);
// 还原在绘制
context.restore();
// 矩形填充again
context.fillRect(180, 60, 100, 60);
```

save和restore配合使用可以类比成局部作用域，但不仅仅是作用域这么简单。

```js
oGc.save();
//相当于定义局部作用域， 这里可以访问外面的画布设置（相当于全局作用域）
oGc.restore();//
```

例子：

```html
  <input id="save" type="submit" value="保存">
  <input id="restore" type="reset" value="恢复">
  <canvas id="canvas"></canvas>
  <script>
    // 获取画布及绘图上下文
    var oC = document.getElementById('canvas')
    var context = oC.getContext('2d');
    // 初始字体大小
    var fontSize = 16;
    // 初始文字填充
    context.font = fontSize + 'px arial';
    context.fillText('观察字号大小', 10, 80);

    // 按钮事件
    // 每次点击都将画布的设置状态保存
    save.addEventListener('click', function () {
        context.clearRect(0, 0, 300, 150);
        // 状态继续存储
        context.save();
        // 字号递增
        fontSize++;
        context.font = fontSize + 'px arial';
        context.fillText('观察字号大小', 10, 80);        
    });
    // 每次点击都恢复上一次画布的设置状态，这样就能以上一次的画布状态绘制
    restore.addEventListener('click', function () {
        context.clearRect(0, 0, 300, 150);
        // 字号递减
        // fontSize--;
        // 恢复上一次状态
        context.restore();
        // 看看现在字号大小
        context.fillText('观察字号大小', 10, 80);
    });
  </script>
```



### clearRect()

清除画布指定区域（在这个区域内所有的像素都变成rgba(0,0,0,0)），在Canvas动画绘制中非常常用，不断清除画布内容再绘制，形成动画效果。

```js
oGc.moveTo(100,100);//笔尖挪到（100,100）
oGc.lineTo(200,200);//连接上一点
oGc.stroke();//画线
oGc.fill();//填充
oGc.rect(100,100,100,100);//绘制指定位置、尺寸的矩形区域
oGc.clearRect(100,100,50,50);//清除画布指定区域
L 、 T 、 W 、 H
```



例子：先把一张图片绘制在Canvas画布上，然后再把中间一块矩形区域的像素信息清除，JavaScript代码如下：

```js
// 先绘制图片
var img = new Image();
img.onload = function () {
    context.drawImage(img, 0, 0, 250, 167);
    // 中间开个方形的洞
    context.clearRect(50, 50, 100, 66);
};
img.src = './1.jpg'
```



# 矩形

和矩形相关的方法canvas提供了四种：

## strokeRect(x, y, w, h)

以（x, y）为矩形左上角坐标点，w为宽度，h为高度，绘制矩形并描边。

## fillRect(x, y, w, h)

以（x, y）为矩形左上角坐标点，w为宽度，h为高度，绘制矩形并填充。

## rect(x, y, w, h)

绘制一个矩形路径（只绘制路径，并不做填充或描边），以（x, y）作为矩形左上角坐标，w为宽度，h为高度。



# 圆

## arc

```
context.arc(cx, cy, r, startAngle, endAngle, counterClockwise);
```


以(cx, cy)为圆心，r为半径，startAngle为起始角度，endAngle为终止角度画圆弧，counterClockwise用于规定画圆弧的方向，true为逆时针，false为顺时针，默认为false。

> 1、0度方向是圆心指向x轴方向。
>
> 2、起始角度和终止角度单位都是弧度，画半圆时为Math.PI * 1。



```js
var context = document.getElementById("canvas").getContext("2d");
context.strokeStyle = "black";
context.moveTo(context.canvas.width / 2, context.canvas.height / 2);
context.arc(context.canvas.width / 2, context.canvas.height / 2, 100, 0, Math.PI * 3 / 2, false);
context.stroke();
```



## arcTo

```
context.arcTo(double pointX1, double pointY1, double pointX2, double pointY2, double radius)
```

首先从当前位置向(pointX1, pointY1)做条辅助线l1，再从(pointX1, pointY1)向(pointX2, pointY2)做条辅助线l2，然后以radius为半径，画一条与l1和l2都相切的曲线。这种方式做曲线需要注意的是，曲线终点坐标有时会变得非常难算，而且曲线的起点和当前路径的起点也不一定重合，在曲线起点和当前路径起点不重合时，canvas会先从路径起点向曲线起点做一条直线，然后再画曲线。



例子： 画一个与直线1[(100, 100), (300, 100)]，直线2[(300, 100),  (300, 300)] 都相切， 且半径为150的圆弧。

```
var context = document.getElementById("canvas").getContext("2d");
context.strokeStyle = "black";
context.lineWidth = 4;
context.moveTo(100, 100);
context.arcTo(300, 100, 300, 300, 150);
context.stroke();
```



# 曲线

```
context.quadraticCurveTo(cx, cy, x, y);
context.bezierCurveTo(cx1, cy1, cx2, cy2, x, y);
```

canvas中绘制二次贝塞尔曲线方法quadraticCurveTo的四个参数，即控制点的坐标(cx, cy)，以及终点坐标(x, y)；三次贝塞尔曲线方法bezierCurveTo的六个参数，即两个控制点的坐标（cx1, cy1）和(cx2, cy2)，以及终点坐标(x, y)。

```js
var context = document.getElementById("canvas").getContext("2d");
context.beginPath();
context.moveTo(10, 50);
context.quadraticCurveTo(30, 100, 100, 50);
context.bezierCurveTo(170, 0, 170, 100, 250, 50)
context.stroke();
```



# 变换

## translate

```js
// 平移 X 、 Y
oGc.translate(100,100);
```

只作用下面的语句，对上面的语句不起作用。



## rotate

```js
oGc.rotate(45/180*Math.PI);

oGc.translate(100,100);//平移下面语句画的图形

oGc.rotate(45/180*Math.PI);//旋转下面语句画的图形

oGc.fillRect(0,0,100,100);

旋转基点是画布左上角。
```



> 注意：
>
> （1）语句的作用域是语句下面。
>
> （2）上面两个语句的顺序不一样，效果也不一样，一个是先平移后旋转，另一个是先旋转后平移。
>
> （3）可以看作是先执行下面的语句，然后执行现行上面的语句。
>
> （4）相同的地方是都是以画布的左上角为基点旋转的。



例子：

```js
// 先将x轴以画布坐标原点旋转45度，得到新的'x'轴， 然后延这个'x'轴平移100
context.save();//先旋转，然后平移。
    context.translate(100,0);
    context.rotate(45/180*Math.PI);
    context.fillRect(0,0,100,100);
context.restore();

// 延x轴平移100， 然后旋转x轴45度
context.save();//先平移，然后旋转。
    context.fillStyle = "red";
    context.rotate(45/180*Math.PI);
    context.translate(100,0);
    context.fillRect(0,0,100,100);
context.restore();
```



# drawImage

```js
//插入图片，第一个参数是图片对象，第二、三个参数是图片的左上角，第三、四个是图片的宽和高。

var oImg = new Image();//效果和document.createElement('img')一样可以插入文档

oImg.src = "1.jpg";

oImg.onload=function(){

oGc.drawImage(oImg,10,10,100,100);

}
```



# 设置背景

```
oGc.createPattern(oImg,'no-repeat')
```

第二个参数：repeat、 repeat-x、 repeat-y、 no-repeat
注意：这里的背景图片方不会缩放，所以设置的宽度和高度都是裁剪，而不是缩放。

```js
var oImg = new Image();
oImg.src = "1.jpg";
oImg.style.width="100px";//在这里此语句失效
oImg.onload=function(){
    var bg = oGc.createPattern(oImg,'no-repeat');//创建填充样式
    oGc.fillStyle= bg;
    oGc.fillRect(10,10,200,200);
}
```



# 渐变

## 线性渐变

```js
var bg = oGc.createLinearGradient(0,0,0,100);
// 第一、二个参数是起点坐标，第三、四的参数是重点的坐标。起点指向重点的方向为渐变的方向。

bg.addColorStop(0,'red');//渐变点0的颜色
bg.addColorStop(0.5,'green');//渐变点0.5的颜色，可以有任意个渐变点
bg.addColorStop(1,'blue');
oGc.fillStyle = bg;
oGc.fillRect(0,0,100,100);
```



## 放射性渐变

```js
// x1、yi、 r1、 x2、 y2 、 r2
// x1、 y1 :第0个渐变点的中心
// r1 :渐变点延径向的距离
var bg = oGc.createRadialGradient(100,100,50,100,100,100);
bg.addColorStop(0,'red');
bg.addColorStop(1,'green');
oGc.fillStyle=bg;
oGc.fillRect(0,0,200,200);
```



例子：

```js
var oC13 = document.getElementById("c13");
var oGc13 = oC13.getContext('2d');

var bg1 = oGc13.createLinearGradient(0,0,0,100);
bg1.addColorStop(0,'red');
bg1.addColorStop(1,'green');
oGc13.fillStyle = bg1;
oGc13.fillRect(0,0,50,200);

var bg2 = oGc13.createRadialGradient(100,100,50,200,100,50);
bg2.addColorStop(0,"red");
bg2.addColorStop(1,"blue");
oGc13.fillStyle = bg2;
oGc13.fillRect(50,50,400,400);
```





#  文字

```
oGc.strokeText('H',0,0);
oGc.fillText('H',60,0);
oGc.font="60px inpact";
oGc.textAlign="center";
oGc.textBaseline = "top";
oGc.measureText('H').width
//没有height，height通过font设置
```

例子：

```js
oGc.font="60px inpact";
//字体大小
oGc.textAlign="center";
//左右居中方式：left（默认）、 right、 center
oGc.textBaseline = "top";
//上下基准线：bottom（默认）、 middle、 top
oGc.strokeText('H',0,0);
//文字、 x 、y。边框字体。
oGc.fillText('H',60,0);
```



例子2:  文字居中显示

```js
oGc.font="60px inpact";
oGc.textBaseline = "top";
var w = oGc.measureText('H').width; // 测量出文字的宽度
oGc.fillText('H',(400-w)/2,(400-60)/2);
```

  

# 画布区域的数据

区域都是以一个一个像素组成的。

## 获取某个区域数据（相当于复制）

```js
//获取某个区域的数据对象
var o = oGc.getImageData(0,0,100,100);

// 三个属性：width、 height、 data
alert(o.width);//一行像素的个数100
alert(o.height);//一列像素的个数100
alert(o.data.length);//所有数据的长度40000 = 4 * 100 * 100, 一万个像素点， 每个像素点由四个数值描述。
alert(o.data[0]);//
alert(o.data[1]);//
alert(o.data[2]);//
alert(o.data[3]);//
o.data----->[0,1,2,3,...]每四个组成一个像素的Rgba数据
```



## 设置某个区域数据（相当于粘贴）

```js
oGc.putImageData(o,200,0);
// o----像素数据对象
// 后两个-------区域左上角坐标
```



## 创建一个区域矩阵数据

```js
var a = oGc.createImageData(100,100);
//创建100*100的区域矩阵,初始时透明的黑色
//alert(a.width);
//alert(a.height);
//alert(a.data.length);

for(var i=0;i< a.width* a.height;i++){
    //给区域矩阵设置数据
    a.data[4*i]=255;
    a.data[4*i+1]=0;
    a.data[4*i+2]=0;
    a.data[4*i+3]=255;
}

oGc.putImageData(a,0,0);//将矩阵的数据粘贴到画布指定区域
```





# 合成

## globalAlpha

```js
oGc.globalAlpha = 0.5;
```

作用于下面的语句。图形透明度。 



## globalCompositeOperation

```js
oGc.globalCompositeOperation
/** 
可取的值：
source-over
destination ：交叉部分显示先画的，还是后画的
source-atop
destination-astop：切割，只留下交叉部分和
source-in
destination-in
source-out
destination-out
lighter
copy
xor
source(源)：新的图形，后画的
destination（目标）：已经绘制过的图形，先画的
**/
```



# 将画布导出png图片



```js
var oImgD = oC.toDataURL();
```

canvas对象的方法。





# 判断坐标是否在某个图形内

```js
 oGc.isPointInPath(X,Y)
```

**如果坐标（X,Y）是在最后定义的路径所画出的图形内则返回true， 否则false**

> 注意：
>
> （1）只作用于最后一次画的图形。
>
> （2）画图只能是先定义路径，用fillRect()画出来的图形不起作用。
>
> （3）原理是根据路径来判断一个点是否在图形内。即最后一次oGc.beginPath()定义的路径。

用法：点击时判断是否点击在图形上

例子：

```js
oGc.beginPath();
oGc.moveTo(0,0);
oGc.lineTo(100,0);
oGc.lineTo(100,100);
oGc.lineTo(0,100);
oGc.closePath();
oGc.stroke();
//oGc.fillRect(0,0,100,100);//不起作用

oC.onmousedown = function(ev){
    var ev = ev||window.event;
    var X = ev.clientX - oC.offsetLeft;
    var Y = ev.clientY - oC.offsetTop;

    if(oGc.isPointInPath(X,Y)){
    	alert(123);
    }
}
```





# 库

jCanvasScript.js

# 怎么解决只能点击最后一次画的图形的问题？？？

重画所有的图形。
# 1、浏览器前缀

## 1.1、定义

为了兼容老版本的写法。浏览器前缀是对新属性的一个提前支持。

## 1.2、常用浏览器的前缀

```
        前缀		  渲染引擎		    浏览器
        -khtml-		KHTML			konqueror
        -ms-		Trident			IE
        -moz-		mozilla			firefox
        -o-		    Presto			opera
        -webkit-	webkit			chrome、safari
```

## 1.3、带有前缀的属性的js写法

去掉横杆，变驼峰，首字母是否大写视浏览器而定。
不过最好是用csstext,或是添加className。

下面是通过js设置样式时， 自动添加前缀的方式。

```js
const styleTest = document.createElement('div').style

const render = {
  webkit: 'webkitTransform',
  ms: 'msTransform',
  Moz: 'MozTransform',
  O: 'OTransform',
  standard: 'transform'
}

const getPrefix = (() => {
  for (let key in render) {
    if (styleTest[render[key]] !== undefined) {
      return key
    }
  }
})()

export default function stylePrefix (style) {
  if (getPrefix === 'standard') {
    return style
  }
  return getPrefix + style.charAt(0).toUpperCase() + style.substr(1)
}
```



# 2、新增选择器

## 2.1、属性选择器

### `E[atrr]`

p[title] 具有title属性的p元素。



### `E[attr="val"]`

p[title='word'] 属性title的值为'word'的p元素。



### `E[attr~="val"]`

p[class~="world"] world是class**属性值列表**的一部分的p元素
注意：
（1）这里指的是含有world类的p元素，p可能含有其他的类。
（2）列表。指的是属性值含有指定的单词，前后有空格。列表是通过空格切割出来的。
比如： p[title~='world']、 p[title~='hello world']



### `E[attr^="val"]`

p[title^='he'] title的值是以'he'开头的p元素。



### `E[attr$="val"]`

p[title$='he'] title的值是以'he'结尾的p元素。



### `E[attr*="val"]`

p[title*='he'] title的值包含'he'的p元素。
注意：

（1）这里不是列表。只要含有即可。
（2）与E[attr~="val"]的区别



### `E[attr|="val"]`

p[title|='he'] title的值是以he或he-开头的p元素。



## 2.2、结构伪类选择器

> 符号 “：”可以理解为交集的意思

### `E:nth-child(n)`

E父元素中的第n个子元素并且这个元素还是E元素
满足两个条件：
1、选择的是E父元素的第n个子元素
2、这个元素是E元素



### `E:nth-child(odd)`

E父元素的所有第奇数个子元素并且这个元素还是E元素
满足两个条件：
1、选择的是E父元素的奇数个子元素
2、这个元素是E元素



### `E:nth-child(even)`

E父元素的所有第偶数个子元素并且这个元素还是E元素
满足两个条件：
1、选择的是E父元素的偶数个子元素
2、这个元素是E元素



### `E:nth-child(2n)`

E父元素的所有第2n个子元素并且这个元素还是E元素
可以是任何表达式，**n从1开始**。
满足两个条件：
1、选择的是E父元素的第2n个子元素
2、这个元素是E元素



### `E:nth-last-child()`

**从后往前数，用法与nth-child()一样。**



### `E:nth-of-type(n)`

p:nth-of-type(2)
找到p的父元素下的第二个p元素。
注意：
1、与p:nth-child(2)的区别
前者：父元素的第二个p元素
后者：父元素的第二个元素，第二个元素不一定是p元素



### `E:nth-last-of-type(n)`

从后往前数，用法与E:nth-of-type(n)一样



## 2.3、伪类

### `E:target`

锚a指向的目标且是E元素。

```html
target: < p id="top">目标</p>
锚：<a href="#top">锚</a>

<!DOCTYPE html>
<html>
<head>
<style>
#news1:target
{
background-color: red;
}

#news2:target
{
background-color: green;
}
</style>
</head>
<body>
<p><a href="#news1">链接1</a></p>
<p><a href="#news2">链接2</a></p>

<p>请点击上面的链接，:target 选择器会突出显示当前活动的 HTML 锚。</p>
<p id="news1"><b>点击链接1我会变红色</b></p>
<p id="news2"><b>点击链接2我会变绿色</b></p>
<p><b>注释：</b> Internet Explorer 8 以及更早的版本不支持 :target 选择器。</p>

</body>
</html>
        
```

p:target{}  p元素是一个锚点。



### `E:disabled` 

不可点击的表单控件 选择属性disabled为true的表单控件。 

 input:disabled 



### `E:enabled` 

可点击的表单控件 

 input:enabled 



### `E:checked` 

选中的checkbox或radio 



### `E:first-line` 

E元素的第一行

 p:first-line{} //p的第一行 



### `E:first-letter` 

E元素中的第一个字符



### `E::selection` 

E元素中的文字被选中时

 p::selection{color:green;} 段落中被选的文字颜色变为绿色



###  `E::before` 

生成内容在E前面

 例子：在段落前面添加内容'hello' 

```css
p::before{ 
    content:"hello";//要添加的内容
    background:green;
    display:block;//默认是内联 
} 
```



### `E::after` 

生成内容在E前面 用法与before一样 



###  `E~F` 

E元素毗邻的F兄弟元素,包括E后面所有的F元素 。



### `E+F` 

E的下一个F元素，一个E只能有一个F元素 

注意：他们的共同点都是只能选择后面的元素，不能选择前面的元素



### `E:not(str)` 

除了......之外的E元素

```
 div:not(p[width]) //表示除了有width属性的所有p元素
 div:not(.hello) //表示除了有hello类的所有p元素
```



# 3、rgba

**三原色取值：0~255**
**透明度：0~1**
css2中所有的颜色都可以用rgba表示。
第一个效果，背景透明文字不透明。
注意：边框透明时会把背景露出来
`rgba(0,0,0,0)` 透明的黑色。



# 4、text-shadow

作用：**文字阴影**
用法：`text-shadow:5px 5px 10px red ;`
横向偏移：
纵向偏移：
模糊距离：0-不模糊 值越大越模糊，直到看不见
阴影颜色：
阴影叠加：
`text-shadow:5px 5px 10px red,0px 0px 10px green ;`
不同的阴影用逗号隔开。
渲染顺序：先渲染后面的，再渲染前面的。



# 5、text-stroke

作用： **文字描边**

`-webkit-text-stroke:1px red;`
描边宽度 颜色
适合大字体，字体太小看不出效果。
只有-webkit-兼容。



# 6、direction

作用：**定义文字排列方式**。
用法:`direction:rtl;`
rtl:从右到左
ltr：从左到右
单独使用只是将文字右对齐
需要配合`unicode-bidi:bidi-override;`
此时会将文字的书写顺序变成从右到左。

```
direction: rtl;
unicode-bidi: bidi-override;
```



# 7、@font-face

作用：**使用自己的字体**。
用法：@font-face{}。
自定义字体软件：AsiaFont Studio。
转换字体格式生成兼容代码：www.fontsquirrel.com。



# 8、flex



# 9、white-space

作用：**文字超出范围用省略号表示超出的部分**。

```
white-space:nowrap;		//不换行
overflow:hidden;		//超出的范围隐藏
text-overflow:ellipsis;	//ellipsis有省略号 clip没有省略号
```

一般配合上面的命令使用。
如果要实现多行，可以在要换行的地方加br  。



# 10、box-shadow

作用： **给盒模型添加阴影**。

`box-shadow: 5px 5px 2px 5px red inset;`
横向偏移
纵向偏移
模糊半径
扩展模糊半径:先往外或往内扩展若干像素后再模糊。
颜色
内投影（不写默认外投影）
**投影不会影响盒子的尺寸，但会覆盖在旁边的元素之上。**



# 11、box-reflect

作用：生成盒子的镜像。
用法：选择对称轴、间距。
特点：只兼容webkit。
`box-reflect:right 10px ;`
倒影方向
与倒影之间的距离 [渐变（可选）]????



# 12、resize

作用： **设置缩放**。

```
resize:both|horizontal|vertical;
```

both:水平垂直都可以缩放。
horizontal：只有水平方向可以缩放。
vertical：只有垂直方向可以缩放。

配合使用才有效果：overflow:auto;
兼容：ie不兼容。



# 13、box-sizing

作用： **设置盒模型**。

```
box-sizing：content-box|border-box;
```

> content-box:标准盒模型
> border-box:怪异盒模型（传统Ie盒模型）



在css中盒模型分为两种，**第一种是w3c标准模型，另一种是Ie传统模型。**

## w3c标准盒模型

外盒尺寸计算：
元素空间高度=内容高度+padding+border+margin。
元素空间宽度=内容宽度+padding+border+margin。



内盒尺寸计算：
元素空间高度=内容高度+padding+border。
元素空间宽度=内容宽度+padding+border。

## 传统IE盒模型

外盒尺寸计算：
元素空间高度=内容高度+margin。
元素空间宽度=内容宽度+margin。



内盒尺寸计算：
元素空间高度=内容高度。

元素空间宽度=内容宽度。



## 两种模型的区别

（1）**标准盒模型设置的width是指的内容宽度，不包含padding、border。IE盒模型设置的width包含padding、border**。
（2）标准盒模型设置padding、border时会改变盒子占的空间大小。 Ie和模型设置padding、border时不会该变盒子站的空间大小， 但会改变内容区域的大小。



# 14、分栏布局

column:复合样式。
column-width；栏目宽度 ，单独设置时列宽固定，列数不固定。
colimn-count：栏目数量 ，设置固定列数。
column-gap：栏目间隔距离 ，列与列之间的距离。
column-rule：栏目间隔线（写法与边框写法一样）。
column-span：none-不跨列 all-跨所有列。
作用：在设置了分栏布局的元素内的某个子元素横跨所有列。

[示例](https://www.cnblogs.com/dtdxrk/p/4530157.html)

# 15、响应式布局

定义：
建立不同尺寸下的样式表，根据媒体查询不同的屏幕尺寸使用不同的样式表。 先写最需要满足的设备的样式，再同果媒体查询来重新写其它设备的样式。 比如bootstrap就是移动设备优先。

用法：
引入样式表时的两种方式
第一种：通过link直接在html文档引入
通过添加media属性来分别。

语法：

media = " screen and (min-width:800px)"//表示显示屏最小800px
media = " screen and (main-width:600px) and (max-width 800px)"//屏幕大小在600到800之间
media = "all and corientation:portrait"//竖屏
media = "all and corientation:landscape"//横屏

第二种：不通过link,直接在样式表中定义样式
@media screen and (min-width:800px){ }

或者：
@import url("index.css") screen and (min-width:800px){ }

例子：

```css
@media screen and (max-width:400px){
    #box{	//里面写css代码
        padding:20px;
        -webkit-columns:40px 1;
    }
}
```



# 16、border-radius

作用： 设置圆角。

```css
border-radius: 5px 15px 20px 25px /1px;
```

前一个数值表示四个圆角的x轴，后一个数值表示四个圆角的y轴 顺序依次是左上角为第一个，顺时针。

```css
border-radius: 5px/1px;
```

四个圆角的x轴数值都是5px,  y轴都是1px。

```css
border-radius: 5px;
```

四个圆角的x轴和y轴数值都是5px。

> 注意：
> 1、取值可以是px或%，%是x轴对应相对于width的尺寸
> 2、圆角不会影响原有的内容的显示排列。



# 17、border-image

作用： 给边框设置背景边框背景。

`border-image`: 	复合属性，是border新加的一个属性。



```
border-image-source；url()； 
```

引入图片。



```
border-image-slice:10 10 10 10 ;
```

切割的图片尺寸(这里没有单位px) 该属性指定从上，右，下，左方位来分隔图像， 将图像分成4个角，4条边和中间区域共9份， 中间区域始终是透明的（即没图像填充）， 除非加上关键字 fill。



`border-image-width`:  边框宽度



`border-image-repeat`:
边框是平铺，round平铺、repeat重复、stretch（默认）拉伸



例子：

```
border:20px solid red;//必须写，如果下面的语句失效，此时边框填充颜色
border-image:url(Hydrangeas.jpg) 20 20 20 20 repeat;
```

因为border-image是border的一个属性，所以先有border再有border-image 这就是border必须写的原因



# 18、border-colors



# 19、线性渐变

## linear-gradient

linear-gradient(角度方向,颜色1 渐变点1,颜色2 渐变点2......)
角度：0reg 从下往上渐变
90reg从左往右
180reg从上往下
270reg从右往左

颜色：可以是rgba



> 渐变点:前面的颜色渐变到后一种颜色的开始位置



> 注意：
>
> 1、至少得两种颜色才能形成渐变。渐变的区域是从渐变点1到渐变点2 之间的区域。
>
> 2、颜色可以用#、rgb、rgba表示，渐变点可以用px、%表示。
>
> 3、一般配合background-image使用。



```
background-image:linear-gradient(0,red 50px, blue 100px);
```



此命令表示，从下往上，
0~50px 红色。
50px开始渐变。
50px~100px 红色渐变成蓝色。
100px 蓝色。
100px往上 蓝色。



## repeating-linear-gradient

重复渐变。
用法与上面一样，只是会重复渐变。

此命令表示，从下往上，
0~50px 红色
50px开始渐变
50px~100px 红色渐变成蓝色
100px 蓝色
100px往上 蓝色
repeating-linear-gradient:重复渐变
用法与上面一样，只是会重复渐变


斑马线效果：

```
background-image:repeating-linear-gradient(0,green 0px,green 50px,white 50px,white 100px);
```

原理：渐变颜色是同一种颜色。
兼容问题：IE678不兼容。

使用ie自带的filter：。。。。。。。。。。。



# 20、镜像渐变

## radial-gradient

```
background-image: radial-gradient(circle 50px at 100px 100px, #f00 10px, #0f0 40px);
```

**circle**:
形状为圆形，后面的参数50px表示渐变的半径 形状也可以是ellipse，椭圆，此时有两个参数，长半轴和短半轴
**at**:
后面的两个参数是圆心坐标，第一个是横坐标，第二个是纵坐标 可以是left right top bottom
**#f00**：
渐变颜色， 后面的参数是指延半径方向开始渐变的位置。



## repeating-radial-gradient

重复渐变。

```
background-image: repeating-radial-gradient(circle 100px at 0 30px, #f00 0, #0f0 20px);
```





# 21、多背景

css3新加的功能，多背景。

## 简写方式

```
background:
url(test1.jpg) no-repeat scroll 10px 20px/50px 60px content-box padding-box, url(test1.jpg) no-repeat scroll 10px 20px/70px 90px content-box padding-box, url(test1.jpg) no-repeat scroll 10px 20px/110px 130px content-box padding-box #aaa;
```

书写顺序URL、repeat 、attachment、 position/size、 origin、 clip 、color
拆分;

```
background-image:url(test1.jpg),url(test2.jpg),url(test3.jpg);
background-repeat:no-repeat,no-repeat,no-repeat;
background-attachment:scroll,scroll,scroll;
background-position:10px 20px,10px 20px,10px 20px;
background-size:50px 60px,70px 90px,110px 130px;
background-origin:content-box,content-box,content-box;
background-clip:padding-box,padding-box,padding-box;
background-color:#aaa;
```

**注意：先写的在上面显示，后写的在下面**



## background-size

作用：设置背景尺寸。
-<u>auto</u>:默认值，不改变图片的尺寸。
-<u>长度值</u>：成对出现或一个值出现等比缩放，指定图片的width、height，只有一个值时指定width。
-<u>百分比</u>；用法与指定数值一样，
-<u>cover</u>：铺满。
-<u>contain</u>：缩放到最大边刚好放下。



## background-origin

作用：设置背景显示的起始位置（css2是默认从padding开始显示）。

background-origin:
-border-box:从border开始显示。
-padding-box：从padding开始显示。
-content-box：从内容开始显示。



## background-clip

作用：裁剪背景图片。

background-clip:
-border-box:裁剪掉border以外的部分。
-padding-box:裁剪掉padding以外的部分。
-content-box:裁剪掉内容以外的部分。
-no-clip:不裁剪。



# 22、-webkit-mask



# 23、过渡

`transition`：	复合属性。

`transition-property`:	要运动的属性样式。
-**all** 所有的属性
-**[attr]** 指定的样式
-**none** 无



`transition-duration`: 	过渡的时间

`transition-delay`:	延迟时间

`transition-timing-function`:	运动形式
-ease（默认） 逐渐变慢
-linear 匀速
-ease-in 加速
-ease-out 减速
-ease-int-out 先加速后减速
-cubic-bezier 贝塞尔曲线



作用：**实现运动的过渡，注重过程,从一个状态到另一个状态**。

用法：

```
transition:1s 1s width ease,1s 1s height ease;
```

参数依次代表的意思是： 运动时间、延迟时间、属性、运动形式。



> 注意：
> （1）不同属性运动过渡用逗号隔开。
> （2）只需要将这个命令放入css语句中即可
> （3）transition的作用是让运动过渡，所以不管是通过什么样的方式 运动均能实现过渡的效果。



## 过渡完成事件

**transitionend:每个样式过渡完成一次就触发一次,所以可能会触发多次。**
兼容问题：

```
obj.addEventListen('transitionEnd',fn,false);
obj.addEventListen('webkitTransitionEnd',fn,false); // webkit内核：
```

例子：

```
var oDiv = document.getElementById('box');

oDiv.addEventListener('webkitTransitionEnd',fn,false);

function fn(){
    ·alert(1);
}
```

怎么解决每次过渡完成一个样式就触发一次transitionend事件？？

```
var oDiv = document.getElementById('box');
oDiv.addEventListener('webkitTransitionEnd',fn,false);

function fn(){
    var w= getComputedStyle(this).width
    if(w=='200px'){//只需判断 自己想要监听的属性是否达到最终结果即可
        alert(1);
    }
}
```



# 24、动画

## 动画的特点：

1、动画是**异步操作**。
2、**在添加一次动画之后，再添加动画是没有效果的，必须用animation：none;清空，再添加**。
3、所谓的动画就是从0 逐渐过渡到100。元素会瞬间变成0的状态，然后慢慢过渡到100。如果0和100不是和 元素之星动画之前的状态一样会显得很突兀。因此，如果不定义0和100，就不会这样了。



## **关键帧：keyFrames**

指明多个状态，而之间的过程由计算机自动计算。 **元素经由设定多个状态到达指定的状态，两个相邻的状态由过渡完成。**



关键帧的时间单位：
数字表示：0% 25% 100% 等。
字符表示：from(0%) to(100%)。



## 定义动画

```
@keyFrames 动画名称｛
	动画状态
｝
```

例子：

```
@keyFrames move{
    0%{transform:translate(0,0);}
    25%{transform:translate(400px,0);}
    50%{transform:translate(400px,400px);}
    75%{transform:translate(0,400px);}
    100%{transform:translate(0,0);}
}
```



## 使用动画

```
 animation：2s move；
```

第一个参数是：运动时间，第二个参数是：动画名称。



**必要属性**：

① **animation-name**:动画名称；

② **animation-duration**:时间；



**可选属性**：

① **animation-timing-function**:动画形式；

-ease（默认） 逐渐变慢

-linear 匀速

-ease-in 加速

-ease-out 减速

-ease-int-out 先加速后减速

-cubic-bezier 贝塞尔曲线

② **animation-delay**

③ **animation-iteration-count**:重复次数；

infinite无限次

④ **animation-direction** 播放前重置

alternate 接着上一次

normal 从0%开始

⑤ **animation-play-state**:播放状态

running

paused





使用动画的两个步骤：

1、定义动画

2、调用动画

（1）通过css伪类。

（2）通过js。

a、定义一个class类，里面放好animation的各种属性， 给需要运动的对象添加类。

b、直接操作animation的各种属性（比较麻烦），或使用cssText属性。

c、通过事件：animationend事件 动画播放完毕触发，只触发一次。



# 25、transform2D

**transform**：2D变换， 参数是函数。

## rotate()

```css
transform: rotate(90deg);
```

旋转。 参数的单位是角度。 90deg顺时针旋转90度， -90deg逆时针旋转90度。

> 注意：每次旋转都是从起始位置开始的不会叠加。



## scale()

```
transform: scale(0.6,0.5);
```

缩放。 取值为小数和整数。第一个参数是横向 第二个参数是纵向（只有一个参数是x轴）。



## scaleX()

横向缩放， 参数只有一个。



## scaleY()

纵向缩放， 参数只有一个。



## skew()

倾斜。角度为正数时，下边界往右拉。 角度为负数时，下边界往左边拉。 右下角的度数是90-倾斜度数。
skew(10deg,10deg)第一个参数是x轴 第二个参数是y轴（只有一个参数是x轴）。



## skewX()

延X轴倾斜。



## skewY()

延Y轴倾斜。



## translate()

平移。
translate(100px,100px); 第一个参数是x轴 第二个参数是y轴（一个参数是x轴）。



## translateX()

延X轴平移。



## translateY()

延X轴平移。



## transform-orgin

指定对象的转换基点。
用法：

```
transform-orgin：10px 10px;
```


第一个参数是横轴坐标，第二个参数是纵轴坐标。在转换时 基准点是不会运动的。

> 注意：
> transform 转换产生的移动平移不会脱离文档流，也不会占用其他元素的位置， 只会覆盖其他的元素。



## 矩阵函数

标准下（包括Ie9+）。

```
transfrom: matrix(a,b,c,d,e,f);
```

初始情况下`matrix(1,0,0,1,0,0)`。

**通过矩阵实现缩放**：
x轴缩放： a=x*a    c=x*c   e=x*e
y轴缩放： b=x*b    d=x*d   f=x*f



**位移**
x轴位移：e=e+x
y轴位移：f=f+x



**倾斜**
x：c=Math.tan(xdeg/180*Math.PI)
y：b=Math.tan(xdeg/180*Math.PI)



**旋转**（没试过）
a = Math.cos(deg/180*Math.PI)
b = Math.sin(deg/180*Math.PI)
c = -Math.sin(deg/180*Math.PI)
d = Math.cos(deg/180*Math.PI)



> 要实现复杂的效果通过多次使用matrix函数实现。
> transform:matrix(1,0,0,2,0,0) matrix(1,0,0,1,500,0);



两个问题：
1、IE678的兼容性怎么解决？
使用本身自带的filter
2、Ie下的旋转基点矫正？
在标准下旋转基点是不会运动的， 在IE下基点会运动。
解决：
第一步：用一个div包住旋转的对象， 对象相对于div定位；
第二步：根据调整定位的left top 来调整基点的位置。
left=（div的offsetWidth-对象的offsetWidth）/2
top =（div的offsetHeight-对象的offsetHeight）/2  



# 26、transform3D

[示例](https://www.cnblogs.com/gg-qq/p/10255949.html)

## 空间坐标系

向上为-Y，向下为+Y，向左为-X，向右为+X，向前（屏幕到眼睛的方向）为+Z，向后为-Z。



## **`perspective(n)`**

perspective的中文意思是：透视，视角。没有透视定义，不成3D。

CSS3中3D transform的透视点是在浏览器的前方！  需要设置该元素或该元素父辈元素的perspective大小。

perspective(n)定义视点离屏幕的距离。

> 使用3d转换必须使用这个属性。



## **3d平移**

`translate3d(x,y,z)`，`translateX(x)`，`translateY(y)`，`translateZ(z)`定义3D平移，x,y,z分别为移动的位移。



> 定义translateZ( )，必须要先定义perspective值，否则没有效果。translateZ( )的功能就是让元素在自己的眼前或近或远。设置的translateZ( )值越小，则子元素越小（因为元素远去，我们眼睛看到的就会变小）,translateZ( )值越大，该元素也会越来越大。translateZ( )值接近于perspective值时，该元素的大小就会撑满整个屏幕。





## 3d旋转

**`rotate3d(x,y,z,angle)`，`rotateX(angle)`，`rotateY(angle)`，`rotateZ(angle)`定义3D旋转。**



`rotateX(angle)`

定义沿着X轴的3D旋转。rotateX(angle)表示以X轴为旋转轴旋转。rotateX(angle)函数功能等同于rotate3d(1,0,0,angle)。



`rotateY(angle)`

定义沿着Y轴的3D 旋转。rotateY(angle)表示以Y轴为旋转轴旋转。rotateY(angle)函数功能等同于rotate3d(0,1,0,angle)。



`rotateZ(angle)`

定义沿着Z轴的3D旋转。rotateZ(angle)表示以Z轴为旋转轴旋转。rotateZ(angle)函数功能等同于rotate3d(0,0,1,angle)。



## 3d缩放

**scale3d(x,y,z)，scaleX(x)，scaleY(y)，scaleZ(z)定义3D缩放转换**。

scale3d(x,y,z)通过使用3D缩放函数，可以让元素在Z轴上按比例缩放。默认值为1，当值大于1时，元素放大，反之小于1大于0.01时，元素缩小。当scale3d()中x和y值同时为1，即scale3d(1,1,z)，其效果等同于scaleZ(z)。

> scaleZ( )和scale3d( )函数单独使用时没有任何效果，需要配合其他的变形函数一起使用才会有效果。



# 27、其他

1、写样式一般都是写一点测一点，有层次的。从布局到样式。

2、非法嵌套会导致定位失效，比如在p内的ul不会随着p的定位而移动。 标签要合理嵌套。

3、用css写三角形。

```
width:0;
height:0;
overflow:hidden;
border-left:100px solid transparent;
border-right:100px solid transparent;
border-bottom:100px solid #ca0309;
```

4、注意选择器嵌套过多的问题。

有时候因为很html结构前套过多，导致选择器嵌套过多，一般不要超过3个。 应该想办法避免。

5、选择器并用。

选择器.x1.x2匹配哪些同时有.x1、 .x2类的元素。

6、遮住屏幕

```
position:fixed;
top:0;
right:0;
bottom:0;
left:0;
```

7、每一个有宽高的元素加了overflow:auto;都可看做是一个视口。

8、button激活时chrome里有边框。

```
button:focus{
	outline:0;
}
```

9、两个表单元素input换行被解析。

10、两个定位兄弟元素，如果想让其中一个兄弟元素内部的元素在另一个 兄弟元素的上面，Ie7必须在父级元素上加才有效果。
- https://blog.csdn.net/three_bird/article/details/51312578
- https://www.jianshu.com/p/373055bff286
# 坐标轴
1. 左手坐标系
2. 右手手坐标系

2D变形的坐标轴是平面的，只存在x轴和y轴，而3D变形的坐标轴则是x、y、z三条轴组成的立体空间，x轴正向、y轴正向、z轴正向分别朝向右、下和屏幕外。

# 透视
透视是transform变形3D中最重要的内容。如果不设置透视，元素的3D变形效果将无法实现。

### 观察者
观察者是浏览器模拟出来的用来观察被透视元素的一个没有尺寸的点，观察者发出视线，类似于一个点光源发出光线。

### 被透视元素
被透视元素也就是被观察者观察的元素，根据属性设置的不同，它有可能是变形元素本身，也可能是它的父级或祖先其元素，主要进行`perspective`、`perspective-origin`等属性的设置。

### 变形元素
顾名思义，就是进行transform3D变形的元素，主要进行transform、transform-origin、backface-visibility等属性的设置。

# 透视属性
透视距离`perspective`是指观察者沿着平行于z轴的视线与屏幕之间的距离，简称视距。
```css
perspective: 100px;
```
1. 不可为0和负数，因为观察者与屏幕距离为0时或者在屏幕背面时是不可以观察到被透视元素的正面的。
2. 不可取百分比，因为百分比需要相对的元素，但z轴并没有可相对的元素尺寸。
3. 一般地，物体离得越远，显得越小。反映在perspective属性上，就是该属性值越大，元素的3d效果越不明显。
4. 设置透视perspective属性的元素就是被透视元素。一般地，该属性只能设置在变形元素的父级或祖先级。因为浏览器会为其子级的变形产生透视效果，但并不会为其自身产生透视效果。


# 透视原点
透视原点`perspective-origin`是指观察者的位置，一般地，观察者位于与屏幕平行的另一个平面上，观察者始终是与屏幕垂直的。
*观察者的活动区域是被观察元素的盒模型区域。*
```css
perspective-origin: center;
```

# 变形函数

### matrix3d
3d变形函数位移、旋转和缩放都是通过矩阵设置不同的参数而实现的。相比于2d矩阵martrix()的6个参数而言，3d矩阵matrix3d却有12个参数。其变形规则与2dmatrix()类似，只不过是从3*3矩阵，变成了4*4矩阵。
```css
matrix3d(a,b,c,0,d,e,f,0,g,h,i,0,j,k,l,1)
```

### translateZ()、translateX()、translateY()、、translate3d(x, y, z)
1. x和y可以是长度值，也可以是百分比，百分比是相对于其本身元素水平方向的宽度和垂直方向的高度。
2. z只能设置长度值。


### scale3d(x,y,z)
默认值为scale3d(1,1,1)，当参数为负值时，先翻转再缩放。


### rotate3d(x,y,z,Ndeg)
1. x、y、z分别用来描述围绕x、y、z轴旋转的矢量值。最终变形元素沿着由(0,0,0)和(x,y,z)这两个点构成的直线为轴，进行旋转。
2. 当N为正数时，元素进行顺时针旋转；当N为负数时，元素进行逆时针旋转。

> rotateX(Ndeg)相当于rotate3d(1,0,0,Ndeg)

> rotateY(Ndeg)相当于rotate3d(0,1,0,Ndeg)

> rotateZ(Ndeg)相当于rotate3d(0,0,1,Ndeg)


# 透视函数
> 与透视属性的区别？ 
透视属性应用在变形元素的父级或祖先级。而透视函数perspective()是transform变形函数的一个属性值，应用于变形元素本身。


# transform-origin

# transform-style
```css
transform-style: flat | preserve-3d
```
变形风格transform-style允许变形元素及其子元素在3d空间中呈现。变形风格有两个值。flat是默认值，表示2d平面；而perserve-3d表示3d空间。

# backface-visibility
定义当元素不面向屏幕时隐藏。
```css
backface-visibility: visible | hidden;
```

# 示例
<div class="box">
  <div class="div1">1</div>
  <div class="div2">2</div>
  <div class="div3">3</div>
  <div class="div4">4</div>
  <div class="div5">5</div>
  <div class="div6">6</div>
</div>
<style>
.box {
  position:relative;
  display: inline-block;
  width: 200px;
  height: 200px;
  background: #f0e0e0;
  perspective: 200px;
}
.box > div {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  line-height: 200px;
  text-align: center;
}
.div1 {
  transform: rotateY(40deg)
}
 
</style>
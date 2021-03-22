### 线性渐变

linear-gradient(角度方向,颜色1 渐变点1,颜色2 渐变点2......)
角度：0reg 从下往上渐变
90reg从左往右
180reg从上往下
270reg从右往左

颜色：可以是rgba

渐变点:前面的颜色渐变到后一种颜色的开始位置

注意：1、至少得两种颜色才能形成渐变
渐变的区域是从渐变点1到渐变点2 之间的区域。

2、颜色可以用#、rgb、rgba表示
渐变点可以用px、%表示

3、一般配合background-image使用


background-image:linear-gradient(0,red 50px, blue 100px);
此命令表示，从下往上，
0~50px 红色
50px开始渐变
50px~100px 红色渐变成蓝色
100px 蓝色
100px往上 蓝色
repeating-linear-gradient:重复渐变
用法与上面一样，只是会重复渐变


斑马线效果：
background-image:repeating-linear-gradient(0,green 0px,green 50px,white 50px,white 100px);
原理：渐变颜色是同一种颜色
兼容问题：IE678不兼容

使用ie自带的filter：。。。。。。。。。。。
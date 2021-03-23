# 文字阴影
```css
text-shadow:5px 5px 10px red ;
```
- 横向偏移：
- 纵向偏移：
- 模糊距离：0-不模糊 值越大越模糊，直到看不见
- 阴影颜色：

<div class="box">text-shadow</div>
<style>
.box {
  margin: 50px 0;
  font-size: 50px;
  text-shadow:5px 5px 10px red ;
} 
</style>



# 阴影叠加：
```css
text-shadow:10px 10px 10px red, 0px 0px 10px green ;
```
不同的阴影用逗号隔开。
> 渲染顺序：先渲染后面的，再渲染前面的。

<div class="box">text-shadow</div>
<style>
.box {
  margin: 50px 0;
  font-size: 50px;
  text-shadow:10px 10px 10px red, 0px 0px 10px green ;
} 
</style>
# 盒子的阴影
```css
box-shadow: 5px 5px 2px 5px red inset;
```
- 横向偏移
- 纵向偏移
- 模糊半径
- 扩展模糊半径:先往外或往内扩展若干像素后再模糊
- 颜色
- 内投影（不写默认外投影）

**投影不会影响盒子的尺寸，但会覆盖在旁边的元素之上。**
# 单边阴影
<div class="box top">box-shadow: inset 0px 15px 10px -15px #000;</div>
<div class="box right">box-shadow:inset -15px 0px 10px -15px #000;</div>
<div class="box bottom">box-shadow:inset 0px -15px 10px -15px #000;</div>
<div class="box left">box-shadow:inset 15px 0px 10px -15px #000;</div>
<div class="box bottom-out">box-shadow: 0 10px 10px -10px gray;</div>
<style>
.box {
  margin: 20px;
  display: inline-block;
  width: 400px;
  height: 200px;
  line-height: 200px;
  text-align: center;
  background: #e0e0e0;
}
.top {
  box-shadow: inset 0px 15px 10px -15px #000;
}
.right {
  box-shadow:inset -15px 0px 10px -15px #000;
}
.bottom {
  box-shadow:inset 0px -15px 10px -15px #000;
}
.left {
  box-shadow:inset 15px 0px 10px -15px #000;
}
.bottom-out {
  box-shadow: 0 10px 10px -10px #000;
}
</style>
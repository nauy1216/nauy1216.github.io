# 倒影（镜像）
- 作用：生成盒子的镜像
- 用法：选择对称轴、间距
- 特点：
  1. 只兼容webkit
  2. 镜像不会占用文档流

```css
box-reflect:right 10px ; /*倒影方向、 与倒影之间的距离 [渐变（可选）*/

.box1 {
  background: red;
  display: inline-block;
  -webkit-box-reflect:right 10px;
}
```

<div class="box1">box-reflect:right 10px</div>
<div class="box2">box-reflect:right 10px</div>
<style>
.box1 {
  background: red;
  display: inline-block;
  -webkit-box-reflect:right 10px;
}
.box2 {
  display: inline-block;
  background: green;
  height: 40px;
}
</style>


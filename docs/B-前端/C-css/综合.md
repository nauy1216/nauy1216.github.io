# BFC
### 什么是BFC?
- 块级格式化上下文。(block format context)

### 特点
- 一个独立的布局容器，在布局上不会影响外面的元素，也不会影响外面的元素。
- 同一个BFC内相邻的两个元素的上下margin会重叠，而不同的BFC内的两个元素的margin是不会重叠的。
- 形成了BFC的元素不会与其他浮动元素重叠。
- 在BFC元素内部的浮动元素是会被计算在内的。

### 形成BFC的场景？
- 1. 根元素或包含根元素的元素，比如html元素
- 2. 浮动元素（元素的 float 不是 none）
- 3. 绝对定位元素（元素的 position 为 absolute 或 fixed）
- 4. 行内块元素（元素的 display 为 inline-block）
- 5. 表格单元格（元素的 display为 table-cell，HTML表格单元格默认为该值）
- 6. 表格标题（元素的 display 为 table-caption，HTML表格标题默认为该值）
- 7. 匿名表格单元格元素（元素的 display为 table、table-row、 table-row-group、table-header-group、table-footer-group（分别是HTML table、row、tbody、thead、tfoot的默认属性）或 inline-table）
- 8. overflow 值不为 visible 的块元素
- 9. display 值为 flow-root 的元素
- 10. contain 值为 layout、content或 strict 的元素
- 11. 弹性元素（display为 flex 或 inline-flex元素的直接子元素）
- 12. 网格元素（display为 grid 或 inline-grid 元素的直接子元素）
- 13. 多列容器（元素的 column-count 或 column-width 不为 auto，包括 column-count 为 1）
- 14. column-span 为 all 的元素始终会创建一个新的BFC，即使该元素没有包裹在一个多列容器中（标准变更，Chrome bug）。

### 应用场景？
- margin重叠问题。`overflow: hidden;`使得div1形成了`BFC`。本来div2的margin会跑到div1的外面，现在形成`BFC`后就不会了。
```html
<style>
    .div1 {
        overflow: hidden;
        background: pink;
    }
    .div2 {
        width: 200px;
        height: 200px;
        background: #e0e0e0;
        margin: 20px;
    }
</style>
<div class="div1">
    <div class="div2"></div>
</div>
```

- 清浮动。形成了`BFC`的元素的高度是计算浮动元素的高度在内的。下面的例子中，如果没加`overflow: hidden;`div1的高度就会是0，加了就是200px。
```html
<style>
    * {
        margin: 0;
        padding: 0;
    }
    .div1 {
        overflow: hidden;
        background: pink;
    }
    .div2 {
        width: 200px;
        height: 200px;
        background: #e0e0e0;
        float: left;
    }
</style>
<div class="div1">
    <div class="div2"></div>
</div>
```

- 阻止普通文档流元素被浮动元素覆盖。如果没加`overflow: hidden;`的话demo1会浮在在demo2上，并且形成文字环绕的效果。加了之后demo1和demo2
    互不干扰不会重叠在一起。下面的例子稍微改下就能成为两栏布局。
```html
<style>
    * {
        margin: 0;
        padding: 0;
    }
    .demo1 {
        width: 100px;
        height: 100px;
        float: left;
        background: pink
    }
    .demo2 {
        width: 200px;
        height: 200px;
        background: blue;
        overflow: hidden;
    }
</style>

<div class="demo">
    <div class="demo1">我是一个左侧浮动元素</div>
    <div class="demo2">我是一个没有设置浮动, 也没有触发BFC的元素</div>
</div>
 
```

# 移动端1px
### 产生1px问题的原因？
由于`DPR(devicePixelRatio)`设备像素比不为1， 当css设置1px边框时，屏幕上对应的是2个或3个物理像素(具体多少个看设备像素比是多少)。
所以一像素看起来会很粗。

### 解决1px边框很粗的问题？
- 使用0.5px
    - 安卓有兼容问题。
- 使用transform: scale(0.5)进行缩放
- 使用viewport全局缩放
- 使用box-shadow
```css
box-shadow: 0  -1px 1px -1px #e5e5e5,   //上边线
            1px  0  1px -1px #e5e5e5,   //右边线
            0  1px  1px -1px #e5e5e5,   //下边线
            -1px 0  1px -1px #e5e5e5;   //左边线
```
- 使用图片

> 新项目最好使用的是设置viewport的scale值，这个方法兼容性好，后期写起来方便。老项目的话，改起来可能比较多，用的比较多的方法就是伪元素+transform的方法。


# postion
- 有哪几种定位方式？
- sticky?

# flex
### 容器属性
- display
- flex-direction
- justify-content
- align-items
- flex-wrap
- flex-flow
- align-content
### 项目属性
- flex
- flex-shrink
- flex-grow
- order
- flex-basis
- align-self




#  回流和重绘
> https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/24
### 浏览器渲染机制
- 浏览器采用流式布局模型（Flow Based Layout）
- 浏览器会把HTML解析成DOM，把CSS解析成CSSOM，DOM和CSSOM合并就产生了渲染树（Render Tree）
- 有了RenderTree，我们就知道了所有节点的样式，然后计算他们在页面上的大小和位置，最后把节点绘制到页面上
- 由于浏览器使用流式布局，对Render Tree的计算通常只需要遍历一次就可以完成，但table及其内部元素除外，他们可能需要多次计算，通常要花3倍于同等元素的时间，这也是为什么要避免使用table布局的原因之一。

### 回流（reflow）
- 定义
由于节点的几何属性发生改变或者由于样式发生改变而*会影响布局*的，称为回流。
回流是影响浏览器性能的关键因素，因为其变化涉及到部分页面（或是整个页面）的布局更新。
一个元素的回流可能会导致了其所有子元素以及DOM中紧随其后的节点、祖先节点元素的随后的回流。

- 作用
根据渲染树计算dom元素的位置和集合信息。

### 重绘（repaint）
- 定义
由于节点的几何属性发生改变或者由于样式发生改变而*不会影响布局*的，称为重绘。例如outline, visibility, color、background-color等。

> 回流必定会发生重绘，重绘不一定会引发回流。

### 浏览器优化
现代浏览器大多都是*通过队列机制来批量更新布局*，浏览器会把修改操作放在队列中，*至少一个浏览器刷新（即16.6ms）才会清空队列*，
但当你获取布局信息的时候，队列中可能有会影响这些属性或方法返回值的操作，即使没有，浏览器也会强制清空队列，触发回流与重绘来确保返回正确的值。
使用下面的属性时会导致强制触发回流和重绘：
- offsetTop、offsetLeft、offsetWidth、offsetHeight
- scrollTop、scrollLeft、scrollWidth、scrollHeight
- clientTop、clientLeft、clientWidth、clientHeight
- width、height
- getComputedStyle()
- getBoundingClientRect()


### 减少回流和重绘
- css
    - transform代替top
    - visibility代替display:none
    - 避免使用tableb布局
    - 将动画设置到position属性为absolute或fixed的元素上
- js
    - 为了减少发生次数，我们可以合并多次对DOM和样式的修改，然后一次处理掉。


# css3硬件加速
cSS3 硬件加速又叫做 GPU 加速，是利用 GPU 进行渲染，减少 CPU 操作的一种优化方案。
由于 GPU 中的 transform 等 CSS 属性不会触发 repaint，所以能大大提高网页的性能。

> CSS 中的以下几个属性能触发硬件加速：
- transform
- opacity
- filter
- will-change
如果有一些元素不需要用到上述属性，但是需要触发硬件加速效果，可以使用一些小技巧来诱导浏览器开启硬件加速。
```css
.element {
    -webkit-transform: translateZ(0);
    -moz-transform: translateZ(0);
    -ms-transform: translateZ(0);
    -o-transform: translateZ(0);
    transform: translateZ(0); 
    /**或者**/
    transform: rotateZ(360deg);
    transform: translate3d(0, 0, 0);
}
```

> 注意
- 1、过多地开启硬件加速可能会*耗费较多的内存*，因此什么时候开启硬件加速，给多少元素开启硬件加速，需要用测试结果说话。
- 2、GPU 渲染会影响字体的抗锯齿效果。这是因为 GPU 和 CPU 具有不同的渲染机制，即使最终硬件加速停止了，文本还是会在动画期间显示得很模糊。

# 浏览器调试


# 实现水平垂直居中
- 定宽高
    - 绝对定位 + margin取负值
    - 绝对定位 + translate
    - 绝对定位 + top/right/bottom/left + margin
    - grid
    - flex
    - table-cell + vertical-align + inline-block/margin: auto
- 不定宽高
    - 绝对定位 + translate
    - table-cell + vertical-align + inline-block/margin: auto
    - flex
    - grid

# 布局
- 单列布局
- 两列布局
- 三栏布局
    > 特点：中间列自适应宽度，旁边两侧固定宽度
    - 圣杯布局
    - 双飞翼布局
    - 等高布局
    - 表格布局
    - 粘连布局
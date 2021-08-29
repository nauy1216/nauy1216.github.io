1. **介绍一下标准的CSS的盒子模型？与低版本IE的盒子模型有什么不同的？**
2. **box-sizing属性？**
3. **CSS选择器有哪些？哪些属性可以继承？**
4. **如何居中div？如何居中一个浮动元素？如何让绝对定位的div居中？**
5. **display有哪些值？说明他们的作用?**
6. **position的值？**
7. **CSS3有哪些新特性？**
8. **请解释一下CSS3的flexbox（弹性盒布局模型）,以及适用场景？**
9. <u>**什么是 BFC机制？**</u>
> BFC(Block Formatting Context)，块级格式化上下文，是一个独立的渲染区域，让处于 BFC 内部的元素与外部的元素相互隔离，使内外元素的定位不会相互影响。

```css
触发条件 (以下任意一条)
float的值不为none
overflow的值不为visible
display的值为table-cell、tabble-caption和inline-block之一
position的值不为static或则releative中的任何一个
```

> 在IE下, Layout,可通过zoom:1 触发
> BFC布局与普通文档流布局区别:
> BFC布局规则:

```css
浮动的元素会被父级计算高度(父级元素触发了BFC)
非浮动元素不会覆盖浮动元素的位置(非浮动元素触发了BFC)
margin不会传递给父级(父级触发BFC)
属于同一个BFC的两个相邻元素上下margin会重叠
普通文档流布局: 浮动的元素是不会被父级计算高度
非浮动元素会覆盖浮动元素的位置
margin会传递给父级元素
两个相邻元素上下的margin会重叠
```

> 开发中的应用

```css
阻止margin重叠
可以包含浮动元素 —— 清除内部浮动(清除浮动的原理是两个 div都位于同一个 BFC 区域之中)
自适应两栏布局
可以阻止元素被浮动元素覆盖
```

10.**CSS3中新增的选择器以及属性**

11.**水平居中**

> 行内元素: text-align:center
> 块级元素: margin:0 auto
> 绝对定位和移动: absolute + transform
> 绝对定位和负边距: absolute + margin
> flex布局: flex + justify-content:center

12.**垂直居中**

> 子元素为单行文本: line-height:height
> absolute + transform
> flex + align-items:center
> table: display:table-cell; vertical-align: middle
> 利用position和top和负margin

13.**水平垂直居中**

1. 已知元素宽高:绝对定位+margin:auto:

   ```
   div{
         width: 200px;
         height: 200px;
         background: green;
   
         position:absolute;
         left:0;
         top: 0;
         bottom: 0;
         right: 0;
         margin: auto;
    }
   ```

14. **清除浮动有哪些方法, 各有什么优缺点**

1、clear: both

2、overflow:hidden;或overflow:auto



15.**用纯CSS创建一个三角形的原理是什么**

16.**实现三栏布局有哪些方法, 分别描述一下**

1、flex

2、左右使用fixed定位， 中间的使用margin居中

3、table

4、float

5、双飞翼布局

```css
<style>
.content {
  float: left;
  width: 100%;
}
.main {
  height: 200px;
  margin-left: 110px;
  margin-right: 220px;
  background-color: yellow;
}
.left {
  float: left;
  height: 200px;
  width: 100px;
  margin-left: -100%;
  background-color: red;
}
.right {
  width: 200px;
  height: 200px;
  float: right;
  margin-left: -200px;
  background-color: green;
}  
</style>
<div class="content">
  <div class="main"></div>
</div>
<div class="left"></div>
<div class="right"></div>
```

6、圣杯布局

```css
<style>
.container {
  margin-left: 120px;
  margin-right: 220px;
}
.main {
  float: left;
  width: 100%;
  height: 300px;
  background-color: yellow;
}
.left {
  float: left;
  width: 100px;
  height: 300px;
  margin-left: -100%;
  position: relative;
  left: -120px;
  background-color: blue;
}
.right {
  float: left;
  width: 200px;
  height: 300px;
  margin-left: -200px;
  position: relative;
  right: -220px;
  background-color: green;
}
</style>
<div class="container">
  <div class="main"></div>
  <div class="left"></div>
  <div class="right"></div>
</div>
```

> 圣杯布局和双飞翼布局解决问题的方案在前一半是相同的，也就是三栏全部float浮动，但左右两栏加



17.**css3实现0.5px的细线**

1、transform: scale(0.5)

18. **link 与 @import 的区别**

**a.从属关系区别**
@import是 CSS 提供的语法规则，只有导入样式表的作用；
link是HTML提供的标签，不仅可以加载 CSS 文件，还可以定义 RSS、rel 连接属性等
**b.加载顺序区别**
加载页面时，link标签引入的 CSS 被同时加载；
@import引入的 CSS 将在页面加载完毕后被加载。
**c.兼容性区别**
@import是 CSS2.1 才有的语法，故只可在 IE5+ 才能识别；
link标签作为 HTML 元素，不存在兼容性问题。
**d.DOM可控性区别**
可以通过 JS 操作 DOM ，插入link标签来改变样式；
由于DOM方法是基于文档的，无法使用@import的方式插入样式。
css部分就整理到这里, 小伙伴们面试还有什么经常遇到的,可以在评论区给我留言, 我有时间就整理出来, IT(挨踢)都是一大家, 方便你我他



19.**为什么要初始化css样式**

> 因为浏览器的兼容问题，不同浏览器对有些标签的默认值是不同的，如果没对CSS初始化往往会出现浏览器之间的页面显示差异。



20.**CSS优化、提高性能的方法有哪些**

> 尽量将样式写在单独的css文件里面，在head元素中引用 将代码写成单独的css文件有几点好处：

```text
内容和样式分离，易于管理和维护
减少页面体积
css文件可以被缓存、重用，维护成本降低
```

> 不使用@import
> 避免使用复杂的选择器，层级越少越好 建议选择器的嵌套最好不要超过三层，比如：
> 精简页面的样式文件，去掉不用的样式
> 利用CSS继承减少代码量
> 避免！important，可以选择其他选择器





21.**什么是响应式设计？响应式设计的基本原理是什么？如何兼容低版本的IE？**

响应式网站设计(Responsive Web design)是一个网站能够兼容多个终端，而不是为每一个终端做一个特定的版本。
基本原理是通过媒体查询检测不同的设备屏幕尺寸做处理。
页面头部必须有meta声明的viewport。



22. **视差滚动效果？**

> 视差滚动（Parallax Scrolling）通过在网页向下滚动的时候，控制背景的移动速度比前景的移动速度慢来创建出令人惊叹的3D效果。
> CSS3实现**优点**：开发时间短、性能和开发效率比较好，
> **缺点**是不能兼容到低版本的浏览器jQuery实现通过控制不同层滚动速度，计算每一层的时间，控制滚动效果。
> **优点**：能兼容到各个版本的，效果可控性好
> **缺点**：开发起来对制作者要求高插件实现方式例如：parallax-scrolling，兼容性十分好



23. **::before 和 :after中双冒号和单冒号有什么区别？解释一下这2个伪元素的作用**

> 单冒号(:)用于CSS3伪类，双冒号(::)用于CSS3伪元素。
> ::before就是以一个子元素的存在，定义在元素主体内容之前的一个伪元素。并不存在于dom之中，只存在在页面之中。
> :before 和 :after 这两个伪元素，是在CSS2.1里新出现的。
> 起初，伪元素的前缀使用的是单冒号语法，但随着Web的进化，在CSS3的规范里，伪元素的语法被修改成使用双冒号，成为::before ::after



24.**你对line-height是如何理解的？**

行高是指一行文字的高度，具体说是两行文字间基线的距离。CSS中起高度作用的是height和line-height，没有定义height属性，最终其表现作用一定是line-height。
**单行文本垂直居中**：把line-height值设置为height一样大小的值可以实现单行文字的垂直居中，其实也可以把height删除。
**多行文本垂直居中**：需要设置display属性为inline-block。



25.**怎么让Chrome支持小于12px 的文字？**

1、缩放

```
p{
    font-size:10px;
    -webkit-transform:scale(0.8);
} //0.8是缩放比例
```

2、







26. **让页面里的字体变清晰，变细用CSS怎么做？**

-webkit-font-smoothing在window系统下没有起作用，但是在IOS设备上起作用-webkit-font-smoothing：antialiased是最佳的，灰度平滑。



27. **position:fixed;在android下无效怎么处理？**

```
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"/>
```



28.**如果需要手动写动画，你认为最小时间间隔是多久，为什么？**

多数显示器默认频率是60Hz，即1秒刷新60次，所以理论上最小间隔为1/60＊1000ms ＝ 16.7ms。



29.**li与li之间有看不见的空白间隔是什么原因引起的？有什么解决办法？**

> 行框的排列会受到中间空白（回车空格）等的影响，因为空格也属于字符,这些空白也会被应用样式，占据空间，所以会有间隔，把字符大小设为0，就没有空格了。
> **解决方法**：可以将<li>代码全部写在一排浮动
> li中float：left在ul中用font-size：0（谷歌不支持）；
> 可以使用letter-space：-3px



30.**display:inline-block 什么时候会显示间隙？**

> 有空格时候会有间隙
> **解决**：移除空格
> margin正值的时候
> **解决**：margin使用负值
> 使用font-size时候
> **解决**：font-size:0、letter-spacing、word-spacing



31.**有一个高度自适应的div，里面有两个div，一个高度100px，希望另一个填满剩下的高度**



32. **png、jpg、gif 这些图片格式解释一下，分别什么时候用。有没有了解过webp？**

> **png**是便携式网络图片（Portable Network Graphics）是一种无损数据压缩位图文件格式.优点是：压缩比高，色彩好。大多数地方都可以用。
> **jpg**是一种针对相片使用的一种失真压缩方法，是一种破坏性的压缩，在色调及颜色平滑变化做的不错。在www上，被用来储存和传输照片的格式。
> **gif**是一种位图文件格式，以8位色重现真色彩的图像。可以实现动画效果.
> **webp**格式是谷歌在2010年推出的图片格式，压缩率只有jpg的2/3，大小比png小了45%。缺点是压缩的时间更久了，兼容性不好，目前谷歌和opera支持





33.**style标签写在body后与body前有什么区别？**

> 页面加载自上而下 当然是先加载样式。
> 写在body标签后由于浏览器以逐行方式对HTML文档进行解析，当解析到写在尾部的样式表（外联或写在style标签）会导致浏览器停止之前的渲染，等待加载且解析样式表完成之后重新渲染，在windows的IE下可能会出现FOUC现象（即样式失效导致的页面闪烁问题）



34.**CSS属性overflow属性定义溢出元素内容区的内容会如何处理?**

> 参数是scroll时候，必会出现滚动条。
> 参数是auto时候，子元素内容大于父元素时出现滚动条。
> 参数是visible时候，溢出的内容出现在父元素之外。
> 参数是hidden时候，溢出隐藏。





35.**阐述一下CSS Sprites**

> 将一个页面涉及到的所有图片都包含到一张大图中去，
> 然后利用CSS的 background-image，background- repeat，background-position 的组合进行背景定位。
> 利用CSS Sprites能很好地减少网页的http请求，从而大大的提高页面的性能；
> CSS Sprites能减少图片的字节。



36.**伪类，什么是伪元素，他们的区别？**

- 伪类的受体是文档树中已有的元素，而伪元素则创建了一个DOM外的元素
- 伪类用于添加元素的特殊效果，而伪元素则是添加元素的内容
- 伪类使用的一个冒号，为元素使用两个冒号
- 伪类更常用一些简单的动画或者交互的样式，例如滑入滑出，而为伪元素更常用语字体图标，清除浮动等



37.**margin和padding分别适合什么场景使用？**

margin是用来隔开元素与元素的间距；padding是用来隔开元素与内容的间隔。margin是用来布局分开元素，使元素与元素互不相干；padding用于元素与内容之间的间隔，让内容与元素之间有一段间距



38.**什么是外边距合并**

外边距合并指的是，当两个垂直外边距相遇时，他们将形成一个外边距。合并后的外边距的高度等于两个发生合并的外边距的高度中较大者





39.文字超出省略号，多行省略号
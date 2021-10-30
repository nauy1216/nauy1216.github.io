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



# Css浏览器调试？





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





# 利用box-shdow实现单边阴影？

使用内阴影：

上： box-shadow: inset 0px 15px 10px -15px #000;

下： box-shadow:inset 0px -15px 10px -15px #000;

左： box-shadow:inset 15px 0px 10px -15px #000;

右：box-shadow:inset -15px 0px 10px -15px #000;

使用外阴影：

下： box-shadow: 0 10px 10px -10px gray;



# a 标签四大伪类？

​    a:link，      定义正常链接的样式；

​    a:visited， 定义已访问过链接的样式；

​    a:hover，  定义鼠标悬浮在链接上时的样式；

​    a:active，  定义鼠标点击链接时的样式。





# min-width 不起作用？

在给li设置最小宽度时，代码如下， 但是不起作用：

```
        li {
            border: 1px solid red;
            min-width: 600px;
        }
```

原因是li是块元素， 宽度会继承父元素的宽度， 所以如果在ul的宽度大于600px像素时， li的宽度是大于600px所以就会出现min-width不起作用的错觉， 因为感觉不管怎么样li的宽度不会变，其实不是的，当你缩小浏览器的宽度时你会发现li的宽度减小到600px时就不会减小了。

解决办法：

1、设置display: inline-block使li不继承ul的宽度

2、设置ul的宽度比min-width更小可以使inline-block出现换行的效果

3、设置white-space: nowrap让内容不换行， 才足以撑开li的宽度， 如果不设置将会以min-width为最大的宽度。

```
        ul {
            width: 600px;
            border: 1px solid green;
        }
        li {
            border: 1px solid red;
            min-width: 600px;
            display: inline-block;
            white-space: nowrap;
        }
```

```
    <ul>
        <li>
            <div>地方的法律是手动手动大师傅但是速度更快速度速度过快</span>
            <div>地方的法律是手动手动大师傅但是速度更快速度速度过快地方的法律是手动手动大师傅但是速度更快速度速度过快地方的法律是手动手动大师傅但是速度更快速度速度过快</span>
        </li>
        <li>地方的法律是手动手动大师傅但是速度更快速度速度过快</li>
        <li></li>
        <li></li>
    </ul>
```


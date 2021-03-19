# BEM
BEM的意思就是块（block）、元素（element）、修饰符（modifier）。
命名约定的模式如下：
```css
.block{}
.block__element{}
.block--modifier{}
```
- .block 代表了更高级别的抽象或组件。
- .block__element 代表.block的后代，用于形成一个完整的.block的整体。
- .block--modifier代表.block的不同状态或不同版本。

之所以使用两个连字符和下划线而不是一个，是为了让你自己的块可以用单个连字符来界定，如：

```css
.site-search{} /* 块 */
.site-search__field{} /* 元素 */
.site-search--full{} /* 修饰符 */	

```

BEM的关键是光凭名字就可以告诉其他开发者某个标记是用来干什么的。通过浏览HTML代码中的class属性，你就能够明白模块之间是如何关联的：有一些仅仅是组件，有一些则是这些组件的子孙或者是元素,还有一些是组件的其他形态或者是修饰符。我们用一个类比/模型来思考一下下面的这些元素是怎么关联的：

```css
.person{}
.person__hand{}
.person--female{}
.person--female__hand{}
.person__hand--left{}	
```

> 规范不必生搬硬套，还是得看场景。


# OOCSS


# SMACSS


# Atomic Design
> TailwindCSS


# CSS-in-js


# style module
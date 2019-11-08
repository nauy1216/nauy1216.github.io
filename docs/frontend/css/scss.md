# 1、安装编译环境

# 2、编译scss文件

# 3、scss语法学习

Sass 有两种语法格式。一种是 SCSS， 另一种是最早的sass语法。

## 3.1、嵌套规则

```
#main p {
  color: #00ff00;
  width: 97%;

  .redbox {
    background-color: #ff0000;
    color: #000000;
  }
}
```

 编译后：

```
#main p {
  color: #00ff00;
  width: 97%; }
  #main p .redbox {
    background-color: #ff0000;
    color: #000000; }
```

## 3.2、父选择器 `&`

```
a {
  font-weight: bold;
  text-decoration: none;
  &:hover { text-decoration: underline; }
  body.firefox & { font-weight: normal; }
}
```

编译后：

```
a {
  font-weight: bold;
  text-decoration: none; }
  a:hover {
    text-decoration: underline; }
  body.firefox a {
    font-weight: normal; }
```

注意： `&` 必须作为选择器的第一个字符，其后可以跟随后缀生成复合的选择器（猜测在编译的过程中&会作为变量和后面的字符串拼接）。

```
#main {
  color: black;
  &-sidebar { border: 1px solid; }
}  
```

## 3.3、属性嵌套

```
.funky {
  font: {
    family: fantasy;
    size: 30em;
    weight: bold;
  }
}
```

编译后：

```
.funky {
  font-family: fantasy;
  font-size: 30em;
  font-weight: bold; }
```

命名空间也可以包含自己的属性值，例如：

```
.funky {
  font: 20px/24px {
    family: fantasy;
    weight: bold;
  }
}
```

编译后：

```
.funky {
  font: 20px/24px;
    font-family: fantasy;
    font-weight: bold; }
```

## 3.4、占位符选择器 `%foo`

# 4、SassScript

在 CSS 属性的基础上 Sass 提供了一些名为 SassScript 的新功能。 SassScript 可作用于任何属性，允许属性使用变量、算数运算等额外功能。

## 4.1、变量 `$` (Variables: `$`)

变量以美元符号开头，赋值方法与 CSS 属性的写法一样：

```
$width: 5em; // 定义一个变量

#main {
  width: $width; // 使用变量
}
```

> 变量支持块级作用域，嵌套规则内定义的变量只能在嵌套规则内使用（**局部变量**），不在嵌套规则内定义的变量则可在任何地方使用（**全局变量**）。将局部变量转换为全局变量可以添加 **!global** 声明。

```
#main {
  $width: 5em !global; // 虽然在局部定义的， 但是加上！global后就会变成全局变量
  width: $width;
}

#sidebar {
  width: $width;
}
```

编译后：

```
#main {
  width: 5em;
}

#sidebar {
  width: 5em;
}
```

## 4.2、数据类型 (Data Types)

sassScript支持以下的数据类型：

- 数字，`1, 2, 13, 10px`
- 字符串，有引号字符串与无引号字符串，`"foo", 'bar', baz`
- 颜色，`blue, #04a3f9, rgba(255,0,0,0.5)`
- 布尔型，`true, false`
- 空值，`null`
- 数组 (list)，用空格或逗号作分隔符，`1.5em 1em 0 2em, Helvetica, Arial, sans-serif`
- maps, 相当于 JavaScript 的 object，`(key1: value1, key2: value2)`

### 4.2.1、字符串 (Strings)

SassScript 支持 CSS 的两种字符串类型：

1、有引号字符串 (quoted strings)，如 `"Lucida Grande"` `'http://sass-lang.com'`；

2、无引号字符串 (unquoted strings)，如 `sans-serif` `bold`，

> 在编译 CSS 文件时不会改变其类型。只有一种情况例外，使用 `#{}` (interpolation) 时，有引号字符串将被编译为无引号字符串。

```
@mixin firefox-message($selector) {
  // 如果选择器使用变量时需要使用#{}, 属性使用变量的用法不同。 
  body.firefox #{$selector}:before {
    content: "Hi, Firefox users!";
  }
}
@include firefox-message(".header");
```

编译后：

```
body.firefox .header:before {
  content: "Hi, Firefox users!"; }
```

### 4.2.2、数组 (Lists)

数组 (lists) 指 Sass 如何处理 CSS 中 `margin: 10px 15px 0 0` 或者 `font-face: Helvetica, Arial, sans-serif` 这样通过空格或者逗号分隔的一系列的值。

## 4.3、运算 (Operations)

### 4.3.1、数字运算 (Number Operations)

```
p {
  width: 1in + 8pt;
}
```

编译后

```
p {
  width: 1.111in; }
```

> `/` 在 CSS 中通常起到分隔数字的用途，SassScript 作为 CSS 语言的拓展当然也支持这个功能，同时也赋予了 `/` 除法运算的功能。也就是说，如果 `/` 在 SassScript 中把两个数字分隔，编译后的 CSS 文件中也是同样的作用。

以下三种情况 `/` 将被视为除法运算符号：

- 如果值，或值的一部分，是变量或者函数的返回值
- 如果值被圆括号包裹
- 如果值是算数表达式的一部分

```
p {
  font: 10px/8px;             // Plain CSS, no division
  $width: 1000px;
  width: $width/2;            // Uses a variable, does division
  width: round(1.5)/2;        // Uses a function, does division
  height: (500px/2);          // Uses parentheses, does division
  margin-left: 5px + 8px/2px; // Uses +, does division
}
```

编译后：

```
p {
  font: 10px/8px;
  width: 500px;
  height: 250px;
  margin-left: 9px; }
```

> 如果需要使用变量，同时又要确保 `/` 不做除法运算而是完整地编译到 CSS 文件中，只需要用 **`#{}` 插值语句**将变量包裹。

```
p {
  $font-size: 12px;
  $line-height: 30px;
  font: #{$font-size}/#{$line-height};
}
```

编译后

```
p {
  font: 12px/30px; } 
```

### 4.3.2、颜色值运算 (Color Operations)

> 颜色值的运算是分段计算进行的，也就是分别计算红色，绿色，以及蓝色的值。

```
p {
  color: #010203 + #040506;
}
```

编译后：

```
p {
  color: #050709; } // 计算 01 + 04 = 05 02 + 05 = 07 03 + 06 = 09
```

### 4.3.3、字符串运算 (String Operations)

```
p {
  cursor: e + -resize;
}
```

编译后：

```
p {
  cursor: e-resize; }
```

## 4.4、函数 (Functions)

SassScript 定义了多种函数，有些甚至可以通过普通的 CSS 语句调用：

```
p {
  color: hsl(0, 100%, 50%);
}

// 编译后
p {
  color: #ff0000; }
```

> 关键词参数 (Keyword Arguments)

关键词参数给函数提供了更灵活的接口，以及容易调用的参数。关键词参数可以打乱顺序使用，如果使用默认值也可以省缺，另外，参数名被视为变量名，下划线、短横线可以互换使用。

```
p {
  color: hsl($hue: 0, $saturation: 100%, $lightness: 50%);
}
```

## 4.5、插值语句 `#{}` (Interpolation: `#{}`)

> 通过 `#{}` 插值语句可以在**选择器**或**属性名**中使用变量

```scss
$name: foo;
$attr: border;
p.#{$name} {
  #{$attr}-color: blue;
}

// 编译后
p.foo {
  border-color: blue; }
```

## 4.6、变量定义 `!default` (Variable Defaults: `!default`)

可以在变量的结尾添加 `!default` 给一个未通过 `!default` 声明赋值的变量赋值，此时，如果变量已经被赋值，不会再被重新赋值，但是如果变量还没有被赋值，则会被赋予新的值。

```scss
例1：
$content: "First content";
$content: "Second content?" !default; // 在上面$content已经被赋值了所以不会再赋值
$new_content: "First time reference" !default;

#main {
  content: $content;
  new-content: $new_content;
}

// 编译后
#main {
  content: "First content";
  new-content: "First time reference"; }
  
例2：
$content: null;
$content: "Non-null content" !default;// 在上面并没有赋值所以会使用这里的值

#main {
  content: $content;
}

// 编译后
#main {
  content: "Non-null content"; }
```

# 5、@-Rules 与指令 (@-Rules and Directives)

Sass 支持所有的 CSS3 @-Rules，以及 Sass 特有的 “指令”（directives）。

## 5.1、@import

Sass 拓展了 `@import` 的功能，允许其导入 SCSS 或 Sass 文件。被导入的文件将合并编译到同一个 CSS 文件中，另外，被导入的文件中所包含的变量或者混合指令 (mixin) 都可以在导入的文件中使用。

```scss
@import "foo.scss";
```

### 5.1.1、分音 (Partials)

如果需要导入 SCSS 或者 Sass 文件，但又不希望将其编译为 CSS，只需要在文件名前添加下划线，这样会告诉 Sass 不要编译这些文件，但导入语句中却不需要添加下划线。

例如，将文件命名为 `_colors.scss`，便不会编译 `_colours.css` 文件。

```scss
@import "colors";
```

上面的例子，导入的其实是 `_colors.scss` 文件

注意，不可以同时存在添加下划线与未添加下划线的同名文件，添加下划线的文件将会被忽略。

### 5.1.2、嵌套 @import

> 可以将 `@import` 嵌套进 CSS 样式或者 `@media` 中，与平时的用法效果相同，只是这样导入的样式只能出现在嵌套的层中。

假设 example.scss 文件包含以下样式：

```scss
.example {
  color: red;
}
```

然后导入到 `#main` 样式内

```scss
#main {
  @import "example";
}
```

将会被编译为

```css
#main .example {
  color: red;
}
```

### 5.1.3、@media

> 如果 `@media` 嵌套在 CSS 规则内，编译时，`@media` 将被编译到文件的最外层，包含嵌套的父选择器。这个功能让 `@media` 用起来更方便，不需要重复使用选择器，也不会打乱 CSS 的书写流程。

```scss
.sidebar {
  width: 300px;
  @media screen and (orientation: landscape) {
    width: 500px;
  }
}
```

编译为

```css
.sidebar {
  width: 300px; }
  @media screen and (orientation: landscape) {
    .sidebar {
      width: 500px; } }
```



> @media` 的 queries 允许互相嵌套使用，编译时，Sass 自动添加 `and

```
@media screen {
  .sidebar {
    @media (orientation: landscape) {
      width: 500px;
    }
  }
}
```

编译为

```css
@media screen and (orientation: landscape) {
  .sidebar {
    width: 500px; } }
```



> `@media` 甚至可以使用 SassScript（比如变量，函数，以及运算符）代替条件的名称或者值：



```scss
$media: screen;
$feature: -webkit-min-device-pixel-ratio;
$value: 1.5;

@media #{$media} and ($feature: $value) {
  .sidebar {
    width: 500px;
  }
}
```

编译为

```css
@media screen and (-webkit-min-device-pixel-ratio: 1.5) {
  .sidebar {
    width: 500px; } }
```

### 5.1.4、@extend



### 5.1.5、@extend-Only 选择器 (@extend-Only Selectors)

```scss
// This ruleset won't be rendered on its own.
#context a%extreme {
  color: blue;
  font-weight: bold;
  font-size: 2em;
}
```

占位符选择器需要通过延伸指令使用，用法与 class 或者 id 选择器一样，被延伸后，占位符选择器本身不会被编译。

```scss
.notice {
  @extend %extreme;
}
```

编译为

```css
// 将%extreme替换成.notice
#context a.notice {
  color: blue;
  font-weight: bold;
  font-size: 2em; }
```

### 5.1.5、@debug

代码调试

```scss
@debug 10em + 12em;
```

编译为

```
Line 1 DEBUG: 22em
```

### 5.1.6、@warn

```scss
@mixin adjust-location($x, $y) {
  @if unitless($x) {
    @warn "Assuming #{$x} to be in pixels";
    $x: 1px * $x;
  }
  @if unitless($y) {
    @warn "Assuming #{$y} to be in pixels";
    $y: 1px * $y;
  }
  position: relative; left: $x; top: $y;
}
```

### 5.1.7、@error 

```scss
@mixin adjust-location($x, $y) {
  @if unitless($x) {
    @error "$x may not be unitless, was #{$x}.";
  }
  @if unitless($y) {
    @error "$y may not be unitless, was #{$y}.";
  }
  position: relative; left: $x; top: $y;
}
```

# 6、控制指令

## 6.1、 if()

？？？

## 6.2、 @if

> 当 `@if` 的表达式返回值不是 `false` 或者 `null` 时，条件成立，输出 `{}` 内的代码：

```scss
p {
  @if 1 + 1 == 2 { border: 1px solid; }
  @if 5 < 3 { border: 2px dotted; }
  @if null  { border: 3px double; }
}
```

编译为

```css
p {
  border: 1px solid; }
```

`@if` 声明后面可以跟多个 `@else if` 声明，或者一个 `@else` 声明。如果 `@if` 声明失败，Sass 将逐条执行 `@else if` 声明，如果全部失败，最后执行 `@else` 声明，例如：

```scss
$type: monster;
p {
  @if $type == ocean {
    color: blue;
  } @else if $type == matador {
    color: red;
  } @else if $type == monster {
    color: green;
  } @else {
    color: black;
  }
}
```

编译为

```css
p {
  color: green; }
```

## 6.3、@for

`@for` 指令可以在限制的范围内重复输出格式，每次按要求（变量的值）对输出结果做出变动。这个指令包含两种格式：`@for $var from <start> through <end>`，或者 `@for $var from <start> to <end>`，区别在于 `through` 与 `to` 的含义：*当使用 through 时，条件范围包含 <start> 与 <end> 的值，而使用 to 时条件范围只包含 <start> 的值不包含 <end> 的值*。另外，`$var` 可以是任何变量，比如 `$i`；`<start>` 和 `<end>` 必须是整数值。

```scss
@for $i from 1 through 3 {
  .item-#{$i} { width: 2em * $i; }
}
```

编译为

```css
.item-1 {
  width: 2em; }
.item-2 {
  width: 4em; }
.item-3 {
  width: 6em; }
```

## 6.4、@each

`@each` 指令的格式是 `$var in <list>`, `$var` 可以是任何变量名，比如 `$length` 或者 `$name`，而 `<list>` 是一连串的值，也就是值列表。

`@each` 将变量 `$var` 作用于值列表中的每一个项目，然后输出结果，例如：

```scss
@each $animal in puma, sea-slug, egret, salamander {
  .#{$animal}-icon {
    background-image: url('/images/#{$animal}.png');
  }
}
```

编译为

```css
.puma-icon {
  background-image: url('/images/puma.png'); }
.sea-slug-icon {
  background-image: url('/images/sea-slug.png'); }
.egret-icon {
  background-image: url('/images/egret.png'); }
.salamander-icon {
  background-image: url('/images/salamander.png'); }
```

## 6.5、@while

`@while` 指令重复输出格式直到表达式返回结果为 `false`。这样可以实现比 `@for` 更复杂的循环，只是很少会用到。例如：

```scss
$i: 6;
@while $i > 0 {
  .item-#{$i} { width: 2em * $i; }
  $i: $i - 2;
}
.item-6 {
  width: 12em; }

.item-4 {
  width: 8em; }

.item-2 {
  width: 4em; }
```

# 7、 混合指令 (Mixin Directives)

混合指令（Mixin）用于定义可重复使用的样式。



```scss
@mixin large-text {
  font: {
    family: Arial;
    size: 20px;
    weight: bold;
  }
  color: #ff0000;
}
```

```scss
.page-title {
  @include large-text;
  padding: 4px;
  margin-top: 10px;
}
```

编译为

```css
.page-title {
  font-family: Arial;
  font-size: 20px;
  font-weight: bold;
  color: #ff0000;
  padding: 4px;
  margin-top: 10px; }
```

混合样式中也可以包含其他混合样式，比如

```scss
@mixin compound {
  @include highlighted-background;
  @include header-text;
}
@mixin highlighted-background { background-color: #fc0; }
@mixin header-text { font-size: 20px; }
```

> 参数 (Arguments)

```scss
@mixin sexy-border($color, $width) {
  border: {
    color: $color;
    width: $width;
    style: dashed;
  }
}
p { @include sexy-border(blue, 1in); }
```

编译为

```css
p {
  border-color: blue;
  border-width: 1in;
  border-style: dashed; }
```

> 参数的默认值

```scss
@mixin sexy-border($color, $width: 1in) {
  border: {
    color: $color;
    width: $width;
    style: dashed;
  }
}
p { @include sexy-border(blue); }
h1 { @include sexy-border(blue, 2in); }
```

编译为

```css
p {
  border-color: blue;
  border-width: 1in;
  border-style: dashed; }

h1 {
  border-color: blue;
  border-width: 2in;
  border-style: dashed; }
```

> 关键词参数 (Keyword Arguments)

混合指令也可以使用关键词参数，上面的例子也可以写成：

```scss
p { @include sexy-border($color: blue); }
h1 { @include sexy-border($color: blue, $width: 2in); }
```

> 参数变量 (Variable Arguments)

有时，不能确定混合指令需要使用多少个参数，比如一个关于 `box-shadow` 的混合指令不能确定有多少个 'shadow' 会被用到。这时，可以使用参数变量 `…` 声明（写在参数的最后方）告诉 Sass 将这些参数视为值列表处理：

```scss
@mixin box-shadow($shadows...) {
  -moz-box-shadow: $shadows;
  -webkit-box-shadow: $shadows;
  box-shadow: $shadows;
}
.shadows {
  @include box-shadow(0px 4px 5px #666, 2px 6px 10px #999);
}
```

编译为

```css
.shadowed {
  -moz-box-shadow: 0px 4px 5px #666, 2px 6px 10px #999;
  -webkit-box-shadow: 0px 4px 5px #666, 2px 6px 10px #999;
  box-shadow: 0px 4px 5px #666, 2px 6px 10px #999;
}
```

> 向混合样式中导入内容 (Passing Content Blocks to a Mixin)， 有点像slot ^_^

```scss
@mixin apply-to-ie6-only {
  * html {
    @content;
  }
}
@include apply-to-ie6-only {
  #logo {
    background-image: url(/logo.gif);
  }
}
```

**为便于书写，@mixin 可以用 = 表示，而 @include 可以用 + 表示**，所以上面的例子可以写成：

```sass
=apply-to-ie6-only
  * html
    @content

+apply-to-ie6-only
  #logo
    background-image: url(/logo.gif)
```

**注意：** 当 `@content` 在指令中出现过多次或者出现在循环中时，额外的代码将被导入到每一个地方。

# 8、函数指令

```scss
$grid-width: 40px;
$gutter-width: 10px;

@function grid-width($n) {
  @return $n * $grid-width + ($n - 1) * $gutter-width;
}

#sidebar { width: grid-width(5); }
```

编译为

```css
#sidebar {
  width: 240px; }
```

# 9、输出格式 (Output Style)

Sass 提供了四种编译后代码输出格式，可以通过 `:style option` 选项设定，或者在命令行中使用 `--style` 选项。
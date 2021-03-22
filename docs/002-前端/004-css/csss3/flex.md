# 弹性盒模型
1. 最老版本：box inline-box
2. 过渡版本：flexbox inline-flexbox
3. 最新版本：flex inline-flex

学习的是最新的版本。

# 特性：
1. 容器不设置宽度时默认是占满一行，高度由内容撑开。
2. 设置为inline-flex, 宽度由内容撑开。

# 定义：
1. flex容器：采用flex布局的元素。

2. flex项目：flex容器内所有的子元素都自动成为容器成员，成为flex项目。

3. 容器默认存在的两根轴：
- 水平的主轴（main axis）：
  - 开始位置 main start
  - 结束位置 main end
- 垂直的交叉轴（cross axis）:
  - cross start
  - cross end

4. 项目默认沿主轴排列。
  - main size :单个项目占据主轴的空间。
  - cross size :单个项目占据交叉轴的空间。

# 容器的属性
### 1.flex-direction
决定主轴及其方向（主轴可以设置）
1. row（默认）:从左到右
2. row-reverse:从右到左
3. column:从上到下
4. column-reverse:从下到上


### 2. flex-wrap
定义一条轴线如果排不下，如何换行。
1. nowrap（默认）:不换行。//按比例给项目分配空间。项目的大小改变了。
2. wrap:换行，第一行在最上方。//项目的大小没有改变。
3. wrap-reverse:换行，第一行在最下方。

### 3. flex-flow: row nowrap
`flex-direction`和`flex-wrap`两个属性的简写形式。

### 4. justify-content:
定义了项目主轴上的对齐方式。
1. flex-start（默认）:左对齐
2. flex-end:右对齐
3. center：居中
4. space-between:两端对齐，项目之间间隔相等。
5. space-around:每个项目的两边的距离对相等。

### 5. align-items（一根轴，项目在主轴上顺交叉轴方向的对齐方式）:
定义在交叉轴上怎么对齐
1. flex-start:交叉轴的起点对齐
2. flex-end:交叉轴的终点对齐
3. center：交叉轴的中点对齐，都是上下居中。
4. baseline：项目的第一行文字的基准线对齐,所有项目的第一行都是对齐的。
5. stretch（默认）：如果项目没有指定高度将占满整个容器的高度

如果项目指定高度默认是起点对齐
### 6. align-content（多根主轴，作用对象是轴线）:
定义的多根轴的对齐方式，如果项目只有一根轴线该属性不起作用。
1. flex-start:与交叉轴的起点对齐,所有主轴从交叉轴起点开始排列
2. flex-end:与交叉轴的终点对齐
3. flex-center:与交叉轴的中点对齐
4. space-between:
5. space-around:
6. stretch:轴线占满整个交叉轴

出现交叉轴的情况：项目在一条主轴线上放不下，换行时就会产生多条主轴 这个属性是用来设置多根主轴在交叉轴上的对齐方式。

# 项目属性
### 1.order
定义项目的排列顺序，数值越小越靠前，默认是0.
- 值可以是负数。
- 作用是可以改变项目的位置。

### 2.flex-grow
定义项目的放大倍数。默认是0，表示容器有多余空间不放大。
- 这里放大的只是内容，边框、padding、margin不会放大
- 最大只能放大到所有项目填满容器的宽度，此时根据每个项目的放大倍数 作为基数，按比例分配剩余空间。
- 值为负数时不起作用。

### 3.flex-shrink
定义项目的缩小比例。默认是1，即容器空间不足按比例缩小项目。
- 如果每个项目缩小的比例相同，则是等比缩小。
- 如果某个项目的缩小比例为0时表示不缩放。
### 4. flex-basis
定义了在分配多余空间之前，项目占据的主轴空间。浏览器根据这个属性，计算主轴空间是否有剩余。
他的默认值是auto.即项目的本来大小。可以像width一样可以设置占据的主轴空间。
- 作用：可以改变项目的尺寸大小。

### 5. flex
`flex-grow flex-shrink flex-basis`的简写，默认为 `0 1 auto`。

### 6. align-self
允许单个项目有与其他项目不一样的对齐方式。可覆盖align-items属性。
默认是auto，表示继承父元素的align-items的值。
使用方法与align-items一样，多了一个auto。
CSS3 硬件加速又叫做 GPU 加速，是利用 GPU 进行渲染，减少 CPU 操作的一种优化方案。
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


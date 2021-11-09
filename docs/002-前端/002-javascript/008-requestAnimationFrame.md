- https://www.cnblogs.com/coco1s/p/8029582.html
- https://developers.google.com/web/updates/2014/11/frame-timing-api



# requestAnimationFrame

`window.requestAnimationFrame()` 告诉浏览器: 

>  <u>你希望执行一个动画，并且要求浏览器在**下次重绘之前调用**指定的回调函数更新动画。</u>



该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。

1. 回调函数执行次数**通常是每秒60次，但在大多数遵循W3C建议的浏览器中，回调函数执行次数通常与*浏览器屏幕刷新次数*相匹配**。

2. 为了提高性能和电池寿命，因此在大多数浏览器里，当`requestAnimationFrame()` 运行在后台标签页或者隐藏的`<iframe>` 里时，`requestAnimationFrame()` 会被暂停调用以提升性能和电池寿命。

3. 回调函数会被传入**DOMHighResTimeStamp**参数，**DOMHighResTimeStamp**指示当前被 **requestAnimationFrame()** 排序的回调函数被触发的时间。

4. **requestAnimationFrame**是在主线程上完成。这意味着，如果主线程非常繁忙，**requestAnimationFrame**的动画效果会大打折扣。

> 示例
```js
const element = document.getElementById('some-element-you-want-to-animate');
let start;

function step(timestamp) {
  if (start === undefined)
    start = timestamp;
  
  const elapsed = timestamp - start;

  //这里使用`Math.min()`确保元素刚好停在200px的位置。
  element.style.transform = 'translateX(' + Math.min(0.1 * elapsed, 200) + 'px)';

  if (elapsed < 2000) { // 在两秒后停止动画
    window.requestAnimationFrame(step);
  }
}

window.requestAnimationFrame(step);
```



# 兼容

```js
requestID = window.requestAnimationFrame(callback);
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();
```



# 60fps与设备刷新率

目前大多数设备的屏幕刷新率为***60次/秒***，如果在页面中有一个动画或者渐变效果，或者用户正在滚动页面，那么**浏览器渲染动画或页面的每一帧的速率也需要跟设备屏幕的刷新率保持一致。**

### 卡顿

其中每个帧的预算时间仅比**16毫秒**多一点（1秒/ 60 = 16.6毫秒）。但实际上，浏览器有整理工作要做，因此您的所有工作是需要在***10毫秒内*完成**。如果无法符合此预算，帧率将下降，并且内容会在屏幕上抖动。此现象通常称为卡顿，会对用户体验产生负面影响。



### 跳帧

假如动画切换在 16ms,  32ms,  48ms时分别切换，跳帧就是假如到了32ms，其他任务还未执行完成，没有去执行动画切帧，等到开始进行动画的切帧，已经到了该执行48ms的切帧。就好比你玩游戏的时候卡了，过了一会，你再看画面，它不会停留你卡的地方，或者这时你的角色已经挂掉了。必须在下一帧开始之前就已经绘制完毕。



### 查看FPS

*Chrome devtool 查看实时 FPS, 打开 More tools => Rendering, 勾选 FPS meter* 



### 计算FPS

- https://developers.google.com/web/updates/2014/11/frame-timing-api
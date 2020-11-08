### 动画

特点：
1、动画是异步操作。
2、在添加一次动画之后，再添加动画是没有效果的，必须用animation：none;清空，再添加。
3、所谓的动画就是从0 逐渐过渡到100。元素会瞬间变成0的状态，然后慢慢过渡到100。如果0和100不是和 元素之星动画之前的状态一样会显得很突兀。因此，如果不定义0和100，就不会这样了。
关键帧：keyFrames
指明多个状态，而之间的过程由计算机自动计算。 元素经由设定多个状态到达指定的状态，两个相邻的状态由过渡完成。

关键帧的时间单位
数字表示：0% 25% 100% 等--------->时间轴
字符表示：from(0%) to(100%)

定义动画的格式：
在样式表中定义：
@keyFrames 动画名称｛
动画状态
｝
例子：

```
        @keyFrames move{
            0%{transform:translate(0,0);}
            25%{transform:translate(400px,0);}
            50%{transform:translate(400px,400px);}
            75%{transform:translate(0,400px);}
            100%{transform:translate(0,0);}
        }
        
```

使用动画：

 animation：2s move；

第一个参数是：运动时间

第二个参数是：动画名称

必要属性：



① animation-name:动画名称；

② animation-duration:时间；

可选属性：



① animation-timing-function:动画形式；

-ease（默认） 逐渐变慢

-linear 匀速

-ease-in 加速

-ease-out 减速

-ease-int-out 先加速后减速

-cubic-bezier 贝塞尔曲线

② animation-delay

③ animation-iteration-count:重复次数；

infinite无限次

④ animation-direction 播放前重置

alternate 接着上一次

normal 从0%开始

⑤ animation-play-state:播放状态

running

paused

使用动画的两个步骤：



1、定义动画

2、调用动画

（1）通过css伪类

（2）通过js

a、定义一个class类，里面放好animation的各种属性， 给需要运动的对象添加类

b、直接操作animation的各种属性（比较麻烦），或使用cssText属性。

c、通过事件：animationend事件 动画播放完毕触发，只触发一次。
# 文档
- https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Audio_API/Using_Web_Audio_API
- https://firefox-source-docs.mozilla.org/devtools-user/web_audio_editor/index.html
- https://github.com/mdn/webaudio-examples
- https://www.bookstack.cn/read/webapi-tutorial/docs-webaudio.md
- https://zhuanlan.zhihu.com/p/383946261
- https://web-audio.johnsonlee.site/convolver
- https://webfe.kujiale.com/web-recorder/
- https://www.iplaysoft.com/fix-chrome-slow.html
- https://juejin.cn/post/6844903668588740621

# 库
- https://github.com/muaz-khan/RecordRTC
- https://github.com/xiangyuecn/Recorder
- https://github.com/Kagami/ffmpeg.js

# 文档
- https://github.com/xiangyuecn/Recorder
- http://kmanong.top/kmn/qxw/form/article?id=1318&cate=58


# Web Audio API
## 什么是Web Audio API？
1. `Web Audio API`并不会取代`<audio>`音频元素，倒不如说它是`<audio>`的补充更好，就好比如`<canvas>`与`<img>`共存的关系。
2. 如果你想实现更多复杂的音频处理，以及播放，`Web Audio API`提供了更多的优势以及控制。比如：
  - 自选音频源
  - 对音频添加特效
  - 使音频可视化
  - 添加空间效果

## 概念
### 音频上下文(AudioContext)
用户可以在音频上下文(AudioContext)中进行音频操作，具有模块化路由的特点。

### 音频节点
1. 在节点上对音频进行操作。
2. 节点的输出可以连接到其它节点的输入上，然后新节点可以对接收到的采样数据再进行其它的处理，再形成一个结果流。


### 音频路由图
1. 在音频节点上操作进行基础的音频，它们连接在一起构成音频路由图。
2. 音频节点通过它们的输入输出相互连接，形成一个链或者一个简单的网。
3. 一般来说，这个链或网起始于一个或多个音频源。音频源可以提供一个片段一个片段的音频采样数据（以数组的方式），一般，一秒钟的音频数据可以被切分成几万个这样的片段。




# wav
- https://www.cnblogs.com/douzujun/p/10600793.html
- https://juejin.cn/post/6844904051964903431
- https://cloud.tencent.com/developer/article/1358832


# wav转mp3
- https://www.npmjs.com/package/lamejs


# 页面自动播放音频
- https://juejin.cn/post/6844903605170864136
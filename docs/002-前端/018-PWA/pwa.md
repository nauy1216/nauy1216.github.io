- https://juejin.cn/post/6844903556470816781
- https://github.com/hemanth/awesome-pwa
# 什么是PWA?
Progressive Web App, 简称 PWA，是提升Web App的体验的一种新方法，能给用户原生应用的体验。

PWA能做到原生应用的体验不是靠特指某一项技术，而是经过应用一些新技术进行改进，在安全、性能和体验三个方面都有很大提升，PWA本质上是Web App，借助一些新技术也具备了Native App的一些特性，兼具Web App和Native App的优点。

### PWA的主要特点包括下面三点
1. 可靠 - 即使在不稳定的网络环境下，也能瞬间加载并展现
2. 体验 - 快速响应，并且有平滑的动画响应用户的操作
3. 粘性 - 像设备上的原生应用，具有沉浸式的用户体验，用户可以添加到桌面

PWA本身强调渐进式，并不要求一次性达到安全、性能和体验上的所有要求，开发者可以通过PWA Checklist查看现有的特征。

### 通过上面的PWA Checklist，总结起来，PWA大致有以下的优势：
1. 体验：通过Service Worker配合Cache Storage API，保证了PWA首屏的加载效率，甚至配合本地存储可以支持离线应用；
2. 粘性：PWA是可以安装的，用户点击安装到桌面后，会在桌面创建一个 PWA 应用，并且不需要从应用商店下载，可以借助Web App Manifest提供给用户和Native App一样的沉浸式体验，可以通过给用户发送离线通知，让用户回流；
3. 渐进式：适用于大多数现代浏览器，随着浏览器版本的迭代，其功能是渐进增强的；
4. 无版本问题：如Web应用的优势，更新版本只需要更新应用程序对应的静态文件即可，Service Worker会帮助我们进行更新；
5. 跨平台：Windows、Mac OSX、Android、IOS，一套代码，多处使用；
6. 消息推送：即使用户已经关闭应用程序，仍然可以对用户进行消息推送；


# 使用PWA manifest添加桌面入口
注意这里说的`manifest`不是指的`manifest`缓存，这个`manifest`是一个`JSON`文件，开发者可以利用它控制在用户想要看到应用的区域（例如移动设备主屏幕）中如何向用户显示网络应用或网站，指示用户可以启动哪些功能，以及定义其在启动时的外观。

### manifest提供了将网站书签保存到设备主屏幕的功能。当网站以这种方式启动时：
- 它具有唯一的图标和名称，以便用户将其与其他网站区分开来。
- 它会在下载资源或从缓存恢复资源时向用户显示某些信息。
- 它会向浏览器提供默认显示特性，以避免网站资源可用时的过渡过于生硬。

下面的manifest.json文件，作为桌面入口配置文件的示例：
具体的配置方法查看链接：
https://developer.mozilla.org/zh-CN/docs/Web/Manifest
```json
{
  "name": "Counterxing",
  "short_name": "Counterxing",
  "description": "Why did you encounter me?",
  "start_url": "/index.html",
  "display": "standalone",
  "orientation": "any",
  "background_color": "#ACE",
  "theme_color": "#ACE",
  "icons": [{
    "src": "/images/logo/logo072.png",
    "sizes": "72x72",
    "type": "image/png"
  }, {
    "src": "/images/logo/logo152.png",
    "sizes": "152x152",
    "type": "image/png"
  }, {
    "src": "/images/logo/logo192.png",
    "sizes": "192x192",
    "type": "image/png"
  }, {
    "src": "/images/logo/logo256.png",
    "sizes": "256x256",
    "type": "image/png"
  }, {
    "src": "/images/logo/logo512.png",
    "sizes": "512x512",
    "type": "image/png"
  }]
}
```
上面的字段含义也不用多解释了，大致就是:
- 启动的icon样式
- 应用名称
- 简写名称
- 描述等
- display为standalone，则会隐藏浏览器的UI界面，如果设置display为browser，则启动时保存浏览器的UI界面。
- orientation表示启动时的方向，横屏、竖屏等，具体参数值可参考文档。
- background_color和theme_color表示应用程序的背景颜色和主题颜色。
其中必须确保有short_name和name。此外，最好设定好start_url，表示启动的根页面路径，如果不添加，则是使用当前路径。

在创建好manifest.json后，将、使用link标签添加到应用程序的所有页面上，
```html
<link rel="manifest" href="/manifest.json">
```

# 安装到桌面
### 桌面端（以Mac OSX为例）
只有注册、激活了Service Worker的网站才能够安装到桌面，在Chrome 70版本之前，需要手动开启实验性功能，步骤如下：
- 进入chrome://flags
- 找到Desktop PWAs，选择Enabled

### 移动端（以IOS为例）
由于当初苹果推出PWA时，并没有一个统一的manifest的规范，最开始的设计是通过meta和link标签来设定应用的对应参数的，所以，在移动端上的PWA应用，为了兼容Windows Phone和iPhone，需要在所有页面的HTML的head中添加以下的标签：

```html
<meta name="msapplication-TileImage" content="./images/logo/logo152.png">
<meta name="msapplication-TileColor" content="#2F3BA2">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-title" content="Counterxing">
<link rel="apple-touch-icon" href="./images/logo/logo152.png">
```
添加好后，就可以体验我们的PWA了！


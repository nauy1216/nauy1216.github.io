### TODO

- 怎么安装react-devtool
- 怎么打包electron

### Electron是什么？

- 使用 JavaScript、HTML 和 CSS 构建桌面应用程序的框架。
- 跨平台
- 嵌入了 [Chromium](https://www.chromium.org/) 和 [Node.js](https://nodejs.org/) 



### 开发环境

- 系统安装node

  > **注意** 因为 Electron 将 Node.js 嵌入到其二进制文件中，你应用运行时的 Node.js 版本与你系统中运行的 Node.js 版本无关。



### 创建应用

- 创建项目

  ```shell
  mkdir my-electron-app && cd my-electron-app
  npm init
  ```

  - `entry point` 应为 `main.js`.
  - `author` 与 `description` 可为任意值，但对于[应用打包](https://www.electronjs.org/zh/docs/latest/tutorial/quick-start#package-and-distribute-your-application)是必填项。

  

  你的 `package.json` 文件应该像这样：

  ```json
  {  "name": "my-electron-app",  "version": "1.0.0",  "description": "Hello World!",  "main": "main.js",  "author": "Jane Doe",  "license": "MIT"}
  ```
  
- 将 electron 包安装到应用的开发依赖中。

  ```shell
  $ npm install --save-dev electron
  ```

  > 如果安装electron的速度很慢的话，可以同过修改`.npmrc`文件修改镜像地址。

- 启动项目

  ```shell
  {
    "scripts": {
      "start": "electron ."
    }
  }
  ```

  

### 运行主进程

任何 Electron 应用程序的入口都是 `main` 文件。

- 这个文件控制了**主进程**。
- 它运行在一个完整的Node.js环境中。
- 负责控制您应用的生命周期，显示原生界面，执行特殊操作并管理渲染器进程。



> 执行期间，Electron 将依据应用中 `package.json`配置下[`main`](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#main)字段中配置的值查找此文件。





### 创建页面

在可以为我们的应用创建窗口前，我们需要先创建加载进该窗口的内容。 内容可以是：

- 本地的HTML文件
- 远程URL



### 在窗口中打开页面

将已有页面加载进应用窗口中。 要做到这一点，你需要 两个Electron模块：

- [`app`](https://www.electronjs.org/zh/docs/latest/api/app) 模块，它控制应用程序的事件生命周期。
- [`BrowserWindow`](https://www.electronjs.org/zh/docs/latest/api/browser-window) 模块，它创建和管理应用程序 窗口。



因为主进程运行着Node.js，可以在文件头部将他们导入作为[公共JS](https://nodejs.org/docs/latest/api/modules.html#modules_modules_commonjs_modules)模块：

```js
const { app, BrowserWindow } = require('electron')
```



然后，添加一个`createWindow()`方法来将`index.html`加载进一个新的`BrowserWindow`实例。

```js
function createWindow () {  
  const win = new BrowserWindow({    
    width: 800,    
    height: 600  
  })
  win.loadFile('index.html')
}
```



> 在 Electron 中，只有在 `app` 模块的 [`ready`](https://www.electronjs.org/zh/docs/latest/api/app#event-ready) 事件被激发后才能创建浏览器窗口。 您可以通过使用 [`app.whenReady()`](https://www.electronjs.org/zh/docs/latest/api/app#appwhenready) API来监听此事件。 在`whenReady()`成功后调用`createWindow()`。



```js
app.whenReady().then(() => {
  createWindow()
})
```





### 预加载脚本

> 预加载（preload）脚本包含了那些执行于渲染器进程中，且先于网页内容开始加载的代码 。



在主进程通过Node的全局 `process` 对象访问这个信息是微不足道的。 然而，你不能直接在主进程中编辑DOM，因为它无法访问渲染器 `文档` 上下文。 它们存在于完全不同的进程！



> 这是将 **预加载** 脚本连接到渲染器时派上用场的地方。 预加载脚本在渲染器进程加载之前加载，并有权访问两个 渲染器全局 (例如 `window` 和 `document`) 和 Node.js 环境。



>  可以通过预加载脚本可以讲node环境下的数据传入到渲染进程中去？

虽然预加载脚本与其所附加的渲染器在全局共享着一个 `window` ，但您并不能从中直接附加任何变数到 `window` 之中，因为 [`contextIsolation`](https://www.electronjs.org/zh/docs/latest/tutorial/context-isolation) 默认是true。

语境隔离（Context Isolation）意味着预加载脚本与渲染器的主要运行环境是隔离开来的，以避免泄漏任何具特权的 API 到您的网页内容代码中。



**取而代之，我们將使用 [`contextBridge`](https://www.electronjs.org/zh/docs/latest/api/context-bridge) 模块来安全地实现交互：**

`preload.js`

```js
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('myAPI', {
  desktop: true
})
```

`renderer.js`

```js
console.log(window.myAPI)
// => { desktop: true }
```







## 多进程模型[#](https://www.electronjs.org/zh/docs/latest/tutorial/process-model#多进程模型)

为了解决这个问题，Chrome 团队决定让每个标签页在自己的进程中渲染， 从而限制了一个网页上的有误或恶意代码可能导致的对整个应用程序造成的伤害。 然后用单个浏览器进程控制这些標籤頁进程，以及整个应用程序的生命周期。 下方来自 [Chrome 漫画](https://www.google.com/googlebooks/chrome/) 的图表可视化了此模型：

![Chrome的多进程架构](image/chrome-processes-0506d3984ec81aa39985a95e7a29fbb8.png)

Electron 应用程序的结构非常相似。 作为应用开发者，您控制着两种类型的进程：**主进程和渲染器**。 这些类似于上面概述的 Chrome 自己的浏览器和其渲染器进程。



- 主进程

每个 Electron 应用都有一个单一的主进程，作为应用程序的入口点。 主进程在 Node.js 环境中运行，这意味着它具有 `require` 模块和使用所有 Node.js API 的能力。



- 窗口管理

  主进程的主要目的是使用 [`BrowserWindow`](https://www.electronjs.org/zh/docs/latest/api/browser-window) 模块创建和管理应用程序窗口。

  `BrowserWindow` 类的每个实例创建一个应用程序窗口，且在单独的渲染器进程中加载一个网页。 您可从主进程用 window 的 [`webContent`](https://www.electronjs.org/zh/docs/latest/api/web-contents) 对象与网页内容进行交互。

  ```js
  const { BrowserWindow } = require('electron')
  
  const win = new BrowserWindow({ width: 800, height: 1500 })
  win.loadURL('https://github.com')
  
  const contents = win.webContents
  console.log(contents)
  ```

  - 由于 `BrowserWindow` 模块是一个 [`EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter)， 所以您也可以为各种用户事件 ( 例如，最小化 或 最大化您的窗口 ) 添加处理程序。
  - 当一个 `BrowserWindow` 实例被销毁时，与其相应的渲染器进程也会被终止。





- 渲染器进程
  - 每个 Electron 应用都会为每个打开的 `BrowserWindow` ( 与每个网页嵌入 ) 生成一个单独的渲染器进程。 洽如其名，渲染器负责 *渲染* 网页内容。 所以实际上，运行于渲染器进程中的代码是须遵照网页标准的 (至少就目前使用的 Chromium 而言是如此) 。
  - 因此，一个浏览器窗口中的所有的用户界面和应用功能，都应与您在网页开发上使用相同的工具和规范来进行攥写。
  - 这也意味着渲染器无权直接访问 `require` 或其他 Node.js API。 为了在渲染器中直接包含 NPM 模块，您必须使用与在 web 开发時相同的打包工具 (例如 `webpack` 或 `parcel`)		






### 应用程序生命周期

  

主进程还能通过 Electron 的 [`app`](https://www.electronjs.org/zh/docs/latest/api/app) 模块来控制您应用程序的生命周期。 该模块提供了一整套的事件和方法，可以使你添加自定义的应用程序行为 ( 例如：以编程方式退出您的应用程序、修改程序坞或显示关于面板 ) 。






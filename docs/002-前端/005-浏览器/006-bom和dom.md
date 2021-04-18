# 浏览器环境下的三大部分
1. ECMAScript
2. DOM
3. BOM

# ECMAScript
1. ECMAScript是一个标准，JS只是它的一个实现，其他实现包括ActionScript。
2. ECMAScript可以为不同种类的宿主环境提供核心的脚本编程能力，即ECMAScript不与具体的宿主环境相绑定，如JS的宿主环境是浏览器，AS的宿主环境是Flash。
3. ECMAScript描述了以下内容：语法、类型、语句、关键字、保留字、运算符、对象。

# DOM（文档对象模型）
1. DOM是 HTML 和 XML 的应用程序接口（API）。

# BOM（浏览器对象模型）
1. BOM主要处理浏览器窗口和框架，不过通常浏览器特定的 JavaScript 扩展都被看做 BOM 的一部分。
2. javacsript是通过访问BOM（Browser Object Model）对象来访问、控制、修改客户端(浏览器)。

# DOM和BOM的区别
1. DOM描述了处理网页内容的方法和接口，BOM描述了与浏览器进行交互的方法和接口。

# Window
1. 即是js里面的global对象，也是提供访问BOM和DOM接口的对象。包括
  - document：操作文档
  - location： 与浏览器地址有关的操作，获取href,portocol,hash,search等，
  - navigator： 浏览器信息，在检测浏览器和操作系统时有用
  - screen： 获取屏幕的尺寸信息
  - history： 浏览器历史相关
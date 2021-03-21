> application

```js
  constructor(options) {
    super();
    options = options || {};
    this.proxy = options.proxy || false;
    this.subdomainOffset = options.subdomainOffset || 2;
    this.proxyIpHeader = options.proxyIpHeader || 'X-Forwarded-For';
    this.maxIpsCount = options.maxIpsCount || 0;
    this.env = options.env || process.env.NODE_ENV || 'development';
    if (options.keys) this.keys = options.keys;
     
    // 保存应用级中间件
    this.middleware = []; 
    // 请求上下文，继承全局的context
    this.context = Object.create(context);
    // request对象，继承全局的request
    this.request = Object.create(request);
    // response对象，继承全局的response
    this.response = Object.create(response);
    // util.inspect.custom support for node 6+
    /* istanbul ignore else */
    if (util.inspect.custom) {
      this[util.inspect.custom] = this.inspect;
    }
  }


  listen(...args) {
    debug('listen');
    // 调用nodejs原生的api创建服务
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }

  callback() {
    // 将所有的中间件链式调用
    const fn = compose(this.middleware);

    if (!this.listenerCount('error')) this.on('error', this.onerror);

    const handleRequest = (req, res) => {
      // 创建请求上下文
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  }
```

中间件的调用是根据middleware调用的， 每一个中间件是使用`async-await`函数定义的。这函数同步执行的部分按入栈顺序先进先出， 异步执行部分是先进后出。实现的原理是第一个`async`的`promise`的状态依赖下一个`async`的`promise`的状态。大概的执行过程如下：

```js
async function middleware2() {
  console.log('middleware 2')
  await Promise.resolve(middleware3())
  console.log('middleware 2 ===')
}

async function middleware3() {
  console.log('middleware 3')
  await Promise.resolve((async function () {
    await new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })
  })())
  console.log('middleware 3 ===')
}

Promise.resolve((async function () {
  console.log('middleware 1')
  await Promise.resolve(middleware2())
  console.log('middleware 1 ===')
})()) 

// 输出结果
// middleware 1
// middleware 2
// middleware 3
// middleware 1 ===
// middleware 2 ===
// middleware 3 ===
```



> context

代理了`response`和`request`上的一些属性和方法。

```js
delegate(proto, 'response')
  .method('attachment')
  .method('redirect')
  .method('remove')
  .method('vary')
  .method('has')
  .method('set')
  .method('append')
  .method('flushHeaders')
  .access('status')
  .access('message')
  .access('body')
  .access('length')
  .access('type')
  .access('lastModified')
  .access('etag')
  .getter('headerSent')
  .getter('writable');

delegate(proto, 'request')
  .method('acceptsLanguages')
  .method('acceptsEncodings')
  .method('acceptsCharsets')
  .method('accepts')
  .method('get')
  .method('is')
  .access('querystring')
  .access('idempotent')
  .access('socket')
  .access('search')
  .access('method')
  .access('query')
  .access('path')
  .access('url')
  .access('accept')
  .getter('origin')
  .getter('href')
  .getter('subdomains')
  .getter('protocol')
  .getter('host')
  .getter('hostname')
  .getter('URL')
  .getter('header')
  .getter('headers')
  .getter('secure')
  .getter('stale')
  .getter('fresh')
  .getter('ips')
  .getter('ip');
```





> request

基于原生请求`req`对象的一些封装。



> response

基于原生请求`res`对象的一些封装。
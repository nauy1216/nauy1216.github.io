- https://segmentfault.com/a/1190000037525337

# 创建saga中间件
执行`sagaMiddlewareFactory`创建`sagaMiddleware`。

```js
export default function sagaMiddlewareFactory({ context = {}, channel = stdChannel(), sagaMonitor, ...options } = {}) {
  let boundRunSaga

  // 返回的中间件供redux调用
  function sagaMiddleware({ getState, dispatch }) {
    // 1. 在sagaMiddleware.run里面会调用boundRunSaga
    // 2. 因为boundRunSaga会在这里绑定参数， 所以在sagaMiddleware.run必须在后面调用
    boundRunSaga = runSaga.bind(null, {
      ...options,
      context,
      channel,
      dispatch,
      getState,
      sagaMonitor,
    })

    return next => action => {
      // next是redux的dispatch
      // dispatch
      if (sagaMonitor && sagaMonitor.actionDispatched) {
        sagaMonitor.actionDispatched(action)
      }

      // 0. 先执行一次redux dispatch
      const result = next(action) // hit reducers
      // 1. 输入一个action，执行对应的saga逻辑，在saga内部可以修改rudex state需要使用put
      // 2. 所以当在saga或者reducer内同时处理了同一个action时，两个地方都可能会修改state
      
      channel.put(action)
      return result
    }
  }

  sagaMiddleware.run = (...args) => {
    return boundRunSaga(...args)
  }

  sagaMiddleware.setContext = props => {
    assignWithSymbols(context, props)
  }

  return sagaMiddleware
}
```

- runSaga做了什么？
- stdChannel是什么？

# runSaga
1. 第一个参数是在`sagaMiddleware`中绑定的，第二个以后的参数是从启动saga时从`run`传入进来的。
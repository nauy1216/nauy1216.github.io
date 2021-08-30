# createStore
```js
function createStore(
  reducer, 
  preloadedState, 
  enhancer
) {
  return {
    dispatch: dispatch,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable
  }
}
```

# combineReducers
用于将多个reducer合并成一个。简单版的实现。
```js
function combineReducers(reducers) {
  return function combination(state, action) {
    const newState = {}
    let hasChange = false
    Object.keys(reducers).forEach(key => {
      newState[key] = reducers[key](state[key], action)
      if (newState[key] !== state[key]) {
        hasChange = true
      }
    })
    return hasChange ? newState : state
  }
}
```
# compose
将多个方法合并成一个，执行的时候是串连执行。上一个函数的执行结果作为下一个函数的参数。
也是所谓的洋葱模型。
```js
function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args))
  )
}

var a = [
  (v) => {
    console.log('a')
    return v + 1
  },
  (v) => {
    console.log('b')
    return v + 1
  },
  (v) => {
    console.log('c')
    return v + 1
  }
].reduce(
  (a, b) =>
    (...args) =>
      a(b(...args))
)(1)
console.log(a)
// c
// b
// a
// 4
```

# applyMiddleware
```ts
export default function applyMiddleware(
  ...middlewares: Middleware[]
): StoreEnhancer<any> {
  return (createStore: StoreEnhancerStoreCreator) =>
    <S, A extends AnyAction>(
      reducer: Reducer<S, A>,
      preloadedState?: PreloadedState<S>
    ) => {
      // 创建store对象
      const store = createStore(reducer, preloadedState)
      let dispatch: Dispatch = () => {
        throw new Error(
          'Dispatching while constructing your middleware is not allowed. ' +
            'Other middleware would not be applied to this dispatch.'
        )
      }

      const middlewareAPI: MiddlewareAPI = {
        getState: store.getState,
        dispatch: (action, ...args) => dispatch(action, ...args)
      }
      const chain = middlewares.map(middleware => middleware(middlewareAPI))
      // 通过中间来增强dispatch的功能
      dispatch = compose<typeof dispatch>(...chain)(store.dispatch)

      return {
        ...store,
        dispatch
      }
    }
}

```

# bindActionCreators
```js
function bindActionCreator<A extends AnyAction = AnyAction>(
  actionCreator: ActionCreator<A>,
  dispatch: Dispatch
) {
  return function (this: any, ...args: any[]) {
    return dispatch(actionCreator.apply(this, args))
  }
}
```
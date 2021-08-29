# 【版本一】redux、react-redux
### 定义store.ts

1. 通过createStore创建store对象
2. 定义reducer

```ts
import {} from 'react-redux';
import { Action, createStore } from 'redux';

const initState = {
  count: 0
};

export type RootState = typeof initState;
const store = createStore(function reducer(state: RootState = initState, action: Action<any>) {
  const copy = { ...state };
  switch (action.type) {
    case 'ADD': {
      copy.count++;
      return copy;
    }
    case 'incr': {
      copy.count--;
      return copy;
    }
  }
  return state;
});

export default store;

```

### 在应用根节点使用Provider
```js
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import { renderRoutes } from './router/index';
import { routes, basename } from './router/config';
import './App.css';
import { Provider as StoreProvider } from 'react-redux';
import store from './store/store1';

export default function App() {
  return (
    <StoreProvider store={store}>
      <BrowserRouter basename={basename}>{renderRoutes(routes)}</BrowserRouter>
    </StoreProvider>
  );
}

```

### 使用connect组件将store上的state和dispatch注入到组件的props上
```ts
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../../store/store1/index';

function mapStateToProps(state: RootState) {
  return {
    count: state.count
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    add: () =>
      dispatch({
        type: 'ADD'
      })
  };
}
type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;
class Login extends React.Component<Props> {
  render() {
    return (
      <div>
        Login
        <button onClick={this.props.add}>{this.props.count}</button>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

```

> 上面的使用是没有进行封装过的

# 【版本二】redux、react-redux

1. 对dispatch action的过程进行封装

### store.ts
```ts
import {} from 'react-redux';
import { Action, createStore } from 'redux';

const initState = {
  count: 0
};

export type RootState = typeof initState;

function reducer(state: RootState = initState, action: Action<any>) {
  const copy = { ...state };
  switch (action.type) {
    case 'ADD': {
      copy.count++;
      return copy;
    }
    case 'incr': {
      copy.count--;
      return copy;
    }
  }
  return state;
}

const store = createStore(reducer);

export function createActionFn(type: string) {
  return function createAction(data: any) {
    return store.dispatch({
      type,
      data
    });
  };
}

export const addCount = createActionFn('ADD');

export default store;

```

### Login.ts
```ts
import React from 'react';
import { connect } from 'react-redux';
import { RootState, addCount } from '../../store/store1/index';

function mapStateToProps(state: RootState) {
  return {
    count: state.count
  };
}

function mapDispatchToProps() {
  return {
    add: addCount
  };
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;
class Login extends React.Component<Props> {
  render() {
    return (
      <div>
        Login
        <button onClick={this.props.add}>{this.props.count}</button>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

```


# 【版本三】redux、react-redux

1. 在createStore中对reducer进行分发
2. 将action和对应的reducer进行绑定

### store.ts

```ts
import { Action, createStore } from 'redux';

const initState = {
  count: 0
};

export type RootState = typeof initState;

interface ActionData<T> extends Action<string> {
  data: T;
  reducer?: ReducerFunc<T>;
}

type ReducerFunc<T> = (state: RootState, action: ActionData<T>) => RootState;

function reducer(state: RootState = initState, action: ActionData<any>) {
  if (action.reducer) {
    return action.reducer(state, action);
  }
  return state;
}

const store = createStore(reducer);

export function createActionWithReducer<T>(type: string, reducer: ReducerFunc<T>) {
  return function createAction(data: T) {
    return store.dispatch({
      type,
      data,
      reducer
    });
  };
}

export const addCount = createActionWithReducer('ADD', function (state: RootState, action: ActionData<number>) {
  const copy = { ...state };
  copy.count += action.data;
  return copy;
});

export const incrCount = createActionWithReducer('INCR', function (state: RootState, action: ActionData<number>) {
  const copy = { ...state };
  copy.count += action.data;
  return copy;
});

export default store;

```

### Login.ts
```ts
import React from 'react';
import { connect } from 'react-redux';
import { RootState, addCount, incrCount } from '../../store/store1/index';

function mapStateToProps(state: RootState) {
  return {
    count: state.count
  };
}

function mapDispatchToProps() {
  return {
    addCount,
    incrCount
  };
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const Child = connect(mapStateToProps)(
  class _Child extends React.Component<ReturnType<typeof mapStateToProps>> {
    render() {
      return <div>Child: {this.props.count}</div>;
    }
  }
);

class Login extends React.Component<Props> {
  render() {
    return (
      <div>
        <Child />
        {this.props.count}
        <button onClick={() => this.props.addCount(1)}>+1</button>
        <button onClick={() => this.props.incrCount(-2)}>-1</button>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

```

# 【版本四】redux、react-redux
1. 支持异步处理
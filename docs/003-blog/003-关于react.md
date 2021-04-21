### ReactDOM.findDOMNode
### Consumer和Provider反着用？
> 只有当组件所处的树中没有匹配到 Provider 时，其 defaultValue 参数才会生效。这有助于在不使用 Provider 包装组件的情况下对组件进行测试。注意：将 undefined 传递给 Provider 的 value 时，消费组件的 defaultValue 不会生效。

```js
import * as React from 'react';

export type SizeType = 'small' | 'middle' | 'large' | undefined;

const SizeContext = React.createContext<SizeType>(undefined);

export interface SizeContextProps {
  size?: SizeType;
}

export const SizeContextProvider: React.FC<SizeContextProps> = ({ children, size }) => (
  <SizeContext.Consumer>
    {originSize => (
      <SizeContext.Provider value={size || originSize}>{children}</SizeContext.Provider>
    )}
  </SizeContext.Consumer>
);

export default SizeContext;
```

### classnames
### omit.js

### 根据数组的每一项类型的生成的联合类型
```ts
const ClearableInputType = tuple('text', 'input');
typeof ClearableInputType[number]
```

### React.createContext()的第二个参数

### react-redux

### react-router-cache-route
路由缓存
### @loadable/component

### 状态管理方案
- @rematch/core
- redux-saga
- react-redux
- react-thunk 
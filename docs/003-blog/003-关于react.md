# 一、开发工具
1. react devtools
    1. github下载插件
    2. 安装插件
    3. 在开发环境下图标是红色的， 生产环境下是蓝色的
    4. 当打开react17项目时控制台报错，原因是要安装4.0版本的devtool 解决办法参考https://blog.csdn.net/Leo_xian/article/details/112899961


2. Redux DevTools
    1. 下载redux-devtools, https://github.com/reduxjs/redux-devtools
    2. 打包
    3. 修改代码

# 二、路由
### 文档
- http://react-guide.github.io/react-router-cn/docs/API.html
- https://zhuanlan.zhihu.com/p/68838182
### react-router-cache-route
路由缓存

### 路由配置
- router-config

### 异步加载
- @loadable/component
- react-loadable

# 三、 状态管理方案
### 文档
- https://github.com/xgrommx/awesome-redux
- https://www.redux.org.cn/docs/api/index.html

- @rematch/core
- redux-saga
- react-redux
- react-thunk 
- redux-alita


# 四、其他
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

### 根据数组的每一项类型的生成的联合类型
```ts
const ClearableInputType = tuple('text', 'input');
typeof ClearableInputType[number]
```

### omit.js

### React.createContext()的第二个参数

### less.js
1. 切换主题


# classnames
className生成

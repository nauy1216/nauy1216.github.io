### 什么是 Context？

Context 提供了一种在组件之间共享状态的方式，而不必显式地通过组件树的逐层传递 props, 避免了通过中间元素层层传递 props。
类似于 vue 的状态管理`vuex`。

### 何时使用 Context？

Context 设计目的是为了共享那些对于一个组件树而言是“`全局`”的数据，例如当前认证的用户、主题或首选语言。

有的时候在组件树中很多不同层级的组件需要访问同样的一批数据。
Context 能让你将这些数据向组件树下所有的组件进行“广播”，所有的组件都能访问到这些数据，也能访问到后续的数据更新。
使用 context 的通用的场景包括管理当前的 locale，theme，或者一些缓存数据。

### api 使用

##### `React.createContext()`

参数接受一个默认值, 返回一个`Context`对象。

```js
const MyContext = React.createContext(defaultValue);
```

创建一个 Context 对象。当 React 渲染一个订阅了这个 Context 对象的组件，
这个组件会从组件树中离自身最近的那个匹配的 Provider 中读取到当前的 context 值。

只有当组件所处的树中没有匹配到 Provider 时，其 defaultValue 参数才会生效。

##### `Context.Provider`

个 Context 对象都会返回一个 Provider React 组件，它允许消费组件订阅 context 的变化。

```jsx
<MyContext.Provider value={/* 某个值 */}>
```

- Provider 接收一个 value 属性，传递给消费组件。一个 Provider 可以和多个消费组件有对应关系。多个 Provider 也可以嵌套使用，里层的会覆盖外层的数据。
- 当 Provider 的 value 值发生变化时，它内部的所有消费组件都会重新渲染。Provider 及其内部 consumer 组件都不受制于 shouldComponentUpdate 函数，因此当 consumer 组件在其祖先组件退出更新的情况下也能更新。

##### `Class.contextType`

挂载在 class 上的 contextType 属性会被重赋值为一个由 React.createContext() 创建的 Context 对象。
这能让你使用 this.context 来消费最近 Context 上的那个值。你可以在任何生命周期中访问到它，包括 render 函数中。
看下面的例子，区分`Class.contextType`和`Context.Consumer`的用法。

- 在父组件使用时是一样的，都需要创建 contxt 对象，并且在父组件中使用`Context.Provider`。
- `Context.Provider`负责提供数据，但是在它们消费`context`的数据方式是不一样的。
  使用`Class.contextType`时, 只要将`context`挂在 class 的静态属性`contextType`上, 然后在组件内部就可以通过`this.context`的方式使用了。
  而使用`Context.Consumer`时是作为一个组件使用的，子组件通过定义的函数参数的方式传入。
- `Class.contextType`的优点是使用方便，缺点是只能接受单一的`content`。

孙子组件使用`Context.Consumer`。

```js
import React, { Component, createContext } from "react";

const BatteryContext = createContext();

//声明一个孙组件
class Leaf extends Component {
  render() {
    return (
      <BatteryContext.Consumer>
        {(battery) => <h1>Battery : {battery}</h1>}
      </BatteryContext.Consumer>
    );
  }
}

//声明一个子组件
class Middle extends Component {
  render() {
    return <Leaf />;
  }
}

class App extends Component {
  render() {
    return (
      <BatteryContext.Provider value={60}>
        <Middle />
      </BatteryContext.Provider>
    );
  }
}

export default App;
```

孙子组件使用`Context.Consumer`。

```js
import React, { Component, createContext } from "react";

const BatteryContext = createContext();

//声明一个孙组件
class Leaf extends Component {
  static contextType = BatteryContext;
  render() {
    const battery = this.context;
    return <h1>Battery : {battery}</h1>;
  }
}

//声明一个子组件
class Middle extends Component {
  render() {
    return <Leaf />;
  }
}

class App extends Component {
  state = {
    battery: 60,
  };
  render() {
    const { battery } = this.state;
    return (
      <BatteryContext.Provider value={battery}>
        <button
          type="button"
          onClick={() => this.setState({ battery: battery - 1 })}
        >
          减减
        </button>
        <Middle />
      </BatteryContext.Provider>
    );
  }
}

export default App;
```

##### `Context.Consumer`

```jsx
<MyContext.Consumer>
  {value => /* 基于 context 值进行渲染*/}
</MyContext.Consumer>
```

这需要函数作为子元素（function as a child）这种做法。
这个函数接收当前的 context 值，返回一个 React 节点。
传递给函数的 value 值等同于往上组件树离这个 context 最近的 Provider 提供的 value 值。
如果没有对应的 Provider，value 参数等同于传递给 createContext() 的 defaultValue。

##### `Context.displayName `

context 对象接受一个名为 displayName 的 property，类型为字符串。
React DevTools 使用该字符串来确定 context 要显示的内容。

```jsx
const MyContext = React.createContext(/* some value */);
MyContext.displayName = 'MyDisplayName';

<MyContext.Provider> // "MyDisplayName.Provider" 在 DevTools 中
<MyContext.Consumer> // "MyDisplayName.Consumer" 在 DevTools 中
```

### 在嵌套组件中更新 Context

从一个在组件树中嵌套很深的组件中更新 context 是很有必要的。
在这种场景下，你可以通过 context 传递一个函数，使得 consumers 组件更新 context。
context 将更新 context 的操作封装后提供给`consumer`组件。

```js
// 确保传递给 createContext 的默认值数据结构是调用的组件（consumers）所能匹配的！
export const ThemeContext = React.createContext({
  theme: themes.dark,
  toggleTheme: () => {},
});

function ThemeTogglerButton() {
  // Theme Toggler 按钮不仅仅只获取 theme 值，它也从 context 中获取到一个 toggleTheme 函数
  return (
    <ThemeContext.Consumer>
      {({ theme, toggleTheme }) => (
        <button
          onClick={toggleTheme}
          style={{ backgroundColor: theme.background }}
        >
          Toggle Theme
        </button>
      )}
    </ThemeContext.Consumer>
  );
}
```

### 消费多个 Context

了确保 context 快速进行重渲染，React 需要使每一个 consumers 组件的 context 在组件树中成为一个单独的节点。

```jsx
class App extends React.Component {
  render() {
    const { signedInUser, theme } = this.props;

    // 提供初始 context 值的 App 组件
    return (
      <ThemeContext.Provider value={theme}>
        <UserContext.Provider value={signedInUser}>
          <Layout />
        </UserContext.Provider>
      </ThemeContext.Provider>
    );
  }
}
```

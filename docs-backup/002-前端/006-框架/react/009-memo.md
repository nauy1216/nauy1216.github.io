### memo

> React v16.6.0 出了一些新的包装函数(wrapped functions)，一种用于函数组件 `PureComponent / shouldComponentUpdate` 形式的 React.memo()。

> React.memo()是一个高阶函数，它与 React.PureComponent 类似，但是一个函数组件而非一个类。

```jsx
import React from "react";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        date: new Date(),
      });
    }, 1000);
  }

  render() {
    return (
      <div>
        <Child seconds={1} />
        <div>{this.state.date.toString()}</div>
      </div>
    );
  }
}
```

现在有一个显示时间的组件,每一秒都会重新渲染一次，对于 Child 组件我们肯定不希望也跟着渲染，所以 Child 需要用到`PureComponent`。

```jsx
class Child extends React.PureComponent {
  render() {
    console.log("I am rendering");
    return <div>I am update every {this.props.seconds} seconds</div>;
  }
}
```

##### 使用`React.memo()`解决

```jsx
function Child({ seconds }) {
  console.log("I am rendering");
  return <div>I am update every {seconds} seconds</div>;
}
export default React.memo(Child);
```

> React.memo()可接受 2 个参数，第一个参数为纯函数的组件，第二个参数用于对比 props 控制是否刷新，与 shouldComponentUpdate()功能类似。

```jsx
import React from "react";

function Child({ seconds }) {
  console.log("I am rendering");
  return <div>I am update every {seconds} seconds</div>;
}

function areEqual(prevProps, nextProps) {
  if (prevProps.seconds === nextProps.seconds) {
    return true;
  } else {
    return false;
  }
}
export default React.memo(Child, areEqual);
```

### 与`React.PureComponent`

`React.PureComponent` 和 `React.Component` 类似，都是定义一个组件类。
不同是 `React.Component` 没有实现 `shouldComponentUpdate()`，而 `React.PureComponent` 通过 `props` 和 `state` 的*浅比较*实现了。

_如果组件的 props 和 state 相同时，render 的内容也一致，那么就可以使用 React.PureComponent 了,这样可以提高组件的性能。_

> React.memo 是一个高阶组件，类似于 React.PureComponent，不同于 React.memo 是 function 组件，React.PureComponent 是 class 组件。

这种方式依然是一种对象的浅比较，有复杂对象时无法 render。在 React.memo 中可以自定义其比较方法的实现。
memo 接收两个参数，一个是组件，一个是函数。这个函数就是定义了 memo 需不需要 render 的钩子。
比较前一次的 props 跟当前 props，返回 true 表示不需要 render。

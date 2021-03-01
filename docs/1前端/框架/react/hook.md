### 什么是 hook？

Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。
如果不使用 hook 函数时组件是没有状态的。

> 没有破坏性。完全可选，100%向后兼容。

_使用 hook 的动机。_

- 在组件之间复用状态逻辑很难。hook 为共享状态逻辑提供更好的原生途径。
  _Hook 使你在无需修改组件结构的情况下复用状态逻辑。 这使得在组件间或社区内共享 Hook 变得更便捷。_

- 复杂组件变得难以理解。
  我们经常维护一些组件，组件起初很简单，但是逐渐会被状态逻辑和副作用充斥。每个生命周期常常包含一些不相关的逻辑。例如，组件常常在 componentDidMount 和 componentDidUpdate 中获取数据。但是，同一个 componentDidMount 中可能也包含很多其它的逻辑，如设置事件监听，而之后需在 componentWillUnmount 中清除。相互关联且需要对照修改的代码被进行了拆分，而完全不相关的代码却在同一个方法中组合在一起。如此很容易产生 bug，并且导致逻辑不一致。
  _Hook 将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据），而并非强制按照生命周期划分。_

- class 带来的问题。
  - this 的绑定问题。
  - class 不能很好的压缩，并且会使热重载出现不稳定的情况。

### 注意事项

- 保证每次渲染时 hook 的调用顺序是不变的。
- Hook 不能在 class 组件中使用。
- 只能在函数最外层调用 Hook。不要在循环、条件判断或者子函数中调用。
- 只能在 React 的函数组件中调用 Hook。不要在其他 JavaScript 函数中调用。还有一个地方可以调用 Hook —— 就是自定义的 Hook 中

### `useState()`

通过在函数组件里调用它来给组件添加一些内部 state。React 会在重复渲染时保留这个 state。useState 会返回一对值：当前状态和一个让你更新它的函数，你可以在事件处理函数中或其他一些地方调用这个函数。它类似 class 组件的 this.setState，但是它不会把新的 state 和旧的 state 进行合并。

```jsx
import React, { useState } from "react";

function Example() {
  // 声明一个新的叫做 “count” 的 state 变量
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

### `useEffect()`

你之前可能已经在 React 组件中执行过数据获取、订阅或者手动修改过 DOM。我们统一把这些操作称为“副作用”，或者简称为“作用”。
useEffect 就是一个 Effect Hook，给函数组件增加了操作副作用的能力。它跟 class 组件中的 `componentDidMount、componentDidUpdate 和 componentWillUnmount `具有相同的用途，只不过被合并成了一个 API。

```jsx
import React, { useState, useEffect } from "react";

function Example() {
  const [count, setCount] = useState(0);

  // 相当于 componentDidMount 和 componentDidUpdate:
  useEffect(() => {
    // 使用浏览器的 API 更新页面标题
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

##### `特点`

- 当你调用 useEffect 时，就是在告诉 React 在完成对 DOM 的更改后运行你的“副作用”函数。

- 由于副作用函数是在组件内声明的，所以它们可以访问到组件的 props 和 state。默认情况下，React 会在每次渲染后调用副作用函数 —— 包括第一次渲染的时候。

- 副作用函数还可以通过返回一个函数来指定如何“清除”副作用。

```jsx
import React, { useState, useEffect } from "react";

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  //  React 会在组件销毁时取消对 ChatAPI 的订阅，然后在后续渲染时重新执行副作用函数。
  // （如果传给 ChatAPI 的 props.friend.id 没有变化，你也可以告诉 React 跳过重新订阅。）
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return "Loading...";
  }
  return isOnline ? "Online" : "Offline";
}
```

### `自定义 hook`

有时候我们会想要在组件之间重用一些状态逻辑。目前为止，有两种主流方案来解决这个问题：高阶组件和 render props。
自定义 Hook 可以让你在不增加组件的情况下达到同样的目的。

```jsx
import React, { useState, useEffect } from "react";

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

### `useMemo`

> useMemo 是针对一个函数，是否多次执行。
> useMemo 主要用来解决使用 React hooks 产生的无用渲染的性能问题。
> 在方法函数，由于不能使用 shouldComponentUpdate 处理性能问题，react hooks 新增了 useMemo

##### 使用

> 如果 `useMemo(fn, arr)` 第二个参数匹配，并且其值发生改变，才会多次执行执行，否则只执行一次，如果为空数组[]，fn 只执行一次。

举例说明：

第一次进来时，控制台显示 rich child，当无限点击按钮时，控制台不会打印 rich child。
但是当改变 props.name 为 props.isChild 时，每点击一次按钮，控制台就会打印一次 rich child。

```jsx
export default () => {
  let [isChild, setChild] = useState(false);

  return (
    <div>
      <Child isChild={isChild} name="child" />
      <button onClick={() => setChild(!isChild)}>改变Child</button>
    </div>
  );
};

let Child = (props) => {
  let getRichChild = () => {
    console.log("rich child");

    return "rich child";
  };

  // 使用了useMemo后，只要props.name没有发生变化就不会重复执行getRichChild
  let richChild = useMemo(() => {
    //执行相应的函数
    return getRichChild();
  }, [props.name]);

  return (
    <div>
      isChild: {props.isChild ? "true" : "false"}
      <br />
      {richChild}
    </div>
  );
};
```

##### 解决的问题？

解决了函数式组件内部逻辑函数不必要的重复执行, 通过`useMemo`的第二个参数来控制当那些数据改变后才会重复执行。

### `useCallback()`

##### 解决的问题？

在函数式组件内部给子组件绑定事件时, 每次重新渲染时都会绑定一个新的事件函数(因为每次更新组件函数时都会产生一个新的闭包),
从而导致子组件的不必要更新。使用`useCallback`解决了这个问题，`useCallback`会将事件处理函数缓存起来, 每次更新的时候都是绑定的同一个函数。

##### 使用方式

```jsx
import React, { useState, memo, useMemo, useCallback } from "react";

const Child = memo((props) => {
  console.log(props);

  return (
    <div>
      <input type="text" onChange={props.onChange} />
    </div>
  );
});

const Parent = () => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  const handleOnChange = useCallback((e) => {
    setText(e.target.value);
  }, []);

  return (
    <div>
      <div>count: {count}</div>
      <div>text: {text}</div>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        +1
      </button>
      <Child onChange={handleOnChange} />
    </div>
  );
};
```

> _对比 useMemo，useMemo 缓存的是一个值，useCallback 缓存的是一个函数。_

### `useRef()`

##### 作用

- 用来获取组件实例对象或者是 DOM 对象。

```jsx
import React, { useState, useEffect, useMemo, useRef } from "react";

export default function App(props) {
  const [count, setCount] = useState(0);

  const doubleCount = useMemo(() => {
    return 2 * count;
  }, [count]);

  const couterRef = useRef();

  useEffect(() => {
    document.title = `The value is ${count}`;
    console.log(couterRef.current);
  }, [count]);

  return (
    <>
      <button
        ref={couterRef}
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Count: {count}, double: {doubleCount}
      </button>
    </>
  );
}
```

- 除了传统的用法之外，它还可以“跨渲染周期”保存数据。

在一个组件中有什么东西可以跨渲染周期，也就是在组件被多次渲染之后依旧不变的属性？第一个想到的应该是 state。没错，一个组件的 state 可以在多次渲染之后依旧不变。但是，state 的问题在于一旦修改了它就会造成组件的重新渲染。
那么这个时候就可以使用 useRef 来跨越渲染周期存储数据，而且对它修改也不会引起组件渲染。

```jsx
import React, { useState, useEffect, useMemo, useRef } from "react";

export default function App(props) {
  const [count, setCount] = useState(0);

  const doubleCount = useMemo(() => {
    return 2 * count;
  }, [count]);

  // react将ref的缓存起来了
  const timerID = useRef();

  useEffect(() => {
    timerID.current = setInterval(() => {
      setCount((count) => count + 1);
    }, 1000);
  }, []);

  useEffect(() => {
    if (count > 10) {
      clearInterval(timerID.current);
    }
  });

  return (
    <>
      <button
        ref={couterRef}
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Count: {count}, double: {doubleCount}
      </button>
    </>
  );
}
```

### `useLayoutEffect()`

> 其函数签名与 useEffect 相同，但它会*在所有的 DOM 变更之后同步调用 effect*。可以使用它来读取 DOM 布局并同步触发重渲染。在浏览器执行绘制之前，useLayoutEffect 内部的更新计划将被同步刷新。

- `useEffect`和`useLayoutEffect`的区别？

`useEffect` 在渲染时是异步执行，并且要等到浏览器将所有变化渲染到屏幕后才会被执行。
`useLayoutEffect` 在渲染时是同步执行，其执行时机与 `componentDidMount`，`componentDidUpdate` 一致。

- 对于 useEffect 和 useLayoutEffect 哪一个与 componentDidMount，componentDidUpdate 的是等价的？

useLayoutEffect，因为从源码中调用的位置来看，useLayoutEffect 的 create 函数的调用位置、时机都和 componentDidMount，componentDidUpdate 一致，
且都是被 React 同步调用，都会阻塞浏览器渲染。

- useEffect 和 useLayoutEffect 哪一个与 componentWillUnmount 的是等价的？

同上，useLayoutEffect 的 detroy 函数的调用位置、时机与 componentWillUnmount 一致，且都是同步调用。
useEffect 的 detroy 函数从调用时机上来看，更像是 componentDidUnmount (注意 React 中并没有这个生命周期函数)。

- 为什么建议将修改 DOM 的操作里放到 useLayoutEffect 里，而不是 useEffect？

DOM 已经被修改，但但浏览器渲染线程依旧处于被阻塞阶段，所以还没有发生回流、重绘过程。由于内存中的 DOM 已经被修改，通过 useLayoutEffect 可以拿到最新的 DOM 节点，并且在此时对 DOM 进行样式上的修改，假设修改了元素的 height，这些修改会在步骤 11 和 react 做出的更改一起被一次性渲染到屏幕上，依旧只有一次回流、重绘的代价。

如果放在 useEffect 里，useEffect 的函数会在组件渲染到屏幕之后执行，此时对 DOM 进行修改，会触发浏览器再次进行回流、重绘，增加了性能上的损耗。

### `useReducer()`

> 尽管 useReducer 是扩展的 hook， 而 useState 是基本的 hook，但 useState 实际上执行的也是一个 useReducer。
> 这意味着 useReducer 是更原生的，你能在任何使用 useState 的地方都替换成使用 useReducer。

- 与`useState`一样都返回当前状态和一个改变状态的函数。
- 比`useState`更强大, 出了接受一个初始值作为第二个参数外， 还接受一个定义改变状态值逻辑的函数。

```jsx
function ShoppingList() {
  const inputRef = useRef();
  const [items, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'add':
        return [
          ...state,
          {
            id: state.length,
            name: action.name
          }
        ];
      default:
        return state;
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    dispatch({
      type: 'add',
      name: inputRef.current.value
    });
    inputRef.current.value = '';
  }

  return (
    // ... same ...
  );
}

```

- 任何使用`useState`的地方都可以使用`useReducer`代替

```jsx
function Test() {
  const [count, setCount] = useState(0)
  const [count, setCount] = useReducer((state, action) => {
    return action
  }, 0)


  return (
    // ...
  )
}
```

### useImperativeHandle

正常情况下 `ref` 是不能挂在到函数组件上的，因为函数组件没有实例，但是 `useImperativeHandle` 为我们提供了一个类似实例的东西。
它帮助我们通过 `useImperativeHandle` 的第 2 个参数，_所返回的对象的内容挂载到 父组件的 ref.current 上_。

_`forwardRef` 会创建一个 `React` 组件，这个组件能够将其接受的 `ref` 属性转发到其组件树下的另一个组件中。_

```jsx
import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
} from "react";

const TestRef = forwardRef((props, ref) => {
  // 将open方法暴露出去，父组件可以获取到。
  useImperativeHandle(ref, () => ({
    open() {
      console.log("open");
    },
  }));
});

function App() {
  const ref = useRef();
  useEffect(() => {
    // 这里获取的current对象就是，在TestRef中使用useImperativeHandle定义第二参数的返回值的。
    ref.current.open();
  }, []);

  return (
    <>
      <TestRef ref={ref}></TestRef>
    </>
  );
}
export default App;
```

### 总结

React Hook 让无狀态组件拥有了许多只有有狀态组件的能力，如自更新能力（setState，使用 useState），
访问 ref（使用 useRef 或 useImperativeMethods），
访问 context(使用 useContext)，使用更高级的 setState 设置（useReducer），
及进行类似生命周期的阶段性方法（useEffect 或 useLayoutEffect）。

当然还有一些 Hook，带来了一些新功能，如 useCallback，这是对事件句柄进行缓存，
useState 的第二个返回值是 dispatch，但是每次都是返回新的，使用 useCallback，可以让它使用上次的函数。
在虚拟 DOM 更新过程中，如果事件句柄相同，那么就不用每次都进行 removeEventListner 与 addEventListner。
最后就是 useMemo，取得上次缓存的数据，它可以说是 useCallback 的另一种形式。

- > useState： setState
- > useReducer：setState
- > useRef: ref
- > useImperativeMethods: ref
- > useContext: context
- > useCallback: 可以对 setState 的优化
- > useMemo: useCallback 的变形
- > useLayoutEffect: 类似 componentDidMount/Update, componentWillUnmount
- > useEffect: 类似于 setState(state, cb)中的 cb，总是在整个更新周期的最后才执行

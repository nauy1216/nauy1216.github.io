### 什么是 ref 转发？

Ref 转发是一项将 ref 自动地通过组件传递到其一子组件的技巧。
_Ref 转发是一个可选特性，其允许某些组件接收 ref，并将其向下传递（换句话说，“转发”它）给子组件。_

### API 使用

在下面的示例中，FancyButton 使用 React.forwardRef 来获取传递给它的 ref，然后转发到它渲染的 DOM button。
这样，使用 FancyButton 的组件可以获取底层 DOM 节点 button 的 ref ，并在必要时访问，就像其直接使用 DOM button 一样。

```jsx
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// 你可以直接获取 DOM button 的 ref：
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

### 原理

ref 不会透传下去, 这是因为 ref 不是 prop 属性,就像 key 一样，其被 React 进行了特殊处理。
所以通过`React.forwardRef`获取传给父组件的 ref, 将其传递给子组件。

### 在 DevTools 中显示自定义名称

- 如果你命名了渲染函数，DevTools 也将包含其名称（例如 “ForwardRef(myFunction)”）：

```jsx
const WrappedComponent = React.forwardRef(function myFunction(props, ref) {
  return <LogProps {...props} forwardedRef={ref} />;
});
```

- 设置函数的 `displayName` 属性来包含被包裹组件的名称。

```jsx
function logProps(Component) {
  class LogProps extends React.Component {
    // ...
  }

  function forwardRef(props, ref) {
    return <LogProps {...props} forwardedRef={ref} />;
  }

  // 在 DevTools 中为该组件提供一个更有用的显示名。
  // 例如 “ForwardRef(logProps(MyComponent))”
  const name = Component.displayName || Component.name;
  forwardRef.displayName = `logProps(${name})`;

  return React.forwardRef(forwardRef);
}
```

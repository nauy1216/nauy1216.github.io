[代码](https://stackblitz.com/edit/react-nbdump)

# 1、函数组件与 class 组件

```
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```



```
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```


### 框架
在函数fn内部（或间接的）调用fn，直到不满足条件为止。
```js
function fn(args1) {
    // 基线条件
    if (condition) {
        fn(args2)
    }
}
```
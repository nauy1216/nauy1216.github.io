
# this 指向
1. 谁调用函数 fn，this 就指向谁。this 的指向是动态的。
2. 如果是直接调用 fn, this 就指向全局对象或者是 undefined
3. 箭头函数内部没有 this, 所以箭头函数的 this 的指向和定义箭头函数时的外部函数的 this 指向是一致的。
4. 通过 new 创建对象时，this 指向的是创建的对象。如果构造函数返回一个对象，那么 this 将会指向这个对象。

# 思考：
-   改变 this 指向的方式？
    -   bind
    -   call
    -   apply
    -   箭头函数
-   什么时候不建议使用箭头函数？bind、call、apply 对箭头函数是否有效？
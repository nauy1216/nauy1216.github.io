- http://www.alloyteam.com/2016/02/generators-in-depth/
- https://segmentfault.com/a/1190000023652879
# 概念
- 语法上，首先可以把它理解成，Generator 函数是一个状态机，封装了多个内部状态。
- 执行 Generator 函数会返回一个遍历器对象，也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。
- 两个特征。
  - 一是，function关键字与函数名之间有一个星号；
  - 二是，函数体内部使用yield表达式，定义不同的内部状态（yield在英语里的意思就是“产出”）。
- 调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的遍历器对象。
```js
function* helloWorldGenerator() {
  console.log(1)
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator(); // 不打印 1
```


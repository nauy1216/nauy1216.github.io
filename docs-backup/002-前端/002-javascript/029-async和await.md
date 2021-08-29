# 特点
1. 优点
- 优势在于处理 then 的调用链，能够更清晰的写出代码。
2. 缺点
- 异常需要通过try/catch捕获
- 滥用可能会导致阻塞，比如并行的两个promise就应该用Promise.all。

# 示例1
```js
async function fn() {
    await 1
    console.log('1')
}
fn()
console.log('2')
// 2
// 1
```

# 示例2
```js
var a = 0
async function fn() {
    var b = a + await 10
    console.log(b)
}
a++
fn()
// 11
```
babel编译后：
```js
"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { 
    try { 
        var info = gen[key](arg); 
        var value = info.value; 
    } catch (error) { 
        reject(error); 
        return; 
    } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var a = 0;

function fn() {
  return _fn.apply(this, arguments);
}

function _fn() {
  _fn = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var b;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.t0 = a;
            _context.next = 3;
            return 10;

          case 3:
            _context.t1 = _context.sent;
            b = _context.t0 + _context.t1;
            console.log(b);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _fn.apply(this, arguments);
}

a++;
fn();
```
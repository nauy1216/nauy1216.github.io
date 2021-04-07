# 参考
- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
- https://blog.csdn.net/dennis_jiang/article/details/105389519

```js
// 先定义三个常量表示状态
var PENDING = "pending";
var FULFILLED = "fulfilled";
var REJECTED = "rejected";

function MyPromise(fn) {
  this.status = PENDING; // 初始状态为pending
  this.value = null; // 初始化value
  this.reason = null; // 初始化reason

  // 构造函数里面添加两个数组存储成功和失败的回调
  this.onFulfilledCallbacks = [];
  this.onRejectedCallbacks = [];

  // 存一下this,以便resolve和reject里面访问
  var that = this;
  // resolve方法参数是value
  function resolve(value) {
    if (that.status === PENDING) {
      that.status = FULFILLED;
      that.value = value;

      // resolve里面将所有成功的回调拿出来执行
      that.onFulfilledCallbacks.forEach((callback) => {
        callback(that.value);
      });
    }
  }

  // reject方法参数是reason
  function reject(reason) {
    if (that.status === PENDING) {
      that.status = REJECTED;
      that.reason = reason;

      // resolve里面将所有失败的回调拿出来执行
      that.onRejectedCallbacks.forEach((callback) => {
        callback(that.reason);
      });
    }
  }

  try {
    fn(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

function resolvePromise(promise, x, resolve, reject) {
  // 如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
  // 这是为了防止死循环
  if (promise === x) {
    return reject(
      new TypeError("The promise and the return value are the same")
    );
  }

  if (x instanceof MyPromise) {
    // 如果 x 为 Promise ，则使 promise 接受 x 的状态
    // 也就是继续执行x，如果执行的时候拿到一个y，还要继续解析y
    // 这个if跟下面判断then然后拿到执行其实重复了，可有可无
    x.then(function (y) {
      resolvePromise(promise, y, resolve, reject);
    }, reject);
  }
  // 如果 x 为对象或者函数
  else if (typeof x === "object" || typeof x === "function") {
    // 这个坑是跑测试的时候发现的，如果x是null，应该直接resolve
    if (x === null) {
      return resolve(x);
    }

    try {
      // 把 x.then 赋值给 then
      var then = x.then;
    } catch (error) {
      // 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
      return reject(error);
    }

    // 如果 then 是函数
    if (typeof then === "function") {
      var called = false;
      // 将 x 作为函数的作用域 this 调用之
      // 传递两个回调函数作为参数，第一个参数叫做 resolvePromise ，第二个参数叫做 rejectPromise
      // 名字重名了，我直接用匿名函数了
      try {
        then.call(
          x,
          // 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
          function (y) {
            // 如果 resolvePromise 和 rejectPromise 均被调用，
            // 或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
            // 实现这条需要前面加一个变量called
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject);
          },
          // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
          function (r) {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } catch (error) {
        // 如果调用 then 方法抛出了异常 e：
        // 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
        if (called) return;

        // 否则以 e 为据因拒绝 promise
        reject(error);
      }
    } else {
      // 如果 then 不是函数，以 x 为参数执行 promise
      resolve(x);
    }
  } else {
    // 如果 x 不为对象或者函数，以 x 为参数执行 promise
    resolve(x);
  }
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
  // 如果onFulfilled不是函数，给一个默认函数，返回value
  // 后面返回新promise的时候也做了onFulfilled的参数检查，这里可以删除，暂时保留是为了跟规范一一对应，看得更直观
  var realOnFulfilled = onFulfilled;
  if (typeof realOnFulfilled !== "function") {
    realOnFulfilled = function (value) {
      return value;
    };
  }

  // 如果onRejected不是函数，给一个默认函数，返回reason的Error
  // 后面返回新promise的时候也做了onRejected的参数检查，这里可以删除，暂时保留是为了跟规范一一对应，看得更直观
  var realOnRejected = onRejected;
  if (typeof realOnRejected !== "function") {
    realOnRejected = function (reason) {
      throw reason;
    };
  }

  var that = this; // 保存一下this

  if (this.status === FULFILLED) {
    var promise2 = new MyPromise(function (resolve, reject) {
      setTimeout(function () {
        try {
          if (typeof onFulfilled !== "function") {
            resolve(that.value);
          } else {
            var x = realOnFulfilled(that.value);
            resolvePromise(promise2, x, resolve, reject);
          }
        } catch (error) {
          reject(error);
        }
      }, 0);
    });

    return promise2;
  }

  if (this.status === REJECTED) {
    var promise2 = new MyPromise(function (resolve, reject) {
      setTimeout(function () {
        try {
          if (typeof onRejected !== "function") {
            reject(that.reason);
          } else {
            var x = realOnRejected(that.reason);
            resolvePromise(promise2, x, resolve, reject);
          }
        } catch (error) {
          reject(error);
        }
      }, 0);
    });

    return promise2;
  }

  // 如果还是PENDING状态，将回调保存下来
  if (this.status === PENDING) {
    var promise2 = new MyPromise(function (resolve, reject) {
      that.onFulfilledCallbacks.push(function () {
        setTimeout(function () {
          try {
            if (typeof onFulfilled !== "function") {
              resolve(that.value);
            } else {
              var x = realOnFulfilled(that.value);
              resolvePromise(promise2, x, resolve, reject);
            }
          } catch (error) {
            reject(error);
          }
        }, 0);
      });
      that.onRejectedCallbacks.push(function () {
        setTimeout(function () {
          try {
            if (typeof onRejected !== "function") {
              reject(that.reason);
            } else {
              var x = realOnRejected(that.reason);
              resolvePromise(promise2, x, resolve, reject);
            }
          } catch (error) {
            reject(error);
          }
        }, 0);
      });
    });

    return promise2;
  }
};

MyPromise.deferred = function () {
  var result = {};
  result.promise = new MyPromise(function (resolve, reject) {
    result.resolve = resolve;
    result.reject = reject;
  });

  return result;
};

MyPromise.resolve = function (parameter) {
  if (parameter instanceof MyPromise) {
    return parameter;
  }

  return new MyPromise(function (resolve) {
    resolve(parameter);
  });
};

MyPromise.reject = function (reason) {
  return new MyPromise(function (resolve, reject) {
    reject(reason);
  });
};

// 所有promise都被resolve
MyPromise.all = function (promiseList) {
  var resPromise = new MyPromise(function (resolve, reject) {
    var count = 0;
    var result = [];
    var length = promiseList.length;

    if (length === 0) {
      return resolve(result);
    }

    promiseList.forEach(function (promise, index) {
      MyPromise.resolve(promise).then(
        function (value) {
          count++;
          result[index] = value;
          if (count === length) {
            resolve(result);
          }
        },
        function (reason) {
          reject(reason);
        }
      );
    });
  });

  return resPromise;
};

// 任何一个promsie状态变化了即可
MyPromise.race = function (promiseList) {
  var resPromise = new MyPromise(function (resolve, reject) {
    var length = promiseList.length;

    if (length === 0) {
      return resolve();
    } else {
      for (var i = 0; i < length; i++) {
        MyPromise.resolve(promiseList[i]).then(
          function (value) {
            return resolve(value);
          },
          function (reason) {
            return reject(reason);
          }
        );
      }
    }
  });

  return resPromise;
};

MyPromise.prototype.catch = function (onRejected) {
  this.then(null, onRejected);
};

MyPromise.prototype.finally = function (fn) {
  // 1. 不管是resolve还是reject都会执行
  // 2. finally之后还是返回一个promise

  return this.then(
    function (value) {
      return MyPromise.resolve(fn()).then(function () {
        return value;
      });
    },
    function (error) {
      return MyPromise.resolve(fn()).then(function () {
        throw error;
      });
    }
  );
};

// 所有promise的状态都发生了改变，不管是被resolve还是reject
MyPromise.allSettled = function (promiseList) {
  return new MyPromise(function (resolve) {
    var length = promiseList.length;
    var result = [];
    var count = 0;

    if (length === 0) {
      return resolve(result);
    } else {
      for (var i = 0; i < length; i++) {
        (function (i) {
          var currentPromise = MyPromise.resolve(promiseList[i]);

          currentPromise.then(
            function (value) {
              count++;
              result[i] = {
                status: "fulfilled",
                value: value,
              };
              if (count === length) {
                return resolve(result);
              }
            },
            function (reason) {
              count++;
              result[i] = {
                status: "rejected",
                reason: reason,
              };
              if (count === length) {
                return resolve(result);
              }
            }
          );
        })(i);
      }
    }
  });
};

module.exports = MyPromise;
```


# 手写

```js
const Mpromise = (function () {
  const PROMISE_STATUS = {
    PENDING: "pending",
    RESOLVED: "resolved",
    REJECTED: "rejected",
  };

  // 异步执行回调
  function asyncCall(fn) {
    setTimeout(fn, 0);
  }

  // 将promise的状态变成resolved
  function resolvePromise(promise, value) {
    // 状态改变后将不能再更改, 并且注册的回调也只能调用一遍
    if (PROMISE_STATUS.PENDING !== promise.status) return;
    promise.status = PROMISE_STATUS.RESOLVED;
    promise.value = value;
    asyncCall(() => {
      for (let i = 0; i < promise.resolveCallbacks.length; i++) {
        // 传入promise的value
        promise.resolveCallbacks[i](promise.value);
      }
    });
  }

  // 将promise的状态变成rejected
  function rejectPromise(promise, reason) {
    // 状态改变后将不能再更改
    if (PROMISE_STATUS.PENDING !== promise.status) return;
    promise.status = PROMISE_STATUS.REJECTED;
    promise.reason = reason;
    asyncCall(() => {
      for (let i = 0; i < promise.rejectCallbacks.length; i++) {
        promise.rejectCallbacks[i](promise.reason);
      }
    });
  }

  function Mpromise(executor) {
    this.resolveCallbacks = [];
    this.rejectCallbacks = [];
    this.status = PROMISE_STATUS.PENDING;
    this.value = undefined;
    this.reason = undefined;

    const resolve = (value) => resolvePromise(this, value);
    const reject = (reason) => rejectPromise(this, reason);

    // 执行构造函数回调报错时捕获异常并reject
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  function resolvePromiseWithCallback(
    resolvePromise2,
    rejectPromise2,
    callback,
    promise1Value
  ) {
    // 执行回调后的返回值
    let returnVal;
    try {
      returnVal = callback(promise1Value);
      // 如果promise1传过来的是一个promise对象，则等待这个promise的状态发生改变
      if (returnVal instanceof Mpromise) {
        returnVal.then(
          (value) => {
            resolvePromise2(value);
          },
          (reason) => {
            rejectPromise2(reason);
          }
        );
        // 非promise对象直接resolve
      } else {
        resolvePromise2(returnVal);
      }
    } catch (error) {
      rejectPromise2(error);
    }
  }

  Mpromise.prototype = {
    constructor: Mpromise,

    then(resCallback, rejCallback) {
      // 如果resCallback不是一个函数， 则给一个返回value的默认函数
      resCallback =
        typeof resCallback === "function"
          ? resCallback
          : function defaultResCallback(value) {
              return value;
            };

      // 如果resCallback不是一个函数， 则给一个返回reason的Error对象
      rejCallback =
        typeof rejCallback === "function"
          ? rejCallback
          : function defaultRejCallback(reason) {
              if (reason instanceof Error) {
                throw reason;
              } else {
                throw new Error(reason);
              }
            };

      const promise1 = this;

      const promise2 = new Mpromise(function (resolvePromise2, rejectPromise2) {
        // 如果已经是resolve状态了
        if (PROMISE_STATUS.RESOLVED === promise1.status) {
          asyncCall(function () {
            resolvePromiseWithCallback(
              resolvePromise2,
              rejectPromise2,
              resCallback,
              promise1.value
            );
          });
          // 如果已经是reject状态了
        } else if (PROMISE_STATUS.REJECTED === promise1.status) {
          asyncCall(function () {
            resolvePromiseWithCallback(
              resolvePromise2,
              rejectPromise2,
              rejCallback,
              promise1.reason
            );
          });
          // 如果状态还未发生改变
        } else if (PROMISE_STATUS.PENDING === promise1.status) {
          promise1.resolveCallbacks.push(function (value) {
            resolvePromiseWithCallback(
              resolvePromise2,
              rejectPromise2,
              resCallback,
              value
            );
          });
          promise1.rejectCallbacks.push(function (reason) {
            resolvePromiseWithCallback(
              resolvePromise2,
              rejectPromise2,
              rejCallback,
              reason
            );
          });
        }
      });

      return promise2;
    },

    catch(rejCallback) {
      return this.then(null, rejCallback);
    },

    finally(callback) {
      const promise1 = this;
      return new Mpromise((resolve, reject) => {
        promise1.then(
          function (value) {
            resolvePromiseWithCallback(resolve, reject, callback, value);
          },
          function (reason) {
            resolvePromiseWithCallback(resolve, reject, callback, reason);
          }
        );
      });
    },
  };

  return Mpromise;
})();

var p1 = new Mpromise((resolve, reject) => {
  // resolve('jj')
  debugger;
  setTimeout(() => {
    reject("1");
  });
});
p1.name = "p1";

var p2 = p1.then((data) => {
  console.log("then", data);
  return 1;
});
p2.name = "p2";

// var p3 = p2.catch(data => {
//   console.log('catch',data)
// })

// var p4 = p3.finally(() => {
//   console.log('finally')
// })
```
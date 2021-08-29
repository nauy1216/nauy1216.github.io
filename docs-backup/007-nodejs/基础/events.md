### 继承

```js
var EventEmitter = require('events')

class MyEvent extends EventEmitter {

}

var eventBus = new MyEvent()

eventBus.on('send', function(data) {
    console.log('data', data)
})

eventBus.once('send', function(data) {
    console.log('this', this)
})

// 触发事件， 同步执行回调
eventBus.emit('send', {
    message: 'hhh'
})

eventBus.emit('send', {
    message: 'fff'
})
```



### 监听增加和移除事件

```js
var EventEmitter = require('events')

class MyEvent extends EventEmitter {

}

var eventBus = new MyEvent()

eventBus.on('newListener', (event, listener) => {
    console.log('注册事件', event, listener)
})

eventBus.on('removeListener', (event, listener) => {
    console.log('移除事件', event, listener)
})


function fn(data) {
    console.log('data', data)
}
eventBus.on('send', fn)

eventBus.off('send', fn)
```



### eventBus.eventNames()

```js
var EventEmitter = require('events')

class MyEvent extends EventEmitter {

}

var eventBus = new MyEvent()



function fn() {

}

// MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 ev1 listeners added to [MyEvent]. Use emitter.setMaxListeners() to increase limit
// 默认1个事件最多绑定10个回调
// 局部修改
// eventBus.setMaxListeners(eventBus.getMaxListeners() + 11)

// 全局修改 慎用
// EventEmitter.defaultMaxListeners
for (var i=0; i < 20; i++) {
    eventBus.on('ev' + i, fn)
}

//  返回所有的事件名
console.log(eventBus.eventNames())
```


# 从一个例子开始
```html
<style>
    .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    }
</style>
<script>
new Vue({
    el: '#app',
    data() {
        return {
            show: false
        }
    },
    methods: {
        change() {
            this.show = !this.show
        }
    },
    template: `
        <div id="demo">
            <button v-on:click="show = !show">Toggle</button>
            <transition name="fade">
                <p v-if="show">hello</p>
            </transition>
        </div>
    `
})
</script>
```

# patchVnode
1. 准备新旧两个vnode
2. 新旧两个vnode的不同之处在children。

# transition组件的`prepatch`
可以理解成是对新旧两个组件vnode进行patch之前调用的hook。
```js
if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
    i(oldVnode, vnode)
}
```

# 执行`transition`的render
1. 取children的第一个节点children[0]作为render的返回值, 在这个例子中是一个tag为p的vnode。
2. 将从`transition`上获取到的属性给children[0].data.transition
```js
const data: Object = (child.data || (child.data = {})).transition = extractTransitionData(this)
```

# 执行`transition`的patch
1. 在这个例子中点击切换时组件`transition`内部的根节点tag是变化的不能进行patchVnode的逻辑。
2. 所以每次patch都是执行createElm的逻辑

# createElm创建新的dom
1. 根据vnode创建dom元素p
2. 调用`createChildren(vnode, children, insertedVnodeQueue)`创建子节点dom, 在`createChildren`内部会调用`createElm`创建， 形成递归。在这里是创建一个文本节点。
3. 执行`invokeCreateHooks`， 内部调用vnode的createHook更新dom元素p。
    1. updateAttrs
    2. updateClass
    3. updateDOMListeners
    4. updateDOMProps
    5. updateStyle
    6. _enter
    7. create
    8. updateDirectives
4. `insert(parentElm, vnode.elm, refElm)`将p元素插入到父级元素div中。这个时候p元素是已经在文档中的。此时p的class是这样的`<p class="fade-enter fade-enter-active">hello</p>`。

transition的具体处理逻辑是在`_enter`内完成的。

# `removeVnodes([oldVnode], 0, 0)`移除旧的dom节点
1. 直接移除
到这里patch的逻辑就已经完成了但是过渡动画并没有结束。

# 执行enterHooK

# 在p元素插入到文档后的下一帧
1. `removeTransitionClass(el, startClass)`p元素移除css类`fade-enter`。此时p是这样子的`<p class="fade-enter-active">hello</p>`。
2. ` addTransitionClass(el, toClass)`p元素添加css类`fade-enter-to`。此时p是这样子的`<p class="fade-enter-active fade-enter-to">hello</p>`。
3. 添加过渡或者动画完成事件。

# 动画结束后执行afterEnterHook
1. 在动画完成之后p元素移除css类`fade-enter-active`和`fade-enter-to`。
2. 执行afterEnterHook。
```js
const cb = el._enterCb = once(() => {
    if (expectsCSS) {
        removeTransitionClass(el, toClass)
        removeTransitionClass(el, activeClass)
    }
    if (cb.cancelled) {
        if (expectsCSS) {
            removeTransitionClass(el, startClass)
        }
        enterCancelledHook && enterCancelledHook(el)
    } else {
        afterEnterHook && afterEnterHook(el)
    }
    el._enterCb = null
})
```









# _enter
过渡的逻辑就是在这里处理的。
### `resolveTransition(vnode.data.transition)`获取过渡时使用到的css类名
`vnode.data.transition`其实就是传给`transiion`标签的name属性，这里的例子传的是`fade`，所以得到的过渡类是这样的：
```js
{
    enterActiveClass: "fade-enter-active"
    enterClass: "fade-enter"
    enterToClass: "fade-enter-to"
    leaveActiveClass: "fade-leave-active"
    leaveClass: "fade-leave"
    leaveToClass: "fade-leave-to"
    name: "fade"
}
```

### enterHook是在执行insertVnodeQueue的时候执行的
```js
mergeVNodeHook(vnode, 'insert', () => {
    const parent = el.parentNode
    const pendingNode = parent && parent._pending && parent._pending[vnode.key]
    if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
    ) {
        pendingNode.elm._leaveCb()
    }
    enterHook && enterHook(el, cb)
})
```

### 执行beforeEnterHook
```js
 beforeEnterHook && beforeEnterHook(el)
```

### 给dom元素添加fade-enter和fade-enter-active类
1. 变量`expectsCSS`是用来判断是否使用过渡css类的。是否使用取决于两个条件。
    1. 第一个是传给`transition`标签的`css`属性不为false, false明确表示不使用css类。
    2. 浏览器不是ie9，因为ie9不支持`requestAnimationFrame`?

2. 在下一帧移除`fade-enter`，添加`fade-enter-to`。
```js
const expectsCSS = css !== false && !isIE9
// 此处省略一些代码....
if (expectsCSS) {
    // 添加fade-enter类
    addTransitionClass(el, startClass)
    // 添加fade-enter-active类
    addTransitionClass(el, activeClass)
    nextFrame(() => {
      // 下一帧时移除fade-enter类
      removeTransitionClass(el, startClass)
      if (!cb.cancelled) {
        addTransitionClass(el, toClass)
        if (!userWantsControl) {
          if (isValidDuration(explicitEnterDuration)) {
            setTimeout(cb, explicitEnterDuration)
          } else {
            whenTransitionEnds(el, type, cb)
          }
        }
      }
    })
  }
```







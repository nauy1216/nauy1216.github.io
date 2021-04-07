# 从一个例子开始
```js
var CompB = {
    props: {
        message: {
            type:String
        }
    },
    template: `
    <div>
        B {{message}}
        <slot />
    </div>
    `
}

var CompC = {
    data() {
        return {
            msg: "我是组件B"
        }
    },
    methods: {
        handleClick1() {
            this.msg = "2"
        }
    },
    template: `
    <div>
        C
        <slot />
        <slot name="header"></slot>
        <slot name="footer" v-bind:message="msg"></slot>
    </div>
    `
}

new Vue({
    el: '#app',
    components: {
        CompB,
        CompC,
    },
    data: {
        content: '我是root组件的数据'
    },
    template: `
    <CompC>
        <div slot="header">header slot</div>
        <div>default slot</div>
        <template slot="footer" slot-scope="scope">
            <CompB :message="scope.message">
                <div>{{content}}</div>
            </CompB>
        </template>
    </CompC>
    `
})
```

# 编译后的render方法
root组件的render方法
```js
function anonymous() {
    with (this) {
        return _c(
            'CompC',
            {
                scopedSlots: _u([
                    {
                        key: 'footer',
                        fn: function(scope) {
                            return [
                                _c('CompB', { attrs: { message: scope.message } }, [
                                    _c('div', [_v(_s(content))]),
                                ]),
                            ];
                        },
                    },
                ]),
            },
            [
                _c('div', { attrs: { slot: 'header' }, slot: 'header' }, [_v('header slot')]),
                _v(' '),
                _c('div', [_v('default slot')]),
            ]
        );
    }
}

```
1. 普通slot是放在`children`数组里的，会直接生成一个`vnode`对象。
2. 因为scopedSlot比较特殊，所以是放在`data`里的，会生成一个function。

CompC组件的render方法
```js
function anonymous() {
    with (this) {
        return _c(
            'div',
            [
                _v('\n          C\n          '),
                _t('default'),
                _v(' '),
                _t('header'),
                _v(' '),
                _t('footer', null, { message: msg }),
            ],
            2
        );
    }
}
```
CompB组件的render方法
```js
function anonymous() {
    with (this) {
        return _c('div', [_v('\n          B ' + _s(message) + '\n          '), _t('default')], 2);
    }
}
```

# 需要了解的东西
### 1. $createElement
### 2. render辅助方法
```js
export function installRenderHelpers (target: any) {
  target._o = markOnce
  target._n = toNumber
  target._s = toString
  target._l = renderList // 渲染列表
  target._t = renderSlot // 渲染slot
  target._q = looseEqual
  target._i = looseIndexOf
  target._m = renderStatic
  target._f = resolveFilter
  target._k = checkKeyCodes
  target._b = bindObjectProps
  target._v = createTextVNode
  target._e = createEmptyVNode
  target._u = resolveScopedSlots // 渲染scopedSlot
  target._g = bindObjectListeners
  target._d = bindDynamicKeys
  target._p = prependModifier
}
```
### 2. render辅助方法之resolveScopedSlots
`resolveScopedSlots`的代码：
```js
export function resolveScopedSlots (
  fns: ScopedSlotsData, // see flow/vnode
  res?: Object,
  // the following are added in 2.6
  hasDynamicKeys?: boolean,
  contentHashKey?: number
): { [key: string]: Function, $stable: boolean } {
  // $stable为true时则表示稳定的
  res = res || { $stable: !hasDynamicKeys }
  for (let i = 0; i < fns.length; i++) {
    const slot = fns[i]
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys)
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true
      }
      res[slot.key] = slot.fn
    }
  }
  if (contentHashKey) {
    (res: any).$key = contentHashKey
  }
  return res
}
```

1. 执行`_u`(也就是resolveScopedSlots)遍历定义的所有`scopedSlot`, 这里我们以执行root组件的render方法为例，调用`_u`方法传入的是一个数组。数组中的每一项
    都是一个对象，对象有两个属性key和fn。key就是slot的名字。fn就是我们定义的具体的内容，fn的参数是从c组件里传进来的数据，fn的返回值是vnode对象。
    - 为什么fn是一个函数呢？这跟scopedSlot的设计有关，scopedSlot既能使用父组件(root组件)的数据，也能使用子组件(CompC组件)传递的数据(也就是fn的参数)，所以得设计成一个函数。
```js
{
    scopedSlots: _u([
        {
            key: 'footer',
            fn: function(scope) {
                return [
                    _c('CompB', { attrs: { message: scope.message } }, [
                        _c('div', [_v(_s(content))]),
                    ]),
                ];
            },
        },
    ]),
},
```

2. 执行`_u`的返回值是一个对象。
```js
{
    $stable: true
    footer: ƒ (scope)
}
```

3. 返回值将会作为vnode的scopedSlots属性值。
```js
scopedSlots: {
    $stable: true
    footer: ƒ (scope)
}
```

# Vue.prototype._render
```js
```

# 执行根组件的render方法
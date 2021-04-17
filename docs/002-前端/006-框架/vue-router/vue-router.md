# install

```js
export function install(Vue) {
    if (install.installed && _Vue === Vue) return;
    install.installed = true;

    _Vue = Vue;

    const isDef = v => v !== undefined;

    const registerInstance = (vm, callVal) => {
        let i = vm.$options._parentVnode;
        // 执行registerRouteInstance hook
        if (isDef(i) && isDef((i = i.data)) && isDef((i = i.registerRouteInstance))) {
            i(vm, callVal);
        }
    };

    Vue.mixin({
        beforeCreate() {
            debugger;
            // 如果$options.router存在则是root component
            if (isDef(this.$options.router)) {
                this._routerRoot = this;
                this._router = this.$options.router;
                // router 初始化
                this._router.init(this);
                // 在root component 上定义_route属性
                // 在子组件内部访问$route时， 其实访问的是root组件的_route属性
                // _route是响应式的
                Vue.util.defineReactive(this, '_route', this._router.history.current);
            } else {
                // this._routerRoot 指向的是通过new Vue创建的组件实例
                this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
            }
            registerInstance(this, this);
        },
        destroyed() {
            registerInstance(this);
        },
    });

    // 挂在原型上， 全局访问
    Object.defineProperty(Vue.prototype, '$router', {
        get() {
            return this._routerRoot._router;
        },
    });

    // 挂在原型上， 全局访问
    Object.defineProperty(Vue.prototype, '$route', {
        get() {
            return this._routerRoot._route;
        },
    });

    Vue.component('RouterView', View);
    Vue.component('RouterLink', Link);

    const strats = Vue.config.optionMergeStrategies;
    // use the same hook merging strategy for route hooks
    // 合并策略
    strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
}
```

# VueRouter

```js
class VueRouter {
    constructor(options: RouterOptions = {}) {
        // 使用当前路由的app
        // 同一个页面可多次被new Vue()注入不同的app实例
        this.apps = [];

        // mode
        switch (mode) {
            case 'history':
                this.history = new HTML5History(this, options.base);
                break;
            case 'hash':
                this.history = new HashHistory(this, options.base, this.fallback);
                break;
            case 'abstract':
                this.history = new AbstractHistory(this, options.base);
                break;
            default:
                if (process.env.NODE_ENV !== 'production') {
                    assert(false, `invalid mode: ${mode}`);
                }
        }
    }

    // 初始化,在root componnet的beforeCreate中调用
    // 会根据当前的地址进行初始化渲染视图
    init(app: any /* Vue component instance */) {
        this.apps.push(app);

        // 监听使用了router的跟组件
        app.$once('hook:destroyed', () => {
            // clean out app from this.apps array once destroyed
            const index = this.apps.indexOf(app);
            if (index > -1) this.apps.splice(index, 1);
            // ensure we still have a main app or null if no apps
            // we do not release the router so it can be reused
            if (this.app === app) this.app = this.apps[0] || null;

            if (!this.app) {
                // clean up event listeners
                // https://github.com/vuejs/vue-router/issues/2341
                this.history.teardownListeners();
            }
        });

        // main app previously initialized
        // return as we don't need to set up new history listener
        if (this.app) {
            return;
        }

        this.app = app;

        const history = this.history;

        if (history instanceof HTML5History || history instanceof HashHistory) {
            const setupListeners = () => {
                history.setupListeners();
            };
            // 获取到当前的地址后进行跳转
            history.transitionTo(history.getCurrentLocation(), setupListeners, setupListeners);
        }

        // 路由发生改变时
        history.listen(route => {
            this.apps.forEach(app => {
                app._route = route;
            });
        });
    }
}
```

# router

-   matcher
-   history

# push 的执行过程

-   调用$router.push
-   在 router 对象内部会交给 history 对象去处理，执行 history.push
-   调用 baseHistory 类的 transitionTo 方法
-   调用 router.match 方法匹配到当前地址对应的$route对象，当地址发生后$route 对象就会发生改变
-   调用 confirmTransition

    ```js
    const { updated, deactivated, activated } = resolveQueue(this.current.matched, route.matched);

    const queue: Array<?NavigationGuard> = [].concat(
        // in-component leave guards
        extractLeaveGuards(deactivated), // 组件内守卫 beforeRouteLeave
        // global before hooks
        this.router.beforeHooks, // 全局守卫 beforeEach
        // in-component update hooks
        extractUpdateHooks(updated), // 组件内守卫 beforeRouteUpdate
        // in-config enter guards
        activated.map(m => m.beforeEnter), // 路由独享守卫  beforeEnter
        // async components
        // 在异步组件加载完成后
        // 组件内守卫 beforeRouteEnter 全局守卫 beforeResolve
        resolveAsyncComponents(activated)
    );
    ```

-

-   $router.push
    -   $router.history.push
        -   $router.history.transitionTo
            -   $router.match
            -   $router.history.confirmTransition

# 路由守卫是怎么实现的？

-   全局守卫

    -   beforeEach
        -   beforeHooks
    -   beforeResolve
        -   resolveHooks
    -   afterEach
        -   afterHooks

-   路由独享

    -   beforeEnter

-   组件内
    -   beforeRouteEnter
    -   beforeRouteUpdate
    -   beforeRouteLeave

### 执行顺序
- 导航被触发。
- 在失活的组件里调用 beforeRouteLeave 守卫。
- 调用全局的 beforeEach 守卫。
- 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
- 在路由配置里调用 beforeEnter。
- 解析异步路由组件。
- 在被激活的组件里调用 beforeRouteEnter。
- 调用全局的 beforeResolve 守卫 (2.5+)。
- 导航被确认。
- 调用全局的 afterEach 钩子。
- 触发 DOM 更新。
- 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。

# 配合异步组件

```js
{
    path: '/',
    component: () => {
        const AsyncComp = () => ({
            error: {
            functional: true,
            render(h) {
                return h('div', {
                style: {
                    color: 'red'
                }
                }, '404')
            }
            },
            component: import('@/views/reportForm/statisticalQuery/purchaseTrakingList')
        })

        return Promise.resolve({
            functional: true,
            render(h) {
            return h(AsyncComp)
            }
        })
    },
}
```

或者

```js
{
    path: '/',
    component: import('@/views/reportForm/statisticalQuery/purchaseTrakingList')
}
```

# history 会保存 state 对象吗？

不会，这个和`react-router`的实现不一样。只是简单的保存了一个`key`。

```js
export function pushState(url?: string, replace?: boolean) {
    saveScrollPosition();
    // try...catch the pushState call to get around Safari
    // DOM Exception 18 where it limits to 100 pushState calls
    const history = window.history;
    try {
        if (replace) {
            // preserve existing history state as it could be overriden by the user
            const stateCopy = extend({}, history.state);
            stateCopy.key = getStateKey();
            history.replaceState(stateCopy, '', url);
        } else {
            history.pushState({ key: setStateKey(genStateKey()) }, '', url);
        }
    } catch (e) {
        window.location[replace ? 'replace' : 'assign'](url);
    }
}
```

# 直接修改 hash 值和通过 router api 的区别？

### 1. 底层都是调用的同一个方法， 不过一个是主动调用一个是被动调用。

直接修改 hash。

```js
const handleRoutingEvent = () => {
    const current = this.current;
    if (!ensureSlash()) {
        return;
    }
    this.transitionTo(getHash(), route => {
        if (supportsScroll) {
            handleScroll(this.router, route, current, true);
        }
        if (!supportsPushState) {
            replaceHash(route.fullPath);
        }
    });
};

const eventType = supportsPushState ? 'popstate' : 'hashchange';
window.addEventListener(eventType, handleRoutingEvent);
this.listeners.push(() => {
    window.removeEventListener(eventType, handleRoutingEvent);
});
```

调用`router api`。

```js
push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    const { current: fromRoute } = this
    this.transitionTo(
        location,
        route => {
        pushHash(route.fullPath)
        handleScroll(this.router, route, fromRoute, false)
        onComplete && onComplete(route)
        },
        onAbort
    )
}
```

### 2. 直接更改 hash 值的话查询参数需要自己拼接

# 路由跳转的两大步骤

1. 根据组件匹配到路由组件
2. 执行路由守卫
3. 修改 route 对象触发视图更新

# 队列处理的实现

1. runQueue

```js
// queque：需要处理的队列
// fn： 自定义的iterator
// cb： queue处理完的回调
export function runQueue(queue: Array<?NavigationGuard>, fn: Function, cb: Function) {
    const step = index => {
        if (index >= queue.length) {
            // 结束
            cb();
        } else {
            if (queue[index]) {
                fn(queue[index], () => {
                    step(index + 1);
                });
            } else {
                // 如果queue[index]不存在， 执行下一轮
                step(index + 1);
            }
        }
    };
    step(0);
}
```

2. iterator

```js
const iterator = (hook: NavigationGuard, next) => {
    if (this.pending !== route) {
        return abort(createNavigationCancelledError(current, route));
    }
    try {
        // 调用路由守卫
        hook(route, current, (to: any) => {
            if (to === false) {
                // next(false) -> abort navigation, ensure current URL
                // 路由跳转失败，需要将地址还原回去
                this.ensureURL(true);
                abort(createNavigationAbortedError(current, route));
            } else if (isError(to)) {
                this.ensureURL(true);
                abort(to);
            } else if (
                typeof to === 'string' ||
                (typeof to === 'object' &&
                    (typeof to.path === 'string' || typeof to.name === 'string'))
            ) {
                // next('/') or next({ path: '/' }) -> redirect
                abort(createNavigationRedirectedError(current, route));
                if (typeof to === 'object' && to.replace) {
                    this.replace(to);
                } else {
                    this.push(to);
                }
            } else {
                // confirm transition and pass on the value
                next(to);
            }
        });
    } catch (e) {
        abort(e);
    }
};
```


# 通知视图更新的逻辑
`app._route`上保存了当前地址匹配到的路由对象。这是一个`reactive`属性，当值发生变化时会通知`<view></view>`组件更新视图。
```js
history.listen(route => {
    this.apps.forEach((app) => {
        app._route = route
    })
})
```

# 在$nextTick中会执行`scrollBehavior`
```js
  router.app.$nextTick(() => {
    const position = getScrollPosition()
    const shouldScroll = behavior.call(
      router,
      to,
      from,
      isPop ? position : null
    )

    if (!shouldScroll) {
      return
    }

    if (typeof shouldScroll.then === 'function') {
      shouldScroll
        .then(shouldScroll => {
          scrollToPosition((shouldScroll: any), position)
        })
        .catch(err => {
          if (process.env.NODE_ENV !== 'production') {
            assert(false, err.toString())
          }
        })
    } else {
      scrollToPosition(shouldScroll, position)
    }
  })
```


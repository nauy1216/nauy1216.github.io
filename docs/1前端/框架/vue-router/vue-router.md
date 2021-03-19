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
        this.apps = []

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
- matcher
- history

# push的执行过程
- 调用$router.push
- 在router对象内部会交给history对象去处理，执行history.push
- 调用baseHistory类的transitionTo方法
- 调用router.match方法匹配到当前地址对应的$route对象，当地址发生

- $router.push
    - $router.history.push
        - $router.history.transitionTo
            - $router.match
            - $router.history.confirmTransition



# 路由守卫是怎么实现的？
- 全局守卫
    - beforeEach
        - beforeHooks
    - beforeResolve
        - resolveHooks
    - afterEach
        - afterHooks

- 路由独享
    - beforeEnter

- 组件内
    - beforeRouteEnter
    - beforeRouteUpdate
    - beforeRouteLeave




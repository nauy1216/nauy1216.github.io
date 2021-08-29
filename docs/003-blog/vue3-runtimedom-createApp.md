### `createApp()`
`createApp`接受一个组件配置对象, 这个组件配置对象生成的组件将会最为应用的根组件。
同时也会返回一个app实例, 可通过`createApp`创建多个不同的实例。

```ts
export const createApp = ((...args) => {
  // 创建app
  const app = ensureRenderer().createApp(...args)

  if (__DEV__) {
    injectNativeTagCheck(app)
  }

  const { mount } = app
  app.mount = (containerOrSelector: Element | string): any => {
    const container = normalizeContainer(containerOrSelector)
    if (!container) return
    const component = app._component
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML
    }
    // clear content before mounting
    container.innerHTML = ''
    const proxy = mount(container)
    container.removeAttribute('v-cloak')
    container.setAttribute('data-v-app', '')
    return proxy
  }

  return app
}) as CreateAppFunction<Element>
```

##### `createRenderer`
调用了`runtime-core`包的`createRenderer`方法得到`renderer`对象。
通过传入不同的`rendererOptions`来做到平台的差异化定制, 在`runtime-core`里封装了与平台无关的代码,
所有与平台相关的代码都是在`runtime-dom`中。
```ts
// rendererOptions 是底层操作dom的一些api
const rendererOptions = extend({ patchProp, forcePatchProp }, nodeOps)

function ensureRenderer() {
  return renderer || (renderer = createRenderer<Node, Element>(rendererOptions))
}
```

`createRenderer`调用了`baseCreateRenderer`。
```ts
export function createRenderer<
  HostNode = RendererNode,
  HostElement = RendererElement
>(options: RendererOptions<HostNode, HostElement>) {
  return baseCreateRenderer<HostNode, HostElement>(options)
}
```

`baseCreateRenderer`返回了一个对象。
```ts
function baseCreateRenderer(
  options: RendererOptions, // 包含一些底层的dom操作API
  createHydrationFns?: typeof createHydrationFunctions
): any {
  // 这里封装了组件mount和patch的逻辑
  // ....
  return {
    render, // 从vnode到dom的patch逻辑
    hydrate, // 服务端渲染使用
    createApp: createAppAPI(render, hydrate) // 传入render、hydrate返回一个创建app的方法createApp
  }
}
```

所以创建`Vue`的App应用的主要逻辑是在`createAppAPI`中。

##### `createAppAPI`
创建的每个`app`都有自己的上下文, 但是每个app应用都是使用的相同的`render`和`hydrate`。
```ts
export function createAppAPI<HostElement>(
  render: RootRenderFunction,
  hydrate?: RootHydrateFunction
): CreateAppFunction<HostElement> {
  return function createApp(rootComponent, rootProps = null) {
    if (rootProps != null && !isObject(rootProps)) {
      __DEV__ && warn(`root props passed to app.mount() must be an object.`)
      rootProps = null
    }

    // 创建每个app的context
    const context = createAppContext()
    const installedPlugins = new Set()

    let isMounted = false

    const app: App = (context.app = {
      // createApp的参数作为创建根组件的参数
      _component: rootComponent as ConcreteComponent, 
      // 传给根组件的props
      _props: rootProps,
      _container: null,
      _context: context,

      version,

      get config() {
        return context.config
      },

      set config(v) {
        if (__DEV__) {
          warn(
            `app.config cannot be replaced. Modify individual options instead.`
          )
        }
      },

      use(plugin: Plugin, ...options: any[]) {
        // ...
      },

      mixin(mixin: ComponentOptions) {
        // ...
      },

      component(name: string, component?: Component): any {
        // ...
      },

      directive(name: string, directive?: Directive) {
        // ...
      },

      mount(rootContainer: HostElement, isHydrate?: boolean): any {
        if (!isMounted) {
          const vnode = createVNode(
            rootComponent as ConcreteComponent,
            rootProps
          )
          // store app context on the root VNode.
          // this will be set on the root instance on initial mount.
          vnode.appContext = context

          // HMR root reload
          if (__DEV__) {
            context.reload = () => {
              render(cloneVNode(vnode), rootContainer)
            }
          }

          if (isHydrate && hydrate) {
            hydrate(vnode as VNode<Node, Element>, rootContainer as any)
          } else {
            render(vnode, rootContainer)
          }
          isMounted = true
          app._container = rootContainer
          // for devtools and telemetry
          ;(rootContainer as any).__vue_app__ = app

          if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
            devtoolsInitApp(app, version)
          }

          return vnode.component!.proxy
        } else if (__DEV__) {
          warn(
            `App has already been mounted.\n` +
              `If you want to remount the same app, move your app creation logic ` +
              `into a factory function and create fresh app instances for each ` +
              `mount - e.g. \`const createMyApp = () => createApp(App)\``
          )
        }
      },

      unmount() {
        if (isMounted) {
          render(null, app._container)
          if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
            devtoolsUnmountApp(app)
          }
        } else if (__DEV__) {
          warn(`Cannot unmount an app that is not mounted.`)
        }
      },

      provide(key, value) {
        if (__DEV__ && (key as string | symbol) in context.provides) {
          warn(
            `App already provides property with key "${String(key)}". ` +
              `It will be overwritten with the new value.`
          )
        }
        // TypeScript doesn't allow symbols as index type
        // https://github.com/Microsoft/TypeScript/issues/24587
        context.provides[key as string] = value

        return app
      }
    })

    return app
  }
}

```

createAppContext
```ts
// 创建app上下文对像
export function createAppContext(): AppContext {
  return {
    app: null as any,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      isCustomElement: NO,
      errorHandler: undefined,
      warnHandler: undefined
    },
    mixins: [],
    components: {},
    directives: {},
    provides: Object.create(null)
  }
}
```


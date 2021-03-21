### `mount()`
```ts
// rootContainer: 根节点
mount(rootContainer: HostElement, isHydrate?: boolean): any {
  // 判断根组件是否mount, 避免重复mount
  if (!isMounted) {
    const vnode = createVNode(
      rootComponent as ConcreteComponent, // createApp传进来的组件option
      rootProps // 需要传给组件的props
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
      // ssr
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
}
```


### `render()`

```ts
const render: RootRenderFunction = (vnode, container) => {
  // 如果vnode不存在, 将会执行unmount的逻辑。
  if (vnode == null) {
    if (container._vnode) {
      unmount(container._vnode, null, null, true)
    }
  } else {
    // 否则执行patch的逻辑
    patch(container._vnode || null, vnode, container)
  }
  flushPostFlushCbs()
  container._vnode = vnode
}
```


### `patch()`
```ts
const patch: PatchFn = (
  n1, // 旧的vnode
  n2, // 新的vnode
  container, // dom容器
  anchor = null,
  parentComponent = null,
  parentSuspense = null,
  isSVG = false,
  optimized = false
) => {
  // patching & not same type, unmount old tree
  if (n1 && !isSameVNodeType(n1, n2)) {
    anchor = getNextHostNode(n1)
    unmount(n1, parentComponent, parentSuspense, true)
    n1 = null
  }

  if (n2.patchFlag === PatchFlags.BAIL) {
    optimized = false
    n2.dynamicChildren = null
  }

  const { type, ref, shapeFlag } = n2
  switch (type) {
    case Text:
      processText(n1, n2, container, anchor)
      break
    case Comment:
      processCommentNode(n1, n2, container, anchor)
      break
    case Static:
      if (n1 == null) {
        mountStaticNode(n2, container, anchor, isSVG)
      } else if (__DEV__) {
        patchStaticNode(n1, n2, container, isSVG)
      }
      break
    case Fragment:
      processFragment(
        n1,
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        optimized
      )
      break
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          optimized
        )
      } else if (shapeFlag & ShapeFlags.COMPONENT) {
        processComponent(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          optimized
        )
      } else if (shapeFlag & ShapeFlags.TELEPORT) {
        ;(type as typeof TeleportImpl).process(
          n1 as TeleportVNode,
          n2 as TeleportVNode,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          optimized,
          internals
        )
      } else if (__FEATURE_SUSPENSE__ && shapeFlag & ShapeFlags.SUSPENSE) {
        ;(type as typeof SuspenseImpl).process(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          optimized,
          internals
        )
      } else if (__DEV__) {
        warn('Invalid VNode type:', type, `(${typeof type})`)
      }
  }

  // set ref
  if (ref != null && parentComponent) {
    setRef(ref, n1 && n1.ref, parentComponent, parentSuspense, n2)
  }
}
```
### runtime和compiler
在包vue里面主要是导出2个不同的版本, `runtime`版本不带编译器，`compiler`版本带编译器。
编译器的作用就是把`template`字符串编译成`render`函数。由此可知, 当代码里有涉及到动态将`template`转成`render function`时就需要使用
`compiler`版本。`sfc`组件并不需要, 因为在项目打包的时候就已经把`template`转换成`render function`了。


##### compiler的逻辑
```ts
// 用于缓存, 每次template被编译成render函数后，会将render函数缓存起来。
const compileCache: Record<string, RenderFunction> = Object.create(null)

function compileToFunction(
  template: string | HTMLElement, 
  options?: CompilerOptions
): RenderFunction {
  // template不是string类型
  if (!isString(template)) {
    // dom节点
    if (template.nodeType) {
      template = template.innerHTML
    } else {
      __DEV__ && warn(`invalid template option: `, template)
      return NOOP
    }
  }

  // 如果缓存中已经存在, 则直接返回
  const key = template
  const cached = compileCache[key]
  if (cached) {
    return cached
  }

  // 如果是以#开头，表示这是一个id选择器
  if (template[0] === '#') {
    const el = document.querySelector(template)
    if (__DEV__ && !el) {
      warn(`Template element not found or is empty: ${template}`)
    }
    // __UNSAFE__
    // Reason: potential execution of JS expressions in in-DOM template.
    // The user must make sure the in-DOM template is trusted. If it's rendered
    // by the server, the template should not contain any user data.
    template = el ? el.innerHTML : ``
  }

  // 调用compiler-dom包的方法
  const { code } = compile(
    template, // 获取到的template字符串
    extend(
      {
        hoistStatic: true, // 静态提升
        onError(err: CompilerError) {
          if (__DEV__) {
            const message = `Template compilation error: ${err.message}`
            const codeFrame =
              err.loc &&
              generateCodeFrame(
                template as string,
                err.loc.start.offset,
                err.loc.end.offset
              )
            warn(codeFrame ? `${message}\n${codeFrame}` : message)
          } else {
            /* istanbul ignore next */
            throw err
          }
        }
      },
      options
    )
  )

  // The wildcard import results in a huge object with every export
  // with keys that cannot be mangled, and can be quite heavy size-wise.
  // In the global build we know `Vue` is available globally so we can avoid
  // the wildcard object.
  // 全局使用和非全局使用
  const render = (__GLOBAL__
    ? new Function(code)()
    : new Function('Vue', code)(runtimeDom)) as RenderFunction

  // mark the function as runtime compiled
  ;(render as InternalRenderFunction)._rc = true

  return (compileCache[key] = render)
}

registerRuntimeCompiler(compileToFunction)

// 导出compile方法
export { compileToFunction as compile }
```


##### 导出了runtime-dom中所有导出的内容
```ts
export * from '@vue/runtime-dom'
```
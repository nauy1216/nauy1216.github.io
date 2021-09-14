# Windows 与 POSIX 的对比
POSIX(Protabl Operation System 可移植操作系统规范)。
path 模块的默认操作因运行 Node.js 应用程序的操作系统而异。 具体来说，当在 Windows 操作系统上运行时，path 模块将假定正在使用 Windows 风格的路径。
因此，在 POSIX 和 Windows 上使用 path.basename() 可能会产生不同的结果。

# path.basename
path.basename() 方法返回 path 的最后一部分，类似于 Unix basename 命令。尾随的`目录分隔符`被忽略。

```js
// quux.html
console.log(
  path.basename('/foo/bar/baz/asdf/quux.html')
)

// quux
console.log(
  path.basename('/foo/bar/baz/asdf/quux.html', '.html')
)
```

# path.delimiter 
提供特定于平台的路径定界符：
; 用于 Windows
: 用于 POSIX
```js
// mac输出 : 
console.log(path.delimiter)
```

# path.dirname
path.dirname() 方法返回 path 的目录名，类似于 Unix dirname 命令。 尾随的目录分隔符被忽略。
```js
path.dirname('/foo/bar/baz/asdf/quux');
// 返回: '/foo/bar/baz/asdf'
```

# path.extname
path.extname() 方法返回 path 的扩展名，即 path 的最后一部分中从最后一次出现的 .（句点）字符到字符串的结尾。 如果 path 的最后一部分中没有 .，或者除了 path 的基本名称（参见 path.basename()）的第一个字符之外没有 . 个字符，则返回空字符串。
```js
path.extname('index.html');
// 返回: '.html'

path.extname('index.coffee.md');
// 返回: '.md'

path.extname('index.');
// 返回: '.'

path.extname('index');
// 返回: ''

path.extname('.index');
// 返回: ''

path.extname('.index.md');
// 返回: '.md'
```

# path.format(pathObject)
pathObject <Object> 任何具有以下属性的 JavaScript 对象：
- dir <string>  dirname
- root <string> 根路径
- base <string> 
- name <string>
- ext <string>
返回: <string>
path.format() 方法从对象返回路径字符串。 这与 path.parse() 相反。
当向 pathObject 提供属性时，存在一个属性优先于另一个属性的组合：
- 如果提供 pathObject.dir，则忽略 pathObject.root
- 如果 pathObject.base 存在，则忽略 pathObject.ext 和 pathObject.name

```js
// 如果提供 `dir`、`root` 和 `base`，
// 则将返回 `${dir}${path.sep}${base}`。
// `root` 将被忽略。
path.format({
  root: '/ignored',
  dir: '/home/user/dir',
  base: 'file.txt'
});
// 返回: '/home/user/dir/file.txt'

// 如果未指定 `dir`，则将使用 `root`。
// 如果仅提供 `root` 或 `dir` 等于 `root`，则将不包括平台分隔符。
// `ext` 将被忽略。
path.format({
  root: '/',
  base: 'file.txt',
  ext: 'ignored'
});
// 返回: '/file.txt'

// 如果未指定 `base`，则将使用 `name` + `ext`。
path.format({
  root: '/',
  name: 'file',
  ext: '.txt'
});
// 返回: '/file.txt'
```

# path.isAbsolute(path)
path.isAbsolute() 方法确定 path 是否为绝对路径。
如果给定的 path 是零长度字符串，则将返回 false。

例如，在 POSIX 上：
```js
path.isAbsolute('/foo/bar'); // true
path.isAbsolute('/baz/..');  // true
path.isAbsolute('qux/');     // false
path.isAbsolute('.');        // false
```

在 Windows 上：
```js
path.isAbsolute('//server');    // true
path.isAbsolute('\\\\server');  // true
path.isAbsolute('C:/foo/..');   // true
path.isAbsolute('C:\\foo\\..'); // true
path.isAbsolute('bar\\baz');    // false
path.isAbsolute('bar/baz');     // false
path.isAbsolute('.');           // false
```

# path.join([...paths])
path.join() 方法使用特定于平台的分隔符作为定界符将所有给定的 path 片段连接在一起，然后规范化生成的路径。
零长度的 path 片段被忽略。 如果连接的路径字符串是零长度字符串，则将返回 '.'，表示当前工作目录。

```js
path.join('a', 'b', 'c') // a/b/c
path.join('/a', 'b', 'c') // /a/b/c
path.join('/a', 'b', 'c', '..') // /a/b
```

# path.normalize(path)

# path.parse(path)#
path.parse() 方法返回一个对象，其属性表示 path 的重要元素。 尾随的目录分隔符被忽略，见 path.sep。
返回的对象将具有以下属性：
- dir <string>
- root <string>
- base <string>
- name <string>
- ext <string>
例如，在 POSIX 上：
```js
path.parse('/home/user/dir/file.txt');
// 返回:
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
```
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
"  /    home/user/dir / file  .txt "
└──────┴──────────────┴──────┴─────┘
("" 行中的所有空格都应被忽略。它们纯粹是为了格式化。)

在 Windows 上：
```js
path.parse('C:\\path\\dir\\file.txt');
// 返回:
// { root: 'C:\\',
//   dir: 'C:\\path\\dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
```
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
" C:\      path\dir   \ file  .txt "
└──────┴──────────────┴──────┴─────┘
("" 行中的所有空格都应被忽略。它们纯粹是为了格式化。)

```js
path.parse('/a/b/c')

{ root: '/', dir: '/a/b', base: 'c', ext: '', name: 'c' }
```

# path.win32和path.posix

# path.relative(from, to)
path.relative() 方法根据当前工作目录返回从 from 到 to 的相对路径。 如果 from 和 to 都解析为相同的路径（在分别调用 path.resolve() 之后），则返回零长度字符串。

```js
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
// 返回: '../../impl/bbb'
```

如果零长度字符串作为 from 或 to 传入，则将使用当前工作目录而不是零长度字符串。返回值和当前工作路径有关。
```js
path.relative('', '/a') // ../../../../../../../a
```

# path.resolve([...paths])

# path.sep
提供特定于平台的路径片段分隔符：
Windows 上是 \
POSIX 上是 /


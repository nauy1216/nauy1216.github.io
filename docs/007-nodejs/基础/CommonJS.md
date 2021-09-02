# require.cache
模块在需要时缓存在此对象中。 通过从此对象中删除键值，下一次 require 将重新加载模块。 这不适用于原生插件，因为重新加载会导致错误。

添加或替换条目也是可能的。 在本地模块之前检查此缓存，如果将匹配本地模块的名称添加到缓存中，则只有 node: 前缀的 require 调用将接收本地模块。 小心使用！
```js
const assert = require('assert');
const realFs = require('fs');

const fakeFs = {};
require.cache.fs = { exports: fakeFs };

// require('fs') 此时获取的是fakeFs
assert.strictEqual(require('fs'), fakeFs);
assert.strictEqual(require('node:fs'), realFs);

```
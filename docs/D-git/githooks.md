# husky

在之前的工作中，我们尝试通过在 git 的 `pre-receive` 阶段嵌入一系列的 ci 流程处理代码以提供给开发者们 "just push" 的开发流程（当然这个想法是完完全全源自 heroku 的）。这个流程将原先的 "push -> wait for verify -> new correct commit -> repush" 的流程转变为 "push -> fail -> correct -> repush"：如果没有在 "pre-receive" 阶段设置门禁的话，坏的提交会被同步到中心仓库后在进行检测；而设置门禁之后坏的 commit 会被拒绝在本地，本地只能将 ci 可以通过的代码提交到中心仓库。但是将所有东西都通过 push 验证很显然是慢了一些：这就像表单的前端验证和后端验证一样，虽然后端验证永远必不可少但是它增加了服务器的负担并且延长了反馈周期。

这时候 `husky` 就要派上用场了。`husky` 其实就是一个为 `git` 客户端增加 hook 的工具。将其安装到所在仓库的过程中它会自动在 `.git/` 目录下增加相应的钩子实现在 `pre-commit` 阶段就执行一系列流程保证每一个 commit 的正确性。部分在 cd `commit stage` 执行的命令可以挪动到本地执行，比如 lint 检查、比如单元测试。当然，`pre-commit` 阶段执行的命令当然要保证其速度不要太慢，每次 commit 都等很久也不是什么好的体验。

在项目根目录下安装

```csharp
yarn add --dev husky lint-staged
```

修改 package.json 文件

```bash
 "husky": {
   "hooks": {
     "pre-commit": "lint-staged",
     // "pre-commit": "npm run test", 每次git提交前都会执行 npm run test
   }
 },
 "lint-staged": {
   "*.{js,vue}": [
     "eslint --fix",
     "git add"
   ]
 }
```

如上配置，每次它只会在你本地 commit 之前，校验你提交的内容是否符合你本地配置的 eslint 规则，如果符合规则，则会提交成功。如果不符合它会自动执行 eslint --fix 尝试帮你自动修复，如果修复成功则会帮你把修复好的代码提交，如果失败，则会提示你错误，让你修好这个错误之后才能允许你提交代码。

# commitlint

在项目根目录下安装

```css
yarn add --dev @commitlint/cli @commitlint/config-conventional
```

在项目根目录下新建.commitlintrc.js

```java
module.exports = {
 extends: ['@commitlint/config-conventional'],
 rules: {
   'subject-case': [0, 'never'],
   'type-enum': [
     2,
     'always',
     [
       'build', // 构建
       'ci', // ci
       'chore', // Other changes that don't modify src or test files. 改变构建流程、或者增加依赖库、工具等
       'docs', // Adds or alters documentation. 仅仅修改了文档，比如README, CHANGELOG, CONTRIBUTE等等
       'feat', // Adds a new feature. 新增feature
       'fix', // Solves a bug. 修复bug
       'perf', // Improves performance. 优化相关，比如提升性能、体验
       'refactor', // Rewrites code without feature, performance or bug changes. 代码重构，没有加新功能或者修复bug
       'revert', // Reverts a previous commit. 回滚到上一个版本
       'style', // Improves formatting, white-space. 仅仅修改了空格、格式缩进、逗号等等，不改变代码逻辑
       'test' // Adds or modifies tests. 测试用例，包括单元测试、集成测试等
     ]
   ]
 }
}
```

修改 package.json 文件

```bash
 "husky": {
   "hooks": {
     ...
     "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
   }
 },
```

这样，每次提交都会检测 message 信息，如果不符合要求，则提交不成功。

每次提交代码都必须以下面的格式进行提交

```
fix: 修复XXX问题
```

# prettier

添加 prettier 依赖

```
cnpm i prettier  pretty-quick -D
```

修改 package.json

```
  "scripts": {
    "precommit": "lint-staged && pretty-quick --staged"
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm run precommit",
      "pre-push": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
```

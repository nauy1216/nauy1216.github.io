# 1、创建项目

```
npm init 

npm  npm install eslint --save-dev
```



设置一个配置文件：

```
./node_modules/.bin/eslint --init
```

执行命令后会有一系列的提示， 选择自己需要的即可。

执行完后会生成 .eslintrc.js 文件。

# 2、配置ESLint

ESLint设计为完全可配置的，这意味着您可以关闭所有规则并仅使用基本语法验证来运行，或者将捆绑的规则和自定义规则混合并匹配，以使ESLint非常适合您的项目。有两种主要的方法来配置ESLint：

1. **配置注释** -使用JavaScript注释将配置信息直接嵌入文件中。

2. **配置文件** -使用JavaScript，JSON或YAML文件为整个目录（主目录除外）及其所有子目录指定配置信息。这可以采用[`.eslintrc.*`](https://eslint.org/docs/user-guide/configuring#configuration-file-formats)文件的形式，也可以采用文件中的`eslintConfig`字段的形式[`package.json`](https://docs.npmjs.com/files/package.json)，ESLint会自动查找并读取它们，或者您可以在[命令行](https://eslint.org/docs/user-guide/command-line-interface)上指定配置文件。

   如果您的主目录（通常是`~/`）中有一个配置文件，则ESLint **仅**在ESLint无法找到任何其他配置文件时才使用它。

可以配置一些信息：

- **环境** -您的脚本旨在在其中运行的环境。每个环境都带有一组特定的预定义全局变量。
- **全局**变量-脚本在执行过程中访问的其他全局变量。
- **规则** -启用了哪些规则以及处于什么错误级别。


# parser
设置解析器。
```json
{
   "parser": "esprima",
}
```
以下解析器与 ESLint 兼容：
- Esprima
- Babel-ESLint - 一个对Babel解析器的包装，使其能够与 ESLint 兼容。
- @typescript-eslint/parser - 将 TypeScript 转换成与 estree 兼容的形式，以便在ESLint中使用。

# parserOptions
设置解析器选项。解析器会被传入 parserOptions，但是不一定会使用它们来决定功能特性的开关。
```json
{
   "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
   }
}
```

# [Processor](https://cn.eslint.org/docs/user-guide/configuring#specifying-processor)
插件可以提供处理器。处理器可以**从另一种文件中提取 JavaScript 代码，然后让 ESLint 检测 JavaScript 代码**。或者处理器可以在预处理中转换 JavaScript 代码。
若要在配置文件中指定处理器，请使用 processor 键，并使用由插件名和处理器名组成的串接字符串加上斜杠。例如，下面的选项启用插件 a-plugin 提供的处理器 a-processor：
```json
{
    "plugins": ["a-plugin"],
    "processor": "a-plugin/a-processor"
}
```

# [Environments](https://cn.eslint.org/docs/user-guide/configuring#specifying-environments)
一个环境定义了一组预定义的全局变量。这些环境并不是互斥的，所以你可以同时定义多个。
```json
{
    "env": {
        "browser": true,
        "node": true
    }
}
```

# [Globals](https://cn.eslint.org/docs/user-guide/configuring#specifying-globals)
要在配置文件中配置全局变量，请将 globals 配置属性设置为一个对象，该对象包含以你希望使用的每个全局变量。对于每个全局变量键，将对应的值设置为 "writable" 以允许重写变量，或 "readonly" 不允许重写变量。
```json
{
    "globals": {
        "var1": "writable",
        "var2": "readonly"
    }
}
```

# [Plugins](https://cn.eslint.org/docs/user-guide/configuring#configuring-plugins)

- 在配置文件里配置插件时，可以使用` plugins `关键字来存放插件名字的列表。
- 插件名称可以省略` eslint-plugin- `前缀。

# [Rules](https://cn.eslint.org/docs/user-guide/configuring#configuring-rules)

ESLint 附带有大量的规则。你可以使用注释或配置文件修改你项目中要使用的规则。要改变一个规则设置，你必须将规则 ID 设置为下列值之一：

- `"off"` 或 `0` - 关闭规则
- `"warn"` 或 `1` - 开启规则，使用警告级别的错误：`warn` (不会导致程序退出)
- `"error"` 或 `2` - 开启规则，使用错误级别的错误：`error` (当被触发的时候，程序会退出)

使用 `rules` 连同错误级别和任何你想使用的选项，在配置文件中进行规则配置。例如：

```json
{
    "rules": {
        "eqeqeq": "off",
        "curly": "error",
        "quotes": ["error", "double"]
    }
}
```

配置定义在插件中的一个规则的时候，你必须使用 `插件名/规则ID` 的形式。比如：

```json
{
    "plugins": [
        "plugin1"
    ],
    "rules": {
        "eqeqeq": "off",
        "curly": "error",
        "quotes": ["error", "double"],
        "plugin1/rule1": "error"
    }
}
```



# [overrides](https://cn.eslint.org/docs/user-guide/configuring#disabling-rules-only-for-a-group-of-files)

若要禁用一组文件的配置文件中的规则，请使用 `overrides` 和 `files`。如果同一个目录下的文件需要有不同的配置。因此，你可以在配置中使用 `overrides` 键，它只适用于匹配特定的 glob 模式的文件，使用你在命令行上传递的格式。例如:

```json
{
  "rules": {...},
  "overrides": [
    {
      "files": ["*-test.js","*.spec.js"],
      "rules": {
        "no-unused-expressions": "off"
      }
    }
  ]
}
```





# [Settings](https://cn.eslint.org/docs/user-guide/configuring#adding-shared-settings)

ESLint 支持在配置文件添加共享设置。你可以添加 `settings` 对象到配置文件，它将提供给每一个将被执行的规则。如果你想添加的自定义规则而且使它们可以访问到相同的信息，这将会很有用，并且很容易配置。

```json
{
    "settings": {
        "sharedData": "Hello"
    }
}
```



# [层叠配置](https://cn.eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy)

1. 如果同一个目录下有多个配置文件，ESLint 只会使用一个。优先级顺序如下：

1. `.eslintrc.js`
2. `.eslintrc.yaml`
3. `.eslintrc.yml`
4. `.eslintrc.json`
5. `.eslintrc`
6. `package.json`



2. 例如，假如你有以下结构：

```
your-project
├── .eslintrc
├── lib
│ └── source.js
└─┬ tests
  ├── .eslintrc
  └── test.js
```

层叠配置使用离要检测的文件最近的 `.eslintrc`文件作为最高优先级，然后才是父目录里的配置文件，等等。当你在这个项目中允许 ESLint 时，`lib/` 下面的所有文件将使用项目根目录里的 `.eslintrc` 文件作为它的配置文件。当 ESLint 遍历到 `test/` 目录，`your-project/.eslintrc` 之外，它还会用到 `your-project/tests/.eslintrc`。所以 `your-project/tests/test.js` 是基于它的目录层次结构中的两个`.eslintrc` 文件的组合，并且离的最近的一个优先。通过这种方式，你可以有项目级 ESLint 设置，也有覆盖特定目录的 ESLint 设置。



> **注意：**如果在你的主目录下有一个自定义的配置文件 (`~/.eslintrc`) ，如果没有其它配置文件时它才会被使用。因为个人配置将适用于用户目录下的所有目录和文件，包括第三方的代码，当 ESLint 运行时可能会导致问题。



**完整的配置层次结构，从最高优先级最低的优先级，如下:**

1. 行内配置

   1. `/*eslint-disable*/` 和 `/*eslint-enable*/`
   2. `/*global*/`
   3. `/*eslint*/`
   4. `/*eslint-env*/`

2. 命令行选项（或 CLIEngine 等价物）：

   1. `--global`
   2. `--rule`
   3. `--env`
   4. `-c`、`--config`

3. 项目级配置：

   1. 与要检测的文件在同一目录下的 `.eslintrc.*` 或 `package.json` 文件
   2. 继续在父级目录寻找 `.eslintrc` 或 `package.json`文件，直到根目录（包括根目录）或直到发现一个有`"root": true`的配置。

4. 如果不是（1）到（3）中的任何一种情况，退回到 `~/.eslintrc` 中自定义的默认配置。

   

# [root]()

默认情况下，ESLint 会在所有父级目录里寻找配置文件，一直到根目录。如果你想要你所有项目都遵循一个特定的约定时，这将会很有用，但有时候会导致意想不到的结果。为了将 ESLint 限制到一个特定的项目，在你项目根目录下的 `package.json` 文件或者 `.eslintrc.*` 文件里的 `eslintConfig` 字段下设置 `"root": true`。ESLint 一旦发现配置文件中有 `"root": true`，它就会停止在父级目录中寻找。

```json
{
    "root": true
}
```

例如，`projectA` 的 `lib/` 目录下的 `.eslintrc` 文件中设置了 `"root": true`。这种情况下，当检测 `main.js` 时，`lib/` 下的配置将会被使用，`projectA/` 下的 `.eslintrc` 将不会被使用。

```
home
└── user
    ├── .eslintrc <- Always skipped if other configs present
    └── projectA
        ├── .eslintrc  <- Not used
        └── lib
            ├── .eslintrc  <- { "root": true }
            └── main.js
```



# [extends]()

`extends` 属性值可以是：

- 指定配置的字符串(配置文件的路径、可共享配置的名称、`eslint:recommended` 或 `eslint:all`)
- 字符串数组：每个配置继承它前面的配置

ESLint递归地扩展配置，因此基本配置也可以具有 `extends` 属性。`extends` 属性中的相对路径和可共享配置名从配置文件中出现的位置解析。



# [Using a shareable configuration package](https://cn.eslint.org/docs/user-guide/configuring#using-the-configuration-from-a-plugin)

[插件](https://cn.eslint.org/docs/developer-guide/working-with-plugins) 是一个 npm 包，通常输出规则。一些插件也可以输出一个或多个命名的 [配置](https://cn.eslint.org/docs/developer-guide/working-with-plugins#configs-in-plugins)。要确保这个包安装在 ESLint 能请求到的目录下。

- `plugins` [属性值](https://cn.eslint.org/docs/user-guide/configuring#configuring-plugins) 可以省略包名的前缀 `eslint-plugin-`。





# [插件](https://cn.eslint.org/docs/developer-guide/working-with-plugins#configs-in-plugins)

### 创建插件

[Yeoman generator](https://www.npmjs.com/package/generator-eslint)





###  [`RuleTester`](https://cn.eslint.org/docs/developer-guide/nodejs-api#ruletester)

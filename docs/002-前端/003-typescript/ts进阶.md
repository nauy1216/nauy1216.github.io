- https://cloud.tencent.com/developer/article/1695444

- https://www.typescriptlang.org/docs/handbook/intro.html



# 泛型（Generics）
> type variable。一种特殊的作用于类型的变量。

> 学习ts的时候学会从两个角度去看代码。一个是静态编译时，另一个是动态运行时。
> 分清楚值和类型的区别。ts中既可以声明值，也可以声明类型。

### 泛型函数（generic identity functions）
```ts
function identity<Type>(arg: Type): Type {
  return arg;
}
```
- 这里的Type就是一个类型变量。相当于我们已经声明了一个变量，但是变量的值我们并不知道。
- 只有在调用`identity`的时候`Type`才会被赋值， 可能是传入进来（`identity<string>(1)`）的或者通过参数类型推断出来的（`identity("hello")`）。

泛型函数的类型声明。
```ts
let myIdentity: <Type>(arg: Type) => Type = identity;
```

通过`interface`的方式声明泛型函数。
```ts
interface Func { 
  <Type>(arg: Type): Type 
}
function identity<Type>(arg: Type): Type {
  return arg;
}
let myIdentity: Func = identity;
```

也可以将类型参数提升到最外层。
```ts
interface Func<Type> { 
  (arg: Type): Type 
}
 
let myIdentity: Func<number> = identity;
```

### 泛型类（Generic Classes）
```ts
class GenericNumber<NumType> {
  zeroValue: NumType;
  add: (x: NumType, y: NumType) => NumType;
}
 
let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
  return x + y;
};
```

### 泛型约束（Generic Constraints）
对类型变量进行约束，而不是可以传任意的类型, 通过一个类型来约束类型变量。
```ts
interface Lengthwise {
  length: number;
}

// 使用Lengthwise约束Type
function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
  console.log(arg.length); // Now we know it has a .length property, so no more error
  return arg;
}

// 获取对象obj的属性为key的值
// 在这里key的类型Key被约束为Key extends keyof Type，
// 也就是key必须是类型Type的key
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key];
}
```

### 构造函数使用泛型
```ts
interface MyConstructor<Type> {
  new (): Type 
}
function create<Type>(c: MyConstructor<Type>): Type {
  return new c();
}
```







# !（非空断言操作符）

1. 忽略 undefined 和 null 类型
```ts
function myFunc(maybeString: string | undefined | null) {
  // Type 'string | null | undefined' is not assignable to type 'string'.
  // Type 'undefined' is not assignable to type 'string'. 
  const onlyString: string = maybeString; // Error
  const ignoreUndefinedAndNull: string = maybeString!; // Ok
}
```
2. 调用函数时忽略 undefined 类型
```ts
type NumGenerator = () => number;

function myFunc(numGenerator: NumGenerator | undefined) {
  // Object is possibly 'undefined'.(2532)
  // Cannot invoke an object which is possibly 'undefined'.(2722)
  const num1 = numGenerator(); // Error
  const num2 = numGenerator!(); //OK
}
```
因为 ! 非空断言操作符会从编译生成的 JavaScript 代码中移除，所以在实际使用的过程中，要特别注意。比如下面这个例子：
```ts
const a: number | undefined = undefined;
const b: number = a!;
console.log(b);
```
以上 TS 代码会编译生成以下 ES5 代码：
```ts
"use strict";
const a = undefined;
const b = a;
console.log(b);
```

# ?. （可选链）
有了可选链后，我们编写代码时如果遇到` null `或` undefined `就可以立即停止某些表达式的运行。可选链的核心是新的` ?. `运算符，它支持以下语法：
```ts
obj?.prop 
obj?.[expr] 
arr?.[index] 
func?.(args)
```
这里我们来举一个可选的属性访问的例子：
```ts
const val = a?.b;
```
为了更好的理解可选链，我们来看一下该` const val = a?.b `语句编译生成的 ES5 代码：
```js
var val = a === null || a === void 0 ? void 0 : a.b;
```


上述的代码会自动检查对象 a 是否为 null 或 undefined，如果是的话就立即返回 undefined，这样就可以立即停止某些表达式的运行。你可能已经想到可以使用 ?. 来替代很多使用 && 执行空检查的代码：
```ts
if(a && a.b) { } 

if(a?.b){ }
/**
* if(a?.b){ } 编译后的ES5代码
* 
* if(
*  a === null || a === void 0 
*  ? void 0 : a.b) {
* }
*/
```
但需要注意的是，?. 与 && 运算符行为略有不同，&& 专门用于检测 falsy 值，比如空字符串、0、NaN、null 和 false 等。而 ?. 只会验证对象是否为 null 或 undefined，对于 0 或空字符串来说，并不会出现 “短路”。


# ?? （空值合并运算符）
当左侧操作数为 null 或 undefined 时，其返回右侧的操作数，否则返回左侧的操作数。

与逻辑或 || 运算符不同，逻辑或会在左操作数为 falsy 值时返回右侧操作数。也就是说，如果你使用 || 来为某些变量设置默认的值时，你可能会遇到意料之外的行为。比如为 falsy 值（’’、NaN 或 0）时。

这里来看一个具体的例子：
```ts
const foo = null ?? 'default string';
console.log(foo); // 输出："default string"

const baz = 0 ?? 42;
console.log(baz); // 输出：0
```
以上 TS 代码经过编译后，会生成以下 ES5 代码：
```js
"use strict";
var _a, _b;
var foo = (_a = null) !== null && _a !== void 0 ? _a : 'default string';
console.log(foo); // 输出："default string"

var baz = (_b = 0) !== null && _b !== void 0 ? _b : 42;
console.log(baz); // 输出：0
```

若空值合并运算符 ?? 直接与 AND（&&）和 OR（||）操作符组合使用 ?? 是不行的。这种情况下会抛出 SyntaxError。
```ts
// '||' and '??' operations cannot be mixed without parentheses.(5076)
null || undefined ?? "foo"; // raises a SyntaxError

// '&&' and '??' operations cannot be mixed without parentheses.(5076)
true && undefined ?? "foo"; // raises a SyntaxError
```
但当使用括号来显式表明优先级时是可行的，比如：
```js
(null || undefined ) ?? "foo"; // 返回 "foo"
```

# ?: （可选属性）
把某个属性声明为可选的。

# & （交叉类型）
在` TypeScript `中交叉类型是将多个类型合并为一个类型。通过` & `运算符可以将现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性。
```ts
type PartialPointX = { x: number; };
type Point = PartialPointX & { y: number; };

let point: Point = {
  x: 1,
  y: 1
}
```
在上面代码中我们先定义了 PartialPointX 类型，接着使用 & 运算符创建一个新的 Point 类型，表示一个含有 x 和 y 坐标的点，然后定义了一个 Point 类型的变量并初始化。

### 同名基础类型属性的合并
那么现在问题来了，假设在合并多个类型的过程中，刚好出现某些类型存在相同的成员，但对应的类型又不一致，比如：
```ts
interface X {
  c: string;
  d: string;
}

interface Y {
  c: number;
  e: string
}

type XY = X & Y;
type YX = Y & X;

let p: XY;
let q: YX;
```
在上面的代码中，接口 X 和接口 Y 都含有一个相同的成员 c，但它们的类型不一致。对于这种情况，此时 XY 类型或 YX 类型中成员 c 的类型是什么类型呢？
> 是never类型。

为什么接口 X 和接口 Y 混入后，成员 c 的类型会变成 never 呢？这是因为混入后成员 c 的类型为 string & number，即成员 c 的类型既可以是 string 类型又可以是 number 类型。很明显这种类型是不存在的，所以混入后成员 c 的类型为 never。

### 同名非基础类型属性的合并
合并规则与第一个例子相同。
```ts
interface D { d: boolean; }
interface E { e: string; }
interface F { f: number; }

interface A { x: D; }
interface B { x: E; }
interface C { x: F; }

type ABC = A & B & C;

let abc: ABC = {
  x: {
    d: true,
    e: 'semlinker',
    f: 666
  }
};

console.log('abc:', abc);
```

# | （联合类型）
在 TypeScript 中联合类型（Union Types）表示取值可以为多种类型中的一种，联合类型使用 | 分隔每个类型。联合类型通常与 null 或 undefined 一起使用：
```ts
const sayHello = (name: string | undefined) => { /* ... */ };
```
以上示例中 name 的类型是 string | undefined 意味着可以将 string 或 undefined 的值传递给 sayHello 函数。

```ts
sayHello("semlinker");
sayHello(undefined);
```
此外，对于联合类型来说，你可能会遇到以下的用法：

```ts
let num: 1 | 2 = 1;
type EventNames = 'click' | 'scroll' | 'mousemove';
```
示例中的 1、2 或 'click' 被称为**字面量类型**，用来约束取值只能是某几个值中的一个。

### 调用联合类型的方法或属性
只能访问构成联合类型的所有类型的公共方法或属性。
```ts
type A = string | number
const a:A = 1 as any;
a.toFixed() //报错： 类型“A”上不存在属性“toFixed”。类型“string”上不存在属性“toFixed”。ts(2339)
```

如果想要访问某一个类型的方法或属性，必须先进行类型断言。
```ts
type A = string | number
const a:A = 1 as any;
(a as number).toFixed();
```

# #XXX （私有字段）
在 TypeScript 3.8 版本就开始支持 ECMAScript 私有字段，使用方式如下：
```ts
class Person {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }

  greet() {
    console.log(`Hello, my name is ${this.#name}!`);
  }
}

let semlinker = new Person("Semlinker");

semlinker.#name;
//     ~~~~~
// Property '#name' is not accessible outside class 'Person'
// because it has a private identifier.
```
与常规属性（甚至使用 private 修饰符声明的属性）不同，私有字段要牢记以下规则：

- 私有字段以 # 字符开头，有时我们称之为私有名称；
- 每个私有字段名称都唯一地限定于其包含的类；
- 不能在私有字段上使用 TypeScript 可访问性修饰符（如 public 或 private）；
- 私有字段不能在包含的类之外访问，甚至不能被检测到。

### 私有字段与 private 的区别
#### private 的示例：
```ts
class Person {
  constructor(private name: string){}
}

let person = new Person("Semlinker");
console.log(person.name);
```
在上面代码中，我们创建了一个 Person 类，该类中使用 private 修饰符定义了一个私有属性 name，接着使用该类创建一个 person 对象，然后通过 person.name 来访问 person 对象的私有属性，这时 TypeScript 编译器会提示以下异常：
```ts
Property 'name' is private and only accessible within class 'Person'.(2341)
```
那如何解决这个异常呢？当然你可以使用类型断言把 person 转为 any 类型：
```ts
console.log((person as any).name);
```

通过这种方式虽然解决了 TypeScript 编译器的异常提示，但是在运行时我们还是可以访问到 Person 类内部的私有属性，为什么会这样呢？我们来看一下编译生成的 ES5 代码，也许你就知道答案了：
```ts
var Person = /** @class */ (function () {
    function Person(name) {
      this.name = name;
    }
    return Person;
}());

var person = new Person("Semlinker");
console.log(person.name);
```


#### 私有字段示例
```ts
class Person {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }

  greet() {
    console.log(`Hello, my name is ${this.#name}!`);
  }
}
```
以上代码目标设置为 ES2015，会编译生成以下代码：
```js
"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) 
  || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
      throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};

var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) 
  || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
      throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};

var _name;
class Person {
    constructor(name) {
      _name.set(this, void 0);
      __classPrivateFieldSet(this, _name, name);
    }
    greet() {
      console.log(`Hello, my name is ${__classPrivateFieldGet(this, _name)}!`);
    }
}
_name = new WeakMap();
```

# 类型运算
### keyof
The keyof operator takes an object type and produces `a string or numeric literal union of its keys`. 
```ts
type Point = { x: number; y: number };
type P = keyof Point; // "x" | "y"
```

If the type has a string or number `index signature`, keyof will return those types instead:
```ts
type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish; // type A = number
 
type Mapish = { [k: string]: boolean };
type M = keyof Mapish; // type M = string | number
```
> Note that in this example, `M `is `string | number` — this is because JavaScript object keys are always coerced to a string, so `obj[0]` is always the same as `obj["0"]`.
> 为什么？？？？


### typeof 
js中也有一个typeof运算符，js中的typeof运行在表达式的上下文中。
ts中的typeof运行在type的上下中， 可以用来推断一个值变量的类型。
```ts
let s = "hello";
let n: typeof s;
```

### index
索引访问类型（Indexed Access Types），可以通过索引访问类型。
```ts
type Person = { age: number; name: string; alive: boolean };
type Age = Person["age"]; // type Age = number
```

索引本身就是一种类型， 所以可以根据索引得到的复杂类型对另一个类型进行访问。
```ts
type I1 = Person["age" | "name"]; // type I1 = string | number
 
type I2 = Person[keyof Person]; // type I2 = string | number | boolean
 
type AliveOrName = "alive" | "name";
type I3 = Person[AliveOrName]; // type I3 = string | boolean
```

通过`number`获取数组每一项的类型。
```ts
const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 38 },
];


type Person = typeof MyArray[number];
// type Person = {
//     name: string;
//     age: number;
// }      

type Age = typeof MyArray[number]["age"];
// type Age = number


type Age2 = Person["age"];
// type Age2 = number
```

### 条件类型（Conditional Types）
Conditional types help describe the relation between the types of inputs and outputs.
```ts
interface Animal {
  live(): void;
}
interface Dog extends Animal {
  woof(): void;
}
 
type Example1 = Dog extends Animal ? number : string;
// type Example1 = number
 
type Example2 = RegExp extends Animal ? number : string;
// type Example2 = string
```


条件类型有点类似js中的三目运算符。当`extends`运算符左边的类型可以转换成右边的类型时，返回`TrueType`。
```ts
type ResType = SomeType extends OtherType ? TrueType : FalseType;
```

看起来似乎没什么用，看下面结合泛型的例子：
```ts
interface IdLabel {
  id: number /* some fields */;
}
interface NameLabel {
  name: string /* other fields */;
}
 
function createLabel(id: number): IdLabel;
function createLabel(name: string): NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel {
  throw "unimplemented";
}
```


用条件类型改写后：
```ts
// 
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;

function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented";
}

let a = createLabel("typescript");
// let a: NameLabel
 
let b = createLabel(2.8);
// let b: IdLabel
 
let c = createLabel(Math.random() ? "hello" : 42);
// let c: NameLabel | IdLabel
```

有哪些类型可以传递给`NameOrId`呢？
```ts
type T1 = NameOrId<number> // IdLabel
type T2 = NameOrId<string> // NameLabel
type T3 = NameOrId<number | string> // IdLabel | NameLabel
type T4 = NameOrId<null> // IdLabel
type T5 = NameOrId<undefined> // IdLabel
type T6 = NameOrId<any> // IdLabel | NameLabel
type T7 = NameOrId<unknown> // Error: 类型“unknown”不满足约束“string | number”
type T8 = NameOrId<never> // never
```

条件类型约束(Conditional Type Constraints):
```ts
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;
```

分配条件类型（Distributive Conditional Types）：
```ts
type ToArray<Type> = Type extends any ? Type[] : never;
type A = ToArray<number> // number[]
```


如果我们传入的是`number | string`呢？条件类型运算会应用在联合类型的每一项上，最后返回结果也是一个联合类型，
这个联合类型的每一项是参数联合类型的每一项的返回结果。相当于`ToArray<string> | ToArray<number>`
```ts
type A = ToArray<number | string> // number[] | string[]
// 相当于
type A = ToArray<number> | ToArray<string>// number[] | string[]
```

那么如果我们传入联合类型但是不想被分配到每一项呢？
```ts
type ToArray<Type> = [Type] extends [any] ? Type[] : never; 
type A = ToArray<string | number> // (string | number)[]
```



### infer
```ts
type Flatten<T> = T extends any[] ? T[number] : T;
```

使用`infer`后，`infer`关键字声明了一个叫Item的类型变量，用来表示数组每一项的类型。
```ts
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
```

We can write some useful helper type aliases using the infer keyword. For example, for simple cases, we can extract the return type out from function types:
```ts
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return
  ? Return
  : never;

type Num = GetReturnType<() => number>; // number
type Str = GetReturnType<(x: string) => string>; // string
```

在上面的获取函数返回值类型的工具类型中，如果传入的是一个具有多个重载的函数，将只会获取得到最后一个函数签名的返回值。
```ts
declare function stringOrNum(x: string): number;
declare function stringOrNum(x: number): string;
declare function stringOrNum(x: string | number): string | number;
 
type T1 = ReturnType<typeof stringOrNum>; // string | number

```

### 类型映射（Mapped Types）
有时候希望在一个类型的基础上得到另一个类型，比如说；
已经有类型：
```ts
interface Person {
  name: string;
  age: number
}
```
你想要的类型：
```ts
interface Person1 {
  name: string;
  age: number;
}
```
如果你不想重复写上面的代码， 你可以通过类型映射来解决；

> A mapped type is a generic type which uses a union of PropertyKeys (frequently created via a keyof) to iterate through keys to create a type:

- 类型映射也是泛型的应用
- 映射类似于js中数组的map, ts的类型系统可以通过索引遍历的方式得到新的类型

上面的例子可以这样解决：
```ts
type TypeMapping<T> = {
  [K in keyof T]: string
}
type Person1 = TypeMapping<Person>
// {
//   name:string;
//   age:string;
// }
```


#### 修饰符（Mapping Modifiers）
- ?。可以加上`-?`或者`?`来增加或者移除`?`。
- readonly。可以加上`-readonly`或者`readonly`来增加或者移除`readonly`。

```ts
type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};
 
type LockedAccount = {
  readonly id: string;
  readonly name: string;
};
 
type UnlockedAccount = CreateMutable<LockedAccount>;
// type UnlockedAccount = {
//     id: string;
//     name: string;
// }


// Removes 'optional' attributes from a type's properties
type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
};
 
type MaybeUser = {
  id: string;
  name?: string;
  age?: number;
};
 
type User = Concrete<MaybeUser>;
```

#### as（属性重命名）
> 可以在映射的时候通过`as`子句来对类型的key重新命名。
语法：
```ts
type MappedTypeWithNewProperties<Type> = {
    [Properties in keyof Type as NewKeyType]: Type[Properties]
}
```

修改key的一个示例： 
```ts
type Getters<Type> = {
    [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
};
 
interface Person {
    name: string;
    age: number;
    location: string;
}
 
type LazyPerson = Getters<Person>;
// type LazyPerson = {
//     getName: () => string;
//     getAge: () => number;
//     getLocation: () => string;
// }
```

> 也可以在映射的过程中，过滤掉某些不要的key。
> 如果使用as重新指定的key的类型是never就会被过滤掉。
```ts
// Remove the 'kind' property
// Ysou can filter out keys by producing never via a conditional type:
type RemoveKindField<Type> = {
    [Property in keyof Type as Exclude<Property, "kind">]: Type[Property]
};
 
interface Circle {
    kind: "circle";
    radius: number;
}
 
type KindlessCircle = RemoveKindField<Circle>;
// type KindlessCircle = {
//     radius: number;
// }
```

在对一个联合类型进行映射时，关键字`in`后面就不要再加上`keyof`了。
因为在映射类型的时候本来就是对联合类型进行的遍历。
```ts
type TypeMapping<T extends string | number | symbol> = {
  [K in T]:string
}
type Hello = TypeMapping<'hello' | 'world'>
// type Hello = {
//   hello: string;
//   world: string;
// }

```

如果联合类型中有除了`string`、`number`、`symbol`的其他类型，则会报错，因为
对象的key的类型必须是`string`、`number`、`symbol`。
可以通过`as`重新映射为`string`、`number`、`symbol`的类型。
```ts
type EventConfig<Events extends { kind: string }> = {
  [E in Events as E["kind"]]: (event: E) => void;
}

type SquareEvent = { kind: "square", x: number, y: number };
type CircleEvent = { kind: "circle", radius: number };

type Config = EventConfig<SquareEvent | CircleEvent>
```
> 注意：
> 字符串字面量类型也是可以赋值给`string`类型的，反过来则不行。
```ts
type A = 'string1'
const a:string = 'string1';
const b:A = 'string1';
const c:string = b;
const d:A = a; // Error: 不能将类型“string”分配给类型“"string1"”。
```

#### 与条件类型一起使用
```ts
type ExtractPII<Type> = {
  [Property in keyof Type]: Type[Property] extends { pii: true } ? true : false;
};
 
type DBFields = {
  id: { format: "incrementing" };
  name: { type: string; pii: true };
};
 
type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>;
// type ObjectsNeedingGDPRDeletion = {
//     id: false;
//     name: true;
// }
```

### 字符模版类型（Template Literal Types）
与`js`中的字符串模版的用法类似。
```ts
type World = "world";
 
type Greeting = `hello ${World}`;
// type Greeting = "hello world"
```

联合类型使用：
```ts
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";
 
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
// type AllLocaleIDs = "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"


type Label = 'hello' | 'world'
type Lang = "en" | "zh";
 
type LocaleMessageIDs = `${Lang}_${Label}`;
// type LocaleMessageIDs = "en_hello" | "en_world" | "zh_hello" | "zh_world"
```
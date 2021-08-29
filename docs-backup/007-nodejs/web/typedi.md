文档： https://www.npmjs.com/package/typedi#usage-with-typescript

### typedi

TypeDI是JavaScript和TypeScript的[依赖项注入](https://en.wikipedia.org/wiki/Dependency_injection)工具。使用TypeDI，您可以构建结构良好且易于测试的应用程序。



### 安装依赖

```shell
npm install typedi --save
npm install reflect-metadata --save
npm install @types/node --save
```

在应用的全局入口引入

```js
import "reflect-metadata";
```



### 设置tsconfig

```json
"emitDecoratorMetadata": true,
"experimentalDecorators": true,
```



### 使用方法

Container.get可以在应用的任何地方，获取到SomeClass类的唯一实例(单例模式)。

```js
import "reflect-metadata";
import {Service, Container} from "typedi";
 
@Service()
class SomeClass {
 
    someMethod() {
    }
 
}
 
let someClass = Container.get(SomeClass);
someClass.someMethod();
```



Inject: 依赖注入。

```js
import {Container, Inject, Service} from "typedi";
 
@Service()
class BeanFactory {
    create() {
    }
}
 
@Service()
class SugarFactory {
    create() {
    }
}
 
@Service()
class WaterFactory {
    create() {
    }
}
 
@Service()
class CoffeeMaker {
 
    @Inject()
    beanFactory: BeanFactory;
    
    @Inject()
    sugarFactory: SugarFactory;
    
    @Inject()
    waterFactory: WaterFactory;
 
    make() {
        this.beanFactory.create();
        this.sugarFactory.create();
        this.waterFactory.create();
    }
 
}
 
let coffeeMaker = Container.get(CoffeeMaker);
coffeeMaker.make();
```



通过构造函数注入，这种方式不需要明确的使用@inject()

```js
import {Container, Service} from "typedi";
 
@Service()
class BeanFactory {
    create() {
    }
}
 
@Service()
class SugarFactory {
    create() {
    }
}
 
@Service()
class WaterFactory {
    create() {
    }
}
 
@Service()
class CoffeeMaker {
 
    constructor(private beanFactory: BeanFactory,
                private sugarFactory: SugarFactory,
                private waterFactory: WaterFactory) {}
 
    make() {
        this.beanFactory.create();
        this.sugarFactory.create();
        this.waterFactory.create();
    }
 
}
 
let coffeeMaker = Container.get(CoffeeMaker);
coffeeMaker.make();
```



也可以修改service的名字， 通过@Service()的参数传入。

```js
import {Container, Service, Inject} from "typedi";
 
interface Factory {
    create(): void;
}
 
@Service("bean.factory")
class BeanFactory implements Factory {
    create() {
    }
}
 
@Service("sugar.factory")
class SugarFactory implements Factory {
    create() {
    }
}
 
@Service("water.factory")
class WaterFactory implements Factory {
    create() {
    }
}
 
@Service("coffee.maker")
class CoffeeMaker {
 
    beanFactory: Factory;
    sugarFactory: Factory;
 
    @Inject("water.factory")
    waterFactory: Factory;
 
    constructor(@Inject("bean.factory") beanFactory: BeanFactory,
                @Inject("sugar.factory") sugarFactory: SugarFactory) {
        this.beanFactory = beanFactory;
        this.sugarFactory = sugarFactory;
    }
 
    make() {
        this.beanFactory.create();
        this.sugarFactory.create();
        this.waterFactory.create();
    }
 
}
 
let coffeeMaker = Container.get<CoffeeMaker>("coffee.maker");
coffeeMaker.make();
```



也可以作为store来注入一些配置项。

```js
import {Container, Service, Inject} from "typedi";
 
// somewhere in your global app parameters
Container.set("authorization-token", "RVT9rVjSVN");
 
@Service()
class UserRepository {
 
    @Inject("authorization-token")
    authorizationToken: string;
 
}


////////////////////////
Container.set(CoffeeMaker, new FakeCoffeeMaker());
 
// or for named services
 
Container.set([
    { id: "bean.factory", value: new FakeBeanFactory() },
    { id: "sugar.factory", value: new FakeSugarFactory() },
    { id: "water.factory", value: new FakeWaterFactory() }
]);
```


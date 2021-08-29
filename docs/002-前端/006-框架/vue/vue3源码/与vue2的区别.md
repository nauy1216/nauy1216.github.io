# `Proxy`与`Object.definePropertype`的区别
- Proxy是es6才有的，definePropertype是es5就存在。Proxy没有definePropertype兼容性好。
- definePropertype不能拦截到数组的变化, 比如增减删除数组的项，数组长度变化等。也不能检测到对象新增属性、删除属性。
- Proxy本质上监听的是对数据的访问或操作，而definePropertype监听的是对属性的访问或赋值。很明显Proxy的功能更强大。

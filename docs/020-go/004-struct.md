- 结构体定义的一般方式如下：

```go
type identifier struct {
    field1 type1
    field2 type2
    ...
}
```



- 结构体的字段可以是任何类型，甚至是结构体本身，也可以是函数或者接口。可以声明结构体类型的一个变量，然后像下面这样给它的字段赋值：

```go
var t T // 这里会自动分配内存
t.a = 5
t.b = 8
```

声明 `var t T` 会给 `t` 分配内存，并零值化内存，但是这个时候 `t` 是类型 `T` 。t` 通常被称做类型 T 的一个实例 (instance) 或对象 (object)。



- 使用 `new()` 函数给一个新的结构体变量分配内存，它返回指向已分配内存的指针：`var t *T = new(T)`，如果需要可以把这条语句放在不同的行（比如定义是包范围的，但是分配却没有必要在开始就做）。

```go
var t *T
t = new(T)
```

变量 `t` 是一个指向 `T` 的指针，此时结构体字段的值是它们所属类型的零值。



- 无论变量是一个结构体类型还是一个结构体类型指针，都使用同样的 **选择器符 (selector-notation)** 来引用结构体的字段：

```go
type myStruct struct { i int }
var v myStruct    // v 是结构体类型变量
var p *myStruct   // p 是指向一个结构体类型变量的指针
v.i
p.i
```



- 初始化一个结构体实例

  ```go
  ms := &struct1{10, 15.5, "Chris"}
  // 此时 ms 的类型是 *struct1
  
  
  type Interval struct {
      start int
      end   int
  }
  
  intr := Interval{0, 3}            (A)
  intr := Interval{end:5, start:1}  (B)
  intr := Interval{end:5}           (C)
  ```



- 可以直接通过`ptr.field`来修改修改属性值，Go 会自动做解指针的转换，当然也可以手动解指针。

  ```go
  package main
  import (
      "fmt"
      "strings"
  )
  
  type Person struct {
      firstName   string
      lastName    string
  }
  
  func upPerson(p *Person) {
      p.firstName = strings.ToUpper(p.firstName)
      p.lastName = strings.ToUpper(p.lastName)
  }
  
  func main() {
      // 1-struct as a value type:
      var pers1 Person
      pers1.firstName = "Chris"
      pers1.lastName = "Woodward"
      upPerson(&pers1)
      fmt.Printf("The name of the person is %s %s\n", pers1.firstName, pers1.lastName)
  
      // 2—struct as a pointer:
      pers2 := new(Person)
      pers2.firstName = "Chris"
      pers2.lastName = "Woodward"
      (*pers2).lastName = "Woodward"  // 这是合法的
      upPerson(pers2)
      fmt.Printf("The name of the person is %s %s\n", pers2.firstName, pers2.lastName)
  
      // 3—struct as a literal:
      pers3 := &Person{"Chris","Woodward"}
      upPerson(pers3)
      fmt.Printf("The name of the person is %s %s\n", pers3.firstName, pers3.lastName)
  }
  ```

- **结构体的内存布局**

  Go 语言中，结构体和它所包含的数据在内存中是以连续块的形式存在的，即使结构体中嵌套有其他的结构体，这在性能上带来了很大的优势。不像 Java 中的引用类型，一个对象和它里面包含的对象可能会在不同的内存空间中，这点和 Go 语言中的指针很像。下面的例子清晰地说明了这些情况：

  ```go
  type Rect1 struct {Min, Max Point }
  type Rect2 struct {Min, Max *Point }
  ```

  [![img](image/10.1_fig10.2.jpg)](https://github.com/unknwon/the-way-to-go_ZH_CN/blob/master/eBook/images/10.1_fig10.2.jpg?raw=true)



- **结构体转换**

  ```go
  package main
  import "fmt"
  
  type number struct {
      f float32
  }
  
  type nr number   // alias type
  
  func main() {
      a := number{5.0}
      b := nr{5.0}
      // var i float32 = b   // compile-error: cannot use b (type nr) as type float32 in assignment
      // var i = float32(b)  // compile-error: cannot convert b (type nr) to type float32
      // var c number = b    // compile-error: cannot use b (type nr) as type number in assignment
      // needs a conversion:
      var c = number(b)
      fmt.Println(a, b, c)
  }
  ```

  

- 使用工厂方法创建结构体实例

  ```go
  type File struct {
      fd      int     // 文件描述符
      name    string  // 文件名
  }
  
  func NewFile(fd int, name string) *File {
      if fd < 0 {
          return nil
      }
  
      return &File{fd, name}
  }
  
  // 调用
  f := NewFile(10, "./test.txt")
  ```

  强制使用工厂方法

  ```go
  type matrix struct {
      ...
  }
  
  func NewMatrix(params) *matrix {
      m := new(matrix) // 初始化 m
      return m
  }
  
  
  // 在其他包里使用工厂方法：
  wrong := new(matrix.matrix)     // 编译失败（matrix 是私有的）
  right := matrix.NewMatrix(...)  // 实例化 matrix 的唯一方式
  ```

- 匿名字段。

  结构体可以包含一个或多个 **匿名（或内嵌）字段**，即这些字段没有显式的名字，只有字段的类型是必须的，此时类型就是字段的名字。匿名字段本身可以是一个结构体类型，即 **结构体可以包含内嵌结构体**。

  

- 内嵌结构体。
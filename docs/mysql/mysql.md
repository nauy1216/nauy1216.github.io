# 第二章 、SQL基础

## **什么是sql**

sql是Structure Query Language（结构化查询语言）的缩写，它是使用关系模型的数据库应用语言。

## sql的分类

DDL: 数据定义语言。这些语言定义了不同的数据字段、数据库、表、列等。

DML：数据操纵语言。数据的增删改查等操作。

DCL：数据控制语言。定义数据库、表、字段、用户的访问权限和安全级别。

## DDL语句

创建数据库。

连接数据库，`-u`后面跟连接的用户名，`-p`表示要输入密码。

```sql
mysql -uroot -p
```

连接成功后， 创建数据库。注意sql语句后面必须加分号。

```
create database learnsql；
```

查看所有的数据库。

```
show databases;
```

选择要操作的数据库。

```
use learnsql;
```

查看数据库下所有的表。

```
show tables;
```

删除数据库。

```
drop database learnsql;
```

创建表。

```
create table student(
  name varchar(10),
  age int(2)
);
```

查看表结构。

```sql
desc student;
```

查看定义表时的sql。输出定义表的sql语句。

```
show create table student;
```

删除表。

```
drop table student;
```

修改表结构。

```
//修改字段的定义
alter table student modify name varchar(20);

//增加字段
 alter table student add address varchar(100);

//删除字段
alter table student drop address;

//修改字段名，将name改为name1
alter table student change name name1 varchar(50);

//修改字段排列顺序
 alter table student modify age int(2) first;
```

修改表名。

```
 alter table student rename stud;
```





## DML语句

插入记录。

```sql
insert student (name,age) values('lcy',18);

// 指定字段时可不按字段顺序插入
insert student (age,name) values (20, 'liu');

// 如果不是非空字段可不填
insert student (age) values (15);

// 省略字段则默认按表定义时的字段顺序填入
insert student values('aa',17);

// 批量插入多条记录
insert student values ('bb',23), ('cc', 34);
```

更新记录。

```mysql
update student set name='defaultname' where name is null;
```

删除记录。

```
delete from student where name = 'defaultname';
```

查询记录。

```mysql
 select * from student where age < 30 and age >= 18;
 
 // 查询不重复的记录, 关键字 distinct
 select distinct classname from student;
 
 // 排序 order by
 // asc升序， desc降序
 select * from student where classname='一班' order by age asc;
```


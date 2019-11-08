## 1、Git是什么？

Git是目前世界上最先进的分布式版本控制系统（没有之一）。

## 2、集中式vs分布式

`CVS`及`SVN`都是集中 式的版本控制系统，而`Git`是分布式版本控制系统。

**集中式版本控制系统**

1、版本库是集中存放在中央服务器的。而干活的时候，用的都是自己的电脑，所以要先从中央服务器取得最新的版本，然后开始干活，干完活了，再把自己的活推送给中央服务器。中央服务器就好比是一个图书馆，你要改一本书，必须先从图书馆借出来，然后回到家自己改，改完了，再放回图书馆。

2、必须联网才能工作。

**分布式版本控制系统**

1、没有“中央服务器”，每个人的电脑上都是一个完整的版本库。工作的时候，就不需要联网了，因为版本库就在你自己的电脑上。既然每个人电脑上都有一个完整的版本库，那多个人如何协作呢？比方说你在自己电脑上改了文件A，你的同事也在他的电脑上改了文件A，这时，你们俩之间只需把各自的修改推送给对方，就可以互相看到对方的修改了。

2、安全性要高很多，因为每个人电脑里都有完整的版本库，某一个人的电脑坏掉了不要紧，随便从其他人那里复制一个就可以了。而集中式版本控制系统的中央服务器要是出了问题，所有人都没法干活了。

3、分布式版本控制系统通常也有一台充当“中央服务器”的电脑，但这个服务器的作用仅仅是用来方便“交换”大家的修改，没有它大家也一样干活，只是交换修改不方便而已。

4、极其强大的分支管理。

## 3、创建版本库

**什么是版本库呢？**

版本库又名仓库，英文名**repository**，你可以简单理解成一个目录，这个目录里面的所有文件都可以被Git管理起来，每个文件的修改、删除，Git都能跟踪，以便任何时刻都可以追踪历史，或者在将来某个时刻可以“还原”。

**创建版本库**

1、进入选择的目录。

2、通过`git init`命令把这个目录变成Git可以管理的仓库。

```
git init
Initialized empty Git repository in /Users/michael/learngit/.git/
```

执行命令之后当前目录下多了一个`.git`的目录，这个目录是Git来跟踪管理版本库的，没事千万不要手动修改这个目录里面的文件，不然改乱了，就把Git仓库给破坏了。

**把文件添加到版本库**

1、用命令`git add`告诉Git，把文件添加到仓库。

```
git add readme.txt
```

2、用命令`git commit`告诉Git，把文件提交到仓库。

```
git commit -m "wrote a readme file"
```

`-m`后面输入的是本次提交的说明，可以输入任意内容，当然最好是有意义的，这样你就能从历史记录里方便地找到改动记录。

## 4、时光机穿梭

**查看仓库当前的状态**

在改动文件之后可以通过 status 命令查看那些文件改动过。

```
git status
```

diff 命令查看某个文件的具体改动。

```
git diff readme.txt 
```

## 5、版本回退

**查看仓库提交日志**

`git log`命令显示从最近到最远的提交日志。

```
git log
```

每提交一个新版本，实际上Git就会把它们自动串成一条时间线。

**回到之前的某一个版本**

1、首先，Git必须知道当前版本是哪个版本，在Git中，用`HEAD`表示当前版本。上一个版本就是HEAD^，上上一个版本就是 HEAD^^。

2、Git的版本回退速度非常快，因为Git在内部有个指向当前版本的`HEAD`指针，当你回退版本的时候，Git仅仅是把HEAD从指向上一个版本。

```
git reset --hard HEAD^ // 回到上一个版本
git reset --hard 1094a // 回到指定的版本， 版本号是 1094a
```

**你回退到了某个版本，关掉了电脑，第二天早上就后悔了，想恢复到新版本怎么办？找不到新版本的`commit id`怎么办？**

Git提供了一个命令`git reflog`用来记录你的每一次命令， 通过这个命令可以查看到之前使用过的每一个命令， 包括 版本号。然后就可以通过版本号恢复到指定的版本。

```
git reflog
```

总结：

- `HEAD`指向的版本就是当前版本，因此，Git允许我们在版本的历史之间穿梭，使用命令`git reset --hard commit_id`。
- 穿梭前，用`git log`可以查看提交历史，以便确定要回退到哪个版本。
- 要重返未来，用`git reflog`查看命令历史，以便确定要回到未来的哪个版本。

**思考**： 如果文件改动之后只执行了 git add 命令，没有执行 git commit 命令，返回到之前的某个版本后， 还能找到改动的内容吗？

## 6、[工作区与暂存区](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000/0013745374151782eb658c5a5ca454eaa451661275886c6000)

**工作区**

就是你在电脑里能看到的目录，比如我的`learngit`文件夹就是一个工作区：

**版本库（Repository）**

工作区有一个隐藏目录`.git`，这个不算工作区，而是Git的版本库。

Git的版本库里存了很多东西，其中最重要的就是称为**stage**（或者叫index）的暂存区，还有Git为我们自动创建的第一个分支`master`，以及指向`master`的一个指针叫`HEAD`。

**暂存区**

前面讲了我们把文件往Git版本库里添加的时候，是分两步执行的：

第一步是用`git add`把文件添加进去，实际上就是**把文件修改添加到暂存区**；

第二步是用`git commit`提交更改，实际上就是**把暂存区的所有内容提交到当前分支**。

你可以简单理解为，需要提交的文件修改通通放到暂存区，然后，一次性提交暂存区的所有修改。

**思考**： 

暂存区里的内容会因为电脑关机而丢失吗？

## 7、管理修改

**Git跟踪并管理的是修改，而非文件。**

你会问，什么是修改？比如你新增了一行，这就是一个修改，删除了一行，也是一个修改，更改了某些字符，也是一个修改，删了一些又加了一些，也是一个修改，甚至创建一个新文件，也算一个修改。

举个例子：

在第一次修改a文件后， 执行 git add . 命令， 然后第二次修改文件， 执行 git commit 命令，

通过git diff 命令查看差异， 你会发现第二次修改并没有在版本库中。

原因是git 管理的是文件的修改而不是文件本身， 每次提交的都是文件的修改。

文件的修改提交到版本库是通过 add 命令先将工作区的改动添加到 暂存区， 然后通过commit命令将暂存区的内容提交到版本库中。

因为这个例子中工作区第二次修改并没有添加到暂存区， 所以不会提交到版本库中。

<u>git diff 比较的是工作区和暂存区， 在改动文件后就能立刻看到修改。</u>

<u>git diff --cached   比较的是暂存区和版本库， 文件改动只要不add 就看不到修改。</u>

<u>git diff HEAD 比较的是工作区和版本库，在改动文件后就能立刻看到修改。</u>

```
git diff HEAD a.txt
```

-----------------------版本库--------------------------------------------
a                          					  a
|                         					   |
git diff --cached          				 |
|                           					  |
b
-------------暂存区----------------------       git diff HEAD
a
|                                            			|
git diff                                      		     |
|                                                		     |
b                                         			 b
-----工作区--------------------------------------------------------------

## 8、撤销修改

**撤销工作区的修改（还未add到暂存区，这种撤销会使工作区恢复到上一次add或commit）**

```
git checkout -- readme.txt
```

使用情景：

当你在工作区修改内容后， 突然想要放弃这一次所有的修改， 可以使用 checkout 命令丢弃工作区的修改。这里有两种情况：

一种是`readme.txt`自修改后还没有被放到暂存区，现在，撤销修改就回到和版本库一模一样的状态；

一种是`readme.txt`已经添加到暂存区后，又作了修改，现在，撤销修改就回到添加到暂存区后的状态。

总之，就是让这个文件回到最近一次`git commit`或`git add`时的状态。

注意：

切换分支之前如果当前分支有未commit的内容将会报错， 提示先commit才能切换分支。

**撤销暂存区的修改（还未commit， 这种撤销会撤销暂存区， 而工作区的内容不会改变， 如果需要commit则需要再次add到暂存区)**

```
git reset HEAD readme.txt
```

用命令`git reset HEAD <file>`可以把暂存区的修改撤销掉（unstage），重新放回工作区。

`git reset`命令既可以回退版本，也可以把暂存区的修改回退到工作区。当我们用`HEAD`时，表示最新的版本。

**撤销已经提交到版本库的修改（已经commit）**

如果只是提交到本地仓库， 那么可以通过版本回退的方法，回到之前的版本。如果已经提交到远程仓库， 那就惨了。。。

## 9、删除文件

#### 删除文件

在Git中，删除也是一个修改操作， 从仓库中删除文件有两个步骤：

1、本地工作区删除。

```
rm test.txt
```

2、从版本库中删除。

```
git rm test.txt
```

如果在本地删错了文件并且没有从版本库中删除的情况 可以通过checkout将版本库中的文件还原到工作区。

```
git checkout -- test.txt
```

就算删除了也可以恢复到之前的版本进行checkout, 但是只能还原到之前的版本。

在当前版本中删除 a.txt 文件， 执行 checkout 命令将会报下面的错误：

```
error: pathspec 'a.txt' did not match any file(s) known to git
```



思考：

为什么在当前版本中删除后， checkout会报错， 切换到上一个版本后再切回来， checkout却可以找到之前被删掉的文件。

## 10、远程仓库

## 11、添加远程库

## 12、从远程库克隆

## 13、分支管理

分支就是科幻电影里面的平行宇宙，当你正在电脑前努力学习Git的时候，另一个你正在另一个平行宇宙里努力学习SVN。

分支在实际中有什么用呢？假设你准备开发一个新功能，但是需要两周才能完成，第一周你写了50%的代码，如果立刻提交，由于代码还没写完，不完整的代码库会导致别人不能干活了。如果等代码全部写完再一次提交，又存在丢失每天进度的巨大风险。

现在有了分支，就不用怕了。你**创建了一个属于你自己的分支，别人看不到，还继续在原来的分支上正常工作，而你在自己的分支上干活**，想提交就提交，直到开发完毕后，再一次性合并到原来的分支上，这样，既安全，又不影响别人工作。

## 14、[创建与合并分支](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000/001375840038939c291467cc7c747b1810aab2fb8863508000)

在[版本回退](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000/0013744142037508cf42e51debf49668810645e02887691000)里，你已经知道，每次提交，Git都把它们串成一条时间线，这条时间线就是一个分支。截止到目前，只有一条时间线，在Git里，这个分支叫主分支，即`master`分支。`HEAD`严格来说不是指向提交，而是指向`master`，`master`才是指向提交的，所以，`HEAD`指向的就是当前分支。

一开始的时候，`master`分支是一条线，Git用`master`指向最新的提交，再用`HEAD`指向`master`，就能确定当前分支，以及当前分支的提交点：

每次提交，`master`分支都会向前移动一步，这样，随着你不断提交，`master`分支的线也越来越长：

当我们创建新的分支，例如`dev`时，Git新建了一个指针叫`dev`，指向`master`相同的提交，再把`HEAD`指向`dev`，就表示当前分支在`dev`上：

**创建分支**

```
git checkout -b dev // 创建并切换到dev分支

// 相当于下面的两个命令
git branch dev
git checkout dev
```

**查看所有分支**

`git branch`命令会列出所有分支，当前分支前面会标一个`*`号。

```
$ git branch
* dev 
  master

```

然后，我们就可以在`dev`分支上正常提交，比如对readme.txt做个修改，加上一行， 然后提交。

现在dev分支的工作完成了， 我们就可以切换到master分支。

切换回`master`分支后，再查看一个readme.txt文件，刚才添加的内容不见了！因为那个提交是在`dev`分支上，而`master`分支此刻的提交点并没有变。

`git merge`命令用于合并指定分支到当前分支。

```
git merge dev
```

合并完成后，就可以放心地删除`dev`分支了：

```
git branch -d dev
```

**总结：**

- 查看分支：`git branch`

- 创建分支：`git branch <name>`

- 切换分支：`git checkout <name>`

- 创建+切换分支：`git checkout -b <name>`

- 合并某分支到当前分支：`git merge <name>`

- 删除分支：`git branch -d <name>`

## 15、解决冲突

## 16、[分支管理策略](https://www.yiibai.com/git/git_pull.html)

通常，合并分支时，如果可能，Git会用`Fast forward`模式，但这种模式下，删除分支后，会丢掉分支信息。

常用 git 命令

start a working area (see also: git help tutorial)                              
**clone**      Clone a repository into a new directory                          
**init**       Create an empty Git repository or reinitialize an existing one    



work on the current change (see also: git help everyday)                        
**add**        Add file contents to the index                                    
**mv**         Move or rename a file, a directory, or a symlink                  
**reset**      Reset current HEAD to the specified state                         
**rm**         Remove files from the working tree and from the index             



examine the history and state (see also: git help revisions)                    
**bisect**     Use binary search to find the commit that introduced a bug        
**grep**       Print lines matching a pattern                                    
**log**        Show commit logs                                                  
**show**       Show various types of objects                                     
**status**     Show the working tree status                                      

grow, mark and tweak your common history                                        
**branch**     List, create, or delete branches                                  
**checkout**    Switch branches or restore working tree files                    
**commit**     Record changes to the repository                                  
**diff**       Show changes between commits, commit and working tree, etc        
**merge**      Join two or more development histories together                   
**rebase**     

在另一个分支基础之上重新应用，用于把一个分支的修改合并到当前分支。

**tag**        Create, list, delete or verify a tag object signed with GPG       





**fetch**     

**pull**       

取回远程主机某个分支的更新，再与本地的指定分支合并，它的完整格式稍稍有点复杂。

将远程存储库中的更改合并到当前分支中。在默认模式下，`git pull`是`git fetch`后跟`git merge FETCH_HEAD`的缩写。

示例 :

```
git pull <远程主机名> <远程分支名>:<本地分支名>
```

比如，要取回`origin`主机的`next`分支，与本地的`master`分支合并，需要写成下面这样

```
git pull origin next:master
```

如果远程分支(`next`)要与当前分支合并，则冒号后面的部分可以省略。上面命令可以简写为：

```
git pull origin next
```

如果当前分支与远程分支存在追踪关系，`git pull`就可以省略远程分支名。

```
git pull origin
```

如果当前分支只有一个追踪分支，连远程主机名都可以省略。

```
git pull
```



**push**           

用于将本地分支的更新，推送到远程主机。它的格式与`git pull`命令相似。           

语法：

```
git push <远程主机名> <本地分支名>:<远程分支名>
```

示例：

将本地的`master`分支推送到`origin`主机的`master`分支。如果`master`不存在，则会被新建。

```
git push origin master
```

如果省略本地分支名，则表示删除指定的远程分支，因为这等同于推送一个空的本地分支到远程分支。

```
$ git push origin :master
# 等同于
$ git push origin --delete master
```

如果当前分支与远程分支之间存在追踪关系，则本地分支和远程分支都可以省略。

下面的命令表示，将当前分支推送到`origin`主机的对应分支。

```
git push origin
```

 如果当前分支只有一个追踪分支，那么主机名都可以省略。

```
git push
```

如果当前分支与多个主机存在追踪关系，则可以使用`-u`选项指定一个默认主机，这样后面就可以不加任何参数使用`git push`。下面命令将本地的`master`分支推送到`origin`主机，同时指定`origin`为默认主机，后面就可以不加任何参数使用`git push`了。

```
git push -u origin master
```



# Q& A

1、将本地仓库新建的feature分支提交到远程仓库时报下面的错误。

The current branch feature has no upstream branch.                       
To push the current branch and set the remote as upstream, use                  
git push --set-upstream origin feature            

解决办法：

把本地feature分支与远程的feature分支关联， -u表示同时建立关联，以后再推送到远程只需git push。

使用下面的命令即使远程没有你要关联的分支，它也会自动创建一个出来，以实现关联。

```
git push -u origin feature 
```

test
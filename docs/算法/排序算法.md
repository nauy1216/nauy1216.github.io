# 一、排序算法

> 参考文档

- *https://www.cnblogs.com/onepixel/articles/7674659.html*


![](./image/210314-1.png)

### 比较类排序

##### 交换排序

- 冒泡排序

```js
function bubbleSort(arr) {
  varlen = arr.length;
  for (vari = 0; i < len - 1; i++) {
    // 外层循环每执行一次就得到一个排序好的值
    for (varj = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        // 相邻元素两两对比
        vartemp = arr[j + 1]; // 元素交换
        arr[j + 1] = arr[j];
        arr[j] = temp;
      }
    }
  }
  return arr;
}
```

- 快速排序

```js
function quickSort(arr, left, right) {
  var len = arr.length;
  var partitionIndex; // 基准值的位置
  var left = typeof left != "number" ? 0 : left; // 左指针
  var right = typeof right != "number" ? len - 1 : right; // 右指针

  if (left < right) {
    partitionIndex = partition(arr, left, right);
    quickSort(arr, left, partitionIndex - 1);
    quickSort(arr, partitionIndex + 1, right);
  }

  return arr;
}

function partition(arr, left, right) {
  // 分区操作
  var pivot = left; // 设定基准值（pivot）
  var index = pivot + 1;
  for (var i = index; i <= right; i++) {
    if (arr[i] < arr[pivot]) {
      swap(arr, i, index);
      index++;
    }
  }
  swap(arr, pivot, index - 1);
  return index - 1;
}

function swap(arr, i, j) {
  var temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}
```

##### 插入排序

- 简单插入排序

```js
function insertionSort(arr) {
  var len = arr.length;
  var preIndex, current;
  for (var i = 1; i < len; i++) {
    preIndex = i - 1;
    current = arr[i];
    while (preIndex >= 0 && arr[preIndex] > current) {
      arr[preIndex + 1] = arr[preIndex];
      preIndex--;
    }
    arr[preIndex + 1] = current;
  }
  return arr;
}
```

- 希尔插入排序

```js
function shellSort(arr) {
  var len = arr.length;
  for (var gap = Math.floor(len / 2); gap > 0; gap = Math.floor(gap / 2)) {
    // 注意：这里和动图演示的不一样，动图是分组执行，实际操作是多个分组交替执行
    for (var i = gap; i < len; i++) {
      var j = i;
      var current = arr[i];
      while (j - gap >= 0 && current < arr[j - gap]) {
        arr[j] = arr[j - gap];
        j = j - gap;
      }
      arr[j] = current;
    }
  }
  return arr;
}
```

##### 选择排序

- 简单选择排序

```js
function selectionSort(arr) {
  var len = arr.length;
  var minIndex; // 记录当前最小值的索引
  var temp; // 临时变量
  for (var i = 0; i < len - 1; i++) {
    minIndex = i;
    for (var j = i + 1; j < len; j++) {
      if (arr[j] < arr[minIndex]) {
        // 寻找最小的数
        minIndex = j; // 将最小数的索引保存
      }
    }
    temp = arr[i];
    arr[i] = arr[minIndex];
    arr[minIndex] = temp;
  }
  returnarr;
}
```

- 堆排序
  - 基本思路
    - 先把数组构造成大顶堆，大顶堆的特点是父节点大于其子节点
    - 将堆顶和数组的最后一个元素交换，这样就把最大值放到了数组的最后面
    - 把数组长度为n-1的部分重新构造大顶堆，把堆顶放到数组的n-1的位置
    - 重复上面的步骤
  - 堆的特点
    - 是一个完全二叉树
    - 所有子节点的值都小于(或大于)父节点的值
  - 大顶堆
  - 小顶堆
  - 堆排序的时间复杂度O(nlogn)

```js
// 交换两个节点
function swap(A, i, j) {
  let temp = A[i];
  A[i] = A[j];
  A[j] = temp;
}

// 将以节点i为根节点的二叉树调整为大顶堆
function shiftDown(A, i, length) {
  // 当前父节点
  let temp = A[i]; 

  // j的初始值为2*i+1, 即左节点
  for (let j = 2 * i + 1; j < length; j = 2 * j + 1) {
    // 父节点的值
    temp = A[i]; 
    // 比较左右两个子节点的最大值，然后用最大值与父节点比较
    if (j + 1 < length && A[j] < A[j + 1]) {
      j++;
    }
    // 如果最大的子节点大于父节点那么就进行交换, 交换后的以子节点作为根节点的数也要进行调整
    if (temp < A[j]) {
      swap(A, i, j); 
      i = j;
    } else {
      // 如果不需要调整则跳出
      break;
    }
  }
}

// 堆排序
function heapSort(A) {
  // 初始化大顶堆，从第一个非叶子结点开始
  // 从下往上开始构建大顶堆
  for (let i = Math.floor(A.length / 2 - 1); i >= 0; i--) {
    shiftDown(A, i, A.length);
  }

  // 排序，每一次for循环找出一个当前最大值，数组长度减一
  for (let i = A.length - 1; i > 0; i--) {
    swap(A, 0, i); // 根节点与最后一个节点交换
    shiftDown(A, 0, i); // 从根节点开始调整，并且最后一个结点已经为当
    // 前最大值，不需要再参与比较，所以第三个参数
    // 为 i，即比较到最后一个结点前一个即可
  }
}

let Arr = [4, 6, 8, 5, 9, 1, 2, 5, 3, 2];
heapSort(Arr);
alert(Arr);
```

##### 归并排序

- 二路归并排序

```js
function mergeSort(arr) {
  var len = arr.length;
  if (len < 2) {
    return arr;
  }
  var middle = Math.floor(len / 2);
  var left = arr.slice(0, middle);
  var right = arr.slice(middle));
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  var result = [];

  while (left.length > 0 && right.length > 0) {
    if (left[0] <= right[0]) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }

  while (left.length) {
    result.push(left.shift())
  };

  while (right.length) {
    result.push(right.shift())
  };

  returnresult;
}
```

- 多路归并排序

### 非比较类排序

- 计数排序
  > 必须知道数组的组大值。适用于在某一区间的整数无序集合的排序。

```js
function countingSort(arr, maxValue) {
  // 创建以数组arr最大值+1的长度的数组
  var bucket = new Array(maxValue + 1);
  var sortedIndex = 0;
  var arrLen = arr.length;
  var bucketLen = maxValue + 1;

  // 将arr[i]放入到bucket[arr[i]]的位置，没重复一次计数加1
  for (vari = 0; i < arrLen; i++) {
    if (!bucket[arr[i]]) {
      bucket[arr[i]] = 0;
    }
    bucket[arr[i]]++;
  }

  // 遍历bucket, 当计数不为0时往arr写入一个相应的数值。
  for (varj = 0; j < bucketLen; j++) {
    while (bucket[j] > 0) {
      arr[sortedIndex++] = j;
      bucket[j]--;
    }
  }

  return arr;
}
```

- 桶排序

```js
function bucketSort(arr, bucketSize) {
  if (arr.length === 0) {
    return arr;
  }

  var i;
  var minValue = arr[0];
  var maxValue = arr[0];

  for (i = 1; i < arr.length; i++) {
    if (arr[i] < minValue) {
      minValue = arr[i]; // 输入数据的最小值
    } else if (arr[i] > maxValue) {
      maxValue = arr[i]; // 输入数据的最大值
    }
  }

  // 桶的初始化
  var DEFAULT_BUCKET_SIZE = 5; // 设置桶的默认数量为5
  bucketSize = bucketSize || DEFAULT_BUCKET_SIZE;
  var bucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1;
  var buckets = new Array(bucketCount);

  for (i = 0; i < buckets.length; i++) {
    buckets[i] = [];
  }

  // 利用映射函数将数据分配到各个桶中
  for (i = 0; i < arr.length; i++) {
    buckets[Math.floor((arr[i] - minValue) / bucketSize)].push(arr[i]);
  }

  arr.length = 0;

  // 对每个桶进行排序依次加入的arr中
  // 因为桶本身的是有顺序的，第二个桶一定会比第一个桶里的值要大
  for (i = 0; i < buckets.length; i++) {
    insertionSort(buckets[i]); // 对每个桶进行排序，这里使用了插入排序
    for (varj = 0; j < buckets[i].length; j++) {
      arr.push(buckets[i][j]);
    }
  }

  return arr;
}

function insertionSort(arr) {
  var len = arr.length;
  var preIndex, current;
  for (var i = 1; i < len; i++) {
    preIndex = i - 1;
    current = arr[i];
    while (preIndex >= 0 && arr[preIndex] > current) {
      arr[preIndex + 1] = arr[preIndex];
      preIndex--;
    }
    arr[preIndex + 1] = current;
  }
  return arr;
}
```

- 基数排序

# setState

```js
Component.prototype.setState = function (partialState, callback) {
  if (
    !(
      typeof partialState === 'object' ||
      typeof partialState === 'function' ||
      partialState == null
    )
  ) {
    {
      throw Error(
        'setState(...): takes an object of state variables to update or a function which returns an object of state variables.'
      );
    }
  }

  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
```

# workLoopSync

```js
function workLoopSync() {
  // Already timed out, so perform work without checking if we need to yield.
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}
```

```js
function performUnitOfWork(unitOfWork: Fiber): void {
  // The current, flushed, state of this fiber is the alternate. Ideally
  // nothing should rely on this, but relying on it here means that we don't
  // need an additional field on the work in progress.
  const current = unitOfWork.alternate;
  setCurrentDebugFiberInDEV(unitOfWork);

  let next;
  // 开启了ProfileMode
  if (enableProfilerTimer && (unitOfWork.mode & ProfileMode) !== NoMode) {
    startProfilerTimer(unitOfWork);
    next = beginWork(current, unitOfWork, subtreeRenderLanes);
    stopProfilerTimerIfRunningAndRecordDelta(unitOfWork, true);
  } else {
    // 生成链表的下一个fiber节点
    next = beginWork(current, unitOfWork, subtreeRenderLanes);
  }

  resetCurrentDebugFiberInDEV();
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  // 如果next为null, 则表示当前work已经完成了，调用completeUnitOfWork
  if (next === null) {
    // If this doesn't spawn new work, complete the current work.
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }

  ReactCurrentOwner.current = null;
}
```

# beginWork

- beginWork
  - updateHostComponent
    - reconcileChildren(current, workInProgress, nextChildren, renderLanes)

```js
<div className="TestHook">
  <div>
    <span>{count}</span>
  </div>
  <button
    id="test"
    onClick={() => {
      debugger;
      setCount(i++);
      setCount(i++);
      setCount(i++);
    }}
  >
    click
  </button>
</div>
```
```txt
- TestHook
-- div.TestHook
---- 
```
# 1

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

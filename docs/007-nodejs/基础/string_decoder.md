### 

```js
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

const cent = Buffer.from([0xC2, 0xA2]);
console.log(decoder.write(cent));


// 将 Buffer 实例写入 StringDecoder 实例时，会使用一个内部 buffer 来确保解码的字符串不包含任何不完整的多字节字符。 
// 不完整的字符会被保存在该 buffer 中，直到下次调用 stringDecoder.write() 或调用 stringDecoder.end()。
const euro = Buffer.from([0xE2, 0x82]);
console.log(decoder.write(euro)); // 不输出
const euro1 = Buffer.from([0xAC])
console.log(decoder.write(euro1)); // 输出 €
console.log(decoder.write(euro1))  // 乱码
```


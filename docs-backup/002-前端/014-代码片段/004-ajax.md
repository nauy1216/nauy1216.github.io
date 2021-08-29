```js
import axios from 'axios'
import {
  Message
} from 'element-ui'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import eventBus from '@/common/eventBus.js'
import {
  getStorageWithCache,
  getStorage
} from '@/common/utils/storage'

function showError (err) {
  if (err.response) {
    Message.error(err.response.data.message || err.response.config.url + '请求错误');
  } else {
    console.log('Error---ajax-', err)
    Message.error(err.data.message || err.data || err.message);
  }
}

let getUser = getStorageWithCache('user')
export default (type, url, params, responseType, contentType, isresponse, isError) => {
  // 拼凑出erp 需要的四个header内容
  var timestamp = Math.round(new Date().getTime() / 1000);
  var guid = function guid () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  var serialize = function (obj) {
    var str = "";
    if (obj == null || obj == undefined) {
      return str
    }

    Object.keys(obj).forEach(function (key) {
      str += `${key}=${obj[key]}&`;
    });

    return str.trimRight('&');
  }
  axios.defaults.timeout = 30 * 60 * 1000; // 不设置请求超时
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  axios.defaults.headers.common['timestamp'] = timestamp;
  axios.defaults.headers.common['ua'] = '5'; //客户端来源 发胜说先随便填一个 cookieGet("ua")
  axios.defaults.headers.common['source'] = '8';
  axios.defaults.headers.common['sn'] = guid();
  if (getToken() && getToken() != undefined) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + getToken();
    axios.defaults.headers.common['financialCode'] = getStorage('hospitalCode') //当前选择医院
  }
  if (getToken() && (getStorage('channelId') >= 0)) {
    axios.defaults.headers.common['channel_id'] = getStorage('channelId'); //合作渠道需求
  }


  let user = getUser()
  if (user && user.userNo) {
    axios.defaults.headers.common['userRealName'] = encodeURIComponent(user.userRealName);
    axios.defaults.headers.common['userNo'] = user.userNo;
  }

  return new Promise((resolve, reject) => {
    switch (type) {
      case 'post':
        params = serialize(params)
        axios.post(url, params, isresponse)
          .then(response => {
            if (response.status == 200 && response.data.code == 200) {
              if (isresponse) {
                resolve(response); //需要返回全部 不然获取不到头部的分页数据类似情况
              } else {
                resolve(response.data);
              }

            } else if (response.data.message) {
              showError(response)
              if (isresponse) {
                reject(response); //需要返回全部 不然获取不到头部的分页数据类似情况
              } else {
                reject(response.data);
              }
            }
          }, err => {
            if (err.response.status == 401) {
              eventBus.$emit('logout')
              return
            }
            console.log('错误日志', err.response)
            showError(err)
            // Message.error(err.response.data.message);
            reject(err.response)

          })

          .catch((error) => {
            reject(error);
            console.log("post--", error);
          })
        break;
      case 'postJson':
        axios.post(url, params, isresponse)
          .then(response => {
            if (response.status == 200 && response.data.code == 200) {
              if (isresponse) {
                resolve(response); //需要返回全部 不然获取不到头部的分页数据类似情况
              } else {
                resolve(response.data);
              }

            } else {
              showError(response)
              if (isresponse) {
                reject(response); //需要返回全部 不然获取不到头部的分页数据类似情况
              } else {
                reject(response.data);
              }
            }

          }, err => {
            if (err.response.status == 401) {
              eventBus.$emit('logout')
              return
            }
            console.log('错误日志', err.response)
            showError(err)
            // Message.error(err.response.data.message);

            reject(err.response)

          })

          .catch((error) => {
            reject(error);
            console.log("post--", error);
          })
        break;
      case 'download':
        axios.post(url, params, responseType)
          .then(response => {
            if (response.status == 200) {
              resolve(response)

            } else {
              reject(response);
            }

          }, err => {
            if (err.response.status == 401) {
              eventBus.$emit('logout')
              return
            }
            console.log('错误日志', err.response)
            if(err.response.data.type == 'application/json'){
              const fileReader = new FileReader();
              fileReader.onload = function() {
                try {
                  const jsonData = JSON.parse(fileReader.result); // 说明是普通对象数据，后台转换失败
                  console.log('后台返回的信息',jsonData.message);
                  showError(jsonData)
                 // dosomething……
                } catch (err) { // 解析成对象失败，说明是正常的文件流
                  console.log('success...');
                }
              };
              fileReader.readAsText(err.response.data);
            }else{
              showError(err)
            }
            
            // Message.error(err.response.data.message);
            reject(err.response)
          })

          .catch((error) => {
            reject(error);
            console.log("post--", error);
          })
        break;
      case 'downloadbyGet':
        axios.get(url, {
          params,
          responseType: 'blob'
        })
          .then(response => {
            if (response.status == 200) {
              resolve(response)

            } else {
              reject(response);
            }

          }, err => {
            if (err.response.status == 401) {
              eventBus.$emit('logout')
              return
            }
            console.log('错误日志', err.response)
            showError(err)
            // Message.error(err.response.data.message);
            reject(err.response)
          })

          .catch((error) => {
            reject(error);
            console.log("post--", error);
          })
        break;
      case 'get':
        axios.get(url, {
          params
        }, isresponse)
          .then(response => {
            if (response.status == 200 && response.data.code == 200) {
              if (isresponse) {
                resolve(response); //需要返回全部 不然获取不到头部的分页数据类似情况
              } else {
                resolve(response.data);
              }
            } else {
              showError(response)
              if (isresponse) {
                reject(response); //需要返回全部 不然获取不到头部的分页数据类似情况
              } else {
                reject(response.data);
              }
            }

          }, err => {
            if (err.response.status == 401) {
              eventBus.$emit('logout')
              return
            }
            console.log('错误日志', err.response)
            showError(err)
            // Message.error(err.response.data.message);
            reject(err.response)

          })
          .catch((error) => {
            reject(error);
            console.log("get--", error);
          })
        break;
      case 'getA8':
        axios.get(url, {
          params
        }, isresponse)
          .then(response => {
            //console.log('数据aa', response)
            if (response.status == 200) {
              if (isresponse) {
                resolve(response); //需要返回全部 不然获取不到头部的分页数据类似情况
              } else {
                resolve(response.data);
              }
            } else {
              if (isresponse) {
                reject(response); //需要返回全部 不然获取不到头部的分页数据类似情况
              } else {
                reject(response.data);
              }
            }

          }, err => {
            if (err.response.status == 401) {
              eventBus.$emit('logout')
              return
            }
            console.log('错误日志', err.response)
            showError(err)
            // Message.error(err.response.data.message);
            reject(err.response)

          })
          .catch((error) => {
            reject(error);
            console.log("get--", error);
          })
        break;
      case 'put':
        axios.put(url, {
          params
        }, isresponse)
          .then(response => {
            if (response.status == 200 && response.data.code == 200) {
              if (isresponse) {
                resolve(response); //需要返回全部 不然获取不到头部的分页数据类似情况
              } else {
                resolve(response.data);
              }
            } else {
              showError(response)
              if (isresponse) {
                reject(response); //需要返回全部 不然获取不到头部的分页数据类似情况
              } else {
                reject(response.data);
              }
            }

          }, err => {
            if (err.response.status == 401) {
              eventBus.$emit('logout')
              return
            }
            console.log('错误日志', err.response)
            showError(err)
            // Message.error(err.response.data.message);
            reject(err.response)

          })
          .catch((error) => {
            reject(error);
            console.log("put--", error);
          })
        break;
    }

  })
}
```
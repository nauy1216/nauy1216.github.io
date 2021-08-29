# 封装

```js
'use strict'

const win = window
const doc = document
const support = {
    XHR2: !!win.FormData,
    Promise: !!win.Promise,
    DefineProperty: Object.prototype.hasOwnProperty('defineProperty'),
}
const _contentTypes = {
    html: 'text/html',
    json: 'application/json',
    file: 'multipart/form-data',
    text: 'text/plain',
    form: 'application/x-www-form-urlencoded',
    _default: 'application/x-www-form-urlencoded',
}
const _accepts = {
    xml: 'application/xml, text/xml',
    html: 'text/html',
    script: 'text/javascript',
    json: 'application/json',
    text: 'text/plain',
    _default: 'application/json, text/plain, */*',
}
const _options = {
    timeout: false,
    async: true,
    header: {
        Accept: _accepts['_default'],
        'Content-Type': _contentTypes['_default'],
    },
    charset: 'utf-8',
    host: '',
    jsonpName: 'jsonp',
    jsonpParam: 'callback',
    convert: null,
    dev: false,
}
const _encodeMethods = {
    'application/json': function (data) {
        isType(data, 'object') && (data = JSON.stringify(data))
        return data
    },
    'text/plain': function (data) {
        !isType(data, 'string') && (data = '')
        return data
    },
    'application/x-www-form-urlencoded': function (data) {
        let temp = ''
        let _this = this
        if (isType(data, 'object')) {
            forEach(data, function (value, key) {
                if (typeof value !== 'undefined') {
                    temp += '&' + key + '=' + encodeURI(value)
                } else if (_this.options.dev) {
                    warn(
                        key +
                            ' of the data sent to ' +
                            _this.url +
                            ' is undefined, so it will be removed from the sent data'
                    )
                }
            })
        }
        data = temp.substring(1)
        return data
    },
    formData: function (data) {
        if (isType(data, 'object') && support.XHR2) {
            let temp = new FormData()
            let _this = this
            forEach(data, function (value, key) {
                if (isType(value, 'FileList')) {
                    forEach(value, function (file) {
                        temp.append(key, file)
                    })
                } else {
                    if (typeof value !== 'undefined') {
                        temp.append(key, value)
                    } else if (_this.options.dev) {
                        warn(
                            key +
                                ' of the data sent to ' +
                                _this.url +
                                ' is undefined, so it will be removed from the sent data'
                        )
                    }
                }
            })
            data = temp
        }
        return data
    },
}
const _LargeCamelReg = /^\w+(-\w+)+/
const _DataType = / (\w+)]/
const pool = [] // xhr对象池
// 警告信息
function warn(info) {
    if (typeof console.warn === 'function') {
        console.warn('extend-ajax warn: ' + info)
    } else {
        console.log('extend-ajax warn: ' + info)
    }
}

function extend(target, source, filter) {
    let key, flag
    !target && (target = {})
    for (key in source) {
        flag = true
        filter &&
            forEach(filter, function (filterKey) {
                filterKey === key && (flag = false)
            })
        if (flag) {
            target[key] =
                key === 'header' ? extend(target[key] || {}, source[key] || {}) : source[key]
        }
    }
    return target
}

function cloneObject(obj) {
    let source
    if (isType(obj, 'object')) {
        source = {}
    } else if (isType(obj, 'array')) {
        source = []
    } else {
        return null
    }
    return (function clone(obj, source) {
        if (isType(obj, 'object')) {
            let key
            for (key in obj) {
                if (isType(obj[key], 'object')) {
                    source[key] = clone(obj[key], {})
                } else if (isType(obj[key], 'array')) {
                    source[key] = clone(obj[key], [])
                } else {
                    source[key] = obj[key]
                }
            }
        }
        return source
    })(obj, source)
}

function toLargeCamel(str) {
    if (_LargeCamelReg.test(str)) {
        str = str.split('-')
        forEach(str, function (item, index) {
            str[index] = item.replace(/^\w/, function (char) {
                return char.toUpperCase()
            })
        })
        str = str.join('-')
    }
    return str
}

function toArray(likeArray) {
    return [].slice.call(likeArray)
}

function protect(obj, propertys) {
    if (support.DefineProperty) {
        forEach(propertys, function (property) {
            Object.defineProperty(obj, property, {
                writable: false,
                enumerable: false,
            })
        })
    }
}

// 将响应头字符串转换成对象
function getHeader(xhr) {
    let headerStr = xhr.getAllResponseHeaders()
    let itemsStr = headerStr.split('\n')
    let header = {}
    itemsStr.pop()
    forEach(itemsStr, function (itemStr) {
        let item = itemStr.replace(' ', '').split(':')
        header[item[0].toLowerCase()] = item[1]
    })
    return header
}

// 将对象obj的所有key都变成大驼峰
function setKeyToLargeCamel(obj) {
    for (let key in obj) {
        let temp = obj[key]
        delete obj[key]
        obj[toLargeCamel(key)] = temp
    }
}

function toStandardHeader(header) {
    forEach(header, function (value, key) {
        let isContentType = key === 'Content-Type'
        let isAccept = key === 'Accept'
        isContentType && (value = _contentTypes[value] || value)
        isAccept && (value = _accepts[value] || value)
        header[key] = value
    })
}

function setHeader(xhr, header, charset) {
    forEach(header, function (value, key) {
        if (value) {
            key === 'Content-Type' && value !== 'formData' && (value += '; charset=' + charset)
            ;(value === 'formData' && key === 'Content-Type') || xhr.setRequestHeader(key, value)
        }
    })
}

function forEach(items, cb) {
    let i, len
    if (isType(items, 'array') || items.length) {
        for (i = 0, len = items.length; i < len; i++) {
            cb(items[i], i) && (i = len)
        }
    } else if (isType(items, 'object')) {
        for (i in items) {
            if (cb(items[i], i)) {
                break
            }
        }
    }
}

function isType(data, type) {
    let expectType = _DataType.exec(Object.prototype.toString.call(data))[1].toLowerCase()
    return type.toLowerCase() === expectType
}

// 创建兼容性xhr对象
function createXHR() {
    let activeXs = ['Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.3.0', 'Msxml2.XMLHTTP']
    let xhr
    try {
        xhr = new XMLHttpRequest()
    } catch (e) {
        forEach(activeXs, function (activeX) {
            try {
                xhr = new window.ActiveXObject(activeX)
                return xhr
            } catch (e) {}
        })
    }
    return xhr
}

// 获取xhr对象
function getXhr() {
    let xhr
    if (pool.length === 0) {
        xhr = createXHR()
    } else {
        // 取出第一个xhr
        xhr = pool.shift()
    }
    return xhr
}

function addXHR2Listener(xhr) {
    let callback = ['abort', 'progress']
    let _this = this
    forEach(callback, function (event) {
        xhr['on' + event] = function (e) {
            _this.emit(event, e, xhr.status, getHeader(xhr))
        }
    })
}

function addXHRListener(xhr, options) {
    let timeout = options.timeout
    let timer = null
    let _this = this
    xhr.onreadystatechange = function (e) {
        let readyState = xhr.readyState
        let status
        let responseText
        let convert = options.convert
        let res = {}
        if (readyState === 4) {
            responseText = xhr.responseText
            status = xhr.status
            res.status = status
            res.header = getHeader(xhr)
            res.data = isType(convert, 'function') ? convert(responseText) : responseText
            timer && clearTimeout(timer)
            if ((status >= 200 && status < 300) || status === 304) {
                _this.emit('success', res)
            } else {
                res.error = new Error('request fail:' + status)
                _this.emit('fail', res)
            }
        } else if (readyState === 1) {
            _this.emit('start')
            if (isType(timeout, 'number')) {
                timer = setTimeout(function () {
                    res.error = new Error('request timeout')
                    _this.emit('timeout')
                }, timeout)
            }
        }
    }
}

function createScript(url) {
    let script = doc.createElement('script')
    let _this = this
    let timeout = this.options.timeout
    let timer = null
    let body = doc.body
    this.script = script
    script.src = url
    script.type = 'text/javascript'
    if (timeout) {
        timer = setTimeout(function () {
            timer = script.onreadystatechange = script.onload = script.onerror = null
            _this.jsonpTimeout = true
            body.removeChild(script)
            _this.emit('timeout')
        }, timeout)
    }
    _this.emit('start')
    body.appendChild(script)

    function load() {
        if (!script.getAttribute('data-load')) {
            _this.emit('fail')
            script.onerror = null
            body.removeChild(script)
        }
        script.onload = script.onreadystatechange = null
        clearTimeout(timer)
        win[_this.options.jsonpName] = null
    }

    script.onreadystatechange = function () {
        if (
            script.readyState &&
            (script.readyState === 'loaded' || script.readyState === 'complete')
        ) {
            load()
        }
    }
    script.onload = load
    script.onerror = function () {
        clearTimeout(timer)
        _this.emit('fail')
        win[_this.options.jsonpName] = null
        body.removeChild(script)
    }
}

function addJSONPCallback(cb) {
    let _this = this
    win[this.options.jsonpName] = function () {
        _this.script.setAttribute('data-load', true)
        if (!_this.jsonpTimeout) {
            cb.apply(null, arguments)
        }
    }
}

function addFormListener(form, options) {
    let id = +new Date()
    let iframe = doc.createElement('frame')
    let res = {}
    let convert = options.convert
    let timeout = options.timeout
    let timer = null
    let _this = this
    let initLoad = true
    let submit = form.submit
    iframe.name = form.target = id
    iframe.style.cssText = 'display:none'
    doc.body.appendChild(iframe)
    res.status = null
    res.header = null
    let load = function () {
        clearTimeout(timer)
        if (!initLoad) {
            let responseText = iframe.contentWindow.document.body.innerText
            res.data = isType(convert, 'function') ? convert(responseText) : responseText
            _this.emit('success', res)
        }
    }
    let createTimer = function (e) {
        initLoad = false
        _this.emit('start')
        if (timeout) {
            clearTimeout(timer)
            timer = setTimeout(function () {
                try {
                    iframe.removeEventListener('load', load)
                } catch (e) {
                    iframe.detachEvent('load', load)
                }
                _this.emit('timeout')
            }, timeout)
        }
        return false
    }
    form.submit = function () {
        submit.call(form)
        createTimer()
    }
    try {
        iframe.addEventListener('load', load)
        form.addEventListener('submit', createTimer)
    } catch (e) {
        iframe.attachEvent('load', load)
        form.attachEvent('submit', createTimer)
    }
}

function encodeData(data, contentType, _this) {
    return _encodeMethods[contentType] ? _encodeMethods[contentType].call(_this, data) : ''
}

// ajax对象
// 初始化ajax对象,创建xhr对象或者从对象池中取出
let Ajax = function (...args) {
    let url = args.shift() || ''
    let type = typeof args[0] === 'string' ? args[0] || 'post' : 'post'
    let options = args[1] ? args[1] || {} : args[0]
    let formElement = typeof url === 'object' ? url : null
    formElement && (url = null)
    if (options && options.header) {
        setKeyToLargeCamel(options.header)
        toStandardHeader(options.header)
    }
    this.xhr = type === 'jsonp' ? null : getXhr()
    this.type = type
    this.url = url
    this.formElement = formElement
    this.options = extend(cloneObject(Ajax.options || _options), options, ['host'])
    if (formElement) {
        addFormListener.call(this, formElement, this.options)
    }
}
let _ajax = Ajax.prototype
extend(_ajax, {
    on: function (event, cb) {
        if (isType(cb, 'function')) {
            if (event === 'success' && !this.xhr && !this.formElement) {
                addJSONPCallback.call(this, cb)
            } else {
                this['$' + event] = cb
                protect(this, ['$' + event])
            }
        }
        return this
    },
    stop: function () {
        typeof this.xhr.abort === 'function' && this.xhr.abort()
    },
    then: function (cb) {
        if (this.xhr) {
            isType(cb, 'function') && this.on('success', cb)
        } else {
            throw new Error("extend-ajax can't use then() with jsonp, it must use on('sucesss')")
        }
    },
    send: function (data) {
        if (this.formElement) {
            return
        }
        let type = this.type
        let xhr = this.xhr || type === 'jsonp' ? this.xhr : getXhr()
        let url = this.url
        let options = this.options
        let async = options.async
        let query = options.query
        let rootHost = Ajax.options.host
        let isGet = type === 'get'
        let _this = this

        if (support.XHR2 && xhr) {
            addXHR2Listener.call(this, xhr, options)
        }
        let addListener = function () {
            if (xhr) {
                addXHRListener.call(_this, xhr, options)
            }
        }
        if (support.Promise) {
            this.promise = new Promise(function (resolve) {
                addListener()
                _this.resolve = resolve
            })
            protect(this, ['promise', 'resolve'])
        } else {
            addListener()
        }

        if (isType(rootHost, 'object') && isType(this.host, 'string')) {
            url = rootHost[this.host] + url
        } else if (isType(rootHost, 'string')) {
            url = rootHost + url
        }
        this.data = data
        if (xhr) {
            query &&
                (query = encodeData(query, _contentTypes['form'], this)) &&
                (url += '?' + query)
            data = isGet
                ? encodeData(data, _contentTypes['form'], this)
                : encodeData(data, options.header['Content-Type'], this)
            xhr.open(type, url, async)
            setHeader(xhr, options.header, options.charset)
            xhr.send(data)
        } else {
            // jsonP
            query = query || {}
            query[options.jsonpParam] = options.jsonpName
            ;(query = encodeData(query, _contentTypes['form'], this)) && (url += '?' + query)
            createScript.call(this, url)
        }
        return xhr ? this.promise || this : this
    },
    emit: function () {
        let args = toArray(arguments)
        let event = args.shift()
        if (this.promise && this.resolve && (event === 'success' || event === 'fail')) {
            this.resolve(args[0])
        }
        this['$' + event] && this['$' + event].apply(null, args)
        // 请求失败 成功,都会触发end
        if (event !== 'progress' && event !== 'end' && event !== 'start') {
            this.emit('end')
            pool.length <= Ajax.poolSize && pool.push(this.xhr)
        }
    },
})
extend(Ajax, {
    config: function (options) {
        if (typeof options === 'object') {
            options.header && setKeyToLargeCamel(options.header) && toStandardHeader(options.header)
            extend(this.options, options)
        }
    },
    options: _options,
    poolSize: 10,
    form: function (id, options) {
        let formElement = doc.getElementById(id)
        if (!formElement) {
            throw new Error('Html element selected is null')
        } else if (!formElement.nodeName.toLowerCase() === 'form') {
            throw new Error('Html element selected must be form element')
        }
        return new Ajax(formElement, null, options)
    },
})
protect(_ajax, ['emit'])

export default {
    request(url, type, options) {
        return new Ajax(url, type, options)
    },
    get(url, data) {
        return new Ajax(url, 'get', {
            headers: {},
            query: data,
        })
            .send()
            .then(({ data }) => {
                return JSON.parse(data)
            })
    },
    post(url, data) {
        return new Ajax(url, 'post', {
            headers: {
                Accept: 'json',
            },
        })
            .send(data)
            .then(({ data }) => {
                return JSON.parse(data)
            })
    },
    jsonp(url, data, options = {}) {
        return new Promise((resolve, reject) => {
            let jsonpName =
                options.jsonpName ||
                'jsonp_' + Date.now() + '_' + parseInt(Math.random() * 1000, 10)
            const jsonp = new Ajax(url, 'jsonp', {
                query: data,
                jsonpName: jsonpName,
            })
            jsonp.on('success', data => {
                resolve(data)
            })
            jsonp.send()
        })
    },
}
```

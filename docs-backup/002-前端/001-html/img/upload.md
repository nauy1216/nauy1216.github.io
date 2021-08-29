### 封装图片处理

```js
(function(win) {
let imageInput = null

/* 选择图片, 可以返回File对象或者URL.createObjectURL(file)返回的地址 */
function chooseImage (options = {}) {
    options = Object.assign({
        transformUrl: true,
        count: 1,
        sourceType: ['camera']
    }, options)

    return new Promise((resolve, reject) => {
        // 移除已有的input
        if (imageInput) {
            document.body.removeChild(imageInput)
            imageInput = null
        }
        // 创建新的input
        imageInput = _createInput(options)
        document.body.appendChild(imageInput)

        imageInput.addEventListener('change', function (event) {
            const tempFilePaths = []
            const tempFiles = []
            const fileCount = event.target.files.length
            for (let i = 0; i < fileCount; i++) {
                const file = event.target.files[i]
                if (options.transformUrl) {
                    // 转换成url
                    const filePath = fileToUrl(file)
                    tempFilePaths.push(filePath)
                    tempFiles.push({
                        path: filePath,
                        size: file.size
                    })
                } else {
                    tempFilePaths.push(file)
                    tempFiles.push({
                        path: file,
                        size: file.size
                    })
                }
            }
            resolve({
                tempFilePaths: tempFilePaths,
                tempFiles: tempFiles
            })
        })
        
        // 手动触发点击事件
        imageInput.click()
    })
}

/* 动态创建input */
function _createInput(options) {
    let inputEl = document.createElement('input')
    inputEl.type = 'file'
    inputEl.style.cssText = `position: absolute; visibility: hidden; z-index: -999; width: 0; height: 0; top: 0; left: 0;`
    inputEl.accept = 'image/*'
    if (options.count > 1) {
        inputEl.multiple = 'multiple'
    }
    // 经过测试，仅能限制只通过相机拍摄，不能限制只允许从相册选择。
    if (options.sourceType.length === 1 && options.sourceType[0] === 'camera') {
        inputEl.capture = 'camera'
    }
    return inputEl
}


function readFile(file, type) {
    return new Promise((resolve, reject) => {
        let reader  = new FileReader()
        reader[type](file)
        reader.onload = function(event) {
            resolve(event.target.result)
        }
    })
}

/** 读取文件为base64 */
function fileTobase64(file) {
    return readFile(file, 'readAsDataURL')
}

/** 读取文件为blob */
function fileToBlob(file) {
    return readFile(file, 'readAsArrayBuffer').then(arrayBuffer => {
        return new Blob([arrayBuffer])
    })
}

/* 从本地file或者blob对象创建url */
// TODO 这里应该做缓存
function fileToUrl (file) {
    // for (const key in files) {
    //     if (files.hasOwnProperty(key)) {
    //         const oldFile = files[key]
    //         if (oldFile === file) {
    //             return key
    //         }
    //     }
    // }
    let url = (window.URL || window.webkitURL).createObjectURL(file)
    // files[url] = file
    return url
}


/* 通过图片的地址获取 */
function urlToBase641(filePath, callback) {
    let newImg = document.createElement('img')
    newImg.src = filePath
    newImg.onload = function() {
        transform(newImg, callback)
    }
    
    // 转换图片
    function transform(img, callback) {
        console.log('尺寸',img.width, img.height)
        EXIF.getData(img, function() {
            debugger
            // 如果是手机拍摄的图片会带有Orientation信息, 导致图片会旋转
            console.log('Orientation', EXIF.getTag(this, 'Orientation'))
            let orientation = EXIF.getTag(this, 'Orientation') || 6

            let width = img.width
            let height = img.height
            let ratio = width / height
            if(width > 1000){
                width = 1000
                height = 1000 / ratio
            }	

            let canvas, ctx, img64
            canvas = document.createElement('canvas')
            switch (orientation) {
                case 6: {
                    // 需要旋转90度
                    canvas.width = height
                    canvas.height = width
                    ctx = canvas.getContext("2d")
                    ctx.fillStyle = '#ffffff'
                    ctx.fillRect(0, 0, height, width)
                    ctx.rotate(90/180*Math.PI)
                    ctx.translate(0,-height)
                    break
                }
                    
                case 3: {
                    // 需要旋转180度
                    canvas.width = width
                    canvas.height = height
                    ctx = canvas.getContext("2d")
                    ctx.fillStyle = '#ffffff'
                    ctx.fillRect(0, 0, width, height)
                    ctx.rotate(Math.PI)
                    ctx.translate(-width,-height)
                    break
                }

                case 8: {
                    // 需要旋转-90度
                    canvas.width = height
                    canvas.height = width
                    ctx = canvas.getContext("2d")
                    ctx.fillStyle = '#ffffff'
                    ctx.fillRect(0, 0, height, width)
                    ctx.rotate(-90/180*Math.PI)
                    ctx.translate(-width,0)
                    break
                }

                default: {
                    canvas.width = width
                    canvas.height = height
                    ctx = canvas.getContext("2d")
                    ctx.fillStyle = '#ffffff'
                    ctx.fillRect(0, 0, width, height)
                }
            }
            ctx.drawImage(img, 0, 0, width, height)
            img64 = canvas.toDataURL("image/jpeg", ratio)
            callback(img64)
        })
    }
}

/* 根据url获取文件 */
function urlToFile (url) {
    // let file = files[url]
    // if (file) {
    //     return Promise.resolve(file)
    // }

    // base64数据
    if (/^data:[a-z-]+\/[a-z-]+;base64,/.test(url)) {
        return Promise.resolve(base64ToFile(url))
    }
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.responseType = 'blob'
        xhr.onload = function () {
            resolve(this.response)
        }
        xhr.onerror = reject
        xhr.send()
    })
}

/**
 * TODO: 这里可以优化
 * 解决两个问题：
 * 1、怎么拿到图片文件？
 * （1）通过img加载图片， document.createElement('img') 或者 new Img()
 * （2）通过XMLHttpRequest请求图片, 可能会产生跨域的问题
 * 2、怎么将图片文件转成base64的数据？
 * （1）用FileReader读取base64的数据
 * （2）使用canvas转化
 * @param {url} url 
 */
function urlToBase64(url) {
    return new Promise((resolve, reject) => {
        let img = document.createElement('img')
        img.src = url
        img.onload = function() {
            let canvas = document.createElement('canvas')
            let width = canvas.width = img.width
            let height = canvas.height = img.height
            let ctx = canvas.getContext("2d")
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(0, 0, width, height)
            ctx.drawImage(img, 0, 0, width, height)
            let img64 = canvas.toDataURL("image/jpeg", 1)
            resolve(img64)
        }
    })
}

function urlToBlob(url) {
    return urlToFile(url)
}


/** base64转File */
function base64ToFile(base64) {
    base64 = base64.split(',')
    let type = base64[0].match(/:(.*?);/)[1]
    let str = atob(base64[1])
    let n = str.length
    let array = new Uint8Array(n)
    while (n--) {
        array[n] = str.charCodeAt(n)
    }
    let filename = `${Date.now()}.${type.split('/')[1]}`
    return new File([array], filename, { type: type })
}

/**  */
function base64ToUrl(base64) {
    let file = base64ToFile(base64)
    return fileToUrl(file)
}

/** */
function base64ToBlob(base64) {
    base64 = base64.split(',')
    let type = base64[0].match(/:(.*?);/)[1]
    let str = atob(base64[1])
    let n = str.length
    let array = new Uint8Array(n)
    while (n--) {
        array[n] = str.charCodeAt(n)
    }
    return new Blob([array], { type: type })
}

/**
 * 
 * @param {*} blob 
 * @param {*} fileName 
 * @param {*} fileType 
 */
function blobToFile(blob, fileName, fileType) {
    let file = new File([blob], fileName, {type: fileType})
    return  file
}


// 上传
function upload (options = {}) {
    let {
        url,  // 上传地址
        file, // 文件
        name, // 文件对应的name字段
        header, // 请求头
        formData, // 表单数据
        onprogress,
        onerror
    } = options

    urlToFile(url).then(() => {
        let xhr = new XMLHttpRequest()
        let form = new FormData()
        // 其他参数
        Object.keys(formData).forEach(key => {
            form.append(key, formData[key])
        })
        // 文件
        form.append(name, file, file.name || `file-${Date.now()}`)
        xhr.open('POST', url)
        // 请求头
        Object.keys(header).forEach(key => {
            xhr.setRequestHeader(key, header[key])
        })

        xhr.upload.onprogress = function (event) {
            typeof onprogress == 'function' && onprogress(event)
        }

        xhr.onerror = function () {
            typeof onerror == 'function' && onerror()
        }

        xhr.onabort = function () {

        }

        xhr.onload = function () {

        }

        xhr.send(form)
    })
}

// 下载
// https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js
function download(src, name = 'text.jpg') {
    let a = document.createElement('a')
    a.download = name
    a.rel = 'noopener' // tabnabbing
    if (typeof src == 'string') {
        a.href = src
    } else {
        a.href = fileToUrl(src)
    }
    setTimeout(function () { a.click() }, 0)
}

win.ImgChoose = {
    chooseImage,

    fileToUrl,
    fileTobase64,
    fileToBlob,

    base64ToFile,
    base64ToUrl,
    base64ToBlob,

    urlToBase64,
    urlToFile,
    urlToBlob,

    blobToFile,
    // blobToUrl, // 与fileToUrl一致
    // blobTobase64, // 与fileTobase64一致

    upload,
    download
}
})(window)
```





### 实例

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <script src="https://cdn.bootcss.com/exif-js/2.3.0/exif.js"></script>
    <script src="img.js"></script>
    <style>
        div {
            height: 20px;
        }
    </style>
</head>
<body>
    <button onclick="file2UrlObject()">File --> URLObject</button>
    <button onclick="file2base64()">File --> base64</button>
    <button onclick="file2blob()">File --> blob</button>
    <div></div>
    <button onclick="base642file()">base64 --> File</button>
    <button onclick="base642Url()">base64 --> URLObject</button>
    <button onclick="base642blob()">base64 --> blob</button>
    <div></div>
    <button onclick="url2file()">URLObject --> File</button>
    <button onclick="url2base64()">URLObject --> base64</button>
    <button onclick="url2blob()">URLObject --> blob</button>
    <div></div>
    <button onclick="blob2File()">blob --> File</button>
    <div></div>
    <img style="width: 200px;" id="img" />


    <script>
        function file2UrlObject() {
            ImgChoose.chooseImage().then(files => {
                // 获取url
                console.log(files)
            })
        }

        function file2base64() {
            ImgChoose.chooseImage({
                transformUrl: false
            }).then(files => {
                // 获取File
                console.log(files)
                ImgChoose.fileTobase64(files.tempFilePaths[0]).then(base64 => {
                    console.log(base64)
                })
            })
        }

        function file2blob() {
            ImgChoose.chooseImage({
                transformUrl: false
            }).then(files => {
                // 获取File
                console.log(files)
                ImgChoose.fileToBlob(files.tempFilePaths[0]).then(blob => {
                    console.log(blob)
                    ImgChoose.download(blob)
                })
            })
        }


        function base642file() {
            ImgChoose.chooseImage({
                transformUrl: false
            }).then(files => {
                // 获取File
                console.log(files)
                ImgChoose.fileTobase64(files.tempFilePaths[0]).then(base64 => {
                    console.log(base64)
                    let file = ImgChoose.base64ToFile(base64)
                    console.log(file)
                    // test
                    ImgChoose.fileTobase64(file).then(data => {
                        showImg(data)
                    })
                })
            })
        }

        function base642Url() {
            ImgChoose.chooseImage({
                transformUrl: false
            }).then(files => {
                // 获取File
                console.log(files)
                ImgChoose.fileTobase64(files.tempFilePaths[0]).then(base64 => {
                    console.log(base64)
                    let url = ImgChoose.base64ToUrl(base64)
                    console.log(url)
                    // test
                    showImg(url)
                })
            })
        }

        function base642blob() {
            ImgChoose.chooseImage({
                transformUrl: false
            }).then(files => {
                // 获取File
                console.log(files)
                ImgChoose.fileTobase64(files.tempFilePaths[0]).then(base64 => {
                    console.log(base64)
                    let blob = ImgChoose.base64ToBlob(base64)
                    console.log(blob)
                    // test
                    ImgChoose.fileTobase64(blob).then(data => {
                        showImg(data)
                    })
                })
            })
        }


        function url2file() {
            ImgChoose.chooseImage().then(files => {
                // 获取url tempFilePaths
                console.log(files)
                ImgChoose.urlToFile(files.tempFilePaths[0]).then(file => {
                    console.log('url2file', file)
                    // ImgChoose.fileTobase64(file).then(base64 => {
                    //     console.log(base64)
                    //     showImg(base64)
                    // })
                })
            })
        }

        function url2base64() {
            ImgChoose.chooseImage().then(files => {
                // 获取url tempFilePaths
                console.log(files)
                ImgChoose.urlToBase64(files.tempFilePaths[0]).then(file => {
                    console.log('urlToBase64', file)
                    showImg(file)
                })
            })
        }


        function url2blob() {
            ImgChoose.chooseImage().then(files => {
                // 获取url tempFilePaths
                console.log(files)
                ImgChoose.urlToBase64(files.tempFilePaths[0]).then(file => {
                    console.log('urlToBase64', file)
                    showImg(file)
                })
            })
        }

        function blob2File() {
            ImgChoose.chooseImage().then(files => {
                // 获取url tempFilePaths
                console.log(files)
                ImgChoose.urlToFile(files.tempFilePaths[0]).then(file => {
                    console.log('blob2File', file)
                    let f = ImgChoose.blobToFile(file, 'test', 'image/png')
                    console.log(f)

                    ImgChoose.fileTobase64(f).then(base64 => {
                        console.log(base64)
                        // test
                        showImg(base64)
                    })
                    // showImg(base64)
                })
            })
        }



        function showImg(src) {
            document.getElementById('img').src = src
        }

        function handleClick() {
            // debugger
            ImgChoose.chooseImage(function(data) {
                console.log('data', data)
                ImgChoose.urlToBase64(data.tempFilePaths[0], function(base64) {
                    // console.log(base64)
                    // document.getElementById('img').src = base64

                    let file = ImgChoose.base64ToFile(base64)
                    let url = ImgChoose.fileToUrl(file)
                    console.log(url)
                    ImgChoose.download(url)
                })
                
                // urlToFile(data.tempFilePaths[0])
            })
        }
    </script>
</body>
</html>
```


写纯函数，不要写类
函数用 const funcname = ()=>{} 这种格式来定义, 不要用 function 定义函数
包用 bun i 安装
模块用 import 导入
超过一个英文单词的变量名用中文
用 await 不要用 .then
用最现代的 nodejs 写法
加密和解密用 Web Crypto API
二进制数据尽量用 Uint8Array
获取当前 js 的目录用 import.meta.dirname 不要用 import.meta.url 来获取目录
js 文件默认导出都写 default
网络请求直接用原生的 fetch ( 不要用 node-fetch )
不要处理异常,不要写 try catch
不要写函数注释
用最现代的 nodejs 写法
函数用 const funcname = ()=>{} 这种格式来定义, 不要用 function 定义函数
import 导入函数，避免直接导入模块
命名要极简，变量名用下划线风格，函数名用小写驼峰风格
用 await 不要用 .then
写纯函数，不要写类
注重代码复用，多定义函数，避免出现大量类似的代码结构
加密和解密用 Web Crypto API
二进制数据尽量用 Uint8Array
js 文件默认导出都写 default
网络请求直接用原生的 fetch ( 不要用 node-fetch )
除了重试等少数情况，避免写 try catch，直接让异常冒泡
用 import.meta.dirname 获取当前目录
不要写函数注释
包用 bun i 安装
只用一次的常量直接内联为参数（可加注释）
const 尽可能合并声明
避免多行 console.log，用模板字符串合并
避免重复字符串，定义为常量
代码要正确、高效、简洁、优雅
如无需全部遍历优先用 for 循环,而不是迭代器
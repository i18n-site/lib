用 bun i 安装依赖
用最现代的 js 写法
不写注释
const 定义的常量要大写，函数用驼峰风格命名
函数用 const funcname = ()=>{} 这种格式来定义, 不要用 function 定义函数
合并多个连续的 const 声明为一个,要写 `const a=1, b=2, c=3;`（而不是 `const a=1;const b=2;const c=3`）
import 导入函数，避免直接导入模块
命名要极简，变量名用下划线风格，函数名用小写驼峰风格
用 await 不要用 .then
写纯函数，不要写类
注重代码复用，多定义函数，避免出现大量类似的代码结构
加密和解密用 Web Crypto API
二进制数据尽量用 Uint8Array
js 文件默认导出都写 default
不要处理异常,不要写 try catch
用 import.meta.dirname 获取当前目录
拆分模块的时候，直接 export default（而不是先声明常量，然后 export default)
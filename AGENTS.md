# JS 代码规范

## 依赖管理

- 使用 `bun i` 安装依赖

## 语法与结构

- 采用最现代的 JavaScript 语法
- 纯函数优先：只写纯函数，绝对不要写 class
- 函数定义：统一使用箭头函数 `const funcName = () => {}`，不使用 `function` 关键字(生成器除外)
- 变量声明：合并多个连续的 `const` 声明为一个语句。要写 `const a=1, b=2, c=3;`，而不是分三行写
- 异步处理：统一使用 `await`，禁止使用 `.then` 链式调用
- 极致精简：
  - 不写注释
  - 不要处理异常，不写 `try...catch`（已有的 try catch 除外）
- 代码复用：注重复用，多提取小函数，坚决避免出现大量类似或复制粘贴的代码结构
- 对象访问：优先使用解构赋值提取需要的属性，避免内部反复使用点号访问深层和嵌套属性，并合并重复的可选链判断

## 命名规范

- 命名追求极简原则。使用尽量短但有意义的命名
- 变量名：使用下划线风格 (snake_case)，例如 `user_auth_token`
- 函数名：使用小写驼峰风格 (camelCase)，例如 `getUserData`
- 全局/模块级常量：使用大写下划线风格 (UPPER_SNAKE_CASE)，例如 `CODE_TO_ID`、`ID_TO_LANG`
- Redis key 常量：使用 `R_` 前缀 + 大写下划线风格，名称尽量和 Redis key 结构一致。例如 key 为 `lang:set:${uid}` 则常量命名为 `R_LANG_SET_UID`。读取 int 值时推荐使用 `R.incrby(key, 0)` 直接获取
- Redis key 集中管理：所有 Redis key 构造函数统一定义在 `lib/RK.js`，业务模块按需导入，禁止就地定义

## 模块化机制

- 导入：按需精准导入函数，禁止直接导入整个模块（避免 `import * as x` 或导入大对象）
- 导出：JS 文件必须使用默认导出 `default`
  - 在拆分模块时，直接对函数或表达式进行 `export default`，不要先声明常量再在文件末尾导出
- 路径解析：获取当前目录路径时，必须使用 `import.meta.dirname`

## 领域特定 API

- 加解密：强制使用原生的 Web Crypto API
- 二进制数据：处理二进制时，尽量统一使用 `Uint8Array`

## 测试规范

- 可执行脚本：测试文件第一行必须声明 `#! /usr/bin/env bun`，并赋予文件可执行权限
- 测试框架：统一使用 `vitest`
- 原则：绝对不要使用 `mock`，所有测试必须通过调用真实的依赖来做

## 文档规范

- 不使用加粗或斜体格式
- 不使用 emoji
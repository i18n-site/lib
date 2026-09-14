---
name: js_review
description: JavaScript 代码审查
---

# JS / Bun 代码规范与审查指南

## 1. 运行时与现代语法规范

- 执行环境：优先使用 Bun 现代运行时，脚本文件顶部统一使用 `#!/usr/bin/env -S bun`。
- 路径与元数据：必须使用 `import.meta.dirname` 获取当前目录路径，禁止使用传统 `__dirname`、`__filename` 或冗长的 `fileURLToPath(import.meta.url)`。
- 极速文件 I/O：在 Bun 环境下，优先使用原生 `Bun.file(path).text()` / `Bun.file(path).json()` / `Bun.write(path, data)` 进行极速异步 I/O。
- 现代语法：充分利用 ES2024+ 现代特性，如 `replaceAll()`、空值合并操作符（`??`）、可选链（`?.`，禁止过度防御式编程）。

## 2. 代码风格与设计哲学

- 简洁优雅：接口设计低耦合、高内聚，拆分过长函数为单一职责纯函数。
- 纯函数优先：严禁定义 `class`，全部使用纯函数与数据流管道。
- 箭头函数：统一使用箭头函数 `const funcName = () => {}`，不使用 `function` 关键字（生成器除外）；如可用 `.bind` 绑定参数则避免多层包装。
- 变量声明：连续声明必须合并为一个 `const` 语句（例如 `const a = 1, b = 2, c = 3;`），减少语句冗余。
- 异步处理：统一使用 `async/await`，严禁使用 `.then()` 链式调用。
- 异常处理：不盲目自动生成 `try...catch`（由人工按需维护，已有 `try catch` 保留）。
- 对象与解构：优先使用解构赋值提取需要的属性，避免在循环或内部深层反复使用点号访问。
- 参数与多值返回：
  - 函数参数扁平化，写 `a, b, c` 而非单一对象 `{ a, b, c }`；如可选参数多，采用 `[[配置项数字, 配置项值], ...]` 范式，配置项用数字常量定义。
  - 多值返回统一使用数组 `[a, b, c]`；多返回值时使用数值常量定义位置语义。
- 状态表示：严禁使用魔法字符串表示状态，统一用常量/数字枚举定义。
- 字符串拼接：普通拼接使用 `+`，`import` 导入语句除外（方便 Vite / 打包器静态分析）。
- 循环与列表：
  - 数组多用 `map`、`forEach`、`filter`、`find`；
  - `for` 循环如需序号统一使用 `++i` 而非 `i++`；
  - 列表变量名不使用复数形式，统一以 `_li` 结尾（例如 `user_li`, `cmd_li`）。

## 3. 命名规范

- 极简语义：使用简短明确的动词/名词（例如用 `rm` 代替 `remove`/`delete`），禁止无意义单个字母或过度缩写。
- 文件名与函数：名词在前、动词在后（如 `profileSet.js` 而非 `setProfile.js`）。函数命名尽量精炼动词，不带无意义的 `get` 前缀（如 `cookieByHeader` 而非 `getCookie`）。
- 风格约定：
  - 普通变量名：蛇形命名 `snake_case`（如 `user_auth_token`）；若变量为函数则使用小写驼峰 `camelCase`。
  - 函数名：小写驼峰 `camelCase`。
  - 回调函数参数：小写驼峰（如 `onChange`）。
  - 模块级/全局常量：全大写下划线 `UPPER_SNAKE_CASE`（如 `DEFAULT_TIMEOUT`, `CODE_TO_ID`）。

## 4. 模块化机制

- 精准按需导入：严禁 `import * as x` 或直接导入庞大对象。
- 导出规范：
  - 禁止导出单一大对象，以函数、变量为粒度导出。
  - 可变全局状态（如语言、用户信息）使用 `export let` 导出。
  - 其余函数与常量合并使用单一 `export const` + 逗号声明。
  - 单一功能文件使用 `export default`。

## 5. 错误处理与浏览器兼容

- 错误码常量化：避免使用字符串描述错误，统一用 `const` 声明数值错误码。
- 结构化错误：需附带数据信息时使用 `[错误码, 数据项1, 数据项2]` 数组范式。
- Web 标准兼容 API：
  - 加解密强制使用原生 Web Crypto API (`crypto.subtle`)。
  - 二进制处理统一使用 `Uint8Array`。

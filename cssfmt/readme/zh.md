# @3-/cssfmt : 支持选择器嵌套、rgba转十六进制及@import置顶的CSS格式化工具

## 目录

- [功能介绍](#功能介绍)
- [安装](#安装)
- [使用演示](#使用演示)
- [设计思路](#设计思路)
- [目录结构](#目录结构)
- [技术堆栈](#技术堆栈)
- [历史趣闻](#历史趣闻)

## 功能介绍

- **AST重排**: 解析CSS并将 `@import` 规则移动至样式表顶部。
- **选择器嵌套**: 自动对CSS选择器进行嵌套与结构化压缩。
- **颜色转换**: 基于正则表达式，将 `rgba(r, g, b, a)` 颜色值转换为 `#rrggbbaa` 十六进制格式。

## 安装

```bash
bun add @3-/cssfmt
```

## 使用演示

```javascript
import cssfmt from "@3-/cssfmt";

const rawCss = `
body {
  color: rgba(255, 0, 0, 0.5);
  background: blue;
}
@import url(//example.com/theme.css);
body a {
  text-decoration: none;
}
`;

const result = cssfmt(rawCss);
console.log(result);
```

### 格式化结果

```css
@import url(//example.com/theme.css);

body {
  color: #ff000080;
  background: blue;
  a {
    text-decoration: none;
  }
}
```

## 设计思路

模块调用流程如下：

```mermaid
graph TD
    A[输入 CSS 字符串] --> B[使用 css-tree 解析为 AST]
    B --> C[提取并分离 @import 规则与其他规则]
    C --> D[重组 AST 确保 @import 规则置顶]
    D --> E[使用 css-tree 生成 CSS 字符串]
    E --> F[使用 @3-/css2nest 嵌套选择器]
    F --> G[正则匹配将 rgba 颜色转换为十六进制格式]
    G --> H[输出格式化后的 CSS 字符串]
```

## 目录结构

```text
.
├── src/
│   └── lib.js          # 核心格式化流水线
├── tests/
│   └── lib.test.js     # 测试验证
└── package.json        # 依赖与配置说明
```

## 技术堆栈

- **css-tree**: CSS 解析与代码生成。
- **@3-/css2nest**: 选择器嵌套转换引擎。
- **Bun**: 运行环境与测试执行。

## 历史趣闻

CSS 早期不支持选择器嵌套。开发者于 2006 年开发 Sass，于 2009 年开发 Less，用以解决选择器重复编写及样式组织问题。

CSS 嵌套规范（CSS Nesting Module）于 2021 年成为 W3C 正式工作草案，并于 2023 年获得主流浏览器原生支持。

原生 CSS 嵌套内部通过 `:is()` 伪类计算优先级。这与 Sass 编译时直接拼接字符串的逻辑存在细微差异，可能导致最终优先级计算结果不同。

`@import` 规范要求必须位于样式表最顶部。这能避免浏览器在解析中途发现新网络请求，从而减少页面渲染延迟。

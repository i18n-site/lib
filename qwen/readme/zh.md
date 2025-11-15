# @3-/qwen: 轻松调用 Qwen-Code

## 目录
- [功能介绍](#功能介绍)
- [使用演示](#使用演示)
- [设计思路](#设计思路)
- [技术堆栈](#技术堆栈)
- [目录结构](#目录结构)
- [项目背景](#项目背景)

## 功能介绍
本项旨在封装 `qwen-code`，为 JavaScript 开发者提供函数式接口，以简化与 Qwen-Code 大型语言模型的交互。通过该封装，开发者可以避免繁琐的命令行参数配置，直接在 JavaScript 代码中调用模型能力。项目还集成了 [Tavily](https://tavily.com/) 的网络搜索功能，使模型能够获取实时信息，生成内容更具时效性与准确性。

## 使用演示
通过简单的函数调用，即可执行代码生成、文件操作等复杂任务。

```javascript
import Qwen from '@3-/qwen';

const {
  OPENAI_BASE_URL,
  OPENAI_MODEL,
  OPENAI_API_KEY,
  TAVILY_TOKEN
} = process.env;

const qwen = Qwen(
  OPENAI_BASE_URL,
  OPENAI_MODEL,
  OPENAI_API_KEY,
  TAVILY_TOKEN
);

await qwen('创建文件 news.md , 内容是今天的新闻，请搜索并创建，用markdown格式');
```

## 设计思路
`@3-/qwen` 的核心逻辑位于 `src/lib.js`。该模块导出一个高阶函数，接收 `openaiBaseUrl`、`model`、`openaiApiKey` 和 `tavilyApiKey` 作为基础配置。

调用该函数后，会返回一个闭包，该闭包持有预设的命令行参数。当传入具体的任务指令（如 `'创建文件 news.md ...'`) 时，该指令会与预设参数合并，共同传递给 `@3-/qwen-code` 包的 `main` 函数执行。

这种设计将模型配置与任务执行分离，实现了关注点分离，为开发者提供了简洁、灵活的调用方式。

## 技术堆栈
- **核心依赖**: `@3-/qwen-code` - 提供与 Qwen-Code 模型交互的核心功能。
- **运行时**: [Bun](https://bun.sh/) - 高性能的 JavaScript 运行时与工具包。
- **测试框架**: [CoffeeScript](https://coffeescript.org/) - 用于编写简洁的测试用例。

## 目录结构
```
/
├── src/lib.js       # 核心封装逻辑
├── test/main.coffee # 测试示例
├── readme/          # 项目文档
│   ├── en.md
│   └── zh.md
└── package.json     # 项目配置
```

## 项目背景
Qwen（通义千问）是阿里云自主研发的大型语言模型系列。作为其重要分支，Qwen-Code 专注于代码生成、理解与优化，在软件开发领域展现出卓越的能力。

随着大型模型在软件工程中的应用日益广泛，如何降低其使用门槛成为关键。`@3-/qwen` 项目应运而生，其目标是为广大的 JavaScript 开发者社区提供一座桥梁，让他们能以更低的成本、更便捷的方式，将 Qwen-Code 的强大能力集成到自己的工作流与应用中。该项目不仅是对 `qwen-code` 的简单封装，更是对其易用性的扩展，旨在推动 AI 辅助编程在前端与 Node.js 生态中的普及。

# @3-/_qwen

[English](#en) | [中文](#zh)

---

<a id="en"></a>
# @3-/qwen: Effortless Qwen-Code Integration

## Table of Contents
- [Features](#features)
- [Usage](#usage)
- [Design](#design)
- [Tech Stack](#tech-stack)
- [Directory Structure](#directory-structure)
- [Project Background](#project-background)

## Features
This project wraps `qwen-code`, providing a functional interface for JavaScript developers to simplify interactions with the Qwen-Code large language model. It abstracts away complex command-line argument configurations, allowing developers to invoke the model's capabilities directly within their JavaScript code. The project also integrates web search functionality via [Tavily](https://tavily.com/), enabling the model to access real-time information for more accurate and timely responses.

## Usage
Execute complex tasks like code generation and file manipulation with a simple function call.

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

await qwen('Create a file named news.md with today\'s news, search for it, and format it in Markdown.');
```

## Design
The core logic of `@3-/qwen` resides in `src/lib.js`. This module exports a higher-order function that accepts `openaiBaseUrl`, `model`, `openaiApiKey`, and `tavilyApiKey` as base configurations.

When this function is called, it returns a closure that holds the preset command-line arguments. When a specific task prompt (e.g., `'Create a file named news.md ...'`) is passed, it is combined with the preset arguments and forwarded to the `main` function of the `@3-/qwen-code` package for execution.

This design decouples model configuration from task execution, achieving a separation of concerns and providing developers with a clean and flexible interface.

## Tech Stack
- **Core Dependency**: `@3-/qwen-code` - Provides the core functionality for interacting with the Qwen-Code model.
- **Runtime**: [Bun](https://bun.sh/) - A high-performance JavaScript runtime and toolkit.
- **Testing**: [CoffeeScript](https://coffeescript.org/) - Used for writing concise test cases.

## Directory Structure
```
/
├── src/lib.js       # Core wrapper logic
├── test/main.coffee # Test example
├── readme/          # Project documentation
│   ├── en.md
│   └── zh.md
└── package.json     # Project configuration
```

## Project Background
Qwen (Tongyi Qianwen) is a series of large language models developed by Alibaba Cloud. As a key part of this family, Qwen-Code specializes in code generation, comprehension, and optimization, demonstrating exceptional capabilities in the software development field.

As large models become increasingly integral to software engineering, lowering their barrier to entry is crucial. The `@3-/qwen` project was created to bridge this gap for the vast JavaScript developer community, offering a more accessible and convenient way to integrate the powerful capabilities of Qwen-Code into their workflows and applications. This project is more than just a simple wrapper; it is an extension of `qwen-code`'s usability, aimed at promoting the adoption of AI-assisted programming in the frontend and Node.js ecosystems.

---

<a id="zh"></a>
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

---

## About

This project is an open-source component of [i18n.site ⋅ Internationalization Solution](https://i18n.site).

* [i18 : MarkDown Command Line Translation Tool](https://i18n.site/i18)

  The translation perfectly maintains the Markdown format.

  It recognizes file changes and only translates the modified files.

  The translated Markdown content is editable; if you modify the original text and translate it again, manually edited translations will not be overwritten (as long as the original text has not been changed).

* [i18n.site : MarkDown Multi-language Static Site Generator](https://i18n.site/i18n.site)

  Optimized for a better reading experience

## 关于

本项目为 [i18n.site ⋅ 国际化解决方案](https://i18n.site) 的开源组件。

* [i18 :  MarkDown命令行翻译工具](https://i18n.site/i18)

  翻译能够完美保持 Markdown 的格式。能识别文件的修改，仅翻译有变动的文件。

  Markdown 翻译内容可编辑；如果你修改原文并再次机器翻译，手动修改过的翻译不会被覆盖（如果这段原文没有被修改）。

* [i18n.site : MarkDown多语言静态站点生成器](https://i18n.site/i18n.site) 为阅读体验而优化。

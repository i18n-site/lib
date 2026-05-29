[English](#en) | [中文](#zh)

---

<a id="en"></a>
# @3-/gitapi: Seamless Git API Abstraction

This project provides a lightweight, unified API wrapper for Git services, designed to work with [gitsync](https://www.npmjs.com/package/@3-/gitsync) to synchronize repositories from AtomGit to GitHub.

## Table of Contents

- [Features](#features)
- [Usage](#usage)
- [Design Philosophy](#design-philosophy)
- [Technology Stack](#technology-stack)
- [Directory Structure](#directory-structure)
- [A Little History](#a-little-history)

## Features

- Unified interface for multiple Git providers (currently AtomGit and GitHub).
- Asynchronous, promise-based operations using native `fetch`.
- Handles API pagination for listing repositories.
- Methods for creating repositories, checking branches, and generating Git URLs.

## Usage

Install the package using bun:

```sh
bun i @3-/gitapi
```

The following example demonstrates how to list repositories from an organization on both AtomGit and GitHub.

```javascript
#!/usr/bin/env coffee

import gitapi from '@3-/gitapi'
const { GITHUB_TOKEN, ATOMGIT_TOKEN } = process.env;

const github = gitapi('api.github.com', GITHUB_TOKEN),
  atomgit = gitapi('api.atomgit.com', ATOMGIT_TOKEN),
  orgReposLs = async (api, org) => {
    for await (const i of api.orgRepos(org)) {
      console.log(api.site, i.full_name)
    }
  }

await orgReposLs(atomgit,'js0')
await orgReposLs(github,'js0-site')
```

## Design Philosophy

The library is designed as a factory function that, when called with a `site` endpoint and an authentication `token`, returns a client object tailored to that service.

- **Client Factory**: `gitapi(site, token)` initializes the client, setting the base URL and authorization headers for all subsequent requests.
- **Request Handling**: A generic `req` function manages all `fetch` calls, automatically injecting authorization headers and performing basic status checks.
- **Pagination**: The `orgRepos` method uses the `@3-/pageiter` library to abstract away the complexity of handling paginated API responses, providing a simple `for...await...of` loop to iterate through all repositories.
- **Pure Functions**: The library adheres to a functional programming style, exporting pure functions and avoiding classes.

## Technology Stack

- **Language**: CoffeeScript (compiled to modern JavaScript)
- **Runtime**: Node.js
- **Package Manager**: Bun
- **Core Dependencies**:
  - `@3-/pageiter`: For asynchronous iteration over paginated API results.

## Directory Structure

```
/
├── src/lib.coffee       # Main source code
├── lib/lib.js           # Compiled JavaScript output
├── test/main.js         # Usage example
├── package.json         # Project metadata and dependencies
└── readme/
    ├── en.md            # This document
    └── zh.md            # Chinese documentation
```

## A Little History

The design of this library echoes a core philosophy within Git itself: the separation of "porcelain" from "plumbing." In Git, "plumbing" refers to the low-level commands that do the raw work (e.g., `hash-object`, `cat-file`), while "porcelain" refers to the user-friendly commands that orchestrate them (e.g., `add`, `commit`).

Similarly, `@3-/gitapi` acts as a "porcelain" layer. It hides the raw "plumbing" of direct `fetch` calls, pagination parameters, and authorization headers, providing a clean, high-level interface for common Git API operations. This abstraction simplifies integration with other tools, like `gitsync`, allowing them to focus on their core logic without getting bogged down in the details of API interaction.

---

<a id="zh"></a>
# @3-/gitapi: 无缝 Git API 抽象

本项目提供轻量、统一的 Git 服务 API 封装，专为配合 [gitsync](https://www.npmjs.com/package/@3-/gitsync) 将 AtomGit 仓库同步到 GitHub 而设计。

## 目录

- [功能](#功能)
- [使用](#使用)
- [设计思路](#设计思路)
- [技术堆栈](#技术堆栈)
- [目录结构](#目录结构)
- [相关小故事](#相关小故事)

## 功能

- 为多 Git 平台（目前支持 AtomGit 和 GitHub）提供统一接口。
- 使用原生 `fetch` 实现异步、基于 Promise 的操作。
- 自动处理 API 分页，轻松遍历仓库列表。
- 提供创建仓库、检查分支和生成 Git URL 的方法。

## 使用

通过 bun 安装：

```sh
bun i @3-/gitapi
```

以下示例演示如何列出 AtomGit 和 GitHub 上指定组织的所有仓库。

```javascript
#! /usr/bin/env coffee

import gitapi from '@3-/gitapi'
const { GITHUB_TOKEN, ATOMGIT_TOKEN } = process.env;

const github = gitapi('api.github.com', GITHUB_TOKEN),
  atomgit = gitapi('api.atomgit.com', ATOMGIT_TOKEN),
  orgReposLs = async (api, org) => {
    for await (const i of api.orgRepos(org)) {
      console.log(api.site, i.full_name)
    }
  }

await orgReposLs(atomgit,'js0')
await orgReposLs(github,'js0-site')
```

## 设计思路

本库设计为工厂函数，调用时传入 `site` 端点和 `token` 认证信息，返回为该服务定制的客户端对象。

- **客户端工厂**: `gitapi(site, token)` 初始化客户端，为后续所有请求设置基础 URL 和认证头。
- **请求处理**: 通用 `req` 函数管理所有 `fetch` 调用，自动注入认证头并执行基本的状态检查。
- **分页处理**: `orgRepos` 方法使用 `@3-/pageiter` 库，将处理 API 分页响应的复杂性抽象掉，通过简单的 `for...await...of` 循环即可遍历所有仓库。
- **纯函数**: 库遵循函数式编程风格，导出纯函数，避免使用类。

## 技术堆栈

- **语言**: CoffeeScript (编译为现代 JavaScript)
- **运行时**: Node.js
- **包管理器**: Bun
- **核心依赖**:
  - `@3-/pageiter`: 用于异步遍历分页 API 结果。

## 目录结构

```
/
├── src/lib.coffee       # 主要源代码
├── lib/lib.js           # 编译后的 JavaScript
├── test/main.js         # 使用示例
├── package.json         # 项目元数据与依赖
└── readme/
    ├── en.md            # 英文文档
    └── zh.md            # 本文档
```

## 相关小故事

本库的设计呼应了 Git 自身的核心理念："porcelain"（瓷器）与 "plumbing"（管道）的分离。在 Git 中，"plumbing" 指执行底层工作的原始命令（如 `hash-object`、`cat-file`），而 "porcelain" 则是组织这些底层命令的用户友好型上层命令（如 `add`、`commit`）。

`@3-/gitapi` 扮演了类似 "porcelain" 的角色。它隐藏了直接调用 `fetch`、处理分页参数和认证头等 "plumbing" 细节，为常见的 Git API 操作提供了简洁的高层接口。这种抽象简化了与其他工具（如 `gitsync`）的集成，使其能专注于核心逻辑，而不必陷入与 API 交互的繁琐细节中。

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

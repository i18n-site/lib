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
# @3-/gitsync

[English](#en) | [中文](#zh)

---

<a id="en"></a>
# gitsync: Automated Git Repository Synchronization and AI-Enhanced Commits

For developers in mainland China, accessing GitHub can often be slow, making AtomGit.com a more efficient alternative. This project bridges that gap by automating the synchronization of repositories from AtomGit to GitHub. It uses AI to generate high-quality commit messages and leverages the `gme` command to signal when a set of changes is ready to be squashed, commented on by AI, and synced to GitHub.

This project not only synchronizes commits from `atomgit.com` to `github.com` but also **automatically creates a corresponding repository on GitHub when a new one is created on AtomGit**, ensuring seamless cross-platform integration.

When your commit message begins with the `🔹` symbol, the system recognizes it as a special merge request. AI then steps in to automatically generate a high-quality, standardized commit message for you.

To maintain a clean and highly readable commit history on the `main` branch, we use `❯ git merge --squash` to combine multiple commits from the `dev` branch into a single, concise hash. This approach preserves the complete development history of the `dev` branch while ensuring the clarity of the main branch.

**From now on, you'll never have to write tedious commit notes by hand again!**

The AI handles it all for you, allowing you to focus on core development tasks.

## Table of Contents

- [Features](#features)
- [How It Works](#how-it-works)
- [Usage](#usage)
- [Technology Stack](#technology-stack)
- [Directory Structure](#directory-structure)
- [A Little Story](#a-little-story)

## Features

- **Automated Synchronization**: Automatically syncs `dev` branches from a source (e.g., AtomGit) to a destination (e.g., GitHub).
- **Smart Sync Rules**:
    - Triggers an immediate merge for commits in the `dev` branch with messages starting with `🔹`.
    - Automatically syncs repositories that have not seen new commits for more than 10 days.
- **AI-Powered Commits**: Utilizes the Qwen large language model to generate concise, high-quality, bilingual (English/Chinese) commit messages for squashed merges.
- **Automatic Repository Creation**: If a corresponding repository does not exist at the destination, it will be created automatically.
- **Resilient and Stateful**: Maintains a state file to track synchronization status, ensuring robustness and preventing redundant operations.

## How It Works

The synchronization process follows a clear, modular flow:

1.  **`lib.coffee` (Main Entry)**: As the library's entry point, it iterates through all repositories in the source organization and calls `syncSrcDev` to process each one.
2.  **`syncSrcDev` (Sync Logic)**: For each repository, it checks the `dev` branch. It determines if a sync is necessary based on either the 10-day inactivity rule or the presence of new commits. It also handles the logic for creating a new destination repository if one doesn't exist.
3.  **`mergeIfNeed` (Merge Execution)**: If a sync is required, this module prepares the environment and calls `gitInit`.
4.  **`gitInit` (Git Initialization)**: It sets up a temporary local repository, adding the source and destination as remotes (`src` and `origin`).
5.  **`needSync` (Sync Condition Check)**: It inspects the commit history of the `src/dev` branch to see if any commit messages start with the `🔹` flag, which signals an explicit request to merge.
6.  **`merge` (The Merge)**:
    - A `--squash` merge of the `dev` branch is performed.
    - A `diff` of the changes is generated.
    - The diff is sent to the Qwen LLM, which returns a standardized, bilingual commit message.
    - The changes are committed and pushed to the `main` branches of both the destination and source remotes, ensuring they stay aligned.
7.  **`ATOMGIT.js` / `GITHUB.js`**: API clients created using the `@3-/gitapi` library, used for interacting with the AtomGit and GitHub platforms.

This design ensures that routine merges are fully automated, with clear and readable commit histories maintained by AI.

## Usage

To use the library, import the `sync` function and provide it with the necessary configuration.

```javascript
#!/usr/bin/env bun

import GITHUB from "@3-/gitsync/GITHUB.js";
import ATOMGIT from "@3-/gitsync/ATOMGIT.js";
import sync from "@3-/gitsync";
import { join } from "path";

const ROOT = import.meta.dirname;

// Start the synchronization process
// This will sync all repos from the 'js0' org on AtomGit
// to the 'js0-site' org on GitHub.
await sync(
  join(ROOT, "sync.yml"), // Path to the state file
  ATOMGIT, "js0",         // Source API client and organization
  GITHUB, "js0-site"      // Destination API client and organization
);
```

## Helper Scripts

The project includes two helper scripts in the `bin/` directory to simplify daily operations.

- **`gci` (Git Commit)**: A shortcut for your daily commit workflow. It automatically stages all new changes, commits them with a standard message, and pushes the `dev` branch. It handles initial repository setup and ensures work from `main` is correctly merged into `dev`.

- **`gme` (Git Merge)**: A script to flag a commit for immediate synchronization. It runs `gci` to commit any pending changes, then amends the latest commit message to add the `🔹` prefix. This signals the automation to perform a merge on its next run.

## Technology Stack

- **Runtime**: Bun / Node.js
- **Language**: CoffeeScript & JavaScript
- **Core Libraries**:
    - `@3-/gitapi`: A wrapper to simplify API calls to Git platforms like GitHub and AtomGit.

## Directory Structure

```
/
├── AGENTS.md           # Agent development standards and style guide
├── bin/                # Helper scripts
│   ├── gci             # Daily commit shortcut
│   └── gme             # Mark commit for AI merge
├── build.sh            # Project build script
├── bun.lock            # bun dependency lock file
├── package.json        # Project metadata and dependencies
├── readme/             # README documents
│   ├── en.md           # English README
│   └── zh.md           # Chinese README
├── run.sh              # Project run script
├── src/                # Source code (CoffeeScript & JavaScript)
│   ├── ATOMGIT.js      # AtomGit API client
│   ├── GITHUB.js       # GitHub API client
│   ├── gitInit.coffee  # Handles git repository initialization
│   ├── lib.coffee      # Main library entry, orchestrates the sync process
│   ├── merge.coffee    # Performs the squash merge and AI commit generation
│   ├── mergeIfNeed.coffee # Manages the merge process if conditions are met
│   ├── needSync.coffee # Checks if a sync is explicitly requested
│   └── syncSrcDev.coffee # Core logic for checking and initiating sync for a repo
└── test/               # Test and example scripts
    ├── github2atomgit.coffee # Test for syncing from GitHub to AtomGit
    ├── main.js         # Example usage entry point
    └── sync.yml        # Example YAML for synchronization state
```

## A Little Story

The concept of distributed version control, which `git` embodies, was a revolutionary step forward from centralized systems like SVN. But the real magic began when developers started building automation on top of it. The idea of a "commit hook" first appeared in the early days of version control systems, long before Git. These were simple scripts that could run on certain events, like a pre-commit check.

This project takes that spirit of automation to a new level. It’s not just a hook; it’s a fully autonomous agent. It decides *when* to act (the 10-day rule), *what* to look for (the `🔹` flag), and even *how* to describe its actions (AI-generated commits). It reflects a modern trend in software development where AI doesn't just assist developers—it becomes an active, intelligent participant in the development lifecycle itself, handling the routine tasks so humans can focus on creative and complex problems.

---

<a id="zh"></a>
# gitsync: 自动化 Git 仓库同步及 AI 增强提交

在中国大陆，访问 GitHub 的速度往往很慢，因此 AtomGit.com 成为更佳选择。本项目旨在打通 AtomGit 与 GitHub，实现仓库的自动化同步。它利用 AI 辅助生成高质量的提交注释，并通过 `gme` 命令标记一个开发阶段的完成，触发 AI 生成合并注释并自动同步到 GitHub。

本项目不仅能将 `atomgit.com` 的提交同步到 `github.com`，**还能在新仓库创建时自动在 GitHub 上创建对应的仓库**，实现了跨平台无缝衔接。

当您的提交注释以 `🔹` 符号开头时，系统会将其识别为一个特殊的合并请求。随后，AI 将自动介入，为您生成高质量、标准化的 `commit message`。

为了保持 `main` 分支提交历史的整洁与高可读性，我们利用 `❯ git merge --squash` 将 `dev` 分支的多次提交合并为一个精简的 `hash`。这种方式既保留了 `dev` 分支完整的开发记录，又确保了主干分支的清晰性。

**从此，您再也无需手写繁琐的提交备注了！**

AI 会为您处理好这一切，让您能更专注于核心开发工作。

## 目录

- [功能特性](#功能特性)
- [设计思路](#设计思路)
- [使用演示](#使用演示)
- [技术堆栈](#技术堆栈)
- [目录结构](#目录结构)
- [相关故事](#相关故事)

## 功能特性

- **自动同步**：自动将源平台（如 AtomGit）的 `dev` 分支同步到目标平台（如 GitHub）。
- **智能同步规则**：
    - 当 `dev` 分支的提交注释以 `🔹` 开头时，立即触发合并。
    - 自动同步超过 10 天没有新提交的仓库。
- **AI 生成提交**：调用通义千问大模型，为压缩合并的提交生成简洁、高质量的中英双语注释。
- **自动创建仓库**：如果目标位置不存在对应仓库，会自动创建。
- **状态持久化**：通过状态文件跟踪同步进度，确保操作的稳健性，避免重复执行。

## 设计思路

同步流程遵循清晰的模块化设计：

1.  **`lib.coffee` (主入口)**：作为库的入口点，负责遍历源组织下的所有仓库，并调用 `syncSrcDev` 对每个仓库进行处理。
2.  **`syncSrcDev` (同步逻辑)**：检查每个仓库的 `dev` 分支，根据“10 天未更新”规则或新提交的标志，判断是否需要同步，并处理目标仓库的自动创建逻辑。
3.  **`mergeIfNeed` (执行合并)**：若需要同步，此模块负责准备临时环境，并调用 `gitInit`。
4.  **`gitInit` (Git 初始化)**：建立一个临时的本地仓库，并将源和目标添加为远程仓库（`src` 和 `origin`）。
5.  **`needSync` (检查同步条件)**：检查 `src/dev` 分支的提交历史，确认是否有以 `🔹` 标志开头的提交，该标志为显式请求合并的信号。
6.  **`merge` (执行合并)**：
    - 对 `dev` 分支执行 `--squash` 压缩合并。
    - 生成变更的 `diff`。
    - 将 `diff` 发送给通义千问大模型，返回标准化的双语提交注释。
    - 提交变更并推送到源和目标远程仓库的 `main` 分支，确保两者保持一致。
7.  **`ATOMGIT.js` / `GITHUB.js`**：利用 `@3-/gitapi` 库创建的 API 客户端，用于与 AtomGit 和 GitHub 平台进行交互。

此设计确保了日常合并工作的完全自动化，并通过 AI 维护了清晰易读的提交历史。

## 使用演示

导入 `sync` 函数并提供必要配置即可使用此库。

```javascript
#!/usr/bin/env bun

import GITHUB from "@3-/gitsync/GITHUB.js";
import ATOMGIT from "@3-/gitsync/ATOMGIT.js";
import sync from "@3-/gitsync";
import { join } from "path";

const ROOT = import.meta.dirname;

// 启动同步流程
// 此操作将 'js0' 组织在 AtomGit 上的所有仓库
// 同步到 GitHub 上的 'js0-site' 组织。
await sync(
  join(ROOT, "sync.yml"), // 状态文件路径
  ATOMGIT, "js0",         // 源 API 客户端及组织
  GITHUB, "js0-site"      // 目标 API 客户端及组织
);
```

## 辅助脚本

项目在 `bin/` 目录下提供了两个辅助脚本，用以简化日常操作。

- **`gci` (Git Commit)**: 日常提交的快捷命令。它会自动暂存所有变更，使用标准信息进行提交，并推送 `dev` 分支。脚本还会处理仓库的初始化设置，并确保 `main` 分支的工作被正确合并到 `dev` 分支。

- **`gme` (Git Merge)**: 用于标记一个提交需要立即被同步的脚本。它会先运行 `gci` 提交所有待处理的变更，然后修改最新的提交，在注释前添加 `🔹` 前缀。这个标志会通知自动化服务在下次运行时执行合并操作。

## 技术堆栈

- **运行时**: Bun / Node.js
- **开发语言**: CoffeeScript & JavaScript
- **核心依赖**:
    - `@3-/gitapi`: 用于封装和简化 Git 平台（GitHub, AtomGit）API 的调用。

## 目录结构

```
/
├── AGENTS.md           # Agent 开发规范与风格指南
├── bin/                # 辅助脚本
│   ├── gci             # 日常提交快捷命令 (git commit)
│   └── gme             # 标记提交以供 AI 合并 (git merge)
├── build.sh            # 项目构建脚本
├── bun.lock            # bun 依赖锁定文件
├── package.json        # 项目元数据及依赖
├── readme/             # README 文档
│   ├── en.md           # 英文 README
│   └── zh.md           # 中文 README
├── run.sh              # 项目运行脚本
├── src/                # 源代码 (CoffeeScript & JavaScript)
│   ├── ATOMGIT.js      # AtomGit API 客户端
│   ├── GITHUB.js       # GitHub API 客户端
│   ├── gitInit.coffee  # 处理 Git 仓库的初始化
│   ├── lib.coffee      # 库主入口，负责编排同步流程
│   ├── merge.coffee    # 执行压缩合并及 AI 生成提交注释
│   ├── mergeIfNeed.coffee # 在满足条件时管理合并流程
│   ├── needSync.coffee # 检查是否存在显式的同步请求
│   └── syncSrcDev.coffee # 检查并启动单个仓库同步的核心逻辑
└── test/               # 测试及演示脚本
    ├── github2atomgit.coffee # 从 GitHub 到 AtomGit 的同步测试
    ├── main.js         # 使用演示入口
    └── sync.yml        # 同步状态的示例 yml 文件
```

## 相关故事

`git` 所代表的分布式版本控制思想，是从 SVN 等集中式系统演进而来的一次革命。但真正的魔力在于开发者在其之上构建的自动化能力。早在 Git 出现之前，版本控制系统的初期就已存在“提交钩子”（commit hook）的概念，它们是一些能在特定事件（如提交前检查）触发时运行的简单脚本。

本项目将这种自动化精神提升到了新高度。它不再只是一个钩子，而是一个完全自主的代理。它能自行决定*何时*行动（10 天规则）、*关注什么*（`🔹` 标志），甚至*如何*描述自己的行为（AI 生成注释）。这反映了软件开发领域的一种现代趋势：AI 不再仅仅是辅助开发者，而是作为开发生命周期中一个积极、智能的参与者，主动承担起重复性的任务，从而让人们能更专注于创造性和复杂问题的解决。

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

# @3-/pool

[English](#-en) | [中文](#-zh)

---
## <a id="-en"></a> English

### Table of Contents
*   [Introduction](#introduction)
*   [Usage](#usage)
*   [Design Philosophy](#design-philosophy)
*   [File Structure](#file-structure)
*   [A Little Story](#a-little-story)

### Introduction

`@3-/pool` is a lightweight, dynamic, and easy-to-use asynchronous task pool for controlling concurrency in JavaScript. In high-concurrency scenarios, it is crucial to limit the number of concurrent operations to prevent system overload. This module provides a simple and effective solution to manage and limit the number of concurrent tasks.

### Usage

The following example demonstrates how to use `@3-/pool` to manage concurrent tasks.

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/pool > Pool
  @3-/sleep:sleep

pool = Pool 5

job = (n)=>
  console.log n
  await sleep 100*n
  console.log 'done\t',n

n = 0
pool.max = 2
while ++n<10
 await pool job,n

console.log 'pool 1 done'

pool.max = 5

n = 0

while ++n<10
 await pool job,n

await pool.done
process.exit()
```

output :

```
1
2
done	 1
3
done	 2
done	 3
4
5
done	 4
done	 5
6
7
done	 6
done	 7
8
9
done	 8
done	 9
pool 1 done
1
2
3
4
5
done	 1
done	 2
done	 3
done	 4
done	 5
6
7
8
9
done	 6
done	 7
done	 8
done	 9
```

### Design Philosophy

The core idea of `@3-/pool` is to maintain a queue of pending tasks (`todo`) and control the number of currently executing tasks (`ing`).

1.  **Task Queue**: When a new task is added, it is pushed into the `todo` queue.
2.  **Concurrency Control**: The `boot` function acts as a scheduler. It continuously checks if the number of executing tasks is less than the maximum limit (`max`) and if there are tasks in the queue. If so, it dequeues a task and executes it.
3.  **Dynamic Adjustment**: The maximum concurrency `max` can be dynamically adjusted. If `max` is increased, the pool will immediately start more tasks from the queue.
4.  **Promise-based**: The module is heavily based on modern Promises, including `Promise.withResolvers()`, to provide a clean and robust asynchronous programming experience. The `done` property returns a promise that resolves when all tasks in the pool are completed.

The main technology stack is **CoffeeScript**, which compiles to modern, readable JavaScript.

### File Structure

*   `src/index.coffee`: The heart of the module. It exports the `Pool` function, which implements the logic for the asynchronous task pool.

### A Little Story

The evolution of asynchronous programming in JavaScript is a fascinating journey. In the early days, we had "callback hell" (also known as the "pyramid of doom"), where nested callbacks for sequential asynchronous operations made code difficult to read and maintain.

Then came Promises, standardized in ES6 (2015). They provided a more elegant way to handle asynchronous operations, allowing us to chain `.then()` calls and handle errors with `.catch()`. This was a huge step forward, making asynchronous code more manageable.

Finally, ES8 (2017) introduced `async/await`, which is syntactic sugar on top of Promises. This allows us to write asynchronous code that looks almost synchronous, making it incredibly intuitive and easy to reason about. The `@3-/pool` library leverages these modern asynchronous patterns to provide its functionality in a clean and efficient manner.

---
## <a id="-zh"></a> 中文

### 目录
*   [简介](#简介)
*   [使用方法](#使用方法)
*   [设计思路](#设计思路)
*   [文件结构](#文件结构)
*   [相关故事](#相关故事)

### 简介

`@3-/pool` 是一个轻量、动态且易于使用的异步任务池，用于控制 JavaScript 中的并发。在处理高并发请求时，限制并发操作的数量对于防止系统过载至关重要。此模块提供了一个简单而有效的解决方案来管理和限制并发任务的数量。

### 使用方法

以下示例演示了如何使用 `@3-/pool` 来管理并发任务。

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/pool > Pool
  @3-/sleep:sleep

pool = Pool 5

job = (n)=>
  console.log n
  await sleep 100*n
  console.log 'done\t',n

n = 0
pool.max = 2
while ++n<10
 await pool job,n

console.log 'pool 1 done'

pool.max = 5

n = 0

while ++n<10
 await pool job,n

await pool.done
process.exit()
```

output :

```
1
2
done	 1
3
done	 2
done	 3
4
5
done	 4
done	 5
6
7
done	 6
done	 7
8
9
done	 8
done	 9
pool 1 done
1
2
3
4
5
done	 1
done	 2
done	 3
done	 4
done	 5
6
7
8
9
done	 6
done	 7
done	 8
done	 9
```

### 设计思路

`@3-/pool` 的核心思想是维护一个待处理任务队列 (`todo`) 并控制当前正在执行的任务数 (`ing`)。

1.  **任务队列**：当一个新任务被添加时，它会被推入 `todo` 队列。
2.  **并发控制**：`boot` 函数充当调度程序。它不断检查正在执行的任务数是否小于最大限制 (`max`) 以及队列中是否有任务。如果是，它会从队列中取出一个任务并执行它。
3.  **动态调整**：最大并发数 `max` 可以动态调整。如果 `max` 增加，池将立即从队列中启动更多任务。
4.  **基于 Promise**：该模块大量使用现代 Promise，包括 `Promise.withResolvers()`，以提供干净且健壮的异步编程体验。`done` 属性返回一个在池中所有任务完成时解析的 Promise。

主要技术栈是 **CoffeeScript**，它可以编译成现代、可读的 JavaScript。

### 文件结构

*   `src/index.coffee`: 模块的核心。它导出了 `Pool` 函数，该函数实现了异步任务池的逻辑。

### 相关故事

JavaScript 中异步编程的演变是一段引人入胜的旅程。在早期，我们有“回调地狱”（也称为“毁灭金字塔”），其中用于顺序异步操作的嵌套回调使代码难以阅读和维护。

然后是 ES6（2015）中标准化的 Promise。它们提供了一种更优雅的方式来处理异步操作，允许我们链接 `.then()` 调用并使用 `.catch()` 处理错误。这是一个巨大的进步，使异步代码更易于管理。

最后，ES8（2017）引入了 `async/await`，它是 Promise 之上的语法糖。这使我们能够编写看起来几乎同步的异步代码，使其非常直观且易于理解。`@3-/pool` 库利用这些现代异步模式，以简洁高效的方式提供其功能。

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

# @3-/ip

[English](#en) | [中文](#zh)

---

<a id="en"></a>
# @3-/ip : Bidirectional IP Address Binary Converter

High-performance library for converting between IP addresses and binary representations, supporting both IPv4 and IPv6 with zero dependencies.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [IPv4 Conversion](#ipv4-conversion)
  - [IPv6 Conversion](#ipv6-conversion)
- [Design Philosophy](#design-philosophy)
- [Technical Stack](#technical-stack)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Historical Context](#historical-context)

## Features

- **Bidirectional Conversion**: Convert IP addresses to binary and back
- **Dual Protocol Support**: Full IPv4 and IPv6 compatibility
- **IPv6 Compression**: Automatic handling of compressed IPv6 notation (::)
- **Type Safety**: Uses Uint8Array for efficient binary representation
- **Zero Dependencies**: Pure JavaScript implementation
- **Modern Syntax**: ES modules with async/await patterns

## Installation

```bash
bun i @3-/ip
```

## Usage

### IPv4 Conversion

```javascript
import ipBin from '@3-/ip/ipBin.js'
import binIp from '@3-/ip/binIp.js'

// Convert IPv4 address to binary
const bytes = ipBin('192.168.1.1')
console.log(bytes) // Uint8Array(4) [192, 168, 1, 1]

// Convert binary back to IPv4 address
const ip = binIp(bytes)
console.log(ip) // "192.168.1.1"
```

### IPv6 Conversion

```javascript
import ipBin from '@3-/ip/ipBin.js'
import binIp from '@3-/ip/binIp.js'

// Convert full IPv6 address to binary
const bytes = ipBin('2001:0db8:85a3:0000:0000:8a2e:0370:7334')
console.log(bytes) // Uint8Array(16) [32, 1, 13, 184, ...]

// Convert compressed IPv6 address
const compressedBytes = ipBin('2001:db8:85a3::8a2e:370:7334')
const ip = binIp(compressedBytes)
console.log(ip) // "2001:db8:85a3::8a2e:370:7334"

// Handle special addresses
const loopback = ipBin('::1')
console.log(binIp(loopback)) // "::1"
```

## Design Philosophy

The library follows a functional programming approach with two core modules:

**Conversion Flow:**

```
IP String → ipBin() → Uint8Array → binIp() → IP String
```

**Module Interaction:**

1. `ipBin.js`: Parses IP string format and converts to binary representation
   - Detects protocol by delimiter (`:` for IPv6, `.` for IPv4)
   - Expands compressed IPv6 notation
   - Validates address format and range
   - Returns Uint8Array (4 bytes for IPv4, 16 bytes for IPv6)

2. `binIp.js`: Reconstructs IP string from binary data
   - Determines protocol by array length
   - Applies IPv6 compression for consecutive zeros
   - Formats output according to protocol standards

3. `IpInvalid.js`: Centralized error handling for invalid addresses

## Technical Stack

- **Runtime**: Bun/Node.js (ES Modules)
- **Language**: Modern JavaScript (ES2022+)
- **Data Structure**: Uint8Array for binary representation
- **Architecture**: Pure functional programming
- **Standards**: RFC 4291 (IPv6), RFC 791 (IPv4)

## Project Structure

```
@3-/ip/
├── src/
│   ├── ipBin.js        # IP string to binary converter
│   ├── binIp.js        # Binary to IP string converter
│   └── IpInvalid.js    # Error definition
├── lib/                # Compiled output
├── test/
│   └── main.js         # Usage examples and tests
├── readme/
│   ├── en.md           # English documentation
│   └── zh.md           # Chinese documentation
└── package.json
```

## API Reference

### ipBin(ip)

Converts IP address string to binary representation.

**Parameters:**
- `ip` (string): IPv4 or IPv6 address

**Returns:**
- `Uint8Array`: 4 bytes for IPv4, 16 bytes for IPv6

**Throws:**
- `IpInvalid`: When address format is invalid

### binIp(bin)

Converts binary representation to IP address string.

**Parameters:**
- `bin` (Uint8Array): Binary IP address (4 or 16 bytes)

**Returns:**
- `string`: Formatted IP address

**Throws:**
- `IpInvalid`: When binary length is invalid

## Historical Context

The need for IP address binary conversion emerged from the early days of network programming. In 1981, RFC 791 defined IPv4 with its 32-bit address space, using dot-decimal notation for human readability while computers processed addresses as binary data.

As the internet grew, IPv4's 4.3 billion addresses proved insufficient. RFC 2460 introduced IPv6 in 1998, expanding to 128-bit addresses with hexadecimal colon notation. The double-colon (::) compression syntax was added to simplify the lengthy addresses, creating the challenge this library solves: efficiently converting between human-readable and machine-processable formats.

The choice of Uint8Array reflects modern JavaScript's evolution. Before typed arrays were introduced in ES2015, developers relied on regular arrays or Buffer objects, which were less efficient for binary operations. Uint8Array provides direct memory access and better performance for network-level operations, making it the ideal choice for IP address manipulation in contemporary JavaScript applications.

---

<a id="zh"></a>
# @3-/ip : IP 地址二进制双向转换器

高性能 IP 地址与二进制表示相互转换库，支持 IPv4 和 IPv6，零依赖。

## 目录

- [特性](#特性)
- [安装](#安装)
- [使用方法](#使用方法)
  - [IPv4 转换](#ipv4-转换)
  - [IPv6 转换](#ipv6-转换)
- [设计思路](#设计思路)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [API 参考](#api-参考)
- [历史背景](#历史背景)

## 特性

- **双向转换**：IP 地址与二进制格式互相转换
- **双协议支持**：完整支持 IPv4 和 IPv6
- **IPv6 压缩**：自动处理 IPv6 压缩表示法（::）
- **类型安全**：使用 Uint8Array 高效表示二进制数据
- **零依赖**：纯 JavaScript 实现

## 安装

```bash
bun i @3-/ip
```

## 使用方法

### IPv4 转换

```javascript
import ipBin from '@3-/ip/ipBin.js'
import binIp from '@3-/ip/binIp.js'

// 将 IPv4 地址转换为二进制
const bytes = ipBin('192.168.1.1')
console.log(bytes) // Uint8Array(4) [192, 168, 1, 1]

// 将二进制转换回 IPv4 地址
const ip = binIp(bytes)
console.log(ip) // "192.168.1.1"
```

### IPv6 转换

```javascript
import ipBin from '@3-/ip/ipBin.js'
import binIp from '@3-/ip/binIp.js'

// 将完整 IPv6 地址转换为二进制
const bytes = ipBin('2001:0db8:85a3:0000:0000:8a2e:0370:7334')
console.log(bytes) // Uint8Array(16) [32, 1, 13, 184, ...]

// 转换压缩格式的 IPv6 地址
const compressedBytes = ipBin('2001:db8:85a3::8a2e:370:7334')
const ip = binIp(compressedBytes)
console.log(ip) // "2001:db8:85a3::8a2e:370:7334"

// 处理特殊地址
const loopback = ipBin('::1')
console.log(binIp(loopback)) // "::1"
```

## 设计思路

本库采用函数式编程方法，由两个核心模块组成：

**转换流程：**

```
IP 字符串 → ipBin() → Uint8Array → binIp() → IP 字符串
```

**模块调用关系：**

1. `ipBin.js`：解析 IP 字符串格式并转换为二进制表示
   - 通过分隔符检测协议（`:` 表示 IPv6，`.` 表示 IPv4）
   - 展开 IPv6 压缩表示法
   - 验证地址格式和范围
   - 返回 Uint8Array（IPv4 为 4 字节，IPv6 为 16 字节）

2. `binIp.js`：从二进制数据重建 IP 字符串
   - 根据数组长度判断协议类型
   - 对连续的零应用 IPv6 压缩
   - 按协议标准格式化输出

3. `IpInvalid.js`：集中处理无效地址错误

## 技术栈

- **运行时**：Bun/Node.js（ES 模块）
- **语言**：现代 JavaScript（ES2022+）
- **数据结构**：Uint8Array 二进制表示
- **架构**：纯函数式编程
- **标准**：RFC 4291（IPv6）、RFC 791（IPv4）

## 项目结构

```
@3-/ip/
├── src/
│   ├── ipBin.js        # IP 字符串转二进制转换器
│   ├── binIp.js        # 二进制转 IP 字符串转换器
│   └── IpInvalid.js    # 错误定义
├── lib/                # 编译输出
├── test/
│   └── main.js         # 使用示例和测试
├── readme/
│   ├── en.md           # 英文文档
│   └── zh.md           # 中文文档
└── package.json
```

## API 参考

### ipBin(ip)

将 IP 地址字符串转换为二进制表示。

**参数：**
- `ip` (string)：IPv4 或 IPv6 地址

**返回值：**
- `Uint8Array`：IPv4 为 4 字节，IPv6 为 16 字节

**抛出异常：**
- `IpInvalid`：地址格式无效时

### binIp(bin)

将二进制表示转换为 IP 地址字符串。

**参数：**
- `bin` (Uint8Array)：二进制 IP 地址（4 或 16 字节）

**返回值：**
- `string`：格式化的 IP 地址

**抛出异常：**
- `IpInvalid`：二进制长度无效时

## 历史背景

IP 地址二进制转换的需求源于网络编程的早期发展。1981 年，RFC 791 定义了 IPv4 及其 32 位地址空间，采用点分十进制记法便于人类阅读，而计算机则以二进制数据处理地址。

随着互联网的发展，IPv4 的 43 亿地址空间逐渐不足。1998 年，RFC 2460 引入了 IPv6，将地址扩展到 128 位，采用十六进制冒号记法。双冒号（::）压缩语法的加入简化了冗长的地址表示，但也带来了本库要解决的挑战：在人类可读格式和机器可处理格式之间高效转换。

选择 Uint8Array 反映了现代 JavaScript 的演进。在 ES2015 引入类型化数组之前，开发者依赖普通数组或 Buffer 对象，这些方式在二进制操作上效率较低。Uint8Array 提供直接内存访问和更好的性能，使其成为当代 JavaScript 应用中进行网络层级操作的理想选择。

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

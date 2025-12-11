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
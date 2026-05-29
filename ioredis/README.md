# @3-/tmpl

[English](#en) | [中文](#zh)

---

<a id="en"></a>
# README

This project provides an optimized ioredis configuration to improve concurrency performance and stability.

## Parameters

### enableAutoPipelining: true
Automatically groups multiple Redis commands into a single network packet within the same event loop tick.
Significantly reduces Round Trip Time (RTT) and increases throughput for high-frequency operations.

### enableOfflineQueue: true
Enables the command queue when the Redis connection is lost. New commands will be stored in memory and executed automatically once the connection is restored.
Ensures that application requests do not fail immediately during brief Redis hiccups or reconnections, improving fault tolerance.

### keepAlive: 10000 (TCP KeepAlive)
Sends a TCP keep-alive probe every 10 seconds.
Prevents network devices (firewalls, load balancers) from silently dropping idle connections.

### connectTimeout: 5000
Sets the connection establishment timeout to 5 seconds.
Avoids indefinite waiting when the network is poor or Redis is down.

### dropBufferSupport: true
Disables buffer return values to reduce memory copying and CPU overhead.
Optimized for applications that primarily handle string data.

### maxRetriesPerRequest: 3
Limits retries for a single Redis command to 3 attempts.
Implements a fail-fast strategy to prevent blocked requests from consuming resources indefinitely.

### retryStrategy
Optimized reconnection logic. Returns an Error object after 6 failed attempts.
Ensures ioredis terminates the reconnection process gracefully and emits an error event, preventing process crashes.

---

<a id="zh"></a>
# 项目说明

本项目对 ioredis 进行了默认优化配置，以提高并发性能并增强稳定性。

## 参数解析

### enableAutoPipelining: true (自动流水线)
在同一个事件循环周期内，将多个 Redis 命令自动合并为一个网络包发送。
大幅减少网络往返次数 (RTT)，显著提升高频小操作的吞吐量。

### enableOfflineQueue: true (启用离线队列)
当 Redis 连接断开时，将新发出的命令缓存在内存中，待连接恢复后自动执行。
确保在 Redis 瞬时抖动或短暂断开时，应用层的请求不会直接报错，提升系统的容错性。

### keepAlive: 10000 (TCP 保活)
每 10 秒发送一次 TCP 心跳包。
防止网络设备（如防火墙、负载均衡器）因连接长时间空闲而主动切断 Socket。

### connectTimeout: 5000 (连接超时)
设置建立连接的超时时间为 5 秒。
避免在网络环境极差或 Redis 宕机时，应用进程陷入无限制的等待。

### dropBufferSupport: true (禁用 Buffer 支持)
强制 ioredis 不再处理 Buffer 类型的返回值。
减少内存拷贝和 CPU 转换开销，适用于主要处理字符串数据的场景。

### maxRetriesPerRequest: 3 (单次请求重试)
单个 Redis 命令在失败后最多重试 3 次。
实现快速失败 (Fail Fast) 策略，避免单个阻塞请求长时间占用资源。

### retryStrategy (重连策略)
优化了重连逻辑。当重连尝试超过 6 次后，返回错误对象。
确保 ioredis 能够终止重连流程，并触发 error 事件，避免进程因未捕获异常而崩溃。

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

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

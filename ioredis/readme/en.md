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

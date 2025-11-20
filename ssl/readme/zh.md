# 项目说明

ZeroSSL 证书申请工具，支持通过 ACME 协议自动申请域名证书。

## 功能特性

- 支持主域名和通配符域名（`example.com` 和 `*.example.com`）
- 使用 DNS-01 验证方式
- 自动处理 ZeroSSL EAB（External Account Binding）凭证

## 环境配置

需要在 `~/js0/conf/cron/cf.env` 文件中配置以下环境变量：

```bash
# ZeroSSL API 密钥（可选，如不提供将无法使用 ZeroSSL）
# 获取方式：登录 ZeroSSL 控制台 -> Developer 页面 -> 查看 API Access Key
export ZEROSSL_API_KEY=your_zerossl_api_key

# Cloudflare 配置（用于 DNS 验证）
export CF_KEY=your_cloudflare_api_key
export CF_MAIL=your_cloudflare_email
```

## 使用方法

```bash
./run.sh
```

## 返回值

函数返回数组 `[cert_key, cert]`：
- `cert_key`: 证书私钥（PEM 格式）
- `cert`: 证书内容（PEM 格式）

## 注意事项

### 关于量子加密

目前 ZeroSSL 暂不支持量子加密证书（ML-DSA/Dilithium）。代码使用 ECDSA 加密算法作为当前的安全方案。

当 ZeroSSL 支持量子加密后，可以通过修改 `生成证书签名请求` 函数中的参数来启用量子加密算法。
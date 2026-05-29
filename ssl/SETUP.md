# 配置环境变量

## 方式一：使用项目默认配置文件

在 `~/js0/conf/cron/cf.env` 文件中添加以下配置：

```bash
export ZEROSSL_API_KEY=your_zerossl_api_key
export CF_KEY=your_cloudflare_api_key
export CF_MAIL=your_cloudflare_email
```

## 方式二：临时设置（仅用于测试）

```bash
export ZEROSSL_API_KEY=your_zerossl_api_key
export CF_KEY=your_cloudflare_api_key
export CF_MAIL=your_cloudflare_email
./run.sh
```

## 获取 ZeroSSL API Key

1. 访问 https://app.zerossl.com/signup 注册免费账号
2. 登录后访问 https://app.zerossl.com/developer
3. 在 "API Credentials" 部分查看您的 API Access Key
4. 复制该 Key 并设置为 `ZEROSSL_API_KEY` 环境变量

## 测试

配置完成后运行：

```bash
./run.sh
```

如果配置正确，程序将自动：
1. 通过 ZeroSSL API 获取 EAB 凭证
2. 创建 ACME 客户端
3. 生成证书签名请求（包含主域名和通配符）
4. 通过 DNS-01 验证
5. 返回证书和私钥

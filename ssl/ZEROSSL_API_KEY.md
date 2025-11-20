# 关于 ZEROSSL_API_KEY 的说明

## acme.sh 的使用方式

是的！我们的代码使用的环境变量 `ZEROSSL_API_KEY` 与 acme.sh 完全一致。

### acme.sh 的工作原理

1. **环境变量**: acme.sh 也使用 `ZEROSSL_API_KEY` 环境变量
2. **自动生成 EAB**: 当设置了这个环境变量后，acme.sh 会自动调用 ZeroSSL API 生成 EAB 凭证
3. **透明化**: 用户不需要手动获取 eab_kid 和 eab_hmac_key

### 我们的实现

我们代码中的 `获取EAB凭证` 函数实现了与 acme.sh 相同的逻辑：

```javascript
const 获取EAB凭证 = async (email) => {
  const api_key = process.env.ZEROSSL_API_KEY;
  if (!api_key) {
    return null;
  }
  // 调用 ZeroSSL API 自动生成 EAB 凭证
  const url = `https://api.zerossl.com/acme/eab-credentials?access_key=${api_key}`;
  const resp = await fetch(url, { method: "POST" });
  const data = await resp.json();
  return {
    kid: data.eab_kid,
    hmacKey: data.eab_hmac_key,
  };
};
```

## 如何使用

### 获取 ZeroSSL API Key

1. 访问 https://app.zerossl.com/signup 注册账号（免费）
2. 登录后访问 https://app.zerossl.com/developer
3. 在 "API Credentials" 部分查看并复制 "API Access Key"

### 配置环境变量

在 `~/js0/conf/cron/cf.env` 中添加：

```bash
export ZEROSSL_API_KEY=你的_API_Key
```

### 运行测试

```bash
./run.sh
```

## 优势

- ✅ 与 acme.sh 使用相同的环境变量，易于迁移
- ✅ 自动生成 EAB 凭证，无需手动操作
- ✅ 代码简洁，符合现代 Node.js 最佳实践
- ✅ 支持主域名和通配符域名

## 注意事项

如果不设置 `ZEROSSL_API_KEY`，函数会返回 null，导致 ACME 客户端创建失败。这是预期行为，因为 ZeroSSL 的 ACME 服务强制要求 EAB 凭证。

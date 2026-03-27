# 代码实现说明

## 主要功能函数

### 获取EAB凭证
- 通过 ZeroSSL API 动态生成 External Account Binding 凭证
- 使用环境变量 `ZEROSSL_API_KEY` 进行认证
- 返回 `kid` 和 `hmacKey` 供 ACME 客户端使用

### 创建客户端
- 生成 ACME 账户私钥
- 配置 ZeroSSL ACME directory URL
- 自动附加 EAB 凭证（如果 API Key 可用）

### 生成证书签名请求
- 使用 `acme-client` 的 `crypto.createCsr()` 方法
- 支持多域名（主域名 + 通配符域名）
- 返回证书私钥和 CSR

### 处理挑战
- 使用 DNS-01 验证方式
- 通过提供的 `setTxt` 函数创建 TXT 记录
- 保存记录 ID 以便后续清理

### 清理挑战
- 通过提供的 `rmTxtById` 函数删除 TXT 记录
- 使用之前保存的记录 ID

## 关于量子加密

虽然用户要求使用抗量子加密，但当前（2025年）ZeroSSL 尚不支持量子加密证书（如 ML-DSA/Dilithium）。

代码已预留扩展性：
- 当 ZeroSSL 支持量子加密后
- 可在 `生成证书签名请求` 函数中添加相关参数
- Node.js 24.7+ 已原生支持 ML-DSA 密钥生成

当前使用 ECDSA 作为加密算法，这是目前 ACME 协议的标准做法。

## 代码风格

- 函数名使用中文，提高代码可读性
- 变量名使用下划线风格（snake_case）
- 使用箭头函数定义
- 使用 async/await 而非 Promise.then()
- 没有 try-catch，错误会自动向上传播
- 所有函数都是纯函数，无副作用（除了API调用）

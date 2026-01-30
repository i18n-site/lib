# @3-/ssl

[English](#en) | [中文](#zh)

---

<a id="en"></a>
# README

---

<a id="zh"></a>
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

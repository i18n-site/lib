# @3-/npmv

cdn 架构设计

## ./cf

* 获取最新的npm包的版本号
* 上传最新的版本号到 backblaze
* 刷新 cloudflare 的 cdn
* 插入到 neon.tech 的postgresql 数据库, 并发送 notify 通知

## ../npmv_refresh

用 postgresql 的 listen refresh_pkg 来监听更新, 刷新 nginx 的 proxy cache

## upv.i18n.site

调用 cf 的 api

用华为云的地域解析, 中国大陆走阿里云的代理

~/i18n/ops/nginx/conf/vps/a1/upv.i18n.site.conf

## v.i18n.site

~/i18n/ops/nginx/conf/vps/a1/v.i18n.site.conf

获取最新 npm 包的版本号, 过期时间为6秒

用华为云的地域解析, 中国大陆走阿里云的代理

## About This Project

This project is an open-source component of [i18n.site ⋅ Internationalization Solution](https://i18n.site).

* [i18 : MarkDown Command Line Translation Tool](https://i18n.site/i18)

  The translation perfectly maintains the Markdown format.

  It recognizes file changes and only translates the modified files.

  The translated Markdown content is editable; if you modify the original text and translate it again, manually edited translations will not be overwritten (as long as the original text has not been changed).

* [i18n.site : MarkDown Multi-language Static Site Generator](https://i18n.site/i18n.site)

  Optimized for a better reading experience

## 关于本项目

本项目为 [i18n.site ⋅ 国际化解决方案](https://i18n.site) 的开源组件。

* [i18 :  MarkDown命令行翻译工具](https://i18n.site/i18)

  翻译能够完美保持 Markdown 的格式。能识别文件的修改，仅翻译有变动的文件。

  Markdown 翻译内容可编辑；如果你修改原文并再次机器翻译，手动修改过的翻译不会被覆盖（如果这段原文没有被修改）。

* [i18n.site : MarkDown多语言静态站点生成器](https://i18n.site/i18n.site) 为阅读体验而优化。
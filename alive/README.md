# @3-/alive

监控代码见
https://atomgit.com/3ti/rust/blob/main/alive

用这个运行
https://cloud.google.com/scheduler/docs/creating?hl=zh-cn

报警策略

0 当时
1 分钟
2 分钟
4 分钟
8 分钟
16 分钟
32 分钟
64 分钟
128 分钟
256 分钟
512 分钟
1024 分钟
2048 分钟
4096 分钟
8192 分钟
16384 分钟
32768 分钟
65536 分钟

因为失败之后不会更新实现 , 而会每分钟做一次检查
那么 , 也就意味着 , 用错误次数-基准错误次数来报警即可

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
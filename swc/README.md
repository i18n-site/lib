# @3-/swc

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/swc
  @3-/read
#   @3-/uridir
#   path > join

# ROOT = uridir(import.meta)

console.log await swc read('/Users/z/i18n/18x/serviceWorker/serviceWorker._.js'), 'xx'
```

output :

```
{
  code: '(async(C,F,New)=>{let p=(async()=>{let t=(await F("${i18nSite}")).split(" "),a=t[0]+t[2],e=F(a);return New("style",{type:"text/css",textContent:await F(t[0]+t[1])}),await e,a})();await eval(await F(C+await F(C+".v"))),New("script",{type:"module",crossorigin:"",src:await p})})("${cdn}",async t=>(await fetch("//"+t)).text(),(t,a)=>document.head.appendChild(Object.assign(document.createElement(t),a)));',
  map: '{"version":3,"sources":["xx"],"sourcesContent":["// global const, will set to window._CDN\\nconst _CDN = \\"//${cdn}\\";\\n\\n(async (C, F, New) => {\\n\\t// for concurrent requests ( 并发请求 )\\n\\tlet p = (async () => {\\n\\t\\tlet t = (await F(\\"${i18nSite}\\")).split(\\" \\"),\\n\\t\\t\\tjs_url = t[0] + t[2],\\n\\t\\t\\tjs_preload = F(js_url);\\n\\n\\t\\tNew(\\"style\\", {\\n\\t\\t\\ttype: \\"text/css\\",\\n\\t\\t\\ttextContent: await F(t[0] + t[1]),\\n\\t\\t});\\n\\n\\t\\t// preload for speed up\\n\\t\\tawait js_preload;\\n\\t\\treturn js_url;\\n\\t})();\\n\\n\\t// load importmap , muse before script module\\n\\tawait eval(await F(C + (await F(C + \\".v\\"))));\\n\\n\\tNew(\\"script\\", {\\n\\t\\ttype: \\"module\\",\\n\\t\\tcrossorigin: \\"\\",\\n\\t\\tsrc: await p,\\n\\t});\\n})(\\n\\t\\"${cdn}\\",\\n\\tasync (U) => {\\n\\t\\treturn (await fetch(\\"//\\" + U)).text();\\n\\t},\\n\\t(tag, attr) =>\\n\\t\\tdocument.head.appendChild(Object.assign(document.createElement(tag), attr)),\\n);\\n"],"names":["C","F","New","p","t","split","js_url","js_preload","type","textContent","eval","crossorigin","src","U","fetch","text","tag","attr","document","head","appendChild","Object","assign","createElement"],"rangeMappings":"","mappings":"AAGC,CAAA,MAAOA,EAAGC,EAAGC,OAEb,IAAIC,EAAI,AAAC,CAAA,UACR,IAAIC,EAAI,AAAC,CAAA,MAAMH,EAAE,cAAa,EAAGI,KAAK,CAAC,KACtCC,EAASF,CAAC,CAAC,EAAE,CAAGA,CAAC,CAAC,EAAE,CACpBG,EAAaN,EAAEK,GAShB,OAPAJ,IAAI,QAAS,CACZM,KAAM,WACNC,YAAa,MAAMR,EAAEG,CAAC,CAAC,EAAE,CAAGA,CAAC,CAAC,EAAE,CACjC,GAGA,MAAMG,EACCD,CACR,CAAA,GAGA,OAAMI,KAAK,MAAMT,EAAED,EAAK,MAAMC,EAAED,EAAI,QAEpCE,IAAI,SAAU,CACbM,KAAM,SACNG,YAAa,GACbC,IAAK,MAAMT,CACZ,EACD,CAAA,EACC,SACA,MAAOU,GACC,AAAC,CAAA,MAAMC,MAAM,KAAOD,EAAC,EAAGE,IAAI,GAEpC,CAACC,EAAKC,IACLC,SAASC,IAAI,CAACC,WAAW,CAACC,OAAOC,MAAM,CAACJ,SAASK,aAAa,CAACP,GAAMC"}'
}
```

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
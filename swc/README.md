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
  code: 'const _V="${V}",_P=[];(async()=>{let at="@",js=".js",split=a=>a.split(">"),getTxt=async a=>(await fetch(a)).text(),getJs=(a,t)=>getTxt(_V+at+a+"/"+t+js),_18x="${X}",[B,P]=split(await getTxt("${V}/.v")).map((a,t)=>getJs(a,"BP"[t])),go=eval(await B)(_18x),D=document,site="site",i_site="i/"+site,site_v=at+await _SITE_V,slash_minus="/-",style=D.createElement("style");style.textContent=(await Promise.all([".css",js].map((a,t)=>_I+site+site_v+slash_minus+a).map(async a=>(await fetch(a)).text())))[0],D.head.appendChild(style),_P.push(...JSON.parse(await P)),go(),import(i_site+site_v+slash_minus+js)})();',
  map: '{"version":3,"sources":["xx"],"sourcesContent":["// global const, will set to window\\nconst _V = \\"${V}\\",\\n\\t_P = [] // [ [prefix, prefix index, show ver?, all show ver list? ]\\n;(async () => {\\n\\tconst at = \\"@\\"\\n\\tconst js = \\".js\\"\\n\\tconst split = (i) => i.split(\\">\\")\\n\\tconst getTxt = async (url) => (await fetch(url)).text()\\n\\tconst getJs = (ver, file) => getTxt(_V + at + ver + \\"/\\" + file + js)\\n\\tconst _18x = \\"${X}\\"\\n\\n\\tconst [B, P] = split(await getTxt(\\"${V}/.v\\")).map((js, pos) =>\\n\\t\\tgetJs(js, \\"BP\\"[pos]),\\n\\t)\\n\\t// New(\'link\',{{href:conf_x+\'_.css\',rel:\'stylesheet\'}});\\n\\n\\tconst go = eval(await B)(_18x)\\n\\n\\t// const decode_li = Promise.all(\\n\\t// \\t[\\"bintxt\\", \\"vbD\\"].map(async (i) => (await import(\\"x/\\" + i + js)).default),\\n\\t// )\\n\\n\\t// 因为 vite 开发环境不需要它, 所以放这里\\n\\tconst D = document,\\n\\t\\tsite = \\"site\\",\\n\\t\\ti_site = \\"i/\\" + site,\\n\\t\\tsite_v = at + (await _SITE_V),\\n\\t\\tslash_minus = \\"/-\\",\\n\\t\\tstyle = D.createElement(\\"style\\")\\n\\n\\tstyle.textContent = (\\n\\t\\tawait Promise.all(\\n\\t\\t\\t[\\".css\\", js]\\n\\t\\t\\t\\t.map((ext, pos) => _I + site + site_v + slash_minus + ext)\\n\\t\\t\\t\\t.map(async (url) => (await fetch(url)).text()),\\n\\t\\t)\\n\\t)[0]\\n\\tD.head.appendChild(style)\\n\\t_P.push(...JSON.parse(await P))\\n\\tgo()\\n\\timport(i_site + site_v + slash_minus + js)\\n})()\\n"],"names":["_V","_P","at","js","split","i","getTxt","url","fetch","text","getJs","ver","file","_18x","B","P","map","pos","go","eval","D","document","site","i_site","site_v","_SITE_V","slash_minus","style","createElement","textContent","Promise","all","ext","_I","head","appendChild","push","JSON","parse"],"rangeMappings":"","mappings":"AACA,MAAMA,GAAK,OACVC,GAAK,EAAE,CACP,AAAC,CAAA,UACD,IAAMC,GAAK,IACLC,GAAK,MACLC,MAAQ,AAACC,GAAMA,EAAED,KAAK,CAAC,KACvBE,OAAS,MAAOC,GAAQ,AAAC,CAAA,MAAMC,MAAMD,EAAG,EAAGE,IAAI,GAC/CC,MAAQ,CAACC,EAAKC,IAASN,OAAON,GAAKE,GAAKS,EAAM,IAAMC,EAAOT,IAC3DU,KAAO,OAEP,CAACC,EAAGC,EAAE,CAAGX,MAAM,MAAME,OAAO,YAAYU,GAAG,CAAC,CAACb,EAAIc,IACtDP,MAAMP,EAAI,IAAI,CAACc,EAAI,GAIdC,GAAKC,KAAK,MAAML,GAAGD,MAOnBO,EAAIC,SACTC,KAAO,OACPC,OAAS,KAAOD,KAChBE,OAAStB,GAAM,MAAMuB,QACrBC,YAAc,KACdC,MAAQP,EAAEQ,aAAa,CAAC,QAEzBD,CAAAA,MAAME,WAAW,CAAG,AACnB,CAAA,MAAMC,QAAQC,GAAG,CAChB,CAAC,OAAQ5B,GAAG,CACVa,GAAG,CAAC,CAACgB,EAAKf,IAAQgB,GAAKX,KAAOE,OAASE,YAAcM,GACrDhB,GAAG,CAAC,MAAOT,GAAQ,AAAC,CAAA,MAAMC,MAAMD,EAAG,EAAGE,IAAI,IAC7C,CACA,CAAC,EAAE,CACJW,EAAEc,IAAI,CAACC,WAAW,CAACR,OACnB1B,GAAGmC,IAAI,IAAIC,KAAKC,KAAK,CAAC,MAAMvB,IAC5BG,KACA,MAAM,CAACK,OAASC,OAASE,YAAcvB,GACxC,CAAA"}'
}
```

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
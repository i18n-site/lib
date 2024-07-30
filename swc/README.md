[‼️]: ✏️README.mdt

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

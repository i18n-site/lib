# @3-/webpush

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/webpush
  @3-/dbq > $q
  @3-/utf8/utf8d.js

{
  VAPID_PK
  VAPID_SK
} = process.env

push = webpush(
  {
    proxy: "http://127.0.0.1:7890"
    vapidDetails: {
      subject: 'mailto:i18n.site@gmail.com'
      publicKey : VAPID_PK
      privateKey: VAPID_SK
    }
  }
  'https://i18n.site/android-chrome-512x512.png'
)

base64url = 'base64url'

ID_HOST = new Map (
  await $q("SELECT id,host FROM webpushEndpointHost")
).map ([id, host])=> [id, utf8d(host)]

for [endpointHostId, endpoint, auth, p256dh] from await $q("SELECT endpointHostId,endpoint,auth,p256dh FROM webpush")
  endpoint = 'https://' + ID_HOST.get(endpointHostId) + '/' + utf8d(endpoint)
  console.log endpoint
  auth = auth.toString(base64url)
  p256dh = p256dh.toString(base64url)
  try
    console.log await push(
      '测试webpush'
      'https://www.npmjs.com/package/web-push'
      '主体'
      endpoint
      auth
      p256dh
    )
  catch err
    console.log err.statusCode, err.body
console.log('done')
# {"endpoint":"https://web.push.apple.com/QD8StnDGB1khT2Ehn0itRDrN4rZzF3XqYxG4ELn9ovO39-vIL1C39Mvx2uA8HpNO-d_E8yQtGIDJ92p43ciqp_x0aoi3A930Zbi4C86g7bVjDM6NQ79v_sev4twHXYGWqJSEplvFbUcIN4S_feTPWc-zhnE0vBmPBdaaJSQGghI","keys":{"p256dh":"BBdcKG-6UrSSb8kJJWZ-I0NWDNIqF9_7IDJLfMvr5fv0ZJOlUsFFC5Rz11gEY_fhJlmgeRL96V4hQ27llcDnsuA","auth":"TqzuWW63r_vTfyINDjmVAg"}}

# ARG = [
#   [
#     "https://web.push.apple.com/QD8StnDGB1khT2Ehn0itRDrN4rZzF3XqYxG4ELn9ovO39-vIL1C39Mvx2uA8HpNO-d_E8yQtGIDJ92p43ciqp_x0aoi3A930Zbi4C86g7bVjDM6NQ79v_sev4twHXYGWqJSEplvFbUcIN4S_feTPWc-zhnE0vBmPBdaaJSQGghI"
#     "TqzuWW63r_vTfyINDjmVAg"
#     "BBdcKG-6UrSSb8kJJWZ-I0NWDNIqF9_7IDJLfMvr5fv0ZJOlUsFFC5Rz11gEY_fhJlmgeRL96V4hQ27llcDnsuA"
#   ]
#   ["https://updates.push.services.mozilla.com/wpush/v2/gAAAAABmaRzB2cyqwa5h1iR2Yz9TJjGlfgw5r6OZXkPrJwj3FVtQucKHoDCbPFHFXBElhz8Uz-CrybHYOGZvuA3PQAZ7xx36FXSFELFdc_RDdFz_b99sZzLG7tNpGiXYXu_M-V5EUb93FPhqASfgX-77dQrF1x_cn4-WO_wHwBcw6y6WzEqVHmw","PSCbzbnnMPAFQ9Qcfez_yQ","BGD2kV9zk0d1fv7xCJ00_EPIG335fws_MCrpLX3x852r7ySPqJ8gUqlSTAcyHxetcoMRckIwQyk0FvsdFp8VUxQ",0]
#   ["https://fcm.googleapis.com/fcm/send/eQh3we0tMkk:APA91bFxO_ydkPXvWlnt_3K9Pn4WbIHEPJ2dS5a4Hz0P5wqm40rB13i3QOA29bvqVxqS0oJH6__PXx1GmnpPGb_nwwuHYS2q5I5wQ1vbglGHLEfzssK-CzdhIQaf_FrDPqR67Zzcea8V","5jGSvwj2_K7GGd4-dGw18w","BFoecbFSWzJib91A4UPiqdmJmAVw_b1-hmgdkLsXwqrahcVlP4gj_GxqWKxuOiiLF0fS9_4v0EoW-yRzGjmsOVw",0]
# ]
#
# for arg in ARG
#   console.log await push(
#     '测试webpush'
#     'https://www.npmjs.com/package/web-push'
#     '主体'
#     ... arg
#   )
```

output :

```
[;90mSET NAMES utf8mb4 - parameters:[][0m
[;90mSELECT id,host FROM webpushEndpointHost - parameters:[][0m
[;90mSELECT endpointHostId,endpoint,auth,p256dh FROM webpush - parameters:[][0m
https://fcm.googleapis.com/fcm/send/c0iC4geeCa4:APA91bHUNS6TBAHLuqF_bXARxyn8TyqHj9V-NJWo8V9vqyLRFkk4-Rh0E79OgjzxTSCZ3R2jGbDhKqsIWVi6Iu4L97RVPvHFRD0vB5o-iQmk9NGnsZBU90MEG3t3KOLz378eJzyIfDsD
[;90mSET NAMES utf8mb4 - parameters:[][0m
[;90mSET NAMES utf8mb4 - parameters:[][0m
[;90mSET NAMES utf8mb4 - parameters:[][0m
[;90mSET NAMES utf8mb4 - parameters:[][0m
[;90mSET NAMES utf8mb4 - parameters:[][0m
[;90mSET NAMES utf8mb4 - parameters:[][0m
[;90mSET NAMES utf8mb4 - parameters:[][0m
410 push subscription has unsubscribed or expired.

https://fcm.googleapis.com/fcm/send/fVOPL8StQCc:APA91bF8PMUiKe-yyXmkKK5N0giiVplsW7SwV3b9SfklyDZR2JnlKtoOmGHs0a0j-BeOdMxYThW1cVvMbnxthA9xGXvZg7VrMdcdyzTTJpuIv8A92xHjHj8iUkTudgBwLqm7TkOtJMMT
{
  statusCode: 201,
  body: '',
  headers: {
    'content-security-policy-report-only': "script-src 'none'; form-action 'none'; frame-src 'none'; report-uri https://csp.withgoogle.com/csp/goa-520bfc14",
    'cross-origin-opener-policy-report-only': 'same-origin; report-to="goa-520bfc14"',
    location: 'https://fcm.googleapis.com/0:1718179466461611%cc9b4facf9fd7ecd',
    'report-to': '{"group":"goa-520bfc14","max_age":2592000,"endpoints":[{"url":"https://csp.withgoogle.com/csp/report-to/goa-520bfc14"}]}',
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'SAMEORIGIN',
    'x-xss-protection': '0',
    date: 'Wed, 12 Jun 2024 08:04:26 GMT',
    'content-length': '0',
    'content-type': 'text/html; charset=UTF-8',
    'alt-svc': 'h3=":443"; ma=2592000,h3-29=":443"; ma=2592000',
    connection: 'close'
  }
}
done
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
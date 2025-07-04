> ./sign.js
  is-chinese:iscn

{env} = process

< (txt)=>
  + hascn
  for i from txt
    if iscn i
      hascn = 1
      break
  if not hascn
    return txt
  TargetLanguage = 'en'
  body = {
    TargetLanguage
    TextList: [
      txt
    ]
    Options: {
      "Category": ""
    }
  }
  signParams = {
    headers: {
      ['X-Date']: new Date().toISOString().replace(/[:-]|\.\d{3}/g, '')
      'Content-Type': 'application/json'
    }
    method: 'POST'
    query: {
      Version: '2020-06-01'
      Action: 'TranslateText'
    }
    body: JSON.stringify(body)
    accessKeyId: env.VOLC_ACCESSKEY
    secretAccessKey: env.VOLC_SECRETKEY
    serviceName: 'translate'
    region: 'cn-north-1'
  }
  r = await fetch(
    "https://translate.volcengineapi.com?#{new URLSearchParams(signParams.query)}"
    {
      headers: {
        ...signParams.headers
        Authorization: sign signParams
      }
      method: signParams.method
      body: signParams.body
    }
  )
  r = await r.json()
  r.TranslationList.map((i)=>i.Translation)[0]

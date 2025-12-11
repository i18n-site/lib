#!/usr/bin/env coffee
#
> @baiducloud/sdk
  @3-/empty:EMPTY
  cdnssl > bind


{
  BAIDU_AK
  BAIDU_SK
} = process.env

SDK = new sdk.HttpClient {
  credentials: {
    ak: BAIDU_AK
    sk: BAIDU_SK
  }
  endpoint: 'https://cdn.baidubce.com'
}

proxy = (method, li)=>
  new Proxy(
    EMPTY
    apply:(target, self, args)=>
      path = '/'+li.join('/')
      headers =
        'Content-Type':'application/json'
        Accept:'application/json'
      [param, body] = args
      if body
        body = JSON.stringify(body)
      else
        body = ''

      r = await SDK.sendRequest(method, path, body, headers, param or {})
      r.body
    get: (_, name)=>
      proxy(method, [...li,name])
  )

C = new Proxy(
  {}
  get: (_, method)=>
    proxy(method, ['v2'])
)

cdnLs = =>
  {
    domains
  } = await C.GET.user.domains(
    status:'ALL'
  )

  (
    for i from domains
      if i.status != 'RUNNING'
        continue
      i.domain
  )

  # POST /v2/domain/certificate?action=put
# {
#     "domains": [
#         "*.baidu.com",
#         "test.baidu.com"
#     ],
#     "certificate": {
#         "certName": "test",
#         "certServerData": "-----BEGIN CERTIFICATE-----END CERTIFICATE-----",
#         "certPrivateData": "-----BEGIN RSA PRIVATE KEY-----END RSA PRIVATE KEY-----"
#     }
# }

export default main = =>
  await bind(
    cdnLs
    (host, name, cert, key)=>
      console.log await C.POST.domain.certificate(
        {
          action: 'put'
        }
        {
          domains: [
            host
            # message: 'the current user(a25a712fc9924bd3a3b7c77cc0e3b85f) does not have these domains(["*.i18n.site"])',
            # '*.'+host
          ]
          certificate: {
            certName: host+new Date().toISOString().slice(0,19).replaceAll(':','')
            certServerData: cert
            certPrivateData: key
          }
        }
      )
      return
    =>
  )
  return

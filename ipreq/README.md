[‼️]: ✏️README.mdt

# @3-/ipreq

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/ipreq/fTxt.js

console.log '>>>',await fTxt(
  'i18n.site'
  '.i'
  '111.63.51.41'
  2000
)
```

output :

```
>>> [
  '<!doctypehtml><meta content="width=device-width,initial-scale=1"name=viewport><meta charset=UTF-8><script>(async(D,S)=>{window._S=await S.register("/S.js");await S.ready;S.controller?(D.head.append(S=D.createElement("script")),S.src="/_"):location.reload()})(document,navigator.serviceWorker);</script>\n',
  {
    'accept-ranges': 'bytes',
    'alt-svc': 'h3=":443"; ma=300, quic="111.63.51.42:443"; ma=300; v="44,43,39"',
    'cache-control': 'max-age=900000',
    connection: 'close',
    'content-encoding': 'br',
    'content-type': 'text/html; charset=utf-8',
    date: 'Thu, 04 Jul 2024 07:48:56 GMT',
    etag: '"defd1b0b88388741792056ea5cf324c4"',
    server: 'JSP3/2.0.14',
    'strict-transport-security': 'max-age=63072000; includeSubDomains',
    'transfer-encoding': 'chunked',
    'x-cache-status': 'MISS'
  },
  200
]
```

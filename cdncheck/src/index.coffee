> @3-/ipreq/fTxt.js
  assert/strict > equal
  @3-/err:Err

{
  CdnCheck
} = Err

_check = (host, path, ip)=>
  begin = +new Date()
  r = await fTxt(host, path, ip)
  if r.pop()!=200
    console.error({host,path,ip },r)
    throw r
  [txt, header] = r
  pos = txt.indexOf('\n')
  if pos >= 0
    txt = txt.slice(0, pos)
  if txt != host
    throw new CdnCheck JSON.stringify {host, path, ip, txt}
  return [
    ip
    new Date() - begin
    header.get('server')
  ]


export default (host, path, ip_li)=>
  r = []
  for i,pos in await Promise.allSettled ip_li.map (ip)=>_check(host, path, ip)
    if i.status == 'fulfilled'
      r.push i.value
    else
      console.error '❌',ip_li[pos], i.reason

  r.sort(
    (a,b)=>
      a[1]-b[1]
  )

  r

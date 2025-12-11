#!/usr/bin/env coffee

> @3-/doge:Doge
  cdnssl > bind
  path > dirname join

{env} = process

doge = Doge(
  env.DOGECLOUD_accessKey
  env.DOGECLOUD_secretKey
)

api = (url,data)=>
  doge("cdn/#{url}", data)

cdnLs = =>
  for i from (
    (await api(
      'domain/list.json'
    )).domains
  )
    i.name

export default =>

  await bind(
    cdnLs

    # upload
    (host, note, cert, key)=>
      {id} = await api(
        'cert/upload.json'
        {
          note
          cert
          private:key
        }
      )
      return id

    # set
    (host, cert, cert_id)=>
      await api(
        "domain/config.json?domain="+host
        {cert_id}
      )
      return

  )

  for i from (await api('cert/list.json')).certs
    if not i.domainCount
      await api(
        'cert/delete.json'
        id:i.id
      )

  return

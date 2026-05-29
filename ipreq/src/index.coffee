> node-fetch:fetch
  https
  @3-/fetch/timeout.js:_timeout
  @3-/err:Err
  lodash-es/merge.js

httpsAgent = new https.Agent({
  rejectUnauthorized: false
})

{
  CertExpired
  NoCert
} = Err

httpsAgent = new https.Agent({
  rejectUnauthorized: false
})

< (host, path, ip, opt)=>
  opt = opt or {}
  {timeout} = opt
  delete opt.timeout
  f = _timeout(fetch, timeout or 16000)

  r = await f(
    'https://'+(if ip.includes('.') then ip else '['+ip+']')+'/'+path
    merge(
      {
        headers: {
          'Host': host
        }
        agent: httpsAgent
      }
      opt
    )
  )

  + has_cert = false
  if not has_cert
    for [name, li] from Object.entries(httpsAgent.sockets)
      for sock from li
        {remoteAddress} = sock
        if remoteAddress and remoteAddress != ip
          continue
        cert = sock.getPeerCertificate()
        {subjectaltname} = cert
        if not subjectaltname
          if sock.authorized
            has_cert = true
            break
          continue
        host_li = cert.subjectaltname.split(',').map (i)=>
          p = i.indexOf(':')
          if p > 0
            i = i.slice(p+1)
          i.trim()

        if host_li.includes(host) or host_li.includes('*.'+host.slice(host.indexOf('.')+1))
          remain = new Date(cert.valid_to) - new Date()
          if remain < 0
            throw new CertExpired("#{host} #{ip}")
          has_cert = true
          break
  if not has_cert
    throw new NoCert("#{host} #{ip}")

  [
    Buffer.from await r.arrayBuffer()
    r.headers
    r.status
  ]
  # new Promise (resolve, reject)=>
  #   req = https.get(
  #     'https://'+ip+'/'+path
  #     {
  #       headers: {
  #         'Host': host
  #       }
  #       timeout
  #       rejectUnauthorized: false
  #       lookup: (domain, options, callback) =>
  #         # console.log {domain, options}
  #         callback null, [
  #           {
  #             address: ip
  #             family: if ip.includes(':') then 6 else 4
  #           }
  #         ]
  #         return
  #     }
  #     (res)=>
  #       w = new stream.PassThrough()
  #       res.pipe w
  #       w.on 'error',reject
  #       w.on(
  #         'finish'
  #         =>
  #           resolve [
  #             w.read()
  #             res.headers
  #             res.statusCode
  #           ]
  #           return
  #       )
  #       return
  #   ).on(
  #     'error'
  #     reject
  #   ).on(
  #     'socket'
  #     (socket)=>
  #       socket.setTimeout(timeout)
  #       socket.on(
  #         'timeout'
  #         =>
  #           req.destroy()
  #           reject TimeoutError
  #           return
  #       )
  #       return
  #   )
  #   return

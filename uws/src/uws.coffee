#!/usr/bin/env coffee
> ./Err.js > NotFound
  uWebSockets.js:uWs
  ./FUNC.js
  @3-/log/ERR.js
  @3-/log/GRAY.js:@ > gray
  @3-/log/GREEN.js
# @3-/ipreq/fTxt.js

process.on 'uncaughtException', (err)=>
  ERR('uncaughtException :',err)
  return

{env} = process

{
  PORT
} = env

PORT = Number.parseInt(PORT) || 3000


dump = (r)=>
  + json
  loop
    try
      if r.constructor == String
        break
    catch
      json = true
      break
    json = not (
      (
        r instanceof Buffer
      ) or (
        r instanceof Uint8Array
      )
    )
    break

  if json
    r = JSON.stringify(r)
  return r

# Bun.serve({
#   port: PORT
#   fetch: (req) =>
#     r = await App.call(req)
#     return new Response(dump(r))
# })

# To configure which port and hostname the server will listen on:
# 要配置服务器将侦听的端口和主机名：

# https://github.com/uNetworking/uWebSockets.js/tree/master/examples
export default (
  App
  init
)=>
  GRAY 'http://127.0.0.1:'+PORT
  init(uWs)
    .any(
      '/*'
      (res, req) =>
        path = req.getUrl().slice(1)
        method = req.getMethod()
        GREEN method, gray(path)
        res.onAborted =>
          res.aborted = true
          return
        o = {
          path
          method
          req
          res
        }
        try
          r = dump await App.call(
            new Proxy(
              o
              get: (self, name) =>
                func = FUNC[name]
                if func then func.call(o) else self[name]
            )
          )
          code = '200'
        catch err
          msg = [
            method
            path
          ]
          if err instanceof NotFound
            code = '404'
            r = ''
          else
            code = '500'
            msg.push err
            r = err.stack?.toString() or JSON.stringify(err)
          ERR(
            code
            ...msg
          )
        if not res.aborted
          res.cork =>
            res.writeStatus(code)
            #.writeHeader('IsExample', 'Yes')
            .end r
            return
        return
    ).listen(
      PORT
      (listenSocket) =>
        if listenSocket
          GRAY('LISTEN '+PORT)
        return
    )
  return

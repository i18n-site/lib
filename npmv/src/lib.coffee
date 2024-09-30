> @3-/cw/Res.js
  @3-/sleep

_f = (url)=>
  r = await fetch('https://'+url)
  if r.status != 200
    throw Res(
      r.status
      url + ': ' + await r.text()
    )
  return r

fjson = (url)=>
  (await _f(url)).json()

fbin = (url)=>
  new Uint8Array await (await _f(url)).arrayBuffer()

< ver = (pkg)=>
  {version} = await fjson "registry.npmjs.org/#{pkg}/latest"
  return version

< (pkg, ver, path) =>
  # 等一会, npm 刷新没那么快
  await sleep 15e3
  li = ['cdn','fastly','quantil','gcore','originfastly']
  time = 29e3
  loop
    url = li.pop() + ".jsdelivr.net/npm/#{pkg}@#{ver}/#{path}"
    try
      return await fbin url
    catch e
      if e.status == 404
        if li.length
          await sleep time
          if time > 9300
            time -= 9300
          continue
      throw e
  return

> @3-/ipreq/fTxt.js
  ./CONF.js

{VPS_HOST, TOKEN} = CONF

< (path, ip, name)=>
  host = VPS_HOST[name]
  url = 'https://'+host+'/'+path
  console.log name, url
  n = 0
  loop
    try
      r = await fTxt(
        host
        path
        ip
        {
          headers: {
            t: TOKEN
          }
        }
      )
      break
    catch e
      if ++n > 9
        throw [name, ip, url, e]
      console.error '❌', n, name, ip, url, e

  if r[2] != 200
    throw [name, ip, url, r]
  return

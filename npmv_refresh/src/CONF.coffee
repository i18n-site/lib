CONF = {}

export default CONF

export init = (js)=>
  conf = await import(js)

  CONF.VPS_HOST = VPS_HOST = {}

  for [host, vps_li] from Object.entries conf.HOST_VPS
    for vps from vps_li.split(' ')
      VPS_HOST[vps] = host

  Object.assign(CONF, conf)
  return

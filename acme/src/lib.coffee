#!/usr/bin/env coffee

> @3-/zx > $raw
  @3-/retry
  @3-/alissl
  os > homedir
  path > join
  fs > existsSync rmSync statSync

{
  NODE_ENV
} = process.env

IS_DEV = NODE_ENV!='production'

HOME = homedir()

DIR_ACME = join HOME,'.acme.sh'

ACME_SH = join DIR_ACME,'acme.sh'

$.verbose = true

issue = (dns, host)=>
  ssl = join DIR_ACME, host+'_ecc'
  fullchain = join ssl, 'fullchain.cer'
  if not existsSync(fullchain) or statSync(fullchain).mtime.getTime() < new Date().getTime() - 5184e6
    try
      await $raw"""#{ACME_SH} --ecc --force --dns dns_#{dns} --log --issue -d "#{host}" -d '*.#{host}'"""
    catch err
      rmSync ssl, { recursive: true, force: true }
      if IS_DEV
        msg = err.stderr + '\n❌ 出错了'
      else
        msg = '❌ 出错了 ' + dns + ' '+ host
      console.error msg
      throw err
  return

if not IS_DEV
  issue = retry issue

export default main = (mail, dns_host)=>
  if not existsSync ACME_SH
    await $"""curl https://get.acme.sh | sh -s email=#{mail} && sed -i '/^[[:space:]]*cat "\$CERT_PATH"[[:space:]]*$/d' ~/.acme.sh/acme.sh"""
  for [dns, host_li] from Object.entries dns_host
    for host from host_li
      console.log dns, host
      # 貌似不能并发，不然会出错
      await issue dns, host
  return

> path > join
  @3-/xxhash3 > hash128
  fs > readFileSync
  base-x

BFILE = BaseX '!$-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'

< (pwd)=>
  map = new Map
  add = (fp, url)=>
    bin = hash128 readFileSync join pwd, fp
    map.set url, bin
    #console.log url, BFILE.encode bin

  add '.i18n/lang', 'lang'
  console.log map
  return

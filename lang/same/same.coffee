#!/usr/bin/env coffee

> ./zh
  @3-/read

m = new Map
# console.log m
for i from read('./nllb.coffee').split('\n')
  j = i.split '|'
  if j[1]
    cn = j[1].trim()
    en = j[2].trim()
    m.set cn,en


map = """库尔德语(索拉尼) ckb_Arab
拉脱维亚语 lvs_Latn
南非科萨语 xho_Latn
南非祖鲁语 zul_Latn
旁遮普语 pan_Guru
契维语 aka_Latn
塞佩蒂语 nso_Latn
塞索托语 sot_Latn
乌兹别克语 uzn_Latn
伊洛卡诺语 ilo_Latn
印尼巽他语 sun_Latn
印尼语 ind_Latn
印尼爪哇语 jav_Latn""".split("\n")

for i from map
  i = i.split(' ')
  console.log
  m.set i[0],i[1]


r = []
to_lang = []
for [code,lang] from zh
  to = m.get(lang)
  if to
    to_lang.push to
    r.push [to, code, lang]
console.log to_lang.length
console.log new Set(to_lang).size
console.log JSON.stringify r

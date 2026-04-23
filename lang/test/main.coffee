#!/usr/bin/env coffee

> @3-/lang/CODE.js
  @3-/lang/ZH.js
  @3-/lang/code/QWEN.js

QW = new Set("""代码
en
zh
zh_tw
ru
ja
ko
es
fr
pt
de
it
th
vi
id
ms
ar
hi
he
my
ta
ur
bn
pl
nl
ro
tr
km
lo
yue
cs
el
sv
hu
da
fi
uk
bg
sr
te
af
hy
as
ast
eu
be
bs
ca
ceb
hr
arz
et
gl
ka
gu
is
jv
kn
kk
lv
lt
lb
mk
mai
mt
mr
acm
ary
ars
ne
az
apc
uz
nb
nn
oc
or
pag
scn
sd
si
sk
sl
ajp
sw
tl
acq
sq
aeb
vec
war
cy
fa
""".split('\n'))

for code,pos in CODE
  code = QWEN[code] || code
  if not QW.has code
    console.log ZH[pos], code
# for i from AI_LANG
#   console.log i
  #, ZH[CODE_ID.get(i)[

# li = "简体中文、英语、日语、泰语、韩语、印地语、乌克兰语、阿拉伯语、土耳其语、越南语、波兰语、荷兰语、葡萄牙语、意大利语、西班牙语、德语、法语、俄语".split('、')
#
# map = new Map
#
# for [k,v] from zh
#   map.set(v,k)
#
# for i,pos in li
#   console.log map.get(i).toUpperCase(),'=',pos+', // '+i
#
#

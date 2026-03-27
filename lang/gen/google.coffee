# https://cloud.google.com/translate/docs/languages?hl=zh-cn

LI = '''阿布哈兹语 ab
亚齐语 ace
阿乔利语 ach
南非语 af
阿尔巴尼亚语 sq
阿卢尔语 alz
Amharic am
阿拉伯语 ar
亚美尼亚语 hy
阿萨姆语 as
阿瓦德语 awa
艾马拉语 ay
阿塞拜疆语 az
巴厘语 ban
班巴拉语 bm
巴什基尔语 ba
巴斯克语 eu
巴塔克卡罗语 btx
巴塔克西马隆贡语 bts
巴塔克托巴语 bbc
白俄罗斯语 be
Bemba bem
孟加拉语 bn
Betawi bew
博杰普尔语 bho
Bikol bik
波斯尼亚语 bs
布列塔尼语 br
保加利亚语 bg
布里亚特语 bua
粤语 yue
加泰罗尼亚语 ca
宿务语 ceb
齐切瓦语（尼扬贾语） ny
简体中文 zh-CN 或 zh (BCP-47)
中文（繁体） zh-TW (BCP-47)
楚瓦什语 cv
科西嘉语 co
克里米亚鞑靼语 crh
克罗地亚语 hr
捷克语 cs
丹麦语 da
Dinka din
第维埃语 dv
多格来语 doi
敦贝语 dov
荷兰语 nl
宗卡语 dz
英语 en
世界语 eo
爱沙尼亚语 et
Ewe ee
斐济语 fj
菲律宾语（塔加拉语） fil 或 tl
芬兰语 fi
法语 fr
法语（法国） fr-FR
法语（加拿大） fr-CA
弗里斯兰语 fy
富拉语 ff
加 (Ga) 语 gaa
加利西亚语 gl
干达语（卢干达语） lg
格鲁吉亚语 ka
德语 de
希腊语 el
瓜拉尼语 gn
古吉拉特语 gu
海地语 ht
哈卡钦语 cnh
Hausa ha
夏威夷语 haw
希伯来语 he
希利盖农语 hil
印地语 hi
苗语 hmn
匈牙利语 hu
洪斯吕克语 hrx
冰岛语 is
Igbo ig
伊洛果语 ilo
印尼语 id
爱尔兰语 ga
意大利语 it
日语 ja
爪哇语 jv
卡纳达语 kn
邦板牙语 pam
哈萨克语 kk
高棉语 km
Kiga cgg
卢旺达语 rw
吉土巴语 ktu
贡根语 gom
韩语 ko
Krio kri
库尔德语（库尔曼吉语） ku
库尔德语（索拉尼语） ckb
吉尔吉斯语 ky
老挝语 lo
拉特加莱语 ltg
拉丁语 la
拉脱维亚语 lv
利古里亚语 lij
林堡语 li
林加拉语 ln
立陶宛语 lt
伦巴第语 lmo
Luo luo
卢森堡语 lb
马其顿语 mk
迈蒂利语 mai
马卡萨 mak
马尔加什语 mg
马来语 ms
马来语（爪夷文） ms-Arab
马拉雅拉姆语 ml
马耳他语 mt
毛利语 mi
马拉地语 mr
草原马里语 chm
梅泰语（曼尼普尔语） mni-Mtei
米南语 min
米佐语 lus
蒙古语 mn
缅甸语 my
恩德贝莱语（南部） nr
尼泊尔语（尼瓦尔语） new
尼泊尔语 ne
北索托语（塞佩蒂语） nso
挪威语 no
努尔语 nus
奥克语 oc
奥里亚语（奥里亚） or
Oromo om
邦阿西楠语 pag
帕皮阿门托语 pap
Pashto ps
波斯语 fa
波兰语 pl
葡萄牙语 pt
葡萄牙语（葡萄牙） pt-PT
葡萄牙语（巴西） pt-BR
旁遮普语 pa
旁遮普语（沙木基文） pa-Arab
克丘亚语 qu
罗姆语 rom
罗马尼亚语 ro
Rundi rn
俄语 ru
萨摩亚语 sm
Sango sg
梵语 sa
苏格兰盖尔语 gd
塞尔维亚语 sr
塞索托语 st
塞舌尔克里奥尔语 crs
掸语 shn
修纳语 sn
西西里语 scn
西里西亚语 szl
信德语 sd
僧伽罗语 si
斯洛伐克语 sk
斯洛文尼亚语 sl
索马里语 so
西班牙语 es
巽他语 su
斯瓦希里语 sw
斯瓦特语 ss
瑞典语 sv
塔吉克语 tg
泰米尔语 ta
鞑靼语 tt
泰卢固语 te
德顿语 tet
泰语 th
提格里尼亚语 ti
聪加语 ts
茨瓦纳语 tn
土耳其语 tr
土库曼语 tk
契维语（阿坎语） ak
乌克兰语 uk
乌尔都语 ur
维吾尔语 ug
乌兹别克语 uz
越南语 vi
威尔士语 cy
科萨语 xh
意第绪语 yi
约鲁巴语 yo
尤卡坦玛雅语 yua
祖鲁语 zu'''.split('\n')

name_code = new Map
export default name_code
export CODE_NAME = new Map

LI.forEach(
 (i)=>
  [cn,code] = i.split(' ')
  switch code
    when 'zh-TW'
      cn = '正體中文'
    when 'zh-CN'
      code = 'zh'
      cn = '简体中文'

  cn_li = cn.split('（').map((i)=>i.split('）')[0].trim())
  for i from cn_li
    if not name_code.has(i)
      name_code.set(i,code)
  name_code.set(cn,code)
  CODE_NAME.set(code,cn_li[0])
  return
)

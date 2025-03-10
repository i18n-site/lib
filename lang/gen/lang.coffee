#!/usr/bin/env coffee

> fs > readFileSync
  path > join
  @3-/write

# https://ai.google.dev/gemini-api/docs/models/gemini?hl=zh-cn#available-languages

# English Name,Chinese Name,Name in Native Language,Language Code,GDP Ranking
LANG = '''
English,英语,English,en,1
Chinese,简体中文,Chinese,zh,2
Spanish,西班牙语,Español,es,3
Japanese,日语,日本語,ja,4
German,德语,Deutsch,de,5
French,法语,Français,fr,6
Italian,意大利语,Italiano,it,7
Hindi,印地语,हिंदी,hi,8
Portuguese,葡萄牙语,Português,pt,9
Russian,俄语,Русский,ru,10
Korean,韩语,한국어,ko,11
Dutch,荷兰语,Nederlands,nl,12
Arabic,阿拉伯语,العربية,ar,13
Turkish,土耳其语,Türkçe,tr,14
Indonesian,印尼语,Bahasa Indonesia,id,15
Swedish,瑞典语,Svenska,sv,16
Polish,波兰语,Polski,pl,17
Norwegian,挪威语,Norsk,no,18
Hebrew,希伯来语,עברית,iw,19
Traditional Chinese,正體中文,正體中文,zh-TW,20
Thai,泰语,ไทย,th,21
Danish,丹麦语,Dansk,da,22
Vietnamese,越南语,Tiếng Việt,vi,23
Finnish,芬兰语,Suomi,fi,24
Greek,希腊语,Ελληνικά,el,25
Czech,捷克语,Čeština,cs,26
Romanian,罗马尼亚语,Română,ro,27
Bengali,孟加拉语,বাঙলা,bn,28
Hungarian,匈牙利语,Magyar,hu,29
Ukrainian,乌克兰语,Українською,uk,30
Slovak,斯洛伐克语,Slovenský Jazyk,sk,31
Swahili,斯瓦希里语,Kiswahili,sw,32
Bulgarian,保加利亚语,Български,bg,33
Croatian,克罗地亚语,Hrvatski,hr,34
Serbian,塞尔维亚语,Srpski,sr,35
Lithuanian,立陶宛语,Lietuvių Kalba,lt,36
Slovenian,斯洛文尼亚语,Slovenčina,sl,37
Latvian,拉脱维亚语,Latviešu Valoda,lv,38
Estonian,爱沙尼亚语,Eesti Keel,et,39
'''.split('\n')

all = new Map readFileSync('lang.txt','utf8').trim().split('\n').map (i)=>
  [cn,code] = i.split(' ')
  [code,cn]

OUT = {}

for i in LANG
  [en,cn,name,code] = i.split(',')
  all.delete code
  for [k,v] from Object.entries {en,cn,name,code}
    li = OUT[k]
    if not li
      OUT[k] = li = []
    li.push v

if all.size
  console.log 'miss lang', all

ROOT = import.meta.dirname
for [k,v] from Object.entries OUT
  write(
    join ROOT,'rust/src',k+'.rs'
    'pub const '+k.toUpperCase()+': &[&str] = &'+JSON.stringify(v)+';'
  )



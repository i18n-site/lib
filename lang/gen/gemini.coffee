#!/usr/bin/env coffee

> ./CODE.coffee
  ./NAME.coffee
  ./GDP.coffee

###
https://support.google.com/gemini/answer/14579026?hl=zh
https://support.google.com/gemini/answer/14579026?hl=en
###

EN = '''
Arabic
Bengali
Bulgarian*
Chinese (Simplified / Traditional)
Croatian*
Czech*
Danish
Dutch
English
Estonian*
Finnish*
French
German
Greek*
Gujarati
Hebrew*
Hindi
Hungarian*
Indonesian
Italian
Japanese
Kannada
Korean
Latvian*
Lithuanian*
Malayalam
Marathi
Norwegian
Polish
Portuguese
Romanian*
Russian
Serbian*
Slovak*
Slovenian*
Spanish
Swahili*
Swedish
Tamil
Telugu
Thai
Turkish
Ukrainian*
Urdu
Vietnamese'''

ZH = '''
阿拉伯语
孟加拉语
保加利亚语*
中文（简体/繁体）
克罗地亚语*
捷克语*
丹麦语
荷兰语
英语
爱沙尼亚语*
芬兰语*
法语
德语
希腊语*
古吉拉特语
希伯来语*
印地语
匈牙利语*
印度尼西亚语
意大利语
日语
卡纳达语
韩语
拉脱维亚语*
立陶宛语*
马拉雅拉姆语
马拉地语
挪威语
波兰语
葡萄牙语
罗马尼亚语*
俄语
塞尔维亚语*
斯洛伐克语*
斯洛文尼亚语*
西班牙语
斯瓦希里语*
瑞典语
泰米尔语
泰卢固语
泰语
土耳其语
乌克兰语*
乌尔都语
越南语'''.replaceAll('*','')

LI = []

EN = EN.replaceAll('*','').split '\n'
for zh,pos in ZH.split('\n')
  if zh.startsWith '中文'
    zh = '简体中文'
    en = 'Simplified Chinese'
    code = CODE.get zh
    LI.push [code,zh,en,zh]

    zh = '正體中文'
    en = 'Traditional Chinese'
    code = CODE.get zh
    LI.push [code,zh,en,zh]
    continue
  code = CODE.get zh
  en = EN[pos]
  code = CODE.get zh
  if not code
    console.log zh,'MISS CODE'
  name = NAME.get(zh)
  if not name
    console.log zh,'MISS NAME'
  LI.push [code,zh,en,name]
  gdp = GDP.get zh
  if not gdp
    console.log zh,'MISS GDP'

LI.sort (a,b)=>
  GDP.get(b[1]) - GDP.get a[1]

export default LI

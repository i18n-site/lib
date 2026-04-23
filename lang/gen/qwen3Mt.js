#!/usr/bin/env bun

const li = `英语,English,en
简体中文,Chinese,zh
繁体中文,Traditional Chinese,zh_tw
俄语,Russian,ru
日语,Japanese,ja
韩语,Korean,ko
西班牙语,Spanish,es
法语,French,fr
葡萄牙语,Portuguese,pt
德语,German,de
意大利语,Italian,it
泰语,Thai,th
越南语,Vietnamese,vi
印度尼西亚语,Indonesian,id
马来语,Malay,ms
阿拉伯语,Arabic,ar
印地语,Hindi,hi
希伯来语,Hebrew,he
缅甸语,Burmese,my
泰米尔语,Tamil,ta
乌尔都语,Urdu,ur
孟加拉语,Bengali,bn
波兰语,Polish,pl
荷兰语,Dutch,nl
罗马尼亚语,Romanian,ro
土耳其语,Turkish,tr
高棉语,Khmer,km
老挝语,Lao,lo
粤语,Cantonese,yue
捷克语,Czech,cs
希腊语,Greek,el
瑞典语,Swedish,sv
匈牙利语,Hungarian,hu
丹麦语,Danish,da
芬兰语,Finnish,fi
乌克兰语,Ukrainian,uk
保加利亚语,Bulgarian,bg
塞尔维亚语,Serbian,sr
泰卢固语,Telugu,te
南非荷兰语,Afrikaans,af
亚美尼亚语,Armenian,hy
阿萨姆语,Assamese,as
阿斯图里亚斯语,Asturian,ast
巴斯克语,Basque,eu
白俄罗斯语,Belarusian,be
波斯尼亚语,Bosnian,bs
加泰罗尼亚语,Catalan,ca
宿务语,Cebuano,ceb
克罗地亚语,Croatian,hr
埃及阿拉伯语,Egyptian Arabic,arz
爱沙尼亚语,Estonian,et
加利西亚语,Galician,gl
格鲁吉亚语,Georgian,ka
古吉拉特语,Gujarati,gu
冰岛语,Icelandic,is
爪哇语,Javanese,jv
卡纳达语,Kannada,kn
哈萨克语,Kazakh,kk
拉脱维亚语,Latvian,lv
立陶宛语,Lithuanian,lt
卢森堡语,Luxembourgish,lb
马其顿语,Macedonian,mk
马加希语,Maithili,mai
马耳他语,Maltese,mt
马拉地语,Marathi,mr
美索不达米亚阿拉伯语,Mesopotamian Arabic,acm
摩洛哥阿拉伯语,Moroccan Arabic,ary
内志阿拉伯语,Najdi Arabic,ars
尼泊尔语,Nepali,ne
北阿塞拜疆语,North Azerbaijani,az
北黎凡特阿拉伯语,North Levantine Arabic,apc
北乌兹别克语,Northern Uzbek,uz
书面语挪威语,Norwegian Bokmål,nb
新挪威语,Norwegian Nynorsk,nn
奥克语,Occitan,oc
奥里亚语,Odia,or
邦阿西楠语,Pangasinan,pag
西西里语,Sicilian,scn
信德语,Sindhi,sd
僧伽罗语,Sinhala,si
斯洛伐克语,Slovak,sk
斯洛文尼亚语,Slovenian,sl
南黎凡特阿拉伯语,South Levantine Arabic,ajp
斯瓦希里语,Swahili,sw
他加禄语,Tagalog,tl
塔伊兹-亚丁阿拉伯语,Ta’izzi-Adeni Arabic,acq
托斯克阿尔巴尼亚语,Tosk Albanian,sq
突尼斯阿拉伯语,Tunisian Arabic,aeb
威尼斯语,Venetian,vec
瓦莱语,Waray,war
威尔士语,Welsh,cy
西波斯语,Western Persian,fa`
  .split("\n")
  .map((i) => i.split(","));

export default li;

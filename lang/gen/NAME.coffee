#!/usr/bin/env coffee

export default new Map(
  '''
中文名称,本语言名称
阿拉伯语,العربية
孟加拉语,বাংলা
保加利亚语,Български
简体中文,简体中文
正體中文,繁體中文
克罗地亚语,Hrvatski
捷克语,Čeština
丹麦语,Dansk
荷兰语,Nederlands
英语,English
爱沙尼亚语,Eesti
芬兰语,Suomi
法语,Français
德语,Deutsch
希腊语,Ελληνικά
古吉拉特语,ગુજરાતી
希伯来语,עברית
印地语,हिन्दी
匈牙利语,Magyar
印度尼西亚语,Bahasa Indonesia
意大利语,Italiano
日语,日本語
卡纳达语,ಕನ್ನಡ
韩语,한국어
拉脱维亚语,Latviešu Valoda
立陶宛语,Lietuvių Kalba
马拉雅拉姆语,മലയാളം
马拉地语,मराठी
挪威语,Norsk
波兰语,Polski
葡萄牙语,Português
罗马尼亚语,Română
俄语,Русский
塞尔维亚语,Српски
斯洛伐克语,Slovenčina
斯洛文尼亚语,Slovenščina
西班牙语,Español
斯瓦希里语,Kiswahili
瑞典语,Svenska
泰米尔语,தமிழ்
泰卢固语,తెలుగు
泰语,ไทย
土耳其语,Türkçe
乌克兰语,Українська
乌尔都语,اردو
越南语,Tiếng Việt
'''.split('\n').map (i)=>i.split(',')
)


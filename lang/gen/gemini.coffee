#!/usr/bin/env coffee

> ./google.coffee:CODE > CODE_NAME


# https://cloud.google.com/vertex-ai/generative-ai/docs/learn/models?hl=zh-cn#languages-gemini


LANG_GEMINI = '''
阿拉伯语 (ar)、孟加拉语 (bn)、保加利亚语 (bg)、中文（简体和繁体）(zh)、克罗地亚语 (hr)、捷克语 (cs)、丹麦语 (da)、荷兰语 (nl)、英语 (en)、爱沙尼亚语 (et)、芬兰 (fi)、法语 (fr)、德语 (de)、希腊语 (el)、希伯来语 (he)、印地语 (hi)、匈牙利语 (hu)、印尼语 (id)、意大利语 (it)、日语 (ja)、韩语 (ko)、拉脱维亚语 (lv)、立陶宛语 (lt)、挪威语 (no)、波兰语 (pl)、葡萄牙语 (pt)、罗马尼亚语 (ro)、俄语 (ru)、塞尔维亚语 (sr)、斯洛伐克语 (sk)、斯洛文尼亚语 (sl)、西班牙语 (es)、斯瓦希里语 (sw)、瑞典语 (sv)、泰语 (th)、土耳其语 (tr)、乌克兰语 (uk)、越南语 (vi)

南非语 (af)、阿姆哈拉语 (am)、阿萨姆语 (as)、阿塞拜疆语 (az)、白俄罗斯语 (be)、波斯尼亚语 (bs)、加泰隆语 (ca)、宿务语 (ceb)、科西嘉语 (co)、威尔士语 (cy)、迪维希语 (dv)、世界语 (eo)、巴斯克语 (eu)、波斯语 (fa)、菲律宾语 (Tagalog) (fil)、弗里西语 (fy)、爱尔兰语 (ga)、苏格兰语 (gd)、加利西亚语 (gl)、古吉拉特语 (gu)、豪萨语 (ha)、夏威夷语 (haw)、苗语 (hmn)、海地克里奥语 (ht)、亚美尼亚语 (hy)、伊博语 (ig)、冰岛语 (is)、爪哇语 (jv)、格鲁吉亚语 (ka)、哈萨克语 (kk)、高棉语 (km)、卡纳达语 (kn)、克里奥语 (kri)、库尔德语 (ku)、吉尔吉斯语 (ky)、拉丁语 (la)、卢森堡语 (lb)、老挝语 (lo)、马达加斯加语 (mg)、毛利语 (mi)、马其顿语 (mk)、马拉雅拉姆语 (ml)、蒙古语 (mn)、曼尼普尔语 (Manipuri) (mni-Mtei)、马拉地语 (mr)、马来语 (ms)、马耳他语 (mt)、缅甸语 (Myanmar) (my)、尼泊尔语 (ne)、尼亚查语 (Chichewa) (ny)、奥里亚语 (Oriya) (or)、旁遮普语 (pa)、普什图语 (ps)、信德语 (sd)、僧伽罗语 (Sinhalese) (si)、萨摩亚语 (sm)、绍纳语 (sn)、索马里语 (so)、阿尔巴尼亚语 (sq)、塞索托语 (st)、巽他语 (su)、泰米尔语 (ta)、泰卢固语 (te)、塔吉克语 (tg)、维吾尔语 (ug)、乌尔都语 (ur)、乌兹别克语 (uz)、科萨语 (xh)、意第绪语 (yi)、约鲁巴语 (yo)、祖鲁语 (zu)

'''.split('\n')

li = [
  ['正體中文','zh-TW']
]
for line from LANG_GEMINI
  line = line.trim()
  if line
    for i from line.split('、')
      [cn] = i = i.split('(')
      code = i.pop()
      code = code.split(')')[0].trim()
      cn = cn.trim()
      if cn == '芬兰'
        cn = '芬兰语'
      if code == 'zh'
        cn = '简体中文'
      gt_code = CODE.get(cn)
      if not gt_code
        name = CODE_NAME.get(code)
        if name
          gt_code = code
          if name.toLowerCase() == name.toUpperCase()
            cn = name
      if gt_code
        li.push [cn, gt_code]
      else
        CODE_NAME
        console.log 'not exist',cn, code, CODE_NAME.get(code)


export default li

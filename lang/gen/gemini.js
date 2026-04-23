#!/usr/bin/env bun

// https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models?hl=zh-cn#expandable-1

const li =
  "南非荷兰语 (af)、 阿尔巴尼亚语 (sq)、 阿姆哈拉语 (am)、 阿拉伯语 (ar)、 亚美尼亚语 (hy)、 阿萨姆语 (as)、 阿塞拜疆语 (az)、 巴斯克语 (eu)、 白俄罗斯语 (be)、 孟加拉语 (bn)、 波斯尼亚语 (bs)、 保加利亚语 (bg)、 加泰罗尼亚语 (ca)、 宿务语 (ceb)、 中文（简体和繁体）(zh)、 科西嘉语 (co)、 克罗地亚语 (hr)、 捷克语 (cs)、 丹麦语 (da)、 迪维希语 (dv)、 荷兰语 (nl)、 英语 (en)、 世界语 (eo)、 爱沙尼亚语 (et)、 菲律宾语（他加禄语）(fil)、 芬兰语 (fi)、 法语 (fr)、 弗里斯兰语 (fy)、 加利西亚语 (gl)、 格鲁吉亚语 (ka)、 德语 (de)、 希腊语 (el)、 古吉拉特语 (gu)、 海地克里奥尔语 (ht)、 豪萨语 (ha)、 夏威夷语 (haw)、 希伯来语 (iw)、 印地语 (hi)、 苗语 (hmn)、 匈牙利语 (hu)、 冰岛语 (is)、 伊博语 (ig)、 印度尼西亚语 (id)、 爱尔兰语 (ga)、 意大利语 (it)、 日语 (ja)、 爪哇语 (jv)、 卡纳达语 (kn)、 哈萨克语 (kk)、 高棉语 (km)、 韩语 (ko)、 克里奥语 (kri)、 库尔德语 (ku)、 吉尔吉斯语 (ky)、 老挝语 (lo)、 拉丁语 (la)、 拉脱维亚语 (lv)、 立陶宛语 (lt)、 卢森堡语 (lb)、 马其顿语 (mk)、 马达加斯加语 (mg)、 马来语 (ms)、 马拉雅拉姆语 (ml)、 马耳他语 (mt)、 毛利语 (mi)、 马拉地语 (mr)、 梅泰语（曼尼普尔语）(mni-Mtei)、 蒙古语 (mn)、 缅甸语 (my)、 尼泊尔语 (ne)、 挪威语 (no)、 尼扬加语（齐切瓦语）(ny)、 奥迪亚语（奥里亚语）(or)、 普什图语 (ps)、 波斯语 (fa)、 波兰语 (pl)、 葡萄牙语 (pt)、 旁遮普语 (pa)、 罗马尼亚语 (ro)、 俄语 (ru)、 萨摩亚语 (sm)、 苏格兰盖尔语 (gd)、 塞尔维亚语 (sr)、 塞索托语 (st)、 绍纳语 (sn)、 信德语 (sd)、 僧伽罗语（锡兰语）(si)、 斯洛伐克语 (sk)、 斯洛文尼亚语 (sl)、 索马里语 (so)、 西班牙语 (es)、 巽他语 (su)、 斯瓦希里语 (sw)、 瑞典语 (sv)、 塔吉克语 (tg)、 泰米尔语 (ta)、 泰卢固语 (te)、 泰语 (th)、 土耳其语 (tr)、 乌克兰语 (uk)、 乌尔都语 (ur)、 维吾尔语 (ug)、 乌兹别克语 (uz)、 越南语 (vi)、 威尔士语 (cy)、 科萨语 (xh)、 意第绪语 (yi)、 约鲁巴语 (yo) 和祖鲁语 (zu)";

export default li.split("、").map((i) => {
  const [name, code] = i.split("(");
  return [name.trim(), code.replace(")", "").trim()];
});

#!/usr/bin/env coffee

export default new Map [
  ['zh-TW', 8.14],    # 台灣 2025 名義 GDP 約 8.14 兆美元
  ['ar', 2.44],       # 阿拉伯語約 2.44 兆美元 :contentReference[oaicite:1]{index=1}
  ['bn', 0.71],       # 孟加拉語約 0.71 兆美元 :contentReference[oaicite:2]{index=2}
  ['bg', 0.05],       # 保加利亞等國家語言 GDP 小於 0.1 兆，估約 0.05
  ['zh', 16.54],      # 中文（主要指中國）約 16.54 兆美元 :contentReference[oaicite:3]{index=3}
  ['hr', 0.05],       # 克羅地亞語 GDP 微小，估值 ~0.05
  ['cs', 0.05],       # 捷克語類似估 ~0.05
  ['da', 0.56],       # 丹麥語約 0.56 兆美元 :contentReference[oaicite:4]{index=4}
  ['nl', 1.16],       # 荷蘭語約 1.16 兆美元 :contentReference[oaicite:5]{index=5}
  ['en', 23.94],      # 英語約 23.94 兆美元 :contentReference[oaicite:6]{index=6}
  ['et', 0.05],       # 愛沙尼亞語微小，約 0.05
  ['fi', 0.56],       # 芬蘭語約 0.56 兆美元 :contentReference[oaicite:7]{index=7}
  ['de', 4.91],       # 德語約 4.91 兆美元 :contentReference[oaicite:8]{index=8}
  ['el', 0.43],       # 希臘語約 0.43 兆美元，與 20 名內相近
  ['iw', 0.43],       # 希伯來語（以色列）約 0.43 兆美元 :contentReference[oaicite:9]{index=9}
  ['hi', 1.37],       # 印地語約 1.37 兆美元 :contentReference[oaicite:10]{index=10}
  ['hu', 0.05],       # 匈牙利語估 ~0.05
  ['id', 0.75],       # 印尼語約 0.75 兆美元 :contentReference[oaicite:11]{index=11}
  ['it', 2.19],       # 意大利語約 2.19 兆美元 :contentReference[oaicite:12]{index=12}
  ['ja', 5.01],       # 日語約 5.01 兆美元 :contentReference[oaicite:13]{index=13}
  ['ko', 1.86],       # 韓語約 1.86 兆美元 :contentReference[oaicite:14]{index=14}
  ['lv', 0.05],       # 拉脫維亞語估 ~0.05
  ['lt', 0.05],       # 立陶宛語估 ~0.05
  ['no', 0.56],       # 挪威語約 0.56 兆美元 :contentReference[oaicite:15]{index=15}
  ['pl', 0.70],       # 波蘭語約 0.70 兆美元 :contentReference[oaicite:16]{index=16}
  ['ro', 0.43],       # 羅馬尼亞語約 0.43 兆美元 :contentReference[oaicite:17]{index=17}
  ['ru', 1.73],       # 俄語約 1.73 兆美元 :contentReference[oaicite:18]{index=18}
  ['sr', 0.05],       # 塞爾維亞語估 ~0.05
  ['sk', 0.05],       # 斯洛伐克語估 ~0.05
  ['sl', 0.05],       # 斯洛文尼亞語估 ~0.05
  ['es', 6.99],       # 西班牙語約 6.99 兆美元 :contentReference[oaicite:19]{index=19}
  ['sw', 0.05],       # 斯瓦希里語估 ~0.05
  ['sv', 0.56],       # 瑞典語約 0.56 兆美元 :contentReference[oaicite:20]{index=20}
  ['th', 0.48],       # 泰語約 0.48 兆美元 :contentReference[oaicite:21]{index=21}
  ['tr', 0.85],       # 土耳其語約 0.85 兆美元 :contentReference[oaicite:22]{index=22}
  ['uk', 0.43],       # 烏克蘭語約 0.43 兆美元 :contentReference[oaicite:23]{index=23}
  ['vi', 0.48],       # 越南語約 0.48 兆美元 :contentReference[oaicite:24]{index=24}
  ['af', 0.05],       # 南非荷蘭語估 ~0.05
  ['as', 0.05],       # 阿薩姆語估 ~0.05
  ['az', 0.05],       # 阿塞拜疆語估 ~0.05
  ['be', 0.05],       # 白俄羅斯語估 ~0.05
  ['bs', 0.05],       # 波士尼亞語估 ~0.05
  ['ca', 0.05],       # 加泰羅尼亞語估 ~0.05
  ['ceb', 0.05],      # 宿霧語估 ~0.05
  ['cy', 0.05],       # 威爾斯語估 ~0.05
  ['eu', 0.05],       # 巴斯克語估 ~0.05
  ['fa', 0.43],       # 波斯語約 0.43 兆美元 :contentReference[oaicite:25]{index=25}
  ['ga', 0.05],       # 愛爾蘭語估 ~0.05
  ['gl', 0.05],       # 加利西亞語估 ~0.05
  ['gu', 0.05],       # 古吉拉特語估 ~0.05
  ['ht', 0.05],       # 海地克里奧爾語估 ~0.05
  ['hy', 0.05],       # 亞美尼亞語估 ~0.05
  ['is', 0.05],       # 冰島語估 ~0.05
  ['jw', 0.05],       # 爪哇語估 ~0.05
  ['ka', 0.05],       # 喬治亞語估 ~0.05
  ['kk', 0.05],       # 哈薩克語估 ~0.05
  ['km', 0.05],       # 柬埔寨語估 ~0.05
  ['kn', 0.05],       # 卡納達語估 ~0.05
  ['lb', 0.05],       # 盧森堡語估 ~0.05
  ['lo', 0.05],       # 寮語估 ~0.05
  ['mk', 0.05],       # 馬其頓語估 ~0.05
  ['ml', 0.05],       # 馬拉雅拉姆語估 ~0.05
  ['mr', 0.05],       # 馬拉地語估 ~0.05
  ['mt', 0.05],       # 馬耳他語估 ~0.05
  ['my', 0.05],       # 緬甸語估 ~0.05
  ['ne', 0.05],       # 尼泊爾語估 ~0.05
  ['or', 0.05],       # 奧里亞語估 ~0.05
  ['sd', 0.05],       # 信德語估 ~0.05
  ['si', 0.05],       # 僧伽羅語估 ~0.05
  ['su', 0.05],       # 巽他語估 ~0.05
  ['ta', 0.43],       # 泰米爾語約 0.43 兆美元，與 Top‑50 類似 :contentReference[oaicite:26]{index=26}
  ['te', 0.43],       # 特盧固語同上估 ~0.43 :contentReference[oaicite:27]{index=27}
  ['tg', 0.05],       # 塔吉克語估 ~0.05
  ['ur', 0.43],       # 烏爾都語約 0.43 兆美元 :contentReference[oaicite:28]{index=28}
  ['yi', 0.05]        # 意第緒語估 ~0.05
]


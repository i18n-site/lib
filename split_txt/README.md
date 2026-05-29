# @3-/split_txt

按句子拆分文本,然后分组

动态规划,每组大概n个字,方便向量化索引

```coffee
export const SEG = new Intl.Segmenter('zh', { granularity: 'sentence' });

/**
 * 将文本切分为句子数组 (辅助函数)。
 * @param {string} txt 原始文本。
 * @returns {string[]} 句子字符串数组。
 */
export const sentenceLi = (txt) => [...SEG.segment(txt)].map(s => s.segment.trim()).filter(s => s.length > 0)

/**
 * 使用动态规划将文本切分为最优的段落 (核心函数)。
 * 目标是使所有段落的字数与目标字数的方差之和最小。
 *
 * @param {string} txt 需要处理的原始文本。
 * @param {number} [size=512] 每个段落的目标字数。
 * @returns {string[]} 段落字符串数组。
 */
export default (txt, size = 512) => {
  const sents = sentenceLi(txt);
  const n = sents.length;
  if (n === 0) return [];


  const lens = sents.map(s => s.length);
  
  const dp = new Array(n + 1).fill(Infinity);
  const path = new Array(n + 1).fill(0);
  dp[0] = 0;

  for (let i = 1; i <= n; i++) {
    let currentLen = 0;
    for (let j = i - 1; j >= 0; j--) {
      currentLen += lens[j];
      if (j < i - 1) {
        currentLen += 1;
      }

      const cost = Math.pow(currentLen - size, 2);

      if (dp[j] + cost < dp[i]) {
        dp[i] = dp[j] + cost;
        path[i] = j;
      }
    }
  }

  const li = [];
  let i = n;
  while (i > 0) {
    const j = path[i];
    li.unshift(sents.slice(j, i).join('\n'));
    i = j;
  }
  
  return li;
};
```

测试 :
```coffee
#!/usr/bin/env bun

import { join } from 'path'
import { readFileSync } from 'node:fs';
import splitTxt from '../src/lib.js';

const chunks = splitTxt(
  readFileSync(join(import.meta.dirname, 'test.txt')),
  512
);
chunks.forEach((chunk, index) => {
  console.log(`\n--- 段落 ${index + 1} (字数: ${chunk.length}) ---`);
  console.log(chunk);
});
```

output :

```

--- 段落 1 (字数: 508) ---
我们，中华人民共和国、53个非洲国家和非洲联盟委员会代表齐聚长沙，遵照2024年中非合作论坛北京峰会领导人共识，全面推进落实《关于共筑新时代全天候中非命运共同体的北京宣言》。
We, the representatives of the People's Republic of China, 53 African countries and the African Union Commission, guided by the consensus reached by our leaders during the 2024 Beijing Summit of the Forum on China-Africa Cooperation (FOCAC), gathered in Changsha to advance the full implementation of the Beijing Declaration on Jointly Building an All-Weather China-Africa Community with a Shared Future for the New Era.

--- 段落 2 (字数: 374) ---
一、我们一致认为，全球南方的崛起壮大代表着时代潮流和发展方向，中国和非洲是全球南方的重要组成和坚定力量。
我们呼吁世界各国特别是全球南方国家同心协力，携手构建人类命运共同体，高质量共建“一带一路”，推动落实全球发展倡议、全球安全倡议、全球文明倡议，赞赏中非共筑新时代全天候命运共同体对维护全球南方团结合作、捍卫多边主义的积极意义。
I.
We agree that the rise and growth of the Global South represents the trend of the times and the future of development.
China and Africa are both important members of and staunch forces in the Global South.

--- 段落 3 (字数: 552) ---
We call on all countries, especially countries in the Global South, to work together to build a community with a shared future for mankind, promote high-quality Belt and Road cooperation, and implement the Global Development Initiative, the Global Security Initiative and the Global Civilization Initiative.
We commend the initiative of jointly building an all-weather China-Africa community with a shared future for the new era for its positive significance in safeguarding solidarity and cooperation of the Global South and defending multilateralism.

--- 段落 4 (字数: 532) ---
二、我们一致认为，当前单边主义、保护主义、经济霸凌乱象频出，给包括非洲等发展中国家经济社会发展和民生改善造成严重困难，是中国和非洲在内的全球南方国家必须应对的迫切挑战。
II.
We agree that the frequent occurrence of unilateralism, protectionism and economic bullying has created severe difficulties for the economic and social development and the improvement of livelihood in African countries and other developing countries.
This is a pressing challenge that members of the Global South including China and African countries must address.
三、鉴于个别国家妄图以关税为手段冲击现有国际经贸秩序，有损国际社会公利，我们呼吁所有国家，特别是美国，回到以平等、尊重、互惠方式磋商解决贸易分歧的正确轨道。

--- 段落 5 (字数: 575) ---
国际社会应高度重视非洲面临的经济困难和发展挑战，切实增加而非单方面大幅削减对非发展援助，持续助力非洲国家改善民生、推进减贫和经济社会发展。
III.
Given that certain countries' attempt to disrupt the existing international economic and trade order by tariffs undermines the common good of the international community, we call on all countries, the United States in particular, to return to the right track of resolving trade disputes through consultation based on equality, respect and mutual benefit.
The international community should give prioritized attention to the economic difficulties and development challenges faced by African countries.

--- 段落 6 (字数: 513) ---
Development assistance to African countries should be effectively increased, not unilaterally slashed, to provide continued support to help African countries improve people's livelihood, reduce poverty and boost economic and social development.
四、非方赞赏中国捍卫国际公平正义、维护国际经贸秩序的勇气和决心。
中方高度赞赏非洲国家坚持主权、公平、公正等基本原则，面对外部压力坚持共同立场。
单边妥协换不来相互尊重。
我们坚决反对任何一方以牺牲他国利益为代价达成妥协交易。
IV.
The African side commends China's courage and resolve to defend international equity and justice and safeguard international economic and trade order.

--- 段落 7 (字数: 483) ---
China highly commends African countries' commitment to the basic principles of sovereignty, equality and justice and to upholding a common position in the face of external pressure.
Unilateral concession cannot earn mutual respect.
We resolutely oppose any party reaching a deal of compromise at the expense of the interests of other countries.
五、我们呼吁国际社会秉持共商共建共享原则，坚持真正的多边主义，共同反对各种形式的单边主义、保护主义，维护以联合国为核心的国际体系，维护以世界贸易组织为核心的多边贸易体系，推动经济全球化朝着更加开放、包容、普惠、均衡的方向发展，营造更有利于全球南方的贸易、投资、融资环境。
V.

--- 段落 8 (字数: 514) ---
We call on the international community to uphold true multilateralism in accordance with the principle of extensive consultation and joint contribution for shared benefit, jointly oppose all forms of unilateralism and protectionism, safeguard the U.N.-centered international system, defend the WTO-centered multilateral trading system, and make economic globalization more open, inclusive, mutually beneficial and balanced, so as to foster a better trade, investment and financing environment for the Global South.

--- 段落 9 (字数: 395) ---
六、我们将团结一致筑牢主权平等的基石，坚持国家不分大小强弱，都是国际社会平等一员，坚决维护国际公正秩序。
我们将继续坚定捍卫彼此正当权益，在乱局变局中携手并肩、相互理解、彼此支持，以中非关系的确定性稳住不确定的世界，树立起全球南方国家真诚友好、平等相待的标杆，倡导平等有序的世界多极化。
VI.
We will join hands in cementing the foundation of sovereign equality, maintaining that all countries, regardless of their size or strength, are equal members of the international community, and resolutely upholding international justice and order.

--- 段落 10 (字数: 516) ---
We will continue to safeguard each other's legitimate rights and interests, stand side by side with mutual understanding and support amid chaos and changes, stabilize this uncertain world with the certainty of the China-Africa relationship, establish a benchmark for sincere friendship and equality in the Global South, and advocate an equal and orderly multipolar world.
七、我们将团结一致支持践行开放合作、互利共赢理念，坚持中非携手推进现代化六大主张，扎实推进“十大伙伴行动”落地见效，助力落实非盟《2063年议程》第二个十年实施计划。
我们将以共筑新时代全天候中非命运共同体打造全球南方国家团结合作、自主自强发展的典范，倡导普惠包容的经济全球化。
VII.

--- 段落 11 (字数: 667) ---
We will unite to support and put into practice the vision of openness, cooperation, mutual benefit and win-win outcomes, stay committed to the six-point proposition on the joint endeavor to advance modernization, make solid progress in implementing the ten partnership actions for modernization, and support the implementation of the Second Ten Year Implementation Plan of Agenda 2063 of the African Union.
We will build an all-weather China-Africa community with a shared future for the new era, set an example of solidarity, cooperation, independence and self-reliance of the Global South, and call for a universally beneficial and inclusive economic globalization.

--- 段落 12 (字数: 535) ---
八、中国愿通过商签共同发展经济伙伴关系协定，对除斯威士兰外53个非洲建交国落实100%税目产品零关税举措，欢迎非洲优质商品进入中国市场。
中方将在2024年中非合作论坛北京峰会宣布对非洲最不发达国家100%税目产品零关税待遇基础上，为非洲最不发达国家推出深化货物贸易市场准入、检验检疫、通关便利等举措，加大能力技术培训、优质产品推介等。
VIII.
China is ready to, through negotiating and signing the agreement of China-Africa Economic Partnership for Shared Development, expand the zero-tariff treatment for 100 percent tariff lines to all 53 African countries having diplomatic relations with China, or all African countries except Eswatini, to welcome quality products from Africa to the Chinese market.

--- 段落 13 (字数: 450) ---
For the least developed countries in Africa, on top of the zero-tariff treatment for 100 percent tariff lines announced at the 2024 Beijing Summit of FOCAC, China will roll out measures on market access, inspection and quarantine, and customs clearance to boost trade in goods, enhance skills and technical training, and expand the promotion of quality products.
九、中国愿同非方深入落实“十大伙伴行动”，特别是在绿色产业、电子商务和支付、科技、人工智能等重点领域加强合作，深化安全、金融、法治等领域合作，推动中非合作高质量发展。
IX.

--- 段落 14 (字数: 495) ---
China is ready to work with Africa to deepen the implementation of the ten partnership actions for modernization, prioritize cooperation in such key areas as green industry, e-commerce and e-payment, science and technology, and artificial intelligence, and enhance cooperation in security, finance and the rule of law, so as to promote high-quality development of China-Africa cooperation.
十、中非合作论坛已经成为全球南方团结合作的典范。《
中非合作论坛北京峰会成果落实清单》集中、量化、具象展现北京峰会成果落实力度。
双方将落实《2026年“中非人文交流年”概念文件》规划，助力全球南方团结。
X.

--- 段落 15 (字数: 517) ---
The Forum on China-Africa Cooperation has become a fine example of solidarity and cooperation of the Global South.
The List of the Outcomes of the Implementation of the Follow-up Actions of the Beijing Summit of the Forum on China-Africa Cooperation provides a comprehensive, quantitative and tangible presentation of progress achieved.
China and Africa will carry out the plans outlined in the Concept Paper of 2026 China-Africa Year of People-to-People Exchanges to contribute to the solidarity of the Global South.
```

## About

This project is an open-source component of [i18n.site ⋅ Internationalization Solution](https://i18n.site).

* [i18 : MarkDown Command Line Translation Tool](https://i18n.site/i18)

  The translation perfectly maintains the Markdown format.

  It recognizes file changes and only translates the modified files.

  The translated Markdown content is editable; if you modify the original text and translate it again, manually edited translations will not be overwritten (as long as the original text has not been changed).

* [i18n.site : MarkDown Multi-language Static Site Generator](https://i18n.site/i18n.site)

  Optimized for a better reading experience

## 关于

本项目为 [i18n.site ⋅ 国际化解决方案](https://i18n.site) 的开源组件。

* [i18 :  MarkDown命令行翻译工具](https://i18n.site/i18)

  翻译能够完美保持 Markdown 的格式。能识别文件的修改，仅翻译有变动的文件。

  Markdown 翻译内容可编辑；如果你修改原文并再次机器翻译，手动修改过的翻译不会被覆盖（如果这段原文没有被修改）。

* [i18n.site : MarkDown多语言静态站点生成器](https://i18n.site/i18n.site) 为阅读体验而优化。

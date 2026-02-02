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


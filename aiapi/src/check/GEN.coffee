> ../TYPE.js

export default {
  type: TYPE.ARRAY
  description: '基于对话分析生成的、可进行外部搜索验证的投资洞察列表（请把公司提及的个案数据，转为对行业搜索研究的命题）'
  minItems: 0
  items:
    type: TYPE.OBJECT
    properties:
      src:
        type: TYPE.STRING
        description: '对话的原文（去除语气助词），是哪一句话引发了去研究这个命题的想法？'
      question:
        type: TYPE.STRING
        description: '从对话中提炼出的、具有明确事实属性，可通过网络搜索验证的关键行业洞察。必须是可以被证明或者证伪的命题。请避免无法验证的主观形容词'
      title:
        type: TYPE.STRING
        description: '从最少字概述命题（必须是一个命题）作为标题'
      zh:
        type: TYPE.ARRAY
        description: '用于验证该洞察真伪的搜索关键词列表(中文)'
        minItems: 0
        items:
          type: TYPE.STRING
      en:
        type: TYPE.ARRAY
        description: '用于验证该洞察真伪的搜索关键词列表(英文)'
        minItems: 0
        items:
          type: TYPE.STRING
      reason:
        type: TYPE.STRING
        description: '分析为何搜索研究该洞察对判断决策至关重要'
    required: [
      'en',
      'question',
      'src',
      'title',
      'zh',
      'reason'
    ]
}

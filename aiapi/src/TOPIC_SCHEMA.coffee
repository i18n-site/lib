> ./TYPE.js

export default {
  type: TYPE.ARRAY
  description: '讨论话题的数组，每个话题都包含相关的问答对'
  items:
    type: TYPE.OBJECT
    properties:
      话题:
        type: TYPE.STRING
        description: '将多个问答合并为一个组,用简短的标题描述'
      问答:
        type: TYPE.ARRAY
        description: '与该话题相关的一系列问答对'
        minItems: 1
        items:
          type: TYPE.OBJECT
          properties:
            题:
              type: TYPE.STRING
              description: '问答的短标题'
            问:
              type: TYPE.STRING
              description: '提问'
            答:
              type: TYPE.STRING
              description: '针对该问题的回答,重新分段,方便阅读'
          required: [ '题', '问', '答']
          propertyOrdering: ['问', '答']
    required: ['话题', '问答']
}

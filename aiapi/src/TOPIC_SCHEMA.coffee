> ./TYPE.js

export default {
  type: TYPE.ARRAY
  description: '录音的问答对'
  minItems: 1
  items:
    type: TYPE.OBJECT
    properties:
      题:
        type: TYPE.STRING
        description: '问答的短标题'
      提问者:
        type: TYPE.INTEGER
        description: '发言人清单中的id'
      问:
        type: TYPE.STRING
        description: '提问'
      答:
        type: TYPE.STRING
        description: '针对该问题的回答,重新分段,方便阅读'
      回答者:
        type: TYPE.INTEGER
        description: '发言人清单中的id'
    required: [ '题', '问', '答', '提问者', '回答者' ]
    propertyOrdering: ['问', '答']
}

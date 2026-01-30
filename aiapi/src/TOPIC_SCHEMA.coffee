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
      问:
        type: TYPE.STRING
        description: '提问'
      答:
        type: TYPE.STRING
        description: '针对该问题的回答,重新分段,方便阅读'
    required: [ '题', '问', '答']
    propertyOrdering: ['问', '答']
}

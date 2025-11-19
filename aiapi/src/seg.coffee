#!/usr/bin/env coffee
> ./TYPE.js

export default (chat, txt_li)=>
  提示词 = '''
下文第1列为行号,第2列为对话内容,以tab分隔。
请划分章节,每章以提问开始,包含几个问答,不要太长也不要太短,千字左右一章。
输出章节标题和每章首个问题的行号及原文,输出格式为JSON数组:\n'''+txt_li.map(
    (i,pos)=>
      (pos+1) + '\t' + i.trim()
  ).join('\n')
  split_li = await chat(
    提示词
    {
      type: TYPE.ARRAY
      description: '章节和行号的列表'
      minItems: 1
      items:
        type: TYPE.OBJECT
        properties:
          题: {
            description: '章节标题,要概括章节内容'
            type: TYPE.STRING
          }
          行: {
            description: '该章最后一行的行号'
            type: TYPE.INTEGER
          }
        required: ['题', '行']
    }
    '你是专业资深的秘书'
  )
  split_li.map (i)=>
    [
      i.题
      i.行
    ]

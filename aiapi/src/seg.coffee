#!/usr/bin/env coffee
> ./TYPE.js
OPT = {
  type: TYPE.OBJECT
  required: [
    'li'
    'user'
  ]
  properties:
    user:
      type: TYPE.ARRAY
      minItems: 1
      description: '对话中出现过的发言人'
      items:
        type: TYPE.OBJECT
        properties:
          name:
            type: TYPE.STRING
            description: '发言人的名称'
          role:
            type: TYPE.STRING
            description: '猜测此人的身份（如创业者、投资人）'
    li:
      type: TYPE.ARRAY
      description: '拆分文章为多个章节，每个章节包含一系列问答对'
      minItems: 1
      items:
        type: TYPE.OBJECT
        properties:
          题: {
            description: '章节标题(只写标题，不写序号、注释)'
            type: TYPE.STRING
          }
          行: {
            description: '该章最后一句的行号'
            type: TYPE.INTEGER
          }
        required: ['题', '行']
}

OPT_WITH_TITLE = structuredClone(OPT)
OPT_WITH_TITLE.required.push '题'
OPT_WITH_TITLE.properties.题 =
  type: TYPE.STRING
  description: '文章总标题（要简短）'

gen = (opt, chat, txt_li)=>
  提示词 = '''
下文第1列为行号,第2列为对话内容,以tab分隔。
请划分章节,每章不要太长也不要太短,千字左右一章。
输出章节标题、每章最后一句号的行号。
输出格式为json数组:\n'''+txt_li.map(
    (i,pos)=>
      (pos+1) + '\t' + i.trim()
  ).join('\n')
  r = await chat(
    提示词
    opt
    '你是专业资深的杂志编辑'
  )
  r.li = r.li.map (i)=>
    [
      i.题
      i.行
    ]
  r

export default (chat, txt_li)=>
  (
    await gen(OPT, chat, txt_li)
  ).li

export segWithTitle = (chat, txt_li)=>
  r = (
    await gen(OPT_WITH_TITLE, chat, txt_li)
  )

  r.user.forEach (i,pos)=>
    i.id = pos+1
    return
  [
    r.题
    r.user
    r.li
  ]

#!/usr/bin/env coffee

> ./fmtJson.js
  ./partition.js
  ./check/GEN.js
  ./check/SEARCH.js
  ./refmt.js

export default (chat, txt)=>
  [
    文章标题
    user
    pli
  ] = await partition(
    chat
    txt
  )
  if not pli.length
    return []

  fmt = fmtJson(chat, pli, user)

  gen_txt = pli.map(
    ([title,li])=>
      '# '+title+'\n'+li.join('\n')
  ).join('\n')

  search = Promise.all (
      await chat(
        gen_txt
        GEN
        "你是专业的风险投资人"
      )
    ).map (i)=>
      # console.log i
      {
        title
        question
        zh
        en
        src
        reason
      } = i
      body = title+'\n研究命题: '+question+'\n中文搜索词: '+zh+'\n英文搜索词: '+en
      console.log('\n# '+body)
      {
        结论
        研究
        文献
        分
      } = await chat(
        '请基于搜索（包括权威媒体、财报、论文等），对以下命题深度研究:\n'+body
        SEARCH
        '利用搜索工具进行客观理性的研究分析，以数据为支撑来推演'
        {
          tools: [
            {
              google_search: {}
            }
            {
              url_context: {}
            }
          ]
        }
      )
      title = title.trim()
      if 分 > 0
        title = '✅ '+title
      else if 分 < 0
        title = '❌ '+title
      else
        title = '❓ '+title

      '## '+title + '\n\n**<u>原文:</u>** ' + src + '\n\n**<u>研究:</u>** ' + question.trim() + '\n\n**<u>结论</u>:** ' + 结论.trim() + '\n\n' + 研究.map(
        ({title,md})=>
          '### '+title+'\n\n'+md
      ).join('\n') + '\n\n### 参考资料\n\n' + 文献.map(
        ({title,brief,url},pos)=>
          (
            (pos+1) + '. ['+title+']('+url+') : '+brief
          )
      ).join('\n')

  [
    fmt
    search
  ] = await Promise.all [
    fmt
    search
  ]

  if search.length
    fmt += '# 机器投研\n\n'+search.map(refmt).join('\n')
  [
    文章标题
    fmt
  ]

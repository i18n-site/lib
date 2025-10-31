#!/usr/bin/env coffee

> ./fmtJson.js
  ./fmtJsonMd.js
  ./factCheck.js
  @3-/txt_li/txtFmt.js
  # @3-/read
  # @3-/write

check = (chat,json)=>
  li = []
  for {问答} from json
    for {问,答} from 问答
      li.push """问:#{txtFmt(问)}\n答:#{txtFmt(答)}"""

  checked = await factCheck(chat, li)

  n = 0
  for {问答} from json
    for j from 问答
      li = checked.get ++n
      if li
        for k from li
          if k.失实度 == '严重失实'
            tip = '❗ 失实:'
          else
            tip = '⚠️'
          j.答 += """
            \n#### #{tip} #{k.标题}

            观点: #{k.观点}

            事实: #{k.事实}
            """
  return

< (chat, txt) =>
  json_li = await fmtJson(chat, txt)
  # write('/tmp/chat.json', JSON.stringify(json_li))
  # json_li = JSON.parse read('/tmp/chat.json')
  # await check(chat, json_li[0])
  await Promise.all json_li.map(
    (i)=>
      check(chat, i)
  )
  fmtJsonMd(json_li)

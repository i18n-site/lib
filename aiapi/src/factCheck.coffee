#!/usr/bin/env coffee

> @3-/retry
  @3-/utf8/utf8d.js
  @3-/utf8/utf8e.js
  # @3-/read
  # @3-/write

SHOW_KIND = [
  '严重失实'
  '不正确'
]

PREFIX = """
对下文问答中提及的事实做核查(不核查观点)。
数据偏差不超过30%都当做基本一致,找不到信息当无法核实。
必须搜索到明确的证伪证据并才算失实。
只输出不正确/严重失实的核查。
输出文本必须是简体中文，格式如下:
- id:
  标题: 要简短,几个词即可
  观点:
  事实: 须标注搜索到的事实网页, 完整描述观点错误所在(不引用其他核查)
  失实度: #{SHOW_KIND.join(' / ')} / 基本一致 / 无法核实
---\n
"""

realUrl = (url)=>
  if url.startsWith 'http'
    try
      r = await fetch(
        url
        method: 'HEAD',
        redirect: 'follow'
      )
      {
        status
      } = r
      if status == 200
        {url} = r
      else
        console.error status+' :'+url
    catch err
      console.error err
  return url

circle = (num) =>
  switch
    when num > 0 and num <= 10 then String.fromCodePoint(0x245F + num)
    else "[#{num}]"

urlLi = (id_li, url_li)=>
  r = []
  for i from id_li
    r.push '['+circle(i+1)+']('+url_li[i]+')'
  r.join ''

addUrl = (text, items) =>
  output = ''
  push = (bin)=>
    output += utf8d bin
    return
  pos = 0

  sorted = items.sort (a, b) -> a.segment.startIndex - b.segment.startIndex

  bin = utf8e(text)

  for entry in sorted
    { segment: { startIndex: start, endIndex: end }, groundingChunkIndices: chunks } = entry

    if start > pos
      push bin.slice(pos, start)

    push bin.slice(start, end)
    output += chunks

    pos = end

  if pos < bin.length
    push bin.slice(pos)

  return output


txtLi = (txt)=>
  r = []

  + t, pre, all_tag

  reset = =>
    all_tag = new Set ['标题', '观点', '事实', '失实度']
    if t
      r.push t
    pre = t = undefined
    return

  txt_li = txt.replaceAll('**','').split '\n'
  `out: //`
  for i from txt_li
    if i.startsWith('- id:')
      reset()
      id = parseInt i.slice(5).trim()
      if id
        t = {id}
    else if t
      trim = i.replace('- ','').trimStart()
      for tag from all_tag
        if trim.startsWith tag+':'
          all_tag.delete tag
          pre = tag
          t[tag] = trim.slice(tag.length+1).trim()
          if tag == '失实度' and all_tag.size == 0
            reset()
          continue out
      if pre and trim
        t[pre] += '\n'+trim

  if t
    r.push t
  r


export default retry (chat, li)=>
  msg = PREFIX+ li.map(
    (i, pos)=>
      'id:'+(pos+1)+'\n'+i
  ).join('\n---\n')
  out = await chat(
    msg
    0
    0
    tools:
      google_search: {}
  )
  # write '/tmp/fact.json',JSON.stringify out
  # out = JSON.parse read '/tmp/fact.json'

  {
    content
    groundingMetadata: {
      groundingChunks
      groundingSupports
    }
  } = out

  if not groundingChunks
    return new Map

  content = content.parts[0].text
  console.log content

  url_li = []
  for {web:{uri}} from groundingChunks
    url_li.push realUrl uri
  url_li = await Promise.all url_li
  for i from groundingSupports
    i.groundingChunkIndices = urlLi(i.groundingChunkIndices, url_li)

  map = new Map

  for i from txtLi addUrl(content, groundingSupports)
    console.log i
    if not SHOW_KIND.includes i.失实度?.split('[')[0]
      continue
    li = map.get i.id
    if not li
      li = []
      map.set i.id, li
    li.push i

  map

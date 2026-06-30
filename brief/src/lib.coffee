#!/usr/bin/env coffee

> @3-/txt_li:txtLi
  @3-/txt_li/txtFmt.js
  @3-/aiapi
  @3-/retry

export default (conf, model, max_tokens=8192)=>
  {
    POST
  } = aiapi(...conf)

  retry (txt)=>
    txt = txtLi(txt).join('\n')

    if txt.length <= 450
      summary = txt
      json = '{"tags":[]}'
      more = ''
      tip = '请为上文打标签'
      guided_json =
        type: "object"
        properties:
          tags:
            type: "array"
            items:
              type: "string"
        required: ["tags"]
    else
      txt = txt.slice(0, max_tokens)
      json = '{"tags":[],"summary":""}'
      more = ';摘要不超过400字,纯文本格式。'
      tip = '请为上文打标签、写摘要'
      guided_json =
        type: "object"
        properties:
          tags:
            type: "array"
            items:
              type: "string"
          summary:
            type: "string"
        required: ["tags", "summary"]
    tag_num = Math.round( txt.length / 150 )
    if tag_num > 7
      tag_num = 7
    else if tag_num < 1
      tag_num = 1

    content = """
阅读下文:
---
#{txt}
---
#{tip},输出json,格式如: #{json}
话题标签用单个词即可,越短越好,总标签数不超过#{tag_num}个#{more}
    """
    body = {
      model
      messages: [
        {
          role: "user",
          content
        }
      ]


      guided_json
      stream: false
      max_tokens: max_tokens
      chat_template_kwargs:
        enable_thinking: false

      # enable_thinking: false
      # thinking_budget: 4096

      # stop: ""
      # temperature: 0.7
      # top_p: 0.7
      # top_k: 50
      # frequency_penalty: 0.5
      # response_format: {
      #   type: "text"
      # }
    }

    result = (
      await POST(
        'chat/completions'
        body
      )
    ).choices[0].message.content.trim()

    try
      { tags } = r = JSON.parse(result)
    catch err
      throw [
        err
        new Error result
      ]

    if not summary
      summary = txtFmt r.summary

    if tags.length > 0 and summary.length > 0
      return [
        tags
        summary
      ]

    throw new Error result
    return

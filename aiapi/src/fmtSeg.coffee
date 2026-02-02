#!/usr/bin/env coffee

> ./TOPIC_SCHEMA.js
  @3-/retry

import { TRON } from '@tron-format/tron'

export default retry (chat, txt, user)=>
  await chat(
    """对话发言人清单: #{TRON.stringify(user))}
将以下语音对话转为JSON数组,确保所有对话都被覆盖,不可遗漏。
优化换行、排版，删除语气助词，在忠于原文的基础上增强可读性，严禁脑补术语:\n"""+txt
    TOPIC_SCHEMA
    "你是专业资深的秘书"
    {
      # generationConfig:
      #   # 谷歌不建议用这个参数了
      #   temperature: 0
    }
  )

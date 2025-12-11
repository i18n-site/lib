#!/usr/bin/env coffee

> ./TOPIC_SCHEMA.js
  @3-/retry

export default retry (chat, txt)=>
  await chat(
    '''将以下语音对话转为JSON数组,确保所有对话都被覆盖,不可遗漏。优化换行、排版、高亮，用markdown格式，增强可读性。用词术语要忠于原文，严禁脑补。:\n'''+txt
    TOPIC_SCHEMA
    "你是专业资深的秘书"
    generationConfig:
      temperature: 0
  )

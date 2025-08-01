#!/usr/bin/env coffee

> ./TOPIC_SCHEMA.js
  @3-/retry

export default retry (chat, txt)=>
  await chat(
    '''将以下语音对话转为JSON数组,要确保所有问答都被包含,不要遗漏:\n'''+txt
    TOPIC_SCHEMA
    "你是专业资深的秘书"
    generationConfig:
      temperature: 0
  )

#!/usr/bin/env coffee

# 定义符号对和状态机状态
符号对 = [
  ['(', ')'],
  ['{', '}']
]

在引号内 = 0
外部 = 0
在符号内 = 1

export default (输入)=>
  状态 = 外部
  当前对 = []
  深 = 0
  结果 = []
  临时内容 = ""

  len = 输入.length
  i = 0

  push = (content)=>
    结果.push content
    临时内容 = ''
    return

  while i < len
    字符 = 输入[i++]

    if 在引号内
      临时内容 += 字符
      if 字符 == '\\'
        if i < len
          临时内容 += 输入[i++]
      else if 字符 == 在引号内
        push 临时内容
        在引号内 = 0
      continue

    switch 状态
      when 外部
        for 对 in 符号对
          if 字符 == 对[0]
            if 临时内容
              push 临时内容
            状态 = 在符号内
            当前对 = 对
            深 = 1
            break
        if 状态 == 外部
          if '\'"'.includes(字符)
            if 临时内容
              push  临时内容
            在引号内 = 字符
        临时内容 += 字符

      when 在符号内
        临时内容 += 字符
        [开,闭] = 当前对
        if 字符 == 开
          ++深
        else if 字符 == 闭
          --深
          if 深 == 0
            状态 = 外部
            push 临时内容

  if 临时内容
    结果.push 临时内容

  return 结果

# 还原内容 = (结果) ->
#   输出 = ""
#   for 内容 from 结果
#     输出 += 内容
#   return 输出
#
# 测试 = (输入) ->
#   提取结果 = module.exports(输入)
#   还原结果 = 还原内容(提取结果)
#   一致性 = 输入 == 还原结果
#   console.log "提取结果: ", 提取结果
#   console.log "输入: ", 输入
#   console.log "还原: ", 还原结果
#   console.log "一致性: ", 一致性
#
# # 测试
# 输入 = 'a (b (c) d) e {f {g} h} i "j \\"k\\"" l \'m \\\'n\''
# 测试 输入

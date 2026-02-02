#!/usr/bin/env coffee

全角标点 = "，、。！？：；"

# 全角转半角的函数
全角转半角 = (str) ->
  result = ""

  for char in str
    code = char.charCodeAt(0)
    # 检查字符是否在全角字符的范围内
    if code >= 0xFF01 and code <= 0xFF5E
      halfWidthChar = String.fromCharCode(code - 0xFEE0)
      # 如果是全角标点，则在后面加一个空格
      if ~ 全角标点.indexOf(char)
        result += halfWidthChar + ' '
      else
        result += halfWidthChar
    else if code == 0x3000
      # 特殊处理全角空格（0x3000），将其转换为普通空格
      result += String.fromCharCode(0x0020)
    else
      # 非全角字符保持不变
      result += char
  result.trimEnd()

# 测试
testCases = [
  "全角字符：！你好，世界。",
  "这是一段测试文本，包含全角标点！",
  "测试正常的空格和全角空格：　",
  "只有半角字符：Hello World!",
]

for testCase in testCases
  console.log("输入: #{testCase}\n输出: #{全角转半角(testCase)}\n")


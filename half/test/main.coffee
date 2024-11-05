#!/usr/bin/env coffee

> @3-/half

testCases = [
  "全角字符：啊！你好，世界。",
  "这是一段测试文本，包含全角标点！",
  "测试正常的空格和全角空格：　",
  "只有半角字符：Hello World!",
]

for testCase in testCases
  console.log("输入: #{testCase}\n输出: #{half(testCase)}\n")


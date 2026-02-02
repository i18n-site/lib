#!/usr/bin/env coffee

import biasedrng from '../src/lib.js'

# --- 测试参数 ---
# 迭代次数，即生成多少个随机数
ITERATIONS = 10000
# 随机数上限 n
N = 20
# 偏向强度
BIAS = 2

# --- 执行测试 ---
console.log "开始测试 biasedrng 函数..."
console.log "参数: n=#{N}, bias=#{BIAS}, 迭代次数=#{ITERATIONS}"

# 用于存储每个数字出现的次数
distribution = {}

for i in [0...ITERATIONS]
  num = biasedrng(N, BIAS)
  distribution[num] = (distribution[num] or 0) + 1

# --- 准备输出 ---
# 确保所有 0 到 N-1 的数字都在 distribution 中，方便排序和打印
for i in [0...N]
  distribution[i] = distribution[i] or 0

# 按键（即数字）排序
sortedKeys = Object.keys(distribution).map((k) -> parseInt(k)).sort((a, b) -> a - b)

# --- 打印原始数据 ---
console.log "
--- 结果分布 (原始数据) ---"
for key in sortedKeys
  count = distribution[key]
  percentage = (count / ITERATIONS * 100).toFixed(2)
  console.log "#{String(key).padStart(2, ' ')}: #{count} 次 (#{percentage}%)"


# --- 打印 ASCII 分布图 ---
console.log "
--- 结果分布 (ASCII 图) ---"

maxCount = 0
for key, count of distribution
  if count > maxCount
    maxCount = count

# 设置图表的最大宽度
MAX_BAR_WIDTH = 50

for key in sortedKeys
  count = distribution[key]
  # 根据最大计数值和最大宽度来计算当前条的长度
  barLength = Math.round((count / maxCount) * MAX_BAR_WIDTH)
  bar = '█'.repeat(barLength)
  percentage = (count / ITERATIONS * 100).toFixed(2)
  # 打印: 数字 | 图表条 | 次数 (百分比)
  console.log "#{String(key).padStart(2, ' ')} |#{bar} #{count} (#{percentage}%)"

console.log "
测试完成."

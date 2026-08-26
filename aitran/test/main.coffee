#!/usr/bin/env coffee

> @3-/aitran

tran = aitran(
  [
    process.env.AI_TRAN_KEY
  ]
  "中文"
  "英文"
)

console.log await tran new Set [
  "月光"
  "星空"
]

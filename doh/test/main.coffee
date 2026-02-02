#!/usr/bin/env coffee

> ../src/AnswerData.js
  ../src/cf.js

for type in ['A','AAAA']
  console.log await AnswerData cf,'smtp.js0.site', type

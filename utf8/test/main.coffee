#!/usr/bin/env coffee

import utf8e from '@3-/utf8/utf8e'
import utf8d from '@3-/utf8/utf8d'
import autoe from '@3-/utf8/autoe'

console.log utf8d utf8e '测试'

console.log autoe '车'
console.log autoe Buffer.from [1,2,3]


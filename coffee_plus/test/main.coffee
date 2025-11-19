#!/usr/bin/env coffee
import TEST from './code.js'
import CoffeeScript from "coffeescript"
import hack from '@3-/coffee_plus'
hack CoffeeScript

for [kind, code] from Object.entries(TEST)
  #if kind != 'export'
  #  continue
  console.log """## #{kind}
```
#{code}```
→
```
#{CoffeeScript.compile(code, bare:true)}```"""


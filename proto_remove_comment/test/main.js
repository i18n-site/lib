#!/usr/bin/env coffee

import removeComment from '../src/lib.js'
import { readFileSync } from 'fs'
import { join } from 'path'

const ROOT = import.meta.dirname

console.log(
  removeComment(readFileSync(join(ROOT, 'test.proto'), 'utf-8'))
)

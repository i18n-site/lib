#!/usr/bin/env coffee

import uridir from '@3-/uridir'
import {thisfile} from '@3-/uridir'

console.log(uridir(import.meta))
console.log(thisfile(import.meta))

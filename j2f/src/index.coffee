#!/usr/bin/env coffee

import * as opencc from 'opencc-js'

export default opencc.Converter(
  from: 'cn'
  to: 'tw'
)

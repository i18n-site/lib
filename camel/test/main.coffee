#!/usr/bin/env coffee

import camel from '@3-/camel'
import Camel from '@3-/camel/Camel'

for i in 'index.htm str_li str2li i18n iI18n test-db User LIB_INDEX'.split(' ')
  console.log "#{i} → #{camel i}"
  console.log "#{i} → #{Camel i}"

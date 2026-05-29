#!/usr/bin/env coffee

import snake from '@3-/snake'

for i in 'index.htm _SUBMIT i18n iI18n test-db User LIB_INDEX'.split(' ')
  console.log "#{i} → #{snake i}"

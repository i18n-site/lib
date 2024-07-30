[‼️]: ✏️README.mdt

# @3-/camel

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

import camel from '@3-/camel'
import Camel from '@3-/camel/Camel'

for i in 'index.htm str_li str2li i18n iI18n test-db User LIB_INDEX'.split(' ')
  console.log "#{i} → #{camel i}"
  console.log "#{i} → #{Camel i}"
```

output :

```
index.htm → index.htm
index.htm → Index.htm
str_li → strLi
str_li → StrLi
str2li → str2li
str2li → Str2li
i18n → i18n
i18n → I18n
iI18n → iI18n
iI18n → II18n
test-db → testDb
test-db → TestDb
User → User
User → User
LIB_INDEX → LIB_INDEX
LIB_INDEX → LIB_INDEX
```

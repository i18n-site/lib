[‼️]: ✏️README.mdt

# @3-/snake

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

import snake from '@3-/snake'

for i in 'index.htm _SUBMIT i18n iI18n test-db User LIB_INDEX'.split(' ')
  console.log "#{i} → #{snake i}"
```

output :

```
index.htm → index.htm
_SUBMIT → _submit
i18n → i18n
iI18n → i_i18n
test-db → test_db
User → user
LIB_INDEX → lib_index
```

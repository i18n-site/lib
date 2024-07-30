[‼️]: ✏️README.mdt

# @3-/csv

see options in https://c2fo.github.io/fast-csv/docs/parsing/options

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/csv
  @3-/uridir
  path > join

ROOT = uridir(import.meta)

for await i from csv join ROOT,'test.csv'
  console.log i
```

output :

```
[ 'market', '面向通用市场' ]
[ 'pre-tailoring', '准备工作（过程）' ]
[ '(module) blanks', '填充模块,假模块' ]
[ 'a highly parallel problem', '高度并行的问题' ]
[ 'a marketing presentation', '销售/推介演示文稿' ]
[ 'apparent swap space', '显态交换分区保留极限' ]
[ 'backplane', '背板，底板' ]
```

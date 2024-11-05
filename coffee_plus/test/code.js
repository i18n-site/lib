export default {
	label: `
y = 0

:$ x=y*2

:$ if y>2 then x+=y else x-=y

:$
  if x > y
    x = y/2
  else
    x = y+9
  x += 1

:$ func = => 1

:$ func = ->
  1
  2

do =>
  :out
    for i in [1,2,3]
      for j in [4,5,6]
        console.log i,j
        if i > 1
          break out
  return
  `,
	var: `
do =>
  + a,b
`,
	import: `
> fs1 path0

console.log 1

> fs/promises
> fs/promises:fs
> fs2
  fs:
  bun:sqlite:sqlite
  path1
  test.css
> path3 > join dirname1
  path4:@ > join3
  path9:Path9 > join2
  path5.js:@ > join1
  base-x:BaseX
  base-y
  # xxx
  base-z # xxx
  path5:p5 > join:J1 dirname2
  fs3 path5:p6 > join:J dirname LIB_INDEX
  str2li
  node:util
  node:util > promiseify
  xx > bb$ x1
  ./git > ROOT HOME STATIC
  ./lib/byTag.js:@ > byElem
`,
	export: `
< x
< x = 1

< b=(a,b=1)=>
  a+b

< =>
  a+b

< {
  C:1
}
< {}

< xxx = ->
  1+2

< class Test
  @(a,b,c)->
< class Test2
  @->
< [
  1
]
`,
};

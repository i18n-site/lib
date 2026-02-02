# @3-/coffee_plus

[test/main.coffee](./test/main.coffee) :

```coffee
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
```

output :

```
## label
```

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
  ```
→
```
var func, x, y;

y = 0;

$ : x = y * 2;

$ : y > 2 ? x += y : x -= y;

$ : {
  if (x > y) {
    x = y / 2;
  } else {
    x = y + 9;
  }
  x += 1;
}

$ : (func = () => {
  return 1;
});

$ : (func = function() {
  1;
  return 2;
});

(() => {
  var i, j, k, l, len, len1, ref, ref1;
  out : {
    ref = [1, 2, 3];
    for (k = 0, len = ref.length; k < len; k++) {
      i = ref[k];
      ref1 = [4, 5, 6];
      for (l = 0, len1 = ref1.length; l < len1; l++) {
        j = ref1[l];
        console.log(i, j);
        if (i > 1) {
          break out;
        }
      }
    }
  }
})();
```
## var
```

do =>
  + a,b
```
→
```
(() => {
  var a, b;
})();
```
## import
```

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
```
→
```
import fs1 from 'fs1';

import path0 from 'path0';

console.log(1);

import promises from 'fs/promises';

import fs from 'fs/promises';

import fs2 from 'fs2';

import 'fs';

import sqlite from 'bun:sqlite';

import path1 from 'path1';

import 'test.css';

import {
  join,
  dirname1
} from 'path3';

import path4 from 'path4';

import {
  join3
} from 'path4';

import Path9 from 'path9';

import {
  join2
} from 'path9';

import path5 from 'path5.js';

import {
  join1
} from 'path5.js';

import BaseX from 'base-x';

import BaseY from 'base-y';

import BaseZ from 'base-z';

import p5 from 'path5';

import {
  join as J1,
  dirname2
} from 'path5';

import fs3 from 'fs3';

import p6 from 'path5';

import {
  join as J,
  dirname,
  LIB_INDEX
} from 'path5';

import str2li from 'str2li';

import util from 'node:util';

import {
  promiseify
} from 'node';

import {
  bb$,
  x1
} from 'xx';

import {
  ROOT,
  HOME,
  STATIC
} from './git';

import byTag from './lib/byTag.js';

import {
  byElem
} from './lib/byTag.js';
```
## export
```

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
```
→
```
export var x;

export var x = 1;

export const b = (a, b = 1) => {
  return a + b;
};

export default () => {
  return a + b;
};

export default {
  C: 1
};

export default {};

export var xxx = function() {
  return 1 + 2;
};

export var Test = class Test {
  constructor(a, b, c) {}

};

export var Test2 = class Test2 {
  constructor() {}

};

export default [1];
```
```

## About

This project is an open-source component of [i18n.site ⋅ Internationalization Solution](https://i18n.site).

* [i18 : MarkDown Command Line Translation Tool](https://i18n.site/i18)

  The translation perfectly maintains the Markdown format.

  It recognizes file changes and only translates the modified files.

  The translated Markdown content is editable; if you modify the original text and translate it again, manually edited translations will not be overwritten (as long as the original text has not been changed).

* [i18n.site : MarkDown Multi-language Static Site Generator](https://i18n.site/i18n.site)

  Optimized for a better reading experience

## 关于

本项目为 [i18n.site ⋅ 国际化解决方案](https://i18n.site) 的开源组件。

* [i18 :  MarkDown命令行翻译工具](https://i18n.site/i18)

  翻译能够完美保持 Markdown 的格式。能识别文件的修改，仅翻译有变动的文件。

  Markdown 翻译内容可编辑；如果你修改原文并再次机器翻译，手动修改过的翻译不会被覆盖（如果这段原文没有被修改）。

* [i18n.site : MarkDown多语言静态站点生成器](https://i18n.site/i18n.site) 为阅读体验而优化。
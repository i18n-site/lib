# @3-/merge

[English](#english-readme) | [中文说明](#中文说明)


## English README

Deeply merges one or more source objects into a target object.

- If a key holds an object in both the target and the source, it recursively merges them.
- If a key holds an array in both the target and the source, it concatenates the arrays.
- Otherwise, the value from the source overwrites the value in the target.

[test/main.test.js](./test/main.test.js) :

```javascript
import merge from '@3-/merge';

const target = {
  a: 1,
  b: {
    c: 2,
    d: [3, 4]
  }
};

const source1 = {
  b: {
    d: [5, 6],
    e: 7
  },
  f: 8
};

const source2 = {
  a: 9,
  b: {
    c: 10
  }
}

const result = merge({}, target, source1, source2);

console.log(JSON.stringify(result, null, 2));
```

output:

```json
{
  "a": 9,
  "b": {
    "c": 10,
    "d": [
      3,
      4,
      5,
      6
    ],
    "e": 7
  },
  "f": 8
}
```

## 中文说明

`@3-/merge` 深度合并一个或多个源对象到目标对象。

- 如果目标和源中的同一个键的值都是对象，它将递归合并它们。
- 如果目标和源中的同一个键的值都是数组，它将连接这两个数组。
- 在其他情况下，源中的值将覆盖目标中的值。

[test/main.test.js](./test/main.test.js) :

```javascript
import merge from '@3-/merge';

const target = {
  a: 1,
  b: {
    c: 2,
    d: [3, 4]
  }
};

const source1 = {
  b: {
    d: [5, 6],
    e: 7
  },
  f: 8
};

const source2 = {
  a: 9,
  b: {
    c: 10
  }
}

const result = merge({}, target, source1, source2);

console.log(JSON.stringify(result, null, 2));
```

输出:

```json
{
  "a": 9,
  "b": {
    "c": 10,
    "d": [
      3,
      4,
      5,
      6
    ],
    "e": 7
  },
  "f": 8
}
```

---

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

[English](#english) | [中文](#中文)

<a id="english"></a>

# @3-/biasedrng

Biased random number generator.

This module provides a function to generate random numbers with a bias towards smaller values.

## Installation

```bash
npm install @3-/biasedrng
```

## Usage

```javascript
import biasedrng from '@3-/biasedrng';

// Generate a random integer between 0 and 99
// The distribution is biased towards 0.
const randomNumber = biasedrng(100);

// You can also specify a bias factor.
// A higher bias value means a stronger bias towards 0.
const highlyBiasedNumber = biasedrng(100, 10);

console.log(`A random number with default bias: ${randomNumber}`);
console.log(`A random number with high bias: ${highlyBiasedNumber}`);
```

### `biasedrng(n, bias = 7)`

*   `n` (Integer): The upper bound (exclusive) for the random number generation. Must be a positive integer.
*   `bias` (Number): The bias strength.
    *   `bias > 1`: Smaller numbers are more likely. The larger the value, the stronger the bias.
    *   `bias = 1`: The distribution is close to uniform.
    *   `0 < bias < 1`: Larger numbers are more likely (inverse bias).

```
 0 |██████████████████████████████████████████████████ 6438 (64.38%)
 1 |█████ 682 (6.82%)
 2 |███ 439 (4.39%)
 3 |██ 320 (3.20%)
 4 |██ 233 (2.33%)
 5 |██ 206 (2.06%)
 6 |██ 195 (1.95%)
 7 |█ 179 (1.79%)
 8 |█ 165 (1.65%)
 9 |█ 162 (1.62%)
10 |█ 118 (1.18%)
11 |█ 129 (1.29%)
12 |█ 116 (1.16%)
13 |█ 120 (1.20%)
14 |█ 98 (0.98%)
15 |█ 81 (0.81%)
16 |█ 88 (0.88%)
17 |█ 93 (0.93%)
18 |█ 75 (0.75%)
19 | 63 (0.63%)
```

---

<a id="中文"></a>

# @3-/biasedrng

可偏向的随机数生成器。

本模块提供一个函数，可以生成一个倾向于较小值的随机数。

## 安装

```bash
npm install @3-/biasedrng
```

## 使用方法

```javascript
import biasedrng from '@3-/biasedrng';

// 生成一个在 [0, 100) 区间内的随机整数
// 分布会偏向于 0
const randomNumber = biasedrng(100);

// 你也可以指定一个偏向参数
// 偏向参数越大，结果就越偏向于 0
const highlyBiasedNumber = biasedrng(100, 10);

console.log(`一个默认偏向的随机数: ${randomNumber}`);
console.log(`一个高偏向的随机数: ${highlyBiasedNumber}`);
```

### `biasedrng(n, bias = 7)`

*   `n` (整数): 生成随机数的上限（不包含该数）。必须是一个大于 0 的正整数。
*   `bias` (数字): 偏向强度参数。
    *   `bias > 1`: 数值越小，被选中的概率越高。值越大，偏向越强。
    *   `bias = 1`: 接近于标准的均匀分布。
    *   `0 < bias < 1`: 结果会反向偏向于 n（即数值大的概率更高）。

```
 0 |██████████████████████████████████████████████████ 6438 (64.38%)
 1 |█████ 682 (6.82%)
 2 |███ 439 (4.39%)
 3 |██ 320 (3.20%)
 4 |██ 233 (2.33%)
 5 |██ 206 (2.06%)
 6 |██ 195 (1.95%)
 7 |█ 179 (1.79%)
 8 |█ 165 (1.65%)
 9 |█ 162 (1.62%)
10 |█ 118 (1.18%)
11 |█ 129 (1.29%)
12 |█ 116 (1.16%)
13 |█ 120 (1.20%)
14 |█ 98 (0.98%)
15 |█ 81 (0.81%)
16 |█ 88 (0.88%)
17 |█ 93 (0.93%)
18 |█ 75 (0.75%)
19 | 63 (0.63%)
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

[English](#en) | [中文](#zh)

---

<a id="en"></a>

# vite-plugin-svg-var

A Vite plugin to automatically convert SVG files into CSS variables.

## Features

1. **Auto Scanning**: Recursively scans all `.svg` files within the `public/svg` directory under the project root.
2. **Smart Deduplication**: Computes MD5 hashes of SVGs. Identical SVGs mapped from different paths will share the same CSS variable, minimizing the final bundle size.
3. **Optimized UTF-8 Encoding**: Encodes SVGs into CSS `data:image/svg+xml` URLs using UTF-8 encoding (which is smaller and cleaner than Base64).
4. **Collision Resolution**: Employs a camelCase variable naming strategy. If name collisions occur (e.g. from different subdirectories), parent directory names are prefixed or counter suffixes are appended.
5. **Auto Injection & Replacement**:
   - Automatically prepends `import "virtual:svgVar.css";` to entry files matching `/page/entry/**/*.js`.
   - Replaces references like `url("/svg/xxx.svg")` in CSS, Stylus, Svelte, or JS files with `var(--xxxSvg)`.
6. **HMR Support**: Watches the `public/svg` directory, automatically rescanning SVGs and invalidating modules to trigger a full page reload upon addition, update, or deletion.

---

## Installation

Install the package as a development dependency:

```bash
bun i -D vite-plugin-svg-var
```

## Usage

### 1. Register the Vite Plugin

Import and register the plugin in your `vite.config.js`:

```javascript
import svgVar from "vite-plugin-svg-var";

export default {
  plugins: [svgVar()],
};
```

### 2. Add SVG Files

Place your SVG files into `public/svg`:

```text
public/
└── svg/
    ├── close.svg
    └── user/
        └── avatar.svg
```

The plugin dynamically maps them to CSS variables:

- `public/svg/close.svg` -> `--closeSvg`
- `public/svg/user/avatar.svg` -> `--userAvatarSvg`

### 3. Reference in Stylesheets

Reference your SVG path normally using standard URLs in `.styl`, `.css`, or Svelte `<style>` blocks:

```stylus
.btn-close
  background-image: url("/svg/close.svg")
  background-size: contain
  width: 16px
  height: 16px

.avatar
  background: url("/svg/user/avatar.svg") no-repeat center
```

During build or dev mode, the plugin automatically replaces the url references with CSS variables:

```css
.btn-close {
  background-image: var(--closeSvg);
  background-size: contain;
  width: 16px;
  height: 16px;
}

.avatar {
  background: var(--userAvatarSvg) no-repeat center;
}
```

The corresponding CSS variables are defined in the global `:root`:

```css
:root {
  --closeSvg: url("data:image/svg+xml,...");
  --userAvatarSvg: url("data:image/svg+xml,...");
}
```

---

<a id="zh"></a>

# vite-plugin-svg-var

一个用于将 SVG 文件自动转换为 CSS 变量的 Vite 插件。

## 功能特性

1. **自动扫描**：自动递归扫描项目根目录下的 `public/svg` 文件夹中的所有 `.svg` 文件。
2. **智能去重**：通过对 SVG 内容进行 MD5 哈希计算，对于内容相同的 SVG，只会生成一个 CSS 变量，多个引用路径会自动映射到同一个变量名，从而减少打包体积。
3. **安全编码**：使用更高效、体积更小的 UTF-8 编码将 SVG 转换为 CSS `data:image/svg+xml` URL，而不是使用 Base64。
4. **命名冲突解决**：采用智能驼峰命名算法。如果存在同名 SVG（例如位于不同子目录下），插件会自动前缀子目录名（如项目名）或追加数字后缀。
5. **自动注入与替换**：
   - 在入口 JS 文件（匹配 `/page/entry/**/*.js`）中自动注入 `import "virtual:svgVar.css";`。
   - 在 CSS/Stylus/Svelte/JS 文件中，将 CSS 中的 `url("/svg/xxx.svg")` 形式的引用自动替换为 `var(--xxxSvg)`。
6. **开发阶段热更新 (HMR)**：监听 `public/svg` 目录，在 SVG 增删改时自动重新扫描并触发页面刷新。

---

## 安装说明

在你的包目录下使用以下命令安装：

```bash
bun i -D vite-plugin-svg-var
```

## 使用方案

### 1. 配置 Vite 插件

在你的 `vite.config.js` 中引入并配置该插件：

```javascript
import svgVar from "vite-plugin-svg-var";

export default {
  plugins: [svgVar()],
};
```

### 2. 添加 SVG 文件

将你的 SVG 文件放入 `public/svg` 目录中：

```text
public/
└── svg/
    ├── close.svg
    └── user/
        └── avatar.svg
```

插件会自动为它们分配变量名：

- `public/svg/close.svg` -> `--closeSvg`
- `public/svg/user/avatar.svg` -> `--userAvatarSvg`

### 3. 在样式中直接引用

在你的样式文件（如 `.styl`、`.css` 或 Svelte `<style>` 标签）中，可以像平常一样直接引用 SVG 的 URL 路径：

```stylus
.btn-close
  background-image: url("/svg/close.svg")
  background-size: contain
  width: 16px
  height: 16px

.avatar
  background: url("/svg/user/avatar.svg") no-repeat center
```

在构建或开发运行时，插件会自动将其转换为：

```css
.btn-close {
  background-image: var(--closeSvg);
  background-size: contain;
  width: 16px;
  height: 16px;
}

.avatar {
  background: var(--userAvatarSvg) no-repeat center;
}
```

同时，对应的 CSS 变量已在 `:root` 中定义：

```css
:root {
  --closeSvg: url("data:image/svg+xml,...");
  --userAvatarSvg: url("data:image/svg+xml,...");
}
```

---

## About

This project is an open-source component of [i18n.site ⋅ Internationalization Solution](https://i18n.site).

- [i18 : MarkDown Command Line Translation Tool](https://i18n.site/i18)

  The translation perfectly maintains the Markdown format.

  It recognizes file changes and only translates the modified files.

  The translated Markdown content is editable; if you modify the original text and translate it again, manually edited translations will not be overwritten (as long as the original text has not been changed).

- [i18n.site : MarkDown Multi-language Static Site Generator](https://i18n.site/i18n.site)

  Optimized for a better reading experience

## 关于

本项目为 [i18n.site ⋅ 国际化解决方案](https://i18n.site) 的开源组件。

- [i18 : MarkDown命令行翻译工具](https://i18n.site/i18)

  翻译能够完美保持 Markdown 的格式。能识别文件的修改，仅翻译有变动的文件。

  Markdown 翻译内容可编辑；如果你修改原文并再次机器翻译，手动修改过的翻译不会被覆盖（如果这段原文没有被修改）。

- [i18n.site : MarkDown多语言静态站点生成器](https://i18n.site/i18n.site) 为阅读体验而优化。

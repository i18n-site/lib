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

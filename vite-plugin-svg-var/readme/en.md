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
import { transform } from "lightningcss";
import css2nest from "@3-/css2nest";

export const liftImports = (css) => {
    const imports = [],
      others = [],
      lines = css.split("\n");
    for (const line of lines) {
      if (line.trim().startsWith("@import")) {
        imports.push(line);
      } else {
        others.push(line);
      }
    }
    return [...imports, ...others].join("\n");
  },
  sortFlatCss = (css) => {
    const blocks = [];
    let current = "",
      depth = 0;
    for (let i = 0; i < css.length; ++i) {
      const char = css[i];
      current += char;
      if (char === "{") {
        depth++;
      } else if (char === "}") {
        depth--;
        if (depth === 0) {
          blocks.push(current.trim());
          current = "";
        }
      } else if (char === ";" && depth === 0) {
        blocks.push(current.trim());
        current = "";
      }
    }
    if (current.trim()) {
      blocks.push(current.trim());
    }
    return blocks
      .map((b) => b.trim())
      .filter(Boolean)
      .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
      .join("\n\n");
  },
  normalizeCSS = (css_str) => {
    const lifted = liftImports(css_str),
      { code } = transform({
        filename: "style.css",
        code: Buffer.from(lifted),
        minify: false, // Pretty print for readable diffs
      });
    return code
      .toString()
      .trim()
      .replace(/\s*\/\s*/g, "/");
  },
  normalizeNesting = (css) => {
    const lifted = liftImports(css),
      flat = transform({
        filename: "style.css",
        code: Buffer.from(lifted),
        minify: true,
        targets: { chrome: 90 << 16 },
      }).code.toString(),
      sorted_flat = sortFlatCss(flat);
    return normalizeCSS(css2nest(sorted_flat));
  };

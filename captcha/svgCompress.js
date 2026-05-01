#!/usr/bin/env bun
import { optimize } from "svgo";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { resize } from "./sh/resize.js";

const SVG_DIR = "./svg",
  OUT_FILE = "./src/SVG.js",
  PLUGINS = [
    "preset-default",
    "removeDimensions",
    {
      name: "removeAttributesBySelector",
      params: {
        selector: "svg",
        attributes: ["width", "height", "xmlns"],
      },
    },
  ],
  files = readdirSync(SVG_DIR).filter((f) => f.endsWith(".svg")),
  sizes = new Map(),
  compress = (file) => {
    const path = join(SVG_DIR, file);
    
    // First, resize the SVG
    resize(path, file);
    
    const data = readFileSync(path, "utf8"),
      result = optimize(data, { path, plugins: PLUGINS }),
      vBox = result.data.match(/viewBox="([^"]+)"/)?.[1],
      inner = result.data
        .replace(/<svg[^>]*>|<\/svg>/g, "")
        .replace(/stroke="#000"/g, 'stroke="white"')
        .replace(/fill="#000"/g, 'fill="white"');

    if (vBox) {
      const [, , w, h] = vBox.split(/\s+/).map(Number),
        size = w + "x" + h;
      if (!sizes.has(size)) sizes.set(size, []);
      sizes.get(size).push(file);
      return { v: vBox, w, h, i: inner, r: result.data };
    }
  },
  svg_data = await Promise.all(files.map(compress));

if (sizes.size > 1) {
  console.warn("\n⚠️  WARN: Inconsistent SVG dimensions detected!");
  for (const [size, list] of sizes) {
    console.warn(
      "   - " +
        size +
        ": " +
        list.length +
        " files (" +
        list.slice(0, 3).join(", ") +
        (list.length > 3 ? "..." : "") +
        ")",
    );
  }
  console.warn("");
}

const header =
    "const F = (v, w, h, i, r) => [(x, y, rt, sz, sx, sy, op, g, m) => [\n" +
    '  \'<mask id="\' + m + \'"><g fill="white" stroke="white" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">\' + i + "</g></mask>",\n' +
    '  \'<g transform="translate(\' + x + "," + y + ") rotate(\" + rt + \",\" + (sz / 2) + \",\" + (sz / 2) + \") skewX(\" + sx + \") skewY(\" + sy + \')"><svg viewBox="\' + v + \'" width="\' + sz + \'" height="\' + sz + \'" opacity="\' + op + \'"><rect width="\' + w + \'" height="\' + h + \'" fill="url(#\' + g + \')" mask="url(#\' + m + \')"/></svg></g>\'\n' +
    "], r];\n\nexport default [\n",
  body = svg_data
    .map(
      (d) =>
        "  F(\n" +
        "    " +
        JSON.stringify(d.v) +
        ",\n" +
        "    " +
        d.w +
        ",\n" +
        "    " +
        d.h +
        ",\n" +
        "    " +
        JSON.stringify(d.i) +
        ",\n" +
        "    " +
        JSON.stringify(d.r) +
        "\n" +
        "  )",
    )
    .join(",\n"),
  footer = "\n];\n";

writeFileSync(OUT_FILE, header + body + footer);

console.log(svg_data.length + " svg → " + OUT_FILE);

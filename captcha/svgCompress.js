#!/usr/bin/env bun
import { optimize } from "svgo";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

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
    const path = join(SVG_DIR, file),
      data = readFileSync(path, "utf8"),
      result = optimize(data, { path, plugins: PLUGINS }),
      vBox = result.data.match(/viewBox="([^"]+)"/)?.[1];
    
    if (vBox) {
      const [, , w, h] = vBox.split(/\s+/).map(Number),
        size = `${w}x${h}`;
      if (!sizes.has(size)) sizes.set(size, []);
      sizes.get(size).push(file);
    }
    
    return result.data;
  },
  svgs = await Promise.all(files.map(compress));

if (sizes.size > 1) {
  console.warn("\n⚠️  WARN: Inconsistent SVG dimensions detected!");
  for (const [size, list] of sizes) {
    console.warn(`   - ${size}: ${list.length} files (${list.slice(0, 3).join(", ")}${list.length > 3 ? "..." : ""})`);
  }
  console.warn("");
}

writeFileSync(OUT_FILE, "export default " + JSON.stringify(svgs, null, 2) + ";");

console.log("Bundled " + svgs.length + " SVGs into " + OUT_FILE);

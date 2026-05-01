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
        attributes: ["width", "height", "xmlns", "viewBox"],
      },
    },
  ],
  files = readdirSync(SVG_DIR).filter((f) => f.endsWith(".svg")),
  compress = (file) => {
    const path = join(SVG_DIR, file),
      data = readFileSync(path, "utf8"),
      result = optimize(data, { path, plugins: PLUGINS });
    return result.data.replace(/<svg[^>]*>|<\/svg>/g, "");
  },
  svgs = await Promise.all(files.map(compress));

writeFileSync(OUT_FILE, "export default " + JSON.stringify(svgs, null, 2) + ";");

console.log("Bundled " + svgs.length + " SVGs into " + OUT_FILE);

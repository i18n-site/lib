#!/usr/bin/env -S bun test
import { test, expect, describe } from "bun:test";
import compile from "../src/compile.js";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import stylus from "stylus";
import { glob } from "glob";
import { normalizeNesting } from "./helper.js";

describe("bug regression tests", async () => {
  const files = await glob("tests/bug/**/*.styl");
  for (const file of files) {
    test(`should compile ${file} matching official stylus compiler`, async () => {
      const fullPath = resolve(file);
      const content = await readFile(fullPath, "utf8");

      // Compile with our compiler
      const [ourCss] = await compile(fullPath);

      // Compile with official stylus
      const stylusCss = await new Promise((resolve, reject) => {
        stylus.render(content, { filename: fullPath, paths: [dirname(fullPath)] }, (err, css) => {
          if (err) reject(err);
          else resolve(css);
        });
      });

      expect(normalizeNesting(ourCss)).toBe(normalizeNesting(stylusCss));
    });
  }
});

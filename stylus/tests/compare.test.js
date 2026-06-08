#!/usr/bin/env -S bun test
import { test, expect, describe } from "bun:test";
import compile from "../src/compile.js";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import stylus from "stylus";
import { glob } from "glob";
import { normalizeNesting } from "./helper.js";

describe("all cases comparison", async () => {
  const files = await glob("tests/case/**/*.styl");
  for (const file of files) {
    test(`should compile ${file} matching official stylus compiler`, async () => {
      const fullPath = resolve(file);
      const content = await readFile(fullPath, "utf8");

      const [ourCss] = await compile(fullPath);

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

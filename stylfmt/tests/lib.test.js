import { test, expect } from "bun:test";
import { load as loadYaml } from "js-yaml";
import { join } from "path";
import read from "@3-/read";
import stylfmt from "../lib/lib.js";

const TEST_STYL = "test.styl",
  format = stylfmt(loadYaml(read(join(import.meta.dirname, "supremacy.yml"))));

test("stylfmt converts stylus to css2nest and formats", async () => {
  const code = read(join(import.meta.dirname, TEST_STYL)),
    result = await format(code, TEST_STYL);

  console.log("Formatted Result:\n" + result);
  expect(result).toContain("variables.styl");
  expect(result).toContain("mixins.styl");
  expect(result).toContain("body");
  expect(result).toContain("a");
});

test("comments are preserved", async () => {
  const code = ["/* block comment */", "body", "  color: red // inline comment"].join("\n"),
    result = await format(code, TEST_STYL);

  console.log("Formatted Result with comments:\n" + result);
  expect(result).toContain("block comment");
  expect(result).toContain("inline comment");
});

test("import url is preserved", async () => {
  const code = [
      "@import 'variables.styl'",
      "@import url('//registry.npmmirror.com/18s/0.2.16/files/_.css')",
      "body",
      "  color: red",
    ].join("\n"),
    result = await format(code, TEST_STYL);

  console.log("Formatted Result with url import:\n" + result);
  expect(result).toContain("variables.styl");
  expect(result).toContain("npmmirror.com");
  expect(result).toContain("body");
  expect(result).toContain("color red");
});

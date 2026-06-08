import { test, expect, describe, afterEach } from "bun:test";
import compile from "../src/compile.js";
import { writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

describe("CSS Nesting keeping test", () => {
  const test_file = path.resolve(import.meta.dirname, "temp_nest_test.styl");

  afterEach(async () => {
    if (existsSync(test_file)) {
      await rm(test_file);
    }
  });

  test("compiled css should keep basic class nesting brackets structure", async () => {
    await writeFile(test_file, ".parent\n  color red\n  .child\n    color blue\n");
    const [css] = await compile(test_file);
    expect(css).toContain(".parent {\n  color: red;\n  .child {\n    color: blue;\n  }\n}");
    expect(css).not.toContain(".parent .child");
  });

  test("compiled css should keep pseudo-class and state concatenation nesting", async () => {
    await writeFile(
      test_file,
      ".btn\n  padding 10px\n  &:hover\n    color red\n  &.active\n    color blue\n",
    );
    const [css] = await compile(test_file);
    expect(css).toContain(
      ".btn {\n  padding: 10px;\n  &:hover {\n    color: red;\n  }\n\n  &.active {\n    color: blue;\n  }\n}",
    );
  });

  test("compiled css should keep nested media query nesting", async () => {
    await writeFile(
      test_file,
      ".container\n  width 100%\n  @media (max-width: 600px)\n    width 50%\n",
    );
    const [css] = await compile(test_file);
    expect(css).toContain(
      ".container {\n  width: 100%;\n  @media (max-width: 600px) {\n    width: 50%;\n  }\n}",
    );
  });
});

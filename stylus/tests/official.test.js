import { test, expect, describe } from "bun:test";
import { readFile } from "node:fs/promises";
import path from "node:path";
import compile from "../src/compile.js";
import { normalizeNesting } from "./helper.js";

const OFFICIAL_DIR = path.resolve(import.meta.dirname, "official_cases");

describe("official cases comparison", () => {
  test("should match official variable.styl case", async () => {
    const styl_path = path.resolve(OFFICIAL_DIR, "variable.styl"),
      expected_css = await readFile(path.resolve(OFFICIAL_DIR, "variable.css"), "utf8"),
      [css] = await compile(styl_path);

    expect(normalizeNesting(css)).toBe(normalizeNesting(expected_css));
  });

  test("should match official rulset.styl case", async () => {
    const styl_path = path.resolve(OFFICIAL_DIR, "rulset.styl"),
      expected_css = await readFile(path.resolve(OFFICIAL_DIR, "rulset.css"), "utf8"),
      [css] = await compile(styl_path);

    expect(normalizeNesting(css)).toBe(normalizeNesting(expected_css));
  });

  test("should match official import.basic.styl case", async () => {
    const styl_path = path.resolve(OFFICIAL_DIR, "import.basic.styl"),
      expected_css = await readFile(path.resolve(OFFICIAL_DIR, "import.basic.css"), "utf8"),
      [css] = await compile(styl_path);

    expect(normalizeNesting(css)).toBe(normalizeNesting(expected_css));
  });
});

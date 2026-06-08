import { test, expect, describe, beforeAll, afterAll } from "bun:test";
import { writeFile, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import compile from "../src/compile.js";
import { ERR_NOT_FOUND } from "../src/ERR.js";

const TEST_DIR = path.resolve(import.meta.dirname, "temp_test_files"),
  PATH_NESTED = path.resolve(TEST_DIR, "nested.styl"),
  PATH_NORMAL = path.resolve(TEST_DIR, "normal.styl"),
  PATH_DEP = path.resolve(TEST_DIR, "dep.styl"),
  PATH_CIRCULAR_A = path.resolve(TEST_DIR, "circular_a.styl"),
  PATH_CIRCULAR_B = path.resolve(TEST_DIR, "circular_b.styl"),
  PATH_MISSING_IMPORT = path.resolve(TEST_DIR, "missing_import.styl"),
  PATH_DAG_MAIN = path.resolve(TEST_DIR, "dag_main.styl"),
  PATH_DAG_B = path.resolve(TEST_DIR, "dag_b.styl"),
  PATH_DAG_C = path.resolve(TEST_DIR, "dag_c.styl"),
  PATH_REQ_CIRCULAR_A = path.resolve(TEST_DIR, "req_circular_a.styl"),
  PATH_REQ_CIRCULAR_B = path.resolve(TEST_DIR, "req_circular_b.styl"),
  PATH_REQ_DAG_MAIN = path.resolve(TEST_DIR, "req_dag_main.styl"),
  PATH_REQ_DAG_B = path.resolve(TEST_DIR, "req_dag_b.styl"),
  PATH_REQ_DAG_C = path.resolve(TEST_DIR, "req_dag_c.styl"),
  PATH_COMMENT_URL = path.resolve(TEST_DIR, "comment_url.styl");

describe("stylus compiler tests", () => {
  beforeAll(async () => {
    if (!existsSync(TEST_DIR)) {
      await mkdir(TEST_DIR);
    }

    await writeFile(
      PATH_NESTED,
      "base_color = #f00\nbody\n  background base_color\n  h1\n    color #000\n  th:last-child\n    border-right none\n  c-md:hover\n    opacity 0.8\n  align-items flex-start\n  --custom-prop value\n",
    );
    await writeFile(PATH_DEP, "border_val = 1px solid #ccc\n.card\n  border border_val\n");
    await writeFile(PATH_NORMAL, '@import "dep"\ndiv\n  display flex\n');
    await writeFile(PATH_CIRCULAR_A, '@import "circular_b"\nbody\n  margin 0\n');
    await writeFile(PATH_CIRCULAR_B, '@import "circular_a"\nh1\n  padding 10px\n');
    await writeFile(PATH_MISSING_IMPORT, '@import "non_existent"\nbody\n  color #fff\n');
    await writeFile(PATH_DAG_MAIN, '@import "dag_b"\n@import "dag_c"\nbody\n  background #000\n');
    await writeFile(PATH_DAG_B, '@import "dag_c"\ndiv\n  color #fff\n');
    await writeFile(PATH_DAG_C, "h1\n  margin 0\n");
    await writeFile(PATH_REQ_CIRCULAR_A, '@require "req_circular_b"\nbody\n  margin 0\n');
    await writeFile(PATH_REQ_CIRCULAR_B, '@require "req_circular_a"\nh1\n  padding 10px\n');
    await writeFile(
      PATH_REQ_DAG_MAIN,
      '@require "req_dag_b"\n@require "req_dag_c"\nbody\n  background #000\n',
    );
    await writeFile(PATH_REQ_DAG_B, '@require "req_dag_c"\ndiv\n  color #fff\n');
    await writeFile(PATH_REQ_DAG_C, "h1\n  margin 0\n");
    await writeFile(
      PATH_COMMENT_URL,
      "body\n  background url(http://example.com/logo.png)\n  background-image url(//example.com/logo.png)\n  color #fff // white color\n  /* multi\n     line */\n  margin 0\n",
    );
  });

  afterAll(async () => {
    if (existsSync(TEST_DIR)) {
      await rm(TEST_DIR, { recursive: true, force: true });
    }
  });

  test("should compile nested rules and variables", async () => {
    const [css] = await compile(PATH_NESTED);
    expect(css).toContain(
      "body {\n  background: #f00;\n  align-items: flex-start;\n  --custom-prop: value;",
    );
    expect(css).toContain("  h1 {\n    color: #000;\n  }");
    expect(css).toContain("  th:last-child {\n    border-right: none;\n  }");
    expect(css).toContain("  c-md:hover {\n    opacity: 0.8;\n  }");
  });

  test("should compile normal import with variables resolved", async () => {
    const [css] = await compile(PATH_NORMAL);
    expect(css).toContain(".card {\n  border: 1px solid #ccc;\n}");
    expect(css).toContain("div {\n  display: flex;\n}");
  });

  test("should handle circular imports and break cycle without error", async () => {
    const [css] = await compile(PATH_CIRCULAR_A);
    expect(css).toContain("h1 {\n  padding: 10px;\n}");
    expect(css).toContain("body {\n  margin: 0;\n}");
  });

  test("should handle missing imports and return ERR_NOT_FOUND", async () => {
    try {
      await compile(PATH_MISSING_IMPORT);
      expect().fail("Should throw error");
    } catch (e) {
      const [err, err_data] = e;
      expect(err).toBe(ERR_NOT_FOUND);
      expect(err_data).toBe(path.resolve(TEST_DIR, "non_existent.styl"));
    }
  });

  test("should compile DAG imports without error (non-circular duplicate import)", async () => {
    const [css] = await compile(PATH_DAG_MAIN);
    expect(css).toContain("h1 {\n  margin: 0;\n}");
    expect(css).toContain("div {\n  color: #fff;\n}");
    expect(css).toContain("body {\n  background: #000;\n}");

    // 验证 h1 { 只被导入了一次
    const h1_count = (css.match(/h1\s*\{/g) || []).length;
    expect(h1_count).toBe(1);
  });

  test("should handle require circular imports and break cycle without error", async () => {
    const [css] = await compile(PATH_REQ_CIRCULAR_A);
    expect(css).toContain("h1 {\n  padding: 10px;\n}");
    expect(css).toContain("body {\n  margin: 0;\n}");
  });

  test("should compile require DAG imports without error (non-circular duplicate require)", async () => {
    const [css] = await compile(PATH_REQ_DAG_MAIN);
    expect(css).toContain("h1 {\n  margin: 0;\n}");
    expect(css).toContain("div {\n  color: #fff;\n}");
    expect(css).toContain("body {\n  background: #000;\n}");

    // 验证 h1 { 只被 require 了一次
    const h1_count = (css.match(/h1\s*\{/g) || []).length;
    expect(h1_count).toBe(1);
  });

  test("should handle unquoted URLs and comments correctly", async () => {
    const [css] = await compile(PATH_COMMENT_URL);
    expect(css).toContain("background: url(http://example.com/logo.png);");
    expect(css).toContain("background-image: url(//example.com/logo.png);");
    expect(css).toContain("color: #fff;");
    expect(css).toContain("margin: 0;");
  });
});

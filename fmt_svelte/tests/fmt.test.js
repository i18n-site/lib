#! /usr/bin/env bun
import { describe, it, expect } from "vitest";
import svelte from "../src/svelte.js";
import { writeFileSync, unlinkSync } from "fs";

describe("svelte 格式化", () => {
  it("应该格式化 script 标签中的 js", async () => {
    const 
      input = `<script>\nlet a=1;\nfunction b(){\nreturn a+1;\n}\n</script>`,
      expected = `<script>\nlet a = 1;\nfunction b() {\n  return a + 1;\n}\n</script>`,
      [out, err] = await svelte(input);
    expect(out).toBe(expected);
    expect(err.length).toBe(0);
  });
});

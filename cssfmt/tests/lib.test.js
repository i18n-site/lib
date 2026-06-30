import { test, expect } from "bun:test";
import cssfmt from "../lib/lib.js";

test("cssfmt nests, converts rgba to hex, and moves @import to top", () => {
  const code = `
body {
  color: rgba(255, 0, 0, 0.5);
  background: blue;
}
@import url(//example.com/theme.css);
body a {
  text-decoration: none;
}
`;
  const result = cssfmt(code);
  expect(result.startsWith("@import url(//example.com/theme.css);")).toBe(true);
  expect(result).toContain("color: #ff000080;");
  expect(result).toContain("body {");
  expect(result).toContain("a {");
});

test("cssfmt preserves comments", () => {
  const code =
    "/* header comment */\n" +
    "@import url(//example.com/theme.css);\n" +
    "/* body comment */\n" +
    "body {\n" +
    "  /* color comment */\n" +
    "  color: rgba(255, 0, 0, 0.5);\n" +
    "}\n";
  const result = cssfmt(code);
  expect(result).toContain("/* header comment */");
  expect(result).toContain("/* body comment */");
  expect(result).toContain("/* color comment */");
});

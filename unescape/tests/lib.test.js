import { test, expect } from "bun:test";
import unescape from "../src/lib.js";

test("unescape html entities", () => {
  expect(unescape("&amp; &lt; &gt; &quot; &apos;")).toBe(`& < > " '`);
  expect(unescape("&#65; &#x41; &#X41;")).toBe("A A A");
  expect(unescape("no entities")).toBe("no entities");
});

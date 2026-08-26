import { test, expect } from "bun:test";
import strHash from "../src/lib.js";

test("strhash", () => {
  const short_1 = "",
    short_2 = "a",
    short_3 = "123456789012345678901",
    long_1 = "1234567890123456789012",
    long_2 = "12345678901234567890123",
    utf8_short = "你好，世界！",
    utf8_long = "你好，这是一个很长很长的中文字符串，长度肯定超过了二十二个字符。";

  expect(strHash(short_1)).toBe(short_1);
  expect(strHash(short_2)).toBe(short_2);
  expect(strHash(short_3)).toBe(short_3);
  expect(strHash(utf8_short)).toBe(utf8_short);

  expect(strHash(long_1).length).toBe(22);
  expect(strHash(long_2).length).toBe(22);
  expect(strHash(long_1)).not.toBe(long_1);
  expect(strHash(long_1)).not.toBe(strHash(long_2));

  expect(strHash(utf8_long).length).toBe(22);
  expect(strHash(utf8_long)).not.toBe(utf8_long);
});

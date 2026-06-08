#! /usr/bin/env bun
import { test } from "vitest";
import bufB64 from "../src/bufB64.js";
import uint8B64 from "../src/uint8B64.js";
import b64Buf from "../src/b64Buf.js";
import b64Uint8 from "../src/b64Uint8.js";
import md5B64 from "../src/md5B64.js";

const cases = [
  ["", ""],
  ["f", "Zg"],
  ["fo", "Zm8"],
  ["foo", "Zm9v"],
  ["foob", "Zm9vYg"],
  ["fooba", "Zm9vYmE"],
  ["foobar", "Zm9vYmFy"],
  ["中文", "5Lit5paH"],
];

for (const [input, expected] of cases) {
  test(`bufB64: ${JSON.stringify(input)}`, () => {
    const buf = Buffer.from(input);
    bufB64(buf) === expected || console.error(`Expected: ${expected}, got: ${bufB64(buf)}`);
  });

  test(`uint8B64: ${JSON.stringify(input)}`, () => {
    const uint8 = new TextEncoder().encode(input);
    uint8B64(uint8) === expected || console.error(`Expected: ${expected}, got: ${uint8B64(uint8)}`);
  });

  test(`b64Buf: ${JSON.stringify(input)}`, () => {
    const buf = Buffer.from(input),
      decoded = b64Buf(expected);
    buf.equals(decoded) || console.error(`Expected: ${input}, got: ${decoded}`);
  });

  test(`b64Uint8: ${JSON.stringify(input)}`, () => {
    const uint8 = new TextEncoder().encode(input),
      decoded = b64Uint8(expected),
      equal = uint8.length === decoded.length && uint8.every((v, i) => v === decoded[i]);
    equal || console.error(`Expected: ${input}, got: ${new TextDecoder().decode(decoded)}`);
  });
}

const md5Cases = [
  ["", "1B2M2Y8AsgTpgAmY7PhCfg"],
  ["hello", "XUFAKrxLKna5cZ2REBfFkg"],
  ["hello world", "XrY7u-Ae7tCTyyK7j1rNww"],
  ["中文", "p7rCI5_NyzoGeQPYB3xKBw"],
];

for (const [input, expected] of md5Cases) {
  test(`md5B64: ${JSON.stringify(input)}`, () => {
    const buf = Buffer.from(input),
      result = md5B64(buf);
    result === expected || console.error(`Expected: ${expected}, got: ${result}`);
  });
}

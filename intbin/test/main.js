#!/usr/bin/env bun

import binU64 from "@3-/intbin/binU64.js";
import u64Bin from "@3-/intbin/u64Bin.js";
import u64Buf from "@3-/intbin/u64Buf.js";
import u64B64 from "@3-/intbin/u64B64.js";
import b64U64 from "@3-/intbin/b64U64.js";
import u64B255 from "@3-/intbin/u64B255.js";
import b255U64 from "@3-/intbin/b255U64.js";

let b = u64Bin(51230);
console.log(b);
console.log(binU64(b));

const buf = u64Buf(51230);
console.log(buf, buf instanceof Buffer);
console.log(binU64(buf));

b = u64B64(51230);
console.log(b);
console.log(b64U64(b));

// Test base255
console.log("\n--- Base255 Tests ---");

// 1. Test u64 roundtrip
const test_numbers = [0, 1, 58, 254, 255, 256, 51230, 281474976710655];
for (const n of test_numbers) {
  const encoded = u64B255(n),
    decoded = b255U64(encoded),
    has_colon = encoded.includes(58);
  console.log(
    "u64:",
    n,
    "-> encoded:",
    Buffer.from(encoded),
    "-> decoded:",
    decoded,
    "has_colon:",
    has_colon,
  );
  if (decoded !== n || has_colon) {
    console.error("u64 test failed for", n);
    process.exit(1);
  }
}

console.log("All tests passed successfully!");

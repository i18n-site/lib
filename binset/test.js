#!/usr/bin/env bun

import { BinSet } from "./pkg/_.js";

let s = new BinSet();

s.add(new Uint8Array([1]));
s.add(new Uint8Array([5]));

s = BinSet.load(s.dump());

console.log(s.has(new Uint8Array([1])));
console.log(s.size);

console.log("--- values ---");
for (const v of s.values()) {
  console.log(v);
}

console.log("--- delete ---");
console.log("has 1:", s.has(new Uint8Array([1])));
console.log("delete 1:", s.delete(new Uint8Array([1])));
console.log("has 1:", s.has(new Uint8Array([1])));
console.log("delete 1 again:", s.delete(new Uint8Array([1])));
console.log("size:", s.size);

console.log("--- clear ---");
s.clear();
console.log("size after clear:", s.size);

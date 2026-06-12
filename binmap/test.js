#!/usr/bin/env bun

import { BinMap } from "./pkg/_.js";

let m = new BinMap();

m.set(new Uint8Array([1]), new Uint8Array([1, 2, 3]));
m.set(new Uint8Array([5]), new Uint8Array([5, 6]));

m = BinMap.load(m.dump());

console.log(m.get(new Uint8Array([1])));
console.log(m.size);

console.log("--- keys ---");
for (const k of m.keys()) {
  console.log(k);
}

console.log("--- values ---");
for (const v of m.values()) {
  console.log(v);
}

console.log("--- entries ---");
for (const [k, v] of m.entries()) {
  console.log(k, "=>", v);
}

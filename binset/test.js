#!/usr/bin/env bun

import { BinSet } from "./pkg/_.js";

var s = new BinSet();

s.add(new Uint8Array(1));
s.add(new Uint8Array([5]));

s = BinSet.load(s.dump());

console.log(s.has(new Uint8Array(1)));
console.log(s.size);

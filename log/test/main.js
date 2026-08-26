#!/usr/bin/env bun
import { readdirSync } from "fs";

import { join } from "path";

const lib_dir = join(import.meta.dirname, "../lib"),
  files = readdirSync(lib_dir).filter((file) => {
    const name = file.slice(0, -3);
    return file.endsWith(".js") && name === name.toUpperCase();
  });

for (const file of files) {
  console.log("--- Testing " + file + " ---");
  const mod = await import(join(lib_dir, file));
  for (const [key, val] of Object.entries(mod)) {
    if (key !== "default") {
      console.log("  " + key + ":", val("test"));
    }
  }
  mod.default("default log test");
}

console.log("--- Testing log.js ---");
const log = (await import(join(lib_dir, "log.js"))).default;
log("test log message");
log("test log message with multiple arguments", { a: 1, b: 2 });

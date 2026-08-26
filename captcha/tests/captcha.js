#!/usr/bin/env bun
import captchaGen from "../src/lib.js";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = "./out",
  gen = () => {
    if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR);
    for (let i = 0; i < 10; ++i) {
      const [svg] = captchaGen(),
        path = join(OUT_DIR, "captcha_" + (i + 1) + ".svg");
      writeFileSync(path, svg);
      console.log("Generated " + path);
    }
  };

gen();

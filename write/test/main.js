#!/usr/bin/env node

import { join } from "path";
import { rmSync } from "fs";
import write from "@3-/write";

const dir = join(import.meta.dirname, "1");
write(join(dir, "2/3.log"), "test");
rmSync(dir, { recursive: true, force: true });

import gen from "@3-/srv-obj-replace/gen.js";
import fs from "fs/promises";
import { join } from "path";

await gen(
  { name: "test_srv_x", execPath: "/usr/bin/bun", scriptPath: "/tmp/中 文 目 录 测试/dummy.js" },
  join(import.meta.dirname, "linux/systemd.service"),
  join(import.meta.dirname, "test_out.service")
);
const out = await fs.readFile(join(import.meta.dirname, "test_out.service"), "utf-8");
console.log("----- OUTPUT -----");
console.log(out);
console.log("------------------");

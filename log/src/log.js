import { relative } from "path";
import { fileURLToPath } from "url";
import { gray } from "./GRAY.js";

const toPath = (p) => (p.startsWith("file://") ? fileURLToPath(p) : p),
  cwd = process.cwd();

export default (...args) => {
  const line = new Error().stack.split("\n")[2];
  if (line) {
    const start = line.indexOf("("),
      raw = (
        start > -1
          ? line.slice(start + 1, line.lastIndexOf(")"))
          : line.slice(line.indexOf("at ") + 3)
      ).trim(),
      last = raw.lastIndexOf(":"),
      pos = raw.lastIndexOf(":", last - 1),
      idx = pos > -1 ? pos : last;
    if (idx > -1) {
      console.log(
        gray(
          relative(cwd, toPath(raw.slice(0, idx))) +
            ":" +
            (pos > -1 ? raw.slice(idx + 1, last) : raw.slice(idx + 1)) +
            " ›",
        ),
        ...args,
      );
      return;
    }
  }
  console.log(...args);
};

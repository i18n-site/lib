import { createInterface } from "readline";
import { gray } from "@3-/log/GRAY.js";
import ERR from "@3-/log/ERR.js";

const IGNORE_SET = new Set(["diff", "status", "log", "rev-parse"]),
  lineLog = (stream, prefix, is_error) => {
    createInterface({ input: stream }).on("line", (line) => {
      line = line.trim();
      if (line) {
        const msg = gray("[" + prefix + "]") + " " + line;
        (is_error && /error:|fatal:/i.test(line) ? ERR : console.log)(msg);
      }
    });
  };

export default (command, stdout, stderr, args) => {
  const sub = (args && args[0]) || command,
    prefix = command === "git" && sub ? "git " + sub : command;

  if (IGNORE_SET.has(sub)) {
    return;
  }

  lineLog(stdout, prefix, false);
  lineLog(stderr, prefix, true);
};

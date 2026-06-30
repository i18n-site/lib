import { $, log as _log } from "zx";

import { greenBright as _green, redBright as _red } from "ansis";

const USE_COLOR = process.stdout.isTTY && !process.env.NO_COLOR;

let green, red;

if (USE_COLOR) {
  red = _red;
  green = _green;
} else {
  red = green = (s) => {
    return s;
  };
}

$.log = (entry) => {
  var cmd, data, kind;
  if (entry.verbose) {
    ({ kind, cmd, data } = entry);
    switch (kind) {
      case "stdout":
        if ($.stdout === void 0 || $.stdout) {
          process.stdout.write(data.toString("utf-8"));
        }
        return;
      case "cmd":
        console.log(green("> " + cmd));
        return;
      case "stderr":
        process.stdout.write(data);
        return;
    }
  }
  _log(entry);
};

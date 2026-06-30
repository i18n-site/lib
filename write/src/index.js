import { dirname } from "path";

import { writeFileSync, mkdirSync } from "fs";

export default (fp, txt) => {
  try {
    writeFileSync(fp, txt);
  } catch (err) {
    if (err.code === "ENOENT") {
      mkdirSync(dirname(fp), {
        recursive: true,
      });
      writeFileSync(fp, txt);
    } else {
      throw err;
    }
  }
};

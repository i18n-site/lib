import load from "./load.js";
import { existsSync } from "fs";

export default (fp) => {
  if (!existsSync(fp)) {
    return;
  }
  return load(fp);
};

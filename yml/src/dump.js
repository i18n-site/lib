import write from "@3-/write";
import dumps from "./dumps.js";

export default (fp, o) => {
  write(fp, dumps(o));
};


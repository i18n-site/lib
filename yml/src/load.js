import read from "@3-/read";
import loads from "./loads.js";

export default (fp) => {
  try {
    return loads(read(fp));
  } catch (err) {
    let msg = fp;
    const { mark } = err;
    if (mark) {
      const { snippet } = mark;
      msg += "\n" + snippet;
      err = new Error(err.reason);
    }
    console.error(msg);
    throw err;
  }
};


import read from "@3-/read";
import str from "./str.js";

export default (obj, fp) => str(obj, read(fp));

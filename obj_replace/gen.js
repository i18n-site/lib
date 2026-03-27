import write from "@3-/write";
import fp from "./fp.js";

export default (obj, src, dest) => write(dest, fp(obj, src));

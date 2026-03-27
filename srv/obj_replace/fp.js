import read from "@3-/read";
import str from "./str.js";

export default async (obj, fp) => str(obj, await read(fp));

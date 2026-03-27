import fs from "fs/promises";
import fp from "./fp.js";

export default async (obj, src, dest) => fs.writeFile(dest, await fp(obj, src));

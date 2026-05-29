import { format } from "oxfmt";
import rgba2hex from "./rgba2hex.js";

export default async (code, file_name = "file.js") => {
  const ext = file_name.endsWith(".ts") ? "file.ts" : "file.js",
    { code: out, errors } = await format(ext, code);
  return [out ? rgba2hex(out) : out, errors || []];
};

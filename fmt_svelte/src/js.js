import { format } from "oxfmt";

export default async (code, filename = "file.js") => {
  const 
    ext = filename.endsWith(".ts") ? "file.ts" : "file.js",
    result = await format(ext, code);
  return [result.code, result.errors || []];
};

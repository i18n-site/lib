import { format } from "oxfmt";

export default async (code, file_name = "file.js") => {
  const 
    ext = file_name.endsWith(".ts") ? "file.ts" : "file.js",
    { code: out, errors } = await format(ext, code);
  return [out, errors || []];
};

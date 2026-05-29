import { formatterByName } from "./registry.js";
import rgba2hex from "./rgba2hex.js";

export default async (content, file_name) => {
  const ext = file_name.split(".").pop().toLowerCase(),
    fmt = formatterByName(ext);
  if (fmt) {
    const [out, errs] = await fmt(content, file_name);
    return [out ? rgba2hex(out) : out, errs];
  }
  return [undefined, []];
};

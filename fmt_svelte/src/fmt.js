import { formatterByName } from "./registry.js";

export default async (content, file_name) => {
  const ext = file_name.split(".").pop().toLowerCase(),
    fmt = formatterByName(ext);
  if (fmt) return await fmt(content, file_name);
  return [undefined, []];
};

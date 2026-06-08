import { basename } from "node:path";

export default (path) => {
  const name = basename(path);
  if (name.startsWith(".")) {
    return 1;
  }
  return ["node_modules"].includes(name);
};

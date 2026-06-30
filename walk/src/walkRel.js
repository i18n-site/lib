import walk from "./walk.js";
import ignoreDefault from "./ignoreDefault.js";

export default function* (dir, ignore = ignoreDefault) {
  const dir_len = dir.length + 1;
  const ignore_fn = (file_path) => ignore(file_path.slice(dir_len));
  for (const entry of walk(dir, ignore_fn)) {
    yield entry.slice(dir_len);
  }
}

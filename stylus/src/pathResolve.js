import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { ext, isUrl } from "./resolve.js";

const RESOLVE_CACHE = new Map();

export default (import_path, current_dir, lookup_paths) => {
  if (isUrl(import_path)) {
    return import_path;
  }

  const cache_key = import_path + "\0" + current_dir;
  if (RESOLVE_CACHE.has(cache_key)) {
    return RESOLVE_CACHE.get(cache_key);
  }

  const resolvePath = () => {
    if (import_path.startsWith("/")) {
      const trial = ext(import_path);
      if (existsSync(trial)) {
        return trial;
      }
      let dir = current_dir;
      while (true) {
        if (existsSync(resolve(dir, "package.json")) || existsSync(resolve(dir, "node_modules"))) {
          const trial_root = ext(resolve(dir, import_path.slice(1)));
          if (existsSync(trial_root)) {
            return trial_root;
          }
        }
        const parent = dirname(dir);
        if (parent === dir) {
          break;
        }
        dir = parent;
      }
    }

    const local_paths = [current_dir, ...lookup_paths.filter((p) => p !== current_dir)];
    for (const dir of local_paths) {
      const trial = ext(resolve(dir, import_path));
      if (existsSync(trial)) {
        return trial;
      }
    }

    let dir = current_dir;
    while (true) {
      const trial = ext(resolve(dir, "node_modules", import_path));
      if (existsSync(trial)) {
        return trial;
      }
      const parent = dirname(dir);
      if (parent === dir) {
        break;
      }
      dir = parent;
    }

    return ext(resolve(local_paths[0], import_path));
  };

  const resolved = resolvePath();
  RESOLVE_CACHE.set(cache_key, resolved);
  return resolved;
};

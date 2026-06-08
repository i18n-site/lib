import { existsSync } from "node:fs";
import { resolve, dirname, basename, extname, join } from "node:path";
import { ERR_OK } from "./ERR.js";
import load from "./load.js";
import run from "./run.js";
import render from "./render.js";

export const lookupPaths = (main_resolved, custom_paths) => {
  const main_dir_name = dirname(main_resolved),
    lookup_paths = [main_dir_name];
  if (custom_paths) {
    lookup_paths.push(...custom_paths.map((p) => resolve(p)));
  }
  const main_name = basename(main_resolved, extname(main_resolved)),
    main_dir = join(main_dir_name, main_name);
  if (existsSync(main_dir)) {
    lookup_paths.push(main_dir);
  }
  return lookup_paths;
};

export default (file_path, source_map = false) => {
  const file_states = Object.create(null),
    main_resolved = resolve(file_path),
    lookup_paths = lookupPaths(main_resolved),
    [err, err_data, root_nodes] = load(main_resolved, file_states, lookup_paths);

  if (err !== ERR_OK) {
    throw [err, err_data];
  }

  const evaluated = run(root_nodes),
    res = render(evaluated, source_map);
  return source_map ? res : [res, null];
};

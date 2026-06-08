import { resolve } from "node:path";
import { ERR_OK } from "./ERR.js";
import load from "./load.js";
import run from "./run.js";
import render from "./render.js";
import { lookupPaths } from "./compile.js";
import { ext } from "./resolve.js";

export default (content, options = {}) => {
  const ref = {
    options,
    define: () => ref,
    set: (key, val) => {
      options[key] = val;
      return ref;
    },
    render: () => {
      const { filename = "index.styl", paths, sourcemap } = options,
        file_states = Object.create(null),
        main_resolved = ext(resolve(filename));

      file_states["\0content\0" + main_resolved] = content;

      const lookup_paths = lookupPaths(main_resolved, paths),
        [err, err_data, root_nodes] = load(main_resolved, file_states, lookup_paths);
      if (err !== ERR_OK) {
        throw new Error("Stylus compilation error: " + err + " " + err_data);
      }

      ref.dependencies = Object.keys(file_states).filter((k) => !k.startsWith("\0"));

      const evaluated = run(root_nodes),
        source_map = !!sourcemap,
        res = render(evaluated, source_map);

      if (source_map) {
        ref.sourcemap = res[1];
        return res[0];
      }
      return res;
    },
    deps: () => ref.dependencies || [],
  };
  return ref;
};

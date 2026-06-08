import { readFileSync, existsSync } from "node:fs";
import { dirname } from "node:path";
import WARN from "@3-/log/WARN.js";
import {
  STATE_INIT,
  STATE_LOADING,
  STATE_DONE,
  NODE_IMPORT,
  NODE_RULE,
  AST_LINE,
  AST_FILE,
} from "./const.js";
import { ERR_OK, ERR_NOT_FOUND } from "./ERR.js";
import { isUrl, ext } from "./resolve.js";
import pathResolve from "./pathResolve.js";
import parse from "./parse.js";

const expand = (parent_node, current_dir, file_states, lookup_paths) => {
    const expanded = [];
    for (const child of parent_node[2]) {
      const [type, path, line, file] = child;
      if (type === NODE_IMPORT) {
        const sub_path = pathResolve(path, current_dir, lookup_paths),
          [err, err_data, sub_nodes] = load(sub_path, file_states, lookup_paths);
        if (err !== ERR_OK) {
          return [err, err_data];
        }
        if (isUrl(sub_path) && sub_nodes.length > 0) {
          sub_nodes[0][AST_LINE] = line;
          sub_nodes[0][AST_FILE] = file;
        }
        expanded.push(...sub_nodes);
      } else {
        if (type === NODE_RULE) {
          const [err, err_data] = expand(child, current_dir, file_states, lookup_paths);
          if (err !== ERR_OK) {
            return [err, err_data];
          }
        }
        expanded.push(child);
      }
    }
    parent_node[2] = expanded;
    return [ERR_OK, null];
  },
  load = (file_path, file_states, lookup_paths) => {
    if (isUrl(file_path)) {
      return [ERR_OK, null, [[NODE_RULE, "@import " + file_path, []]]];
    }

    const resolved_path = ext(file_path),
      state = file_states[resolved_path] || STATE_INIT;

    if (state === STATE_DONE || state === STATE_LOADING) {
      if (state === STATE_LOADING) {
        WARN("Circular import detected for: " + resolved_path);
      }
      return [ERR_OK, null, []];
    }

    const virtual_content = file_states["\0content\0" + resolved_path];
    if (virtual_content === undefined && !existsSync(resolved_path)) {
      return [ERR_NOT_FOUND, resolved_path];
    }

    file_states[resolved_path] = STATE_LOADING;

    const content = virtual_content ?? readFileSync(resolved_path, "utf8"),
      root = parse(content, resolved_path),
      current_dir = dirname(resolved_path),
      [err, err_data] = expand(root, current_dir, file_states, lookup_paths);

    if (err !== ERR_OK) {
      return [err, err_data];
    }

    file_states[resolved_path] = STATE_DONE;

    return [ERR_OK, null, root[2]];
  };

export default load;

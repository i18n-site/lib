import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { BinSet } from "@3-/binset/_.js";
const ROOT = process.cwd(),
  SVG_DIR = join(ROOT, "public"),
  path_to_var_name = new Map(),
  md5_to_var_name = new Map(),
  assigned_vars = new Set(),
  svg_content_map = new Map(),
  camel = (str) => str.replace(/[-_]([a-z])/g, (g) => g[1].toUpperCase()),
  capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1),
  md5 = (content) => createHash("md5").update(content).digest("hex"),
  encode = (svg) =>
    [..."%#<>,"].reduce((r, c) => r.replaceAll(c, encodeURIComponent(c)), svg.replaceAll('"', "'"));

const scan = () => {
  if (!existsSync(SVG_DIR)) {
    return;
  }

  const files = [],
    walk = (dir, prefix = "") => {
      for (const item of readdirSync(dir, { withFileTypes: true })) {
        if (item.isDirectory()) {
          walk(join(dir, item.name), prefix + item.name + "/");
        } else if (item.name.endsWith(".svg")) {
          files.push(prefix + item.name);
        }
      }
    };
  walk(SVG_DIR);
  files.sort();

  path_to_var_name.clear();
  md5_to_var_name.clear();
  assigned_vars.clear();
  svg_content_map.clear();

  const bin_set = new BinSet(),
    encoder = new TextEncoder();

  for (const file of files) {
    const rel_path = file.slice(0, -4),
      file_path = join(SVG_DIR, file),
      raw = readFileSync(file_path, "utf8");

    const cleaned = raw.trim(),
      svg_bin = encoder.encode(cleaned);

    if (bin_set.has(svg_bin)) {
      const var_name = md5_to_var_name.get(md5(cleaned));
      path_to_var_name.set(rel_path, var_name);
    } else {
      bin_set.add(svg_bin);
      const hash = md5(cleaned),
        parts = rel_path.split("/"),
        filename = parts.at(-1),
        default_var = camel(filename) + "Svg";

      let var_name = default_var;
      if (assigned_vars.has(default_var)) {
        const project_name = parts.length > 1 ? camel(parts[0]) : "",
          fallback_var = project_name + capitalize(camel(filename)) + "Svg";
        var_name = fallback_var;

        let counter = 1;
        while (assigned_vars.has(var_name)) {
          var_name = fallback_var + counter;
          ++counter;
        }
      }

      assigned_vars.add(var_name);
      md5_to_var_name.set(hash, var_name);
      path_to_var_name.set(rel_path, var_name);
      svg_content_map.set(var_name, cleaned);
    }
  }
  bin_set.free();
};

scan();

export const replace = (code) =>
  code.replace(
    /url\(['"]?(?:\.\.?\/|\/)*([^'":)(#?\s]+)\.svg(?:#[^'")\s]*)?['"]?\)/g,
    (match, rel_path) => {
      const var_name = path_to_var_name.get(rel_path);
      return var_name ? "var(--" + var_name + ")" : match;
    },
  );

const render = () =>
  [
    ":root {",
    ...[...svg_content_map].map(
      ([var_name, content]) =>
        "  --" + var_name + ': url("data:image/svg+xml,' + encode(content) + '");',
    ),
    "}",
  ].join("\n");

export default () => {
  const virtual_id = "virtual:svgVar.css",
    resolved_virtual_id = "\0" + virtual_id;

  return {
    name: "vite-plugin-svg-var",
    resolveId: (id) => (id === virtual_id ? resolved_virtual_id : null),
    load: (id) => (id === resolved_virtual_id ? render() : null),
    transform(code, id) {
      const clean_id = id.split("?")[0];
      if (!/\.(styl|svelte|css|js|ts)$/.test(clean_id)) {
        return null;
      }

      const new_code =
        clean_id.includes("/page/entry/") && clean_id.endsWith(".js")
          ? 'import "virtual:svgVar.css";\n' + code
          : code;

      const replaced = replace(new_code);
      if (replaced !== code) {
        return {
          code: replaced,
          map: null,
        };
      }
      return null;
    },
    configureServer: (server) => {
      server.watcher.add(SVG_DIR);
      server.watcher.on("all", (event, file) => {
        if (file.endsWith(".svg") && file.startsWith(SVG_DIR)) {
          scan();
          const { moduleGraph, ws } = server,
            mod = moduleGraph.getModuleById(resolved_virtual_id);
          if (mod) {
            moduleGraph.invalidateModule(mod);
          }
          ws.send({ type: "full-reload" });
        }
      });
    },
  };
};

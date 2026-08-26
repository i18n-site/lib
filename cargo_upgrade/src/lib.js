import { existsSync, globSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import T from "@iarna/toml";

const CARGO_TOML = "Cargo.toml",
  DEP_KEY_LI = ["dependencies", "dev-dependencies", "build-dependencies"],
  VER_CACHE = new Map();

const pkgVer = (dir) => {
  if (VER_CACHE.has(dir)) return VER_CACHE.get(dir);
  const { package: pkg } = T.parse(readFileSync(join(dir, CARGO_TOML), "utf8"));
  if (!pkg) return;
  const { version } = pkg;
  let r;
  if (typeof version === "string") {
    r = version;
  } else if (version?.workspace) {
    let cur = dir;
    while (true) {
      const parent = dirname(cur);
      if (parent === cur) break;
      cur = parent;
      const ws_path = join(cur, CARGO_TOML);
      if (existsSync(ws_path)) {
        const { workspace } = T.parse(readFileSync(ws_path, "utf8")),
          ws_ver = workspace?.package?.version;
        if (typeof ws_ver === "string") {
          r = ws_ver;
          break;
        }
      }
    }
  }
  VER_CACHE.set(dir, r);
  return r;
};

const depUpgrade = (dir, dep_dict) => {
  let changed = 0;
  for (const [, o] of Object.entries(dep_dict)) {
    const { path } = o;
    if (path) {
      const v = pkgVer(resolve(join(dir, path)));
      if (v && o.version !== v) {
        changed = 1;
        o.version = v;
      }
    }
  }
  return changed;
};

const upgrade = (dir) => {
  const cargo_path = join(dir, CARGO_TOML);
  if (!existsSync(cargo_path)) return;
  const toml = T.parse(readFileSync(cargo_path, "utf8")),
    { workspace, target } = toml,
    dep_li = [
      ...DEP_KEY_LI.map((k) => toml[k]),
      workspace?.dependencies,
      ...Object.values(target || {}).flatMap((t) => DEP_KEY_LI.map((k) => t[k])),
    ];
  let changed = 0;

  for (const dep of dep_li) {
    if (dep) changed |= depUpgrade(dir, dep);
  }

  for (const [k, v] of Object.entries(toml)) {
    if (v && typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0) {
      delete toml[k];
      changed = 1;
    }
  }

  if (!changed) return;

  writeFileSync(cargo_path, T.stringify(toml).replaceAll("\n  ", "\n"));
};

export default (root = process.cwd()) => {
  const { workspace } = T.parse(readFileSync(join(root, CARGO_TOML), "utf8")),
    member_li = workspace?.members;
  if (member_li) {
    for (const pattern of member_li) {
      const match_li = globSync(pattern, { cwd: root });
      for (const item of match_li) {
        upgrade(join(root, item));
      }
    }
  }
  upgrade(root);
};

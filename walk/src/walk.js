import { opendirSync, readlinkSync, statSync } from "fs";
import { join, normalize } from "path";
import ignoreDefault from "./ignoreDefault.js";

let walk = function* (dir, ignore = ignoreDefault, meta) {
  const [exist, root] = meta || [new Set(), dir];
  const opened = opendirSync(dir);
  try {
    while (true) {
      const dirent = opened.readSync();
      if (!dirent) {
        break;
      }
      const entry = join(root, dirent.name);
      if (ignore(entry)) {
        continue;
      }
      if (dirent.isDirectory()) {
        yield* walk(entry, ignore, [exist, entry]);
      } else if (dirent.isFile()) {
        yield entry;
      } else if (dirent.isSymbolicLink()) {
        const raw_path = readlinkSync(entry);
        const link_path = raw_path.startsWith("/") ? raw_path : normalize(join(dir, raw_path));
        let stat;
        try {
          stat = statSync(link_path);
        } catch {
          continue;
        }
        if (stat.isDirectory()) {
          if (exist.has(link_path)) {
            continue;
          }
          exist.add(link_path);
          for (const item of walk(link_path, ignore, [exist, entry])) {
            yield item;
          }
        } else if (stat.isFile()) {
          yield entry;
        }
      }
    }
  } finally {
    opened.closeSync();
  }
};

if (process.platform === "win32") {
  walk = (await import("./walk.win.js")).default(walk);
}

export default walk;

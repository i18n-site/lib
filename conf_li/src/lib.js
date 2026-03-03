import { readdirSync } from "node:fs";
import { join } from "node:path";

export default async (conf, load) =>
  Promise.all(
    readdirSync(conf)
      .filter((i) => i.endsWith(".js"))
      .map(async (name) => load((await import(join(conf, name))).default)),
  );

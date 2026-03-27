import { join } from "node:path";
import { tmpdir } from "node:os";
import { unlinkSync, readFileSync, writeFileSync } from "node:fs";
import { $ } from "./init.js";
import gen from "@3-/obj_replace/gen.js";

export default async (name, exec_path, args) => {
  try {
    await $`schtasks /End /TN ${name}`;
  } catch (e) {}

  const xml_path = join(tmpdir(), `${name}.xml`);

  gen(
    { name, execPath: exec_path, scriptPath: args },
    join(import.meta.dirname, "schtasks.xml"),
    xml_path
  );

  writeFileSync(xml_path, "\uFEFF" + readFileSync(xml_path, "utf8"), "utf16le");

  await $([`schtasks /Create /F /TN ${name} /XML "${xml_path}"`]);
  unlinkSync(xml_path);

  await $`schtasks /Run /TN ${name}`;
};

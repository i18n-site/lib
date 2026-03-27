import { writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { $ } from "./init.js";

export default async (name, exec_path, args) => {
  try {
    await $`schtasks /End /TN ${name}`;
  } catch (e) {}

  const cmd = `schtasks /Create /F /TN ${name} /TR "\\"${exec_path}\\" \\"${args}\\" run" /SC ONLOGON`;
  await $([cmd]);

  const { stdout: xml } = await $`schtasks /Query /TN ${name} /XML`,
    xml_path = join(tmpdir(), `${name}.xml`),
    new_xml = xml.replace(
      "</Settings>",
      "  <RestartOnFailure>\n      <Interval>PT1M</Interval>\n      <Count>999</Count>\n    </RestartOnFailure>\n  </Settings>"
    );

  writeFileSync(xml_path, new_xml);
  await $`schtasks /Create /F /TN ${name} /XML ${xml_path}`;
  unlinkSync(xml_path);

  await $`schtasks /Run /TN ${name}`;
};

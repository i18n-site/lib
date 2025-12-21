import { mkdtempSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

export const TMP = tmpdir();

export default (prefix) => mkdtempSync(prefix ? join(TMP, prefix + ".") : TMP);

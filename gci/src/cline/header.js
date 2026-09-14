import { randomUUID } from "node:crypto";

const VERSION = "3.0.61",
  CORE_VERSION = "0.0.82";

export default (token) => ({
  Authorization: "Bearer " + token,
  "Content-Type": "application/json",
  "HTTP-Referer": "https://cline.bot",
  "X-Title": "Cline",
  "User-Agent": "Cline/" + VERSION,
  "X-IS-MULTIROOT": "false",
  "X-CLIENT-TYPE": "cline-cli",
  "X-CLIENT-VERSION": VERSION,
  "X-PLATFORM": process.platform,
  "X-PLATFORM-VERSION": process.version,
  "X-CORE-VERSION": CORE_VERSION,
  "X-Task-ID": randomUUID(),
});

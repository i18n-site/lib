import { createHash } from "node:crypto";
import uint8B64 from "./uint8B64.js";

export default (u8) => uint8B64(createHash("md5").update(u8).digest());

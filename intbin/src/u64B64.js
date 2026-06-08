import u64Bin from "./u64Bin.js";
import uint8B64 from "@3-/base64url/uint8B64.js";

export default (n) => {
  if (!n) {
    return "";
  }
  return uint8B64(u64Bin(n));
};

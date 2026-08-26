import binU64 from "./binU64.js";
import b64Uint8 from "@3-/base64url/b64Uint8.js";

export default (s) => {
  if (!s) {
    return 0;
  }
  return binU64(b64Uint8(s));
};

import utf8e from "@3-/utf8/utf8e.js";
import md5B64 from "@3-/base64url/md5B64.js";

export default (str) => (str.length < 22 ? str : md5B64(utf8e(str)));

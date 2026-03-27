import bufB64 from "./bufB64.js";

export default (buf) => bufB64(new Bun.CryptoHasher("md5").update(buf).digest());

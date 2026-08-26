import IpInvalid from "./IpInvalid.js";

export default (ip) => {
  if (ip.includes(":")) {
    let p;
    if (ip.includes("::")) {
      const parts = ip.split("::"),
        left = parts[0] ? parts[0].split(":") : [],
        right = parts[1] ? parts[1].split(":") : [];
      p = [...left, ...Array(8 - left.length - right.length).fill("0"), ...right];
    } else p = ip.split(":");

    if (p.length !== 8) throw IpInvalid;
    const res = new Uint8Array(16);
    for (let i = 0; i < 8; ++i) {
      const v = parseInt(p[i], 16);
      if (isNaN(v) || v < 0 || v > 0xffff) throw IpInvalid;
      res[i * 2] = v >> 8;
      res[i * 2 + 1] = v & 0xff;
    }
    return res;
  }

  if (ip.includes(".")) {
    const p = ip.split(".");
    if (p.length !== 4) throw IpInvalid;
    const res = new Uint8Array(4);
    for (let i = 0; i < 4; ++i) {
      const v = parseInt(p[i], 10);
      if (isNaN(v) || v < 0 || v > 255) throw IpInvalid;
      res[i] = v;
    }
    return res;
  }
  throw IpInvalid;
};

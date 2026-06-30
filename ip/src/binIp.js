import IpInvalid from "./IpInvalid.js";

export default (bin) => {
  const len = bin.length;
  if (len === 4) return bin.join(".");
  if (len === 16) {
    const p = [];
    for (let i = 0; i < 16; i += 2) p.push(((bin[i] << 8) | bin[i + 1]).toString(16));

    let b_st = -1,
      b_len = 0,
      c_st = -1,
      c_len = 0;

    for (let i = 0; i < 8; ++i) {
      if (p[i] === "0") {
        if (c_st === -1) c_st = i;
        ++c_len;
      } else {
        if (c_st !== -1 && c_len > b_len) {
          b_st = c_st;
          b_len = c_len;
        }
        c_st = -1;
        c_len = 0;
      }
    }

    if (c_st !== -1 && c_len > b_len) {
      b_st = c_st;
      b_len = c_len;
    }

    if (b_len > 1) {
      const res = [];
      for (let i = 0; i < 8; ++i) {
        if (i === b_st) {
          if (i === 0) res.push("");
          res.push("");
          i += b_len - 1;
          if (i === 7) res.push("");
        } else res.push(p[i]);
      }
      return res.join(":");
    }
    return p.join(":");
  }
  throw IpInvalid;
};

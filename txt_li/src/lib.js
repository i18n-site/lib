const WS = [
  160, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200a,
  0x2028, 0x2029, 0x202f, 0x205f, 0x3000,
];

export default (txt) => {
  const r = [],
    len = txt.length;
  let line_start = 0,
    end = -1;
  for (let i = 0; i < len; ++i) {
    const code = txt.charCodeAt(i);
    if (code === 10 || code === 13) {
      if (end !== -1) {
        r.push(txt.slice(line_start, end + 1));
        end = -1;
      }
      line_start = i + 1;
    } else {
      const is_ws =
        code <= 32 || (code <= 0x3000 ? code >= 160 && WS.includes(code) : code === 0xfeff);
      if (!is_ws) {
        end = i;
      }
    }
  }
  if (end !== -1) {
    r.push(txt.slice(line_start, end + 1));
  }
  return r;
};

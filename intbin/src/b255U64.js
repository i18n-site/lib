export default (s) => {
  if (!s) {
    return 0;
  }
  const len = s.length;
  let val = 0;
  for (let i = 0; i < len; ++i) {
    const b = s[i],
      d = b < 58 ? b : b - 1;
    val = val * 255 + d;
  }
  return val;
};

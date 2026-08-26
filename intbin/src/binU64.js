export default (bin) => {
  if (!bin) {
    return 0;
  }
  let val = 0;
  for (let i = bin.length - 1; i >= 0; --i) {
    val = val * 256 + bin[i];
  }
  return val;
};

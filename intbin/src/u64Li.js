export default (n) => {
  const res = [];
  while (n > 0) {
    res.push(n & 255);
    n = Math.floor(n / 256);
  }
  return res;
};

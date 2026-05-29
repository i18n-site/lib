export default (n) => {
  if (!n) {
    return new Uint8Array();
  }
  const digits = [];
  while (n > 0) {
    digits.push(n % 255);
    n = Math.floor(n / 255);
  }
  digits.reverse();

  const res = new Uint8Array(digits.length);
  for (let i = 0; i < digits.length; ++i) {
    const d = digits[i];
    res[i] = d < 58 ? d : d + 1;
  }
  return res;
};


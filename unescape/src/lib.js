import int from "@3-/int";

const MAP = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
};

export default (str) => {
  if (!str.includes("&")) return str;
  return str.replace(
    /&(?:(amp|lt|gt|quot|apos)|#(\d+)|#[xX]([0-9a-fA-F]+));/g,
    (m, name, dec, hex) => {
      if (name) {
        return MAP[name];
      }
      if (dec) {
        return String.fromCodePoint(int(dec));
      }
      if (hex) {
        return String.fromCodePoint(Number.parseInt(hex, 16));
      }
      return m;
    },
  );
};

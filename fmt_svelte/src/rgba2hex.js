const rgbaRegex = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/g;

function rgbaToHex(match, r, g, b, a) {
  const rs = parseInt(r).toString(16).padStart(2, '0');
  const gs = parseInt(g).toString(16).padStart(2, '0');
  const bs = parseInt(b).toString(16).padStart(2, '0');
  const as = Math.round(parseFloat(a) * 255).toString(16).padStart(2, '0');
  return `#${rs}${gs}${bs}${as}`;
}

export default (txt) => txt.replace(rgbaRegex, rgbaToHex);

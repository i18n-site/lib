import SVGS from './SVG.js';

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  HEX = () => '#' + random(0, 0xffffff).toString(16).padStart(6, '0'),
  GEN_GRAD = (id, op1 = 1, op2 = 1) => {
    const c1 = HEX(), c2 = HEX();
    return '<linearGradient id="' + id + '" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="' + c1 + '" stop-opacity="' + op1 + '"/><stop offset="100%" stop-color="' + c2 + '" stop-opacity="' + op2 + '"/></linearGradient>';
  };

export const captchaGen = (w = 300, h = 150, num = 3) => {
  const icon_size = 40,
    positions = [],
    selected = [],
    rendered = [],
    defs = [];

  defs.push(GEN_GRAD('bg_g', 0.2, 0.1));
  const bg_body = '<rect width="' + w + '" height="' + h + '" fill="url(#bg_g)"/>';

  for (let i = 0; i < num; ++i) {
    const idx = random(0, SVGS.length - 1),
      content = SVGS[idx],
      g_id = 'g' + i,
      m_id = 'm' + i;
    let x, y, collision, attempts = 0;

    do {
      x = random(20, w - icon_size - 20);
      y = random(20, h - icon_size - 20);
      collision = positions.some((p) => {
        const dx = p[0] - x, dy = p[1] - y;
        return Math.sqrt(dx * dx + dy * dy) < icon_size * 0.9;
      });
      attempts++;
    } while (collision && attempts < 20);

    positions.push([x, y]);
    selected.push(content);

    // Create a mask for the icon and a gradient for the fill
    defs.push(GEN_GRAD(g_id));
    defs.push('<mask id="' + m_id + '"><g fill="none" stroke="white" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">' + content + '</g></mask>');

    const rot = random(-35, 35),
      scale = random(10, 15) / 10;

    rendered.push(
      '<g transform="translate(' + x + ',' + y + ') rotate(' + rot + ',' + (icon_size / 2) + ',' + (icon_size / 2) + ') scale(' + scale + ')">' +
      '<rect width="' + icon_size + '" height="' + icon_size + '" fill="url(#' + g_id + ')" mask="url(#' + m_id + ')"/>' +
      '</g>'
    );
  }

  // Refined Gooey + Noise filter
  const filter = '<filter id="f" x="-20%" y="-20%" width="140%" height="140%">' +
    '<feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur"/>' +
    '<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo"/>' +
    '<feComposite in="SourceGraphic" in2="goo" operator="atop"/>' +
    '</filter>';

  const full_svg = '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' + defs.join('') + filter + '</defs>' +
    bg_body + '<g filter="url(#f)">' + rendered.join('') + '</g></svg>';

  return [full_svg, selected, positions];
};

export default captchaGen;

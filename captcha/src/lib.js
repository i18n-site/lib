import SVGS from './SVG.js';

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  GEN_BG = (width, height) => {
    let bg = '<rect width="' + width + '" height="' + height + '" fill="#fcfcfc"/>';
    for (let i = 0; i < 15; ++i) {
      const x1 = random(0, width),
        y1 = random(0, height),
        x2 = random(0, width),
        y2 = random(0, height),
        color = 'rgba(' + random(100, 200) + ',' + random(100, 200) + ',' + random(100, 200) + ',0.5)';
      bg += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + color + '" stroke-width="' + random(1, 3) + '"/>';
    }
    for (let i = 0; i < 5; ++i) {
      const cx = random(0, width),
        cy = random(0, height),
        r = random(5, 20),
        color = 'rgba(' + random(150, 250) + ',' + random(150, 250) + ',' + random(150, 250) + ',0.3)';
      bg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + color + '" />';
    }
    return bg;
  };

export const captchaGen = (width = 300, height = 150, num_icons = 3) => {
  const icon_size = 40,
    positions = [],
    selected_svgs = [],
    rendered_icons = [];

  for (let i = 0; i < num_icons; ++i) {
    const svg_index = random(0, SVGS.length - 1),
      svg_content = SVGS[svg_index];
    let x, y, collision, attempts = 0;

    do {
      x = random(20, width - icon_size - 20);
      y = random(20, height - icon_size - 20);
      collision = positions.some((pos) => {
        const dx = pos[0] - x,
          dy = pos[1] - y;
        return Math.sqrt(dx * dx + dy * dy) < icon_size * 0.8;
      });
      attempts++;
    } while (collision && attempts < 20);

    positions.push([x, y]);
    selected_svgs.push(svg_content);

    const color = 'rgb(' + random(0, 100) + ',' + random(0, 100) + ',' + random(0, 100) + ')',
      rotation = random(-30, 30),
      scale = random(10, 14) / 10;

    rendered_icons.push(
      '<g transform="translate(' + x + ',' + y + ') rotate(' + rotation + ',' + (icon_size / 2) + ',' + (icon_size / 2) + ') scale(' + scale + ')">' +
      '<svg width="' + icon_size + '" height="' + icon_size + '" viewBox="0 0 100 100">' +
      '<g fill="none" stroke="' + color + '" stroke-width="8">' + svg_content + '</g>' +
      '</svg></g>'
    );
  }

  const full_svg = '<svg width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />' +
    '<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -7" result="goo" /></filter></defs>' +
    GEN_BG(width, height) + '<g filter="url(#goo)">' + rendered_icons.join('') + '</g></svg>';

  return [full_svg, selected_svgs, positions];
};

export default captchaGen;

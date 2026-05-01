import SVGS from "./SVG.js";

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  HSL = (l_min, l_max) =>
    "hsl(" + random(0, 360) + "," + random(40, 80) + "%," + random(l_min, l_max) + "%)",
  GEN_GRAD = (id, l_min, l_max, op = 1) => {
    const c1 = HSL(l_min, l_max),
      c2 = HSL(l_min, l_max);
    return (
      '<linearGradient id="' +
      id +
      '" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="' +
      c1 +
      '" stop-opacity="' +
      op +
      '"/><stop offset="100%" stop-color="' +
      c2 +
      '" stop-opacity="' +
      op +
      '"/></linearGradient>'
    );
  };

export const captchaGen = (w = 300, h = 300, num = 3) => {
  const icon_size = 45,
    positions = [],
    selected = [],
    rendered = [],
    defs = [];

  defs.push(GEN_GRAD("bg_g", 85, 95));
  let bg_body = '<rect width="' + w + '" height="' + h + '" fill="url(#bg_g)"/>';

  for (let i = 0; i < 15; ++i) {
    const x1 = random(0, w),
      y1 = random(0, h),
      x2 = random(0, w),
      y2 = random(0, h);
    bg_body +=
      '<line x1="' +
      x1 +
      '" y1="' +
      y1 +
      '" x2="' +
      x2 +
      '" y2="' +
      y2 +
      '" stroke="' +
      HSL(70, 80) +
      '" stroke-width="' +
      random(1, 2) +
      '" stroke-opacity="0.5"/>';
  }

  for (let i = 0; i < num; ++i) {
    const idx = random(0, SVGS.length - 1),
      content = SVGS[idx],
      g_id = "g" + i,
      m_id = "m" + i;
    let x,
      y,
      collision,
      attempts = 0;

    do {
      x = random(20, w - icon_size - 20);
      y = random(20, h - icon_size - 20);
      collision = positions.some((p) => {
        const dx = p[0] - x,
          dy = p[1] - y;
        return Math.sqrt(dx * dx + dy * dy) < icon_size * 0.85;
      });
      attempts++;
    } while (collision && attempts < 20);

    positions.push([x, y]);
    selected.push(content);

    defs.push(GEN_GRAD(g_id, 20, 45));
    defs.push(
      '<mask id="' +
        m_id +
        '"><g fill="none" stroke="white" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">' +
        content +
        "</g></mask>",
    );

    const rot = random(-30, 30),
      scale = random(10, 13) / 10,
      op = random(25, 50) / 100; // Transparency: 0.25 to 0.5 (not exceeding 50%)

    rendered.push(
      '<g transform="translate(' +
        x +
        "," +
        y +
        ") rotate(" +
        rot +
        "," +
        icon_size / 2 +
        "," +
        icon_size / 2 +
        ") scale(" +
        scale +
        ')" opacity="' +
        op +
        '">' +
        '<rect width="' +
        icon_size +
        '" height="' +
        icon_size +
        '" fill="url(#' +
        g_id +
        ')" mask="url(#' +
        m_id +
        ')"/>' +
        "</g>",
    );
  }

  const filter =
    '<filter id="f" x="-20%" y="-20%" width="140%" height="140%">' +
    '<feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur"/>' +
    '<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo"/>' +
    '<feComposite in="SourceGraphic" in2="goo" operator="atop"/>' +
    "</filter>";

  const full_svg =
    '<svg width="' +
    w +
    '" height="' +
    h +
    '" viewBox="0 0 ' +
    w +
    " " +
    h +
    '" xmlns="http://www.w3.org/2000/svg">' +
    "<defs>" +
    defs.join("") +
    filter +
    "</defs>" +
    bg_body +
    '<g filter="url(#f)">' +
    rendered.join("") +
    "</g></svg>";

  return [full_svg, selected, positions];
};

export default captchaGen;

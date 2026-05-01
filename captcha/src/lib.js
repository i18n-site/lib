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
  },
  SHUFFLE = (arr) => {
    for (let i = arr.length - 1; i > 0; --i) {
      const j = random(0, i);
      [arr[i], arr[arr[j] === undefined ? i : j]] = [arr[j], arr[i]];
    }
    return arr;
  };

export const captchaGen = (w = 300, h = 300, num = 3) => {
  const icon_size = 48,
    positions = [],
    selected = [],
    rendered = [],
    defs = [],
    // Grid logic: Divide w, h by icon_size to get available slots
    grid_w = Math.floor(w / icon_size),
    grid_h = Math.floor(h / icon_size),
    grids = [];

  for (let i = 0; i < grid_w * grid_h; ++i) grids.push(i);
  SHUFFLE(grids);

  // Background: Ultra-light for max contrast
  defs.push(GEN_GRAD("bg_g", 90, 97));
  let bg_body = '<rect width="' + w + '" height="' + h + '" fill="url(#bg_g)"/>';

  // Ensure unique icons by shuffling SVGS and picking first N
  const icon_indices = SHUFFLE(Array.from({ length: SVGS.length }, (_, i) => i)).slice(0, num);

  for (let i = 0; i < num; ++i) {
    const idx = icon_indices[i],
      content = SVGS[idx],
      g_id = "g" + i,
      m_id = "m" + i,
      grid_idx = grids.pop(),
      // Position based on grid with a small random jitter
      jitter = 4,
      x = (grid_idx % grid_w) * icon_size + random(-jitter, jitter),
      y = Math.floor(grid_idx / grid_w) * icon_size + random(-jitter, jitter);

    positions.push([x, y]);
    selected.push(content);

    // High contrast icons: Very dark (10-30% lightness)
    defs.push(GEN_GRAD(g_id, 10, 30));
    defs.push(
      '<mask id="' +
        m_id +
        '"><g fill="none" stroke="white" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">' +
        content +
        "</g></mask>",
    );

    const rot = random(-25, 25),
      scale = random(10, 12) / 10,
      op = random(40, 50) / 100; // Transparency limited to 40-50% for visibility

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

  // Refined filter for maximum clarity
  const filter =
    '<filter id="f" x="-10%" y="-10%" width="120%" height="120%">' +
    '<feGaussianBlur in="SourceGraphic" stdDeviation="0.6" result="blur"/>' +
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

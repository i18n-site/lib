import SVGS from "./SVG.js";
import PATTERNS from "./PATTERNS.js";

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  grad = (id, h, l_min, l_max, op = 1) => {
    // 采用三段渐变，并让色相在小范围内滑动，色彩更丰满
    const h1 = h,
      h2 = (h + random(20, 40)) % 360,
      h3 = (h + random(40, 60)) % 360,
      s = random(70, 95),
      c1 = "hsl(" + h1 + "," + s + "%," + l_min + "%)",
      c2 = "hsl(" + h2 + "," + s + "%," + ((l_min + l_max) / 2) + "%)",
      c3 = "hsl(" + h3 + "," + s + "%," + l_max + "%)";
    return (
      '<linearGradient id="' + id + '" x1="0%" y1="0%" x2="100%" y2="100%">' +
      '<stop offset="0%" stop-color="' + c1 + '" stop-opacity="' + op + '"/>' +
      '<stop offset="50%" stop-color="' + c2 + '" stop-opacity="' + op + '"/>' +
      '<stop offset="100%" stop-color="' + c3 + '" stop-opacity="' + op + '"/>' +
      '</linearGradient>'
    );
  },
  rgba = (h, l, op) => "hsla(" + h + "," + random(60, 90) + "%," + l + "%," + op + ")",
  shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; --i) {
      const j = random(0, i);
      [arr[i], arr[arr[j] === undefined ? i : j]] = [arr[j], arr[i]];
    }
    return arr;
  },
  ctrl = (k) => {
    const n = k.length - 1;
    let a = new Array(n), b = new Array(n), c = new Array(n), r = new Array(n), p1 = new Array(n), p2 = new Array(n);
    a[0] = 0; b[0] = 2; c[0] = 1; r[0] = k[0] + 2 * k[1];
    for (let i = 1; i < n - 1; ++i) { a[i] = 1; b[i] = 4; c[i] = 1; r[i] = 4 * k[i] + 2 * k[i + 1]; }
    a[n - 1] = 2; b[n - 1] = 7; c[n - 1] = 0; r[n - 1] = 8 * k[n - 1] + k[n];
    for (let i = 1; i < n; ++i) { const m = a[i] / b[i - 1]; b[i] -= m * c[i - 1]; r[i] -= m * r[i - 1]; }
    p1[n - 1] = r[n - 1] / b[n - 1];
    for (let i = n - 2; i >= 0; --i) p1[i] = (r[i] - c[i] * p1[i + 1]) / b[i];
    for (let i = 0; i < n - 1; ++i) p2[i] = 2 * k[i + 1] - p1[i + 1];
    p2[n - 1] = 0.5 * (k[n] + p1[n - 1]);
    return [p1, p2];
  },
  wave = (points, w, h) => {
    const x = points.map((p) => p.x), y = points.map((p) => p.y), [p1_x, p2_x] = ctrl(x), [p1_y, p2_y] = ctrl(y),
      d = ["M 0," + h + " C 0," + h + " " + x[0] + "," + y[0] + " " + x[0] + "," + y[0]];
    for (let i = 0; i < x.length - 1; ++i) {
      d.push("C " + p1_x[i].toFixed(1) + "," + p1_y[i].toFixed(1) + " " + p2_x[i].toFixed(1) + "," + p2_y[i].toFixed(1) + " " + x[i + 1] + "," + y[i + 1]);
    }
    d.push("C " + x[x.length - 1] + "," + y[y.length - 1] + " " + w + "," + h + " " + w + "," + h + " Z");
    return d.join(" ");
  };

export default (w = 300, h = 300, num = 3) => {
  const total = num + 3,
    // 数学优化：根据数量动态计算行列，避免死板的固定网格
    cols = Math.ceil(Math.sqrt(total * (w / h))),
    rows = Math.ceil(total / cols),
    cell_w = w / cols,
    cell_h = h / rows,
    positions = [], selected = [], rendered = [], defs = [],
    bg_h = random(0, 360),
    // 视觉美学：图标色相与背景色相对冲（互补色逻辑）
    ico_h_base = (bg_h + 160) % 360;

  // 背景渐变
  defs.push(grad("bg0", bg_h, 85, 98), grad("bg1", (bg_h + 30) % 360, 75, 90), grad("bg2", (bg_h + 60) % 360, 60, 95));

  const [p_size, path_d] = PATTERNS[random(0, PATTERNS.length - 1)];
  defs.push('<pattern id="p" patternTransform="scale(0.8) rotate(' + random(0, 360) + ')" width="' + p_size + '" height="' + p_size + '" patternUnits="userSpaceOnUse"><path fill="url(#bg2)" d="' + path_d + '"/></pattern>');

  // 多层视差波浪
  const layer_count = 4, waves = [];
  for (let l = 0; l < layer_count; ++l) {
    const points = [{ x: 0, y: (h / (layer_count + 1)) * (l + 1) }],
      seg = random(5, 10),
      sw = w / seg;
    for (let s = 1; s < seg; ++s) {
      points.push({ x: Math.round(s * sw + random(-sw * 0.2, sw * 0.2)), y: Math.round((h / (layer_count + 1)) * (l + 1) + random(-20, 20)) });
    }
    points.push({ x: w, y: (h / (layer_count + 1)) * (l + 1) });
    waves.push(wave(points, w, h));
  }

  let bg_body = '<rect width="' + w + '" height="' + h + '" fill="url(#bg0)" stroke="none"/>';
  bg_body += '<rect width="' + w + '" height="' + h + '" fill="url(#p)" fill-opacity="0.12" stroke="none"/>';
  shuffle(waves).forEach((d, i) => {
    const op = (0.15 + i * 0.1).toFixed(2),
      stroke = rgba((bg_h + 120) % 360, 80, 0.1);
    bg_body += '<path d="' + d + '" fill="url(#bg1)" fill-opacity="' + op + '" stroke="' + stroke + '" stroke-width="' + random(1, 3) + 'px" stroke-dasharray="' + random(0, 20) + '" transform="rotate(' + (i % 2 ? 180 : 0) + ' ' + (w / 2) + ' ' + (h / 2) + ')"/>';
  });

  // 抖动采样分布 (Jittered Sampling) - O(N)
  const grid_slots = shuffle(Array.from({ length: cols * rows }, (_, i) => i)).slice(0, total),
    icon_indices = shuffle(Array.from({ length: SVGS.length }, (_, i) => i)).slice(0, total);

  for (let i = 0; i < total; ++i) {
    const slot = grid_slots[i],
      gx = slot % cols,
      gy = Math.floor(slot / cols),
      idx = icon_indices[i],
      content = SVGS[idx],
      v_box = content.match(/viewBox="([^"]+)"/)[1],
      inner = content.replace(/<svg[^>]*>|<\/svg>/g, "").replace(/stroke="#000"/g, 'stroke="white"').replace(/fill="#000"/g, 'fill="white"'),
      [, , v_w, v_h] = v_box.split(" ").map(Number),
      m_id = "m" + i,
      g_id = "g" + i,
      // 动态大小：格子的 65% - 85%
      i_size = Math.floor(Math.min(cell_w, cell_h) * (random(65, 85) / 100)),
      // 数学居中 + 随机抖动
      x = gx * cell_w + (cell_w - i_size) / 2 + random(-5, 5),
      y = gy * cell_h + (cell_h - i_size) / 2 + random(-5, 5),
      ico_h = (ico_h_base + random(-30, 30)) % 360;

    if (i < num) { positions.push([x, y, i_size]); selected.push(content); }

    defs.push(grad(g_id, ico_h, 5, 45), '<mask id="' + m_id + '"><g fill="white" stroke="white" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">' + inner + "</g></mask>");
    rendered.push('<g transform="translate(' + x + "," + y + ") rotate(" + random(-30, 30) + "," + (i_size / 2) + "," + (i_size / 2) + ") skewX(" + random(-8, 8) + ") skewY(" + random(-8, 8) + ')"><svg viewBox="' + v_box + '" width="' + i_size + '" height="' + i_size + '" opacity="' + (random(35, 55) / 100) + '"><rect width="' + v_w + '" height="' + v_h + '" fill="url(#' + g_id + ')" mask="url(#' + m_id + ')"/></svg></g>');
  }

  return ['<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" style="border:none"><defs>' + defs.join("") + "</defs>" + bg_body + rendered.join("") + "</svg>", selected, positions];
};

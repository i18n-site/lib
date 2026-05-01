import SVGS from "./SVG.js";
import PATTERNS from "./PATTERNS.js";

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  hsl = (l_min, l_max, s_min = 50, s_max = 90) =>
    "hsl(" + random(0, 360) + "," + random(s_min, s_max) + "%," + random(l_min, l_max) + "%)",
  genGrad = (id, l_min, l_max, op = 1) => {
    const h1 = random(0, 360),
      h2 = (h1 + random(40, 180)) % 360,
      s1 = random(60, 95),
      s2 = random(60, 95),
      c1 = "hsl(" + h1 + "," + s1 + "%," + l_min + "%)",
      c2 = "hsl(" + h2 + "," + s2 + "%," + l_max + "%)";
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
  rgba = (l_min, l_max, op) =>
    "rgba(" + random(l_min, l_max) + "," + random(l_min, l_max) + "," + random(l_min, l_max) + "," + op + ")",
  shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; --i) {
      const j = random(0, i);
      [arr[i], arr[arr[j] === undefined ? i : j]] = [arr[j], arr[i]];
    }
    return arr;
  },
  computeControlPoints = (k) => {
    const n = k.length - 1;
    let a = new Array(n),
      b = new Array(n),
      c = new Array(n),
      r = new Array(n),
      p1 = new Array(n),
      p2 = new Array(n);
    a[0] = 0;
    b[0] = 2;
    c[0] = 1;
    r[0] = k[0] + 2 * k[1];
    for (let i = 1; i < n - 1; ++i) {
      a[i] = 1;
      b[i] = 4;
      c[i] = 1;
      r[i] = 4 * k[i] + 2 * k[i + 1];
    }
    a[n - 1] = 2;
    b[n - 1] = 7;
    c[n - 1] = 0;
    r[n - 1] = 8 * k[n - 1] + k[n];
    for (let i = 1; i < n; ++i) {
      const m = a[i] / b[i - 1];
      b[i] -= m * c[i - 1];
      r[i] -= m * r[i - 1];
    }
    p1[n - 1] = r[n - 1] / b[n - 1];
    for (let i = n - 2; i >= 0; --i) p1[i] = (r[i] - c[i] * p1[i + 1]) / b[i];
    for (let i = 0; i < n - 1; ++i) p2[i] = 2 * k[i + 1] - p1[i + 1];
    p2[n - 1] = 0.5 * (k[n] + p1[n - 1]);
    return [p1, p2];
  },
  genWavePath = (points, w, h) => {
    const x = points.map((p) => p.x),
      y = points.map((p) => p.y),
      [p1x, p2x] = computeControlPoints(x),
      [p1y, p2y] = computeControlPoints(y);
    let d = "M 0," + h + " C 0," + h + " " + x[0] + "," + y[0] + " " + x[0] + "," + y[0] + " ";
    for (let i = 0; i < x.length - 1; ++i) {
      d += "C " + p1x[i] + "," + p1y[i] + " " + p2x[i] + "," + p2y[i] + " " + x[i + 1] + "," + y[i + 1] + " ";
    }
    return d + "C " + x[x.length - 1] + "," + y[y.length - 1] + " " + w + "," + h + " " + w + "," + h + " Z";
  };

/**
 * 生成点击验证码
 * @param {number} w - 画布宽度
 * @param {number} h - 画布高度
 * @param {number} num - 图标数量
 * @returns {[string, string[], [number, number, number][]]} [SVG字符串, 选中的图标内容列表, 图标位置列表[[左上角x, 左上角y, 实际边长], ...]]
 */
export default (w = 300, h = 300, num = 3) => {
  const cell_size = 60,
    positions = [],
    selected = [],
    rendered = [],
    defs = [],
    grid_w = Math.floor(w / cell_size),
    grid_h = Math.floor(h / cell_size),
    taken = new Set();

  defs.push(genGrad("bg0", 85, 98), genGrad("bg1", 70, 90), genGrad("bg2", 60, 95));

  const [psize, path_d] = PATTERNS[random(0, PATTERNS.length - 1)],
    p_scale = random(5, 15) / 10,
    p_rot = random(0, 360),
    p_op = random(10, 20) / 100;

  defs.push(
    '<pattern id="p" patternTransform="scale(' +
      p_scale +
      ") rotate(" +
      p_rot +
      ')" width="' +
      psize +
      '" height="' +
      psize +
      '" patternUnits="userSpaceOnUse"><path fill="url(#bg2)" d="' +
      path_d +
      '"/></pattern>',
  );

  const layer_count = random(3, 4),
    segment_count = random(5, 15),
    variance = random(5, 20),
    cell_w = w / segment_count,
    waves = [];

  for (let l = 0; l < layer_count; ++l) {
    const points = [{ x: 0, y: (h / (layer_count + 1)) * (l + 1) }];
    for (let s = 1; s < segment_count; ++s) {
      points.push({
        x: s * cell_w + random(-cell_w * 0.3, cell_w * 0.3),
        y: (h / (layer_count + 1)) * (l + 1) + random(-variance, variance),
      });
    }
    points.push({ x: w, y: (h / (layer_count + 1)) * (l + 1) });
    waves.push(genWavePath(points, w, h));
  }

  let bg_body = '<rect width="' + w + '" height="' + h + '" fill="url(#bg0)" stroke="none"/>';
  bg_body += '<rect width="' + w + '" height="' + h + '" fill="url(#p)" fill-opacity="' + p_op + '" stroke="none"/>';

  shuffle(waves).forEach((d, i) => {
    const op = (0.2 + i * 0.1).toFixed(2),
      sw = random(0, 5),
      dash = random(0, 30),
      stroke = rgba(50, 200, random(0, 20) / 100),
      rot = i % 2 === 0 ? 0 : 180;
    bg_body +=
      '<path d="' +
      d +
      '" fill="url(#bg1)" fill-opacity="' +
      op +
      '" stroke="' +
      stroke +
      '" stroke-width="' +
      sw +
      'px" stroke-dasharray="' +
      dash +
      '" transform="rotate(' +
      rot +
      " " +
      w / 2 +
      " " +
      h / 2 +
      ')"/>';
  });

  const icon_indices = shuffle(Array.from({ length: SVGS.length }, (_, i) => i)).slice(0, num);

  for (let i = 0; i < num; ++i) {
    let grid_idx = -1,
      attempts = 0;
    while (++attempts < 100) {
      const idx = random(0, grid_w * grid_h - 1);
      if (!taken.has(idx)) {
        grid_idx = idx;
        break;
      }
    }
    if (grid_idx === -1) {
      for (let idx = 0; idx < grid_w * grid_h; ++idx) {
        if (!taken.has(idx)) {
          grid_idx = idx;
          break;
        }
      }
    }
    if (grid_idx === -1) break;

    const gx = grid_idx % grid_w,
      gy = Math.floor(grid_idx / grid_w);

    taken.add(grid_idx);
    if (gx > 0) taken.add(grid_idx - 1);
    if (gx < grid_w - 1) taken.add(grid_idx + 1);
    if (gy > 0) taken.add(grid_idx - grid_w);
    if (gy < grid_h - 1) taken.add(grid_idx + grid_w);

    const idx = icon_indices[i],
      content = SVGS[idx],
      vbox = content.match(/viewBox="([^"]+)"/)[1],
      inner = content.replace(/<svg[^>]*>|<\/svg>/g, ""),
      [, , vw, vh] = vbox.split(" ").map(Number),
      m_id = "m" + i,
      // 每个图标大小不一，且必须小于网格
      icon_size = random(Math.floor(cell_size * 0.6), Math.floor(cell_size * 0.9)),
      jitter = 3,
      x = gx * cell_size + (cell_size - icon_size) / 2 + random(-jitter, jitter),
      y = gy * cell_size + (cell_size - icon_size) / 2 + random(-jitter, jitter),
      rot = random(-30, 30),
      skew_x = random(-5, 5),
      skew_y = random(-5, 5),
      op = random(30, 50) / 100, // 半透明
      g_id = "g" + i;

    positions.push([x, y, icon_size]);
    selected.push(content);

    defs.push(
      genGrad(g_id, 5, 40),
      '<mask id="' +
        m_id +
        '"><g fill="white" stroke="white" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">' +
        inner.replace(/stroke="#000"/g, 'stroke="white"').replace(/fill="#000"/g, 'fill="white"') +
        "</g></mask>",
    );

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
        ") skewX(" +
        skew_x +
        ") skewY(" +
        skew_y +
        ')">' +
        '<svg viewBox="' +
        vbox +
        '" width="' +
        icon_size +
        '" height="' +
        icon_size +
        '" opacity="' +
        op +
        '">' +
        '<rect width="' +
        vw +
        '" height="' +
        vh +
        '" fill="url(#' +
        g_id +
        ')" mask="url(#' +
        m_id +
        ')"/></svg></g>',
    );
  }

  return [
    '<svg width="' +
      w +
      '" height="' +
      h +
      '" viewBox="0 0 ' +
      w +
      " " +
      h +
      '" xmlns="http://www.w3.org/2000/svg" style="border:none"><defs>' +
      defs.join("") +
      "</defs>" +
      bg_body +
      rendered.join("") +
      "</svg>",
    selected,
    positions,
  ];
};

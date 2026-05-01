import SVGS from "./SVG.js";
import PATTERNS from "./PATTERNS.js";

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  PALETTES = [
    [200, 280], // Cold (Blue-Purple)
    [0, 60],   // Warm (Red-Orange)
    [150, 210], // Nature (Green-Cyan)
    [280, 340], // Candy (Pink-Magenta)
    [40, 90]    // Earth (Gold-Brown)
  ],
  grad = (id, h, l_min, l_max, op = 1, seg = 0) => {
    const s = rand(75, 95);
    let stops = "";
    if (seg < 2) {
      // Smooth gradient with subtle vibrance shift
      [0, 0.5, 1].forEach((v, i) => {
        const hh = (h + i * 15) % 360,
          ll = l_min + (l_max - l_min) * v;
        stops += `<stop offset="${v * 100}%" stop-color="hsl(${hh},${s}%,${ll}%)" stop-opacity="${op}"/>`;
      });
    } else {
      // Artistic segments: alternating light/dark or hue shifts
      for (let i = 0; i < seg; i++) {
        const hh = (h + i * (360 / seg) * 0.2) % 360,
          ll = i % 2 === 0 ? rand(l_min, l_min + 15) : rand(l_max - 15, l_max),
          c = `hsl(${hh},${s}%,${ll}%)`;
        stops += `<stop offset="${(i * 100) / seg}%" stop-color="${c}" stop-opacity="${op}"/><stop offset="${((i + 1) * 100) / seg}%" stop-color="${c}" stop-opacity="${op}"/>`;
      }
    }
    const a = rand(0, 360),
      x1 = Math.round(50 + 50 * Math.cos((a * Math.PI) / 180)),
      y1 = Math.round(50 + 50 * Math.sin((a * Math.PI) / 180));
    return `<linearGradient id="${id}" x1="${x1}%" y1="${y1}%" x2="${100 - x1}%" y2="${100 - y1}%">${stops}</linearGradient>`;
  },
  rgba = (h, l, op) => "hsla(" + h + "," + rand(60, 90) + "%," + l + "%," + op + ")",
  shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; --i) {
      const j = rand(0, i);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },
  ctrl = (k) => {
    const n = k.length - 1,
      a = Array.from({ length: n }),
      b = Array.from({ length: n }),
      c = Array.from({ length: n }),
      r = Array.from({ length: n }),
      p1 = Array.from({ length: n }),
      p2 = Array.from({ length: n });
    a[0] = 0; b[0] = 2; c[0] = 1; r[0] = k[0] + 2 * k[1];
    for (let i = 1; i < n - 1; ++i) {
      a[i] = 1; b[i] = 4; c[i] = 1; r[i] = 4 * k[i] + 2 * k[i + 1];
    }
    a[n - 1] = 2; b[n - 1] = 7; c[n - 1] = 0; r[n - 1] = 8 * k[n - 1] + k[n];
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
  wave = (points, w, h) => {
    const x = points.map((p) => p.x),
      y = points.map((p) => p.y),
      [p1_x, p2_x] = ctrl(x),
      [p1_y, p2_y] = ctrl(y);
    let d = "M 0," + h + " C 0," + h + " " + x[0] + "," + y[0] + " " + x[0] + "," + y[0];
    for (let i = 0; i < x.length - 1; ++i) {
      d += " C " + p1_x[i].toFixed(1) + "," + p1_y[i].toFixed(1) + " " + p2_x[i].toFixed(1) + "," + p2_y[i].toFixed(1) + " " + x[i + 1] + "," + y[i + 1];
    }
    return d + " C " + x[x.length - 1] + "," + y[y.length - 1] + " " + w + "," + h + " " + w + "," + h + " Z";
  };

/**
 * 生成点击验证码
 * @param {number} w - 画布宽度
 * @param {number} h - 画布高度
 * @param {number} num - 目标图标数量
 * @returns {[string, string[], [number, number, number][]]} [SVG字符串, 选中的目标图标原始SVG内容列表, 图标位置列表[[左上角x, 左上角y, 边长], ...]]
 */
export default (w = 300, h = 300, num = 3) => {
  const cell_size = 50,
    grid_w = Math.floor(w / cell_size),
    grid_h = Math.floor(h / cell_size),
    total = num + rand(1, 4),
    grid_slots = shuffle(Array.from({ length: grid_w * grid_h }, (_, i) => i)).slice(0, total),
    icon_indices = shuffle(Array.from({ length: SVGS.length }, (_, i) => i)).slice(0, total),
    
    // Select a unified palette for the whole captcha
    palette = PALETTES[rand(0, PALETTES.length - 1)],
    bg_h = rand(palette[0], palette[1]),
    ico_h_base = (bg_h + 180) % 360, // Use complementary or high-contrast hue

    positions = [],
    selected = [],
    rendered = [],
    defs = [],
    [p_size, path_d] = PATTERNS[rand(0, PATTERNS.length - 1)];

  defs.push(
    grad("bg0", bg_h, 92, 98), // Very soft pastel background
    grad("bg1", (bg_h + 30) % 360, 85, 94),
    grad("bg2", (bg_h + 60) % 360, 70, 90),
    '<pattern id="p" patternTransform="scale(0.8) rotate(' + rand(0, 360) + ')" width="' + p_size + '" height="' + p_size + '" patternUnits="userSpaceOnUse"><path fill="url(#bg2)" d="' + path_d + '"/></pattern>',
    // Combined Filter: Drop Shadow + Inner Shadow + Rim Highlight
    '<filter id="f" x="-20%" y="-20%" width="140%" height="140%">' +
    '<feGaussianBlur in="SourceAlpha" stdDeviation="1.2" result="blur"/>' +
    '<feOffset dx="1.2" dy="1.5" result="offsetBlur"/>' +
    '<feFlood flood-color="#000" flood-opacity="0.25" result="dropColor"/>' +
    '<feComposite in="dropColor" in2="offsetBlur" operator="in" result="dropShadow"/>' +
    '<feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="innerBlur"/>' +
    '<feOffset dx="-1" dy="-1" result="offsetInner"/>' +
    '<feComposite in="SourceAlpha" in2="offsetInner" operator="out" result="innerMask"/>' +
    '<feFlood flood-color="#000" flood-opacity="0.4" result="innerColor"/>' +
    '<feComposite in="innerColor" in2="innerMask" operator="in" result="innerShadow"/>' +
    '<feOffset dx="0.6" dy="0.6" result="offsetGlow"/>' +
    '<feComposite in="SourceAlpha" in2="offsetGlow" operator="out" result="glowMask"/>' +
    '<feFlood flood-color="#fff" flood-opacity="0.25" result="glowColor"/>' +
    '<feComposite in="glowColor" in2="glowMask" operator="in" result="highlight"/>' +
    '<feMerge><feMergeNode in="dropShadow"/><feMergeNode in="SourceGraphic"/><feMergeNode in="innerShadow"/><feMergeNode in="highlight"/></feMerge></filter>'
  );

  const layer_count = 4, waves = [];
  for (let l = 0; l < layer_count; ++l) {
    const points = [{ x: 0, y: (h / (layer_count + 1)) * (l + 1) }],
      seg = rand(5, 10),
      sw = w / seg;
    for (let s = 1; s < seg; ++s) {
      points.push({
        x: Math.round(s * sw + rand(-sw * 0.2, sw * 0.2)),
        y: Math.round((h / (layer_count + 1)) * (l + 1) + rand(-20, 20)),
      });
    }
    points.push({ x: w, y: (h / (layer_count + 1)) * (l + 1) });
    waves.push(wave(points, w, h));
  }

  let bg_body = '<rect width="' + w + '" height="' + h + '" fill="url(#bg0)" stroke="none"/><rect width="' + w + '" height="' + h + '" fill="url(#p)" fill-opacity="0.12" stroke="none"/>';
  shuffle(waves).forEach((d, i) => {
    bg_body += '<path d="' + d + '" fill="url(#bg1)" fill-opacity="' + (0.15 + i * 0.1).toFixed(2) + '" stroke="' + rgba((bg_h + 120) % 360, 80, 0.1) + '" stroke-width="' + rand(1, 3) + 'px" stroke-dasharray="' + rand(0, 20) + '" transform="rotate(' + (i % 2 ? 180 : 0) + " " + w / 2 + " " + h / 2 + ')"/>';
  });

  for (let i = 0; i < total; ++i) {
    const slot = grid_slots[i],
      grid_x = slot % grid_w,
      grid_y = Math.floor(slot / grid_w),
      idx = icon_indices[i],
      [render_fn, raw_svg] = SVGS[idx],
      m_id = "m" + i,
      g_id = "g" + i,
      i_sz = rand(32, 42),
      offset = (cell_size - i_sz) / 2,
      jitter_x = rand(-Math.floor(offset), Math.floor(offset)),
      jitter_y = rand(-Math.floor(offset), Math.floor(offset)),
      x = grid_x * cell_size + offset + jitter_x,
      y = grid_y * cell_size + offset + jitter_y,
      ico_h = (ico_h_base + rand(-20, 20)) % 360;

    if (i < num) {
      positions.push([x, y, i_sz]);
      selected.push(raw_svg);
    }

    // Icons use more vibrant colors (luminance 20-60) for contrast
    defs.push(grad(g_id, ico_h, 20, 60, 1, rand(2, 3)));
    const [mask_str, group_str] = render_fn(x, y, rand(-30, 30), i_sz, rand(-8, 8), rand(-8, 8), (rand(60, 85) / 100).toFixed(2), g_id, m_id);
    defs.push(mask_str);
    // Apply the shadow filter for depth
    rendered.push(group_str.replace('<g transform=', '<g filter="url(#f)" transform='));
  }

  return [
    '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + " " + h + '" xmlns="http://www.w3.org/2000/svg" style="border:none"><defs>' + defs.join("") + "</defs>" + bg_body + rendered.join("") + "</svg>",
    selected,
    positions,
  ];
};

import SVGS from "./SVG.js";
import PATTERNS from "./PATTERNS.js";

const randNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  PALETTES = [
    [200, 280], // 冷色调 (蓝紫)
    [0, 60],    // 暖色调 (红橙)
    [150, 210], // 自然 (绿青)
    [280, 340], // 糖果 (粉红)
    [40, 90]    // 大地 (金褐)
  ],
  /**
   * 生成渐变定义
   * @param {string} id - 渐变 ID
   * @param {number} h - 起始色相
   * @param {number} l_min - 最小亮度
   * @param {number} l_max - 最大亮度
   * @param {number} op - 透明度
   * @param {number} seg - 分段数量 (0-1 为平滑渐变，>=2 为硬边界分段)
   */
  gradDef = (id, h, l_min, l_max, op = 1, seg = 0) => {
    const s = randNum(75, 95);
    let stops = "";
    if (seg < 2) {
      // 平滑渐变，带有细微的色相偏移
      [0, 0.5, 1].forEach((v, i) => {
        const hh = (h + i * 15) % 360,
          ll = l_min + (l_max - l_min) * v;
        stops += '<stop offset="' + (v * 100) + '%" stop-color="hsl(' + hh + "," + s + "%," + ll + '%)" stop-opacity="' + op + '"/>';
      });
    } else {
      // 艺术分段：交替明暗或色相偏移
      for (let i = 0; i < seg; ++i) {
        const hh = (h + i * (360 / seg) * 0.2) % 360,
          ll = i % 2 === 0 ? randNum(l_min, l_min + 15) : randNum(l_max - 15, l_max),
          c = "hsl(" + hh + "," + s + "%," + ll + "%)";
        stops += '<stop offset="' + ((i * 100) / seg) + '%" stop-color="' + c + '" stop-opacity="' + op + '"/><stop offset="' + (((i + 1) * 100) / seg) + '%" stop-color="' + c + '" stop-opacity="' + op + '"/>';
      }
    }
    const angle = randNum(0, 360),
      x1 = Math.round(50 + 50 * Math.cos((angle * Math.PI) / 180)),
      y1 = Math.round(50 + 50 * Math.sin((angle * Math.PI) / 180));
    return '<linearGradient id="' + id + '" x1="' + x1 + '%" y1="' + y1 + '%" x2="' + (100 - x1) + '%" y2="' + (100 - y1) + '%">' + stops + "</linearGradient>";
  },
  hslaColor = (h, l, op) => "hsla(" + h + "," + randNum(60, 90) + "%," + l + "%," + op + ")",
  shuffleArr = (arr) => {
    for (let i = arr.length - 1; i > 0; --i) {
      const j = randNum(0, i);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },
  ctrlPoints = (k) => {
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
  wavePath = (points, w, h) => {
    const x = points.map((p) => p.x),
      y = points.map((p) => p.y),
      [p1_x, p2_x] = ctrlPoints(x),
      [p1_y, p2_y] = ctrlPoints(y);
    let d = "M 0," + h + " C 0," + h + " " + x[0] + "," + y[0] + " " + x[0] + "," + y[0];
    for (let i = 0; i < x.length - 1; ++i) {
      d += " C " + p1_x[i].toFixed(1) + "," + p1_y[i].toFixed(1) + " " + p2_x[i].toFixed(1) + "," + p2_y[i].toFixed(1) + " " + x[i + 1] + "," + y[i + 1];
    }
    return d + " C " + x[x.length - 1] + "," + y[y.length - 1] + " " + w + "," + h + " " + w + "," + h + " Z";
  },
  /**
   * 生成 3D 复合滤镜定义
   */
  filterDef = (id) => {
    const blur_val = (randNum(10, 15) / 10).toFixed(1),
      off_x = (randNum(10, 15) / 10).toFixed(1),
      off_y = (randNum(12, 18) / 10).toFixed(1),
      inner_blur = (randNum(12, 18) / 10).toFixed(1),
      inner_op = (randNum(35, 50) / 100).toFixed(2);
    return '<filter id="' + id + '" x="-20%" y="-20%" width="140%" height="140%">' +
      '<feGaussianBlur in="SourceAlpha" stdDeviation="' + blur_val + '" result="blur"/>' +
      '<feOffset dx="' + off_x + '" dy="' + off_y + '" result="offsetBlur"/>' +
      '<feFlood flood-color="#000" flood-opacity="0.25" result="dropColor"/>' +
      '<feComposite in="dropColor" in2="offsetBlur" operator="in" result="dropShadow"/>' +
      '<feGaussianBlur in="SourceAlpha" stdDeviation="' + inner_blur + '" result="innerBlur"/>' +
      '<feOffset dx="-1" dy="-1" result="offsetInner"/>' +
      '<feComposite in="SourceAlpha" in2="offsetInner" operator="out" result="innerMask"/>' +
      '<feFlood flood-color="#000" flood-opacity="' + inner_op + '" result="innerColor"/>' +
      '<feComposite in="innerColor" in2="innerMask" operator="in" result="innerShadow"/>' +
      '<feOffset dx="0.6" dy="0.6" result="offsetGlow"/>' +
      '<feComposite in="SourceAlpha" in2="offsetGlow" operator="out" result="glowMask"/>' +
      '<feFlood flood-color="#fff" flood-opacity="0.25" result="glowColor"/>' +
      '<feComposite in="glowColor" in2="glowMask" operator="in" result="highlight"/>' +
      '<feMerge><feMergeNode in="dropShadow"/><feMergeNode in="SourceGraphic"/><feMergeNode in="innerShadow"/><feMergeNode in="highlight"/></feMerge></filter>';
  };

/**
 * 生成点击验证码
 * @param {number} w - 画布宽度
 * @param {number} h - 画布高度
 * @param {number} num - 目标图标数量
 */
export default (w = 300, h = 300, num = 3) => {
  const cell_size = 50,
    grid_width = Math.floor(w / cell_size),
    grid_height = Math.floor(h / cell_size),
    total_count = num + randNum(1, 4),
    grid_slots = shuffleArr(Array.from({ length: grid_width * grid_height }, (_, i) => i)).slice(0, total_count),
    icon_indices = shuffleArr(Array.from({ length: SVGS.length }, (_, i) => i)).slice(0, total_count),
    
    // 为整个验证码选择统一色调
    palette = PALETTES[randNum(0, PALETTES.length - 1)],
    bg_hue = randNum(palette[0], palette[1]),
    icon_hue_base = (bg_hue + 180) % 360,

    positions = [],
    selected_icons = [],
    rendered_groups = [],
    def_nodes = [],
    [p_size, path_d] = PATTERNS[randNum(0, PATTERNS.length - 1)];

  def_nodes.push(
    gradDef("bg0", bg_hue, 92, 98), // 极浅背景
    gradDef("bg1", (bg_hue + 30) % 360, 85, 94),
    gradDef("bg2", (bg_hue + 60) % 360, 70, 90),
    '<pattern id="p" patternTransform="scale(0.8) rotate(' + randNum(0, 360) + ')" width="' + p_size + '" height="' + p_size + '" patternUnits="userSpaceOnUse"><path fill="url(#bg2)" d="' + path_d + '"/></pattern>'
  );

  const layer_count = 4, waves = [];
  for (let l = 0; l < layer_count; ++l) {
    const points = [{ x: 0, y: (h / (layer_count + 1)) * (l + 1) }],
      seg_count = randNum(5, 10),
      seg_width = w / seg_count;
    for (let s = 1; s < seg_count; ++s) {
      points.push({
        x: Math.round(s * seg_width + randNum(-seg_width * 0.2, seg_width * 0.2)),
        y: Math.round((h / (layer_count + 1)) * (l + 1) + randNum(-20, 20)),
      });
    }
    points.push({ x: w, y: (h / (layer_count + 1)) * (l + 1) });
    waves.push(wavePath(points, w, h));
  }

  let bg_body = '<rect width="' + w + '" height="' + h + '" fill="url(#bg0)" stroke="none"/><rect width="' + w + '" height="' + h + '" fill="url(#p)" fill-opacity="0.12" stroke="none"/>';
  shuffleArr(waves).forEach((d, i) => {
    bg_body += '<path d="' + d + '" fill="url(#bg1)" fill-opacity="' + (0.15 + i * 0.1).toFixed(2) + '" stroke="' + hslaColor((bg_hue + 120) % 360, 80, 0.1) + '" stroke-width="' + randNum(1, 3) + 'px" stroke-dasharray="' + randNum(0, 20) + '" transform="rotate(' + (i % 2 ? 180 : 0) + " " + w / 2 + " " + h / 2 + ')"/>';
  });

  for (let i = 0; i < total_count; ++i) {
    const slot_idx = grid_slots[i],
      grid_x = slot_idx % grid_width,
      grid_y = Math.floor(slot_idx / grid_width),
      icon_idx = icon_indices[i],
      [render_fn, raw_svg] = SVGS[icon_idx],
      mask_id = "m" + i,
      grad_id = "g" + i,
      filter_id = "f" + i,
      icon_size = randNum(32, 42),
      offset_val = (cell_size - icon_size) / 2,
      jitter_x = randNum(-Math.floor(offset_val), Math.floor(offset_val)),
      jitter_y = randNum(-Math.floor(offset_val), Math.floor(offset_val)),
      pos_x = grid_x * cell_size + offset_val + jitter_x,
      pos_y = grid_y * cell_size + offset_val + jitter_y,
      icon_hue = (icon_hue_base + randNum(-30, 30)) % 360;

    if (i < num) {
      positions.push([pos_x, pos_y, icon_size]);
      selected_icons.push(raw_svg);
    }

    // 每个图标使用独立的随机滤镜和渐变
    def_nodes.push(filterDef(filter_id), gradDef(grad_id, icon_hue, 20, 60, 1, randNum(2, 3)));
    const [mask_str, group_str] = render_fn(pos_x, pos_y, randNum(-30, 30), icon_size, randNum(-8, 8), randNum(-8, 8), (randNum(60, 85) / 100).toFixed(2), grad_id, mask_id);
    def_nodes.push(mask_str);
    // 应用唯一的 3D 滤镜
    rendered_groups.push(group_str.replace('<g transform=', '<g filter="url(#' + filter_id + ')" transform='));
  }

  return [
    '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + " " + h + '" xmlns="http://www.w3.org/2000/svg" style="border:none"><defs>' + def_nodes.join("") + "</defs>" + bg_body + rendered_groups.join("") + "</svg>",
    selected_icons,
    positions,
  ];
};

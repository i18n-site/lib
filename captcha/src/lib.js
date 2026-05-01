import SVGS from "./SVG.js";
import PATTERNS from "./PATTERNS.js";

const randNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  normalizeHue = (h) => (h < 0 ? (h % 360) + 360 : h % 360),
  /**
   * 生成色调方案
   */
  getPalette = () => {
    const h = randNum(0, 360),
      s = randNum(60, 90),
      l = randNum(40, 60),
      modes = [
        [0], // Monochromatic
        [180], // Complementary
        [-30, 30], // Analogous
        [120, 240], // Triadic
        [150, 210], // Split-Complementary
      ],
      offsets = modes[randNum(0, modes.length - 1)];
    return [h, ...offsets.map((o) => normalizeHue(h + o))].map((hue) => ({
      h: hue,
      s,
      l,
    }));
  },
  /**
   * 生成渐变定义
   */
  gradDef = (id, h, l_min, l_max, op = 1, seg = 0) => {
    const s = randNum(75, 95);
    let stops = "";
    if (seg < 2) {
      [0, 0.5, 1].forEach((v, i) => {
        const hh = normalizeHue(h + i * 15),
          ll = l_min + (l_max - l_min) * v;
        stops += `<stop offset="${v * 100}%" stop-color="hsl(${hh},${s}%,${ll}%)" stop-opacity="${op}"/>`;
      });
    } else {
      for (let i = 0; i < seg; ++i) {
        const hh = normalizeHue(h + i * (360 / seg) * 0.2),
          ll = i % 2 === 0 ? randNum(l_min, l_min + 15) : randNum(l_max - 15, l_max),
          c = `hsl(${hh},${s}%,${ll}%)`;
        stops += `<stop offset="${(i * 100) / seg}%" stop-color="${c}" stop-opacity="${op}"/><stop offset="${((i + 1) * 100) / seg}%" stop-color="${c}" stop-opacity="${op}"/>`;
      }
    }
    const angle = randNum(0, 360),
      x1 = Math.round(50 + 50 * Math.cos((angle * Math.PI) / 180)),
      y1 = Math.round(50 + 50 * Math.sin((angle * Math.PI) / 180));
    return `<linearGradient id="${id}" x1="${x1}%" y1="${y1}%" x2="${100 - x1}%" y2="${100 - y1}%">${stops}</linearGradient>`;
  },
  hslaColor = (h, l, op) => `hsla(${h},${randNum(60, 90)}%,${l}%,${op})`,
  /**
   * 基础滤镜集合
   */
  filtersDef = () => {
    const seed = randNum(0, 1000);
    return `
<filter id="f_noise" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" seed="${seed}" result="noise"/>
  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
  <feComposite operator="in" in2="SourceGraphic"/>
  <feBlend mode="multiply" in2="SourceGraphic"/>
</filter>
<filter id="f_distort" x="-20%" y="-20%" width="140%" height="140%">
  <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="2" seed="${seed}" result="noise"/>
  <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G"/>
</filter>
<filter id="f_glossy" x="-20%" y="-20%" width="140%" height="140%">
  <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur"/>
  <feSpecularLighting in="blur" surfaceScale="5" specularConstant="1" specularExponent="40" lighting-color="#fff" result="spec">
    <fePointLight x="-50" y="-50" z="200"/>
  </feSpecularLighting>
  <feComposite in="spec" in2="SourceAlpha" operator="in" result="spec"/>
  <feComposite in="SourceGraphic" in2="spec" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
</filter>
<filter id="f_shadow" x="-20%" y="-20%" width="140%" height="140%">
  <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
  <feOffset dx="2" dy="2" result="offsetBlur"/>
  <feFlood flood-color="#000" flood-opacity="0.3" result="color"/>
  <feComposite in="color" in2="offsetBlur" operator="in" result="shadow"/>
  <feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>`;
  },
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
  /**
   * 生成波浪路径 (使用三次贝塞尔曲线)
   */
  wavePath = (points, w, h) => {
    const x = points.map((p) => p.x),
      y = points.map((p) => p.y),
      [p1_x, p2_x] = ctrlPoints(x),
      [p1_y, p2_y] = ctrlPoints(y);
    let d = `M 0,${h} C 0,${h} ${x[0]},${y[0]} ${x[0]},${y[0]}`;
    for (let i = 0; i < x.length - 1; ++i) {
      d += ` C ${p1_x[i].toFixed(1)},${p1_y[i].toFixed(1)} ${p2_x[i].toFixed(1)},${p2_y[i].toFixed(1)} ${x[i + 1]},${y[i + 1]}`;
    }
    return d + ` C ${x[x.length - 1]},${y[y.length - 1]} ${w},${h} ${w},${h} Z`;
  };

/**
 * 生成点击验证码
 */
export default (w = 300, h = 300, num = 3) => {
  const palette = getPalette(),
    is_dark_bg = randNum(0, 1) === 1,
    bg_color = palette[0],
    icon_palette = palette.length > 1 ? palette.slice(1) : [bg_color],
    
    bg_l = is_dark_bg ? [20, 40] : [85, 95],
    icon_l = is_dark_bg ? [70, 90] : [15, 35],

    cell_size = 50,
    grid_w = Math.floor(w / cell_size),
    grid_h = Math.floor(h / cell_size),
    total_count = num + randNum(1, 3),
    slots = shuffleArr(Array.from({ length: grid_w * grid_h }, (_, i) => i)).slice(0, total_count),
    icon_indices = shuffleArr(Array.from({ length: SVGS.length }, (_, i) => i)).slice(0, total_count),

    positions = [],
    selected_icons = [],
    rendered_groups = [],
    def_nodes = [filtersDef()],
    [p_size, path_d] = PATTERNS[randNum(0, PATTERNS.length - 1)];

  // 背景渐变
  def_nodes.push(
    gradDef("bg0", bg_color.h, bg_l[1] - 5, bg_l[1]),
    gradDef("bg1", normalizeHue(bg_color.h + 20), bg_l[0], bg_l[0] + 15),
    gradDef("bg2", normalizeHue(bg_color.h - 20), bg_l[0], bg_l[0] + 10),
    `<pattern id="p" patternTransform="scale(0.8) rotate(${randNum(0, 360)})" width="${p_size}" height="${p_size}" patternUnits="userSpaceOnUse"><path fill="url(#bg2)" d="${path_d}"/></pattern>`
  );

  // 波浪图层
  const layer_count = 3, waves = [];
  for (let l = 0; l < layer_count; ++l) {
    const points = [{ x: 0, y: (h / (layer_count + 1)) * (l + 1) }],
      seg_count = randNum(4, 8),
      seg_w = w / seg_count;
    for (let s = 1; s < seg_count; ++s) {
      points.push({
        x: Math.round(s * seg_w + randNum(-seg_w * 0.3, seg_w * 0.3)),
        y: Math.round((h / (layer_count + 1)) * (l + 1) + randNum(-30, 30)),
      });
    }
    points.push({ x: w, y: (h / (layer_count + 1)) * (l + 1) });
    waves.push(wavePath(points, w, h));
  }

  let bg_body = `<rect width="${w}" height="${h}" fill="url(#bg0)" stroke="none"/><rect width="${w}" height="${h}" fill="url(#p)" fill-opacity="${is_dark_bg ? 0.2 : 0.1}" stroke="none"/>`;
  
  waves.forEach((d, i) => {
    bg_body += `<path d="${d}" filter="url(#f_distort)" fill="url(#bg1)" fill-opacity="${0.2 + i * 0.1}" stroke="${hslaColor(bg_color.h, is_dark_bg ? 40 : 70, 0.2)}" stroke-width="${randNum(1, 2)}" transform="rotate(${i % 2 ? 180 : 0} ${w / 2} ${h / 2})"/>`;
  });

  // 渲染图标
  for (let i = 0; i < total_count; ++i) {
    const slot = slots[i],
      gx = slot % grid_w,
      gy = Math.floor(slot / grid_w),
      icon_idx = icon_indices[i],
      [render_fn, raw_svg] = SVGS[icon_idx],
      
      icon_size = randNum(34, 44),
      padding = (cell_size - icon_size) / 2,
      jx = randNum(-Math.floor(padding + 5), Math.floor(padding + 5)),
      jy = randNum(-Math.floor(padding + 5), Math.floor(padding + 5)),
      px = gx * cell_size + padding + jx,
      py = gy * cell_size + padding + jy,
      
      color_obj = icon_palette[i % icon_palette.length],
      grad_id = `g${i}`,
      mask_id = `m${i}`,
      filter_type = i < num ? (randNum(0, 1) ? "f_glossy" : "f_shadow") : "f_shadow";

    if (i < num) {
      positions.push([px, py, icon_size]);
      selected_icons.push(raw_svg);
    }

    def_nodes.push(gradDef(grad_id, normalizeHue(color_obj.h + randNum(-15, 15)), icon_l[0], icon_l[1], 1, randNum(0, 3)));
    const [mask_str, group_str] = render_fn(px, py, randNum(-45, 45), icon_size, randNum(-10, 10), randNum(-10, 10), (randNum(70, 95) / 100).toFixed(2), grad_id, mask_id);
    def_nodes.push(mask_str);
    
    rendered_groups.push(group_str.replace("<g transform=", `<g filter="url(#${filter_type}) url(#f_distort)" transform=`));
  }

  const final_svg = `
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>${def_nodes.join("")}</defs>
  <g filter="url(#f_noise)">
    ${bg_body}
    ${rendered_groups.join("")}
  </g>
</svg>`;

  return [final_svg, selected_icons, positions];
};

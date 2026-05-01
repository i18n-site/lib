import SVGS from "./SVG.js";
import PATTERNS from "./PATTERNS.js";

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  hueNorm = (h) => (h < 0 ? (h % 360) + 360 : h % 360),
  palette = () => {
    const h = rand(0, 360),
      s = rand(60, 90),
      l = rand(40, 60),
      modes = [
        [0],
        [180],
        [-30, 30],
        [120, 240],
        [150, 210],
      ],
      offsets = modes[rand(0, modes.length - 1)];
    return [h, ...offsets.map((o) => hueNorm(h + o))].map((hue) => [hue, s, l]);
  },
  grad = (id, h, l_min, l_max, op = 1, seg = 0) => {
    const s = rand(75, 95);
    let stops = "";
    if (seg < 2) {
      [0, 0.5, 1].forEach((v, i) => {
        const hh = hueNorm(h + i * 15),
          ll = l_min + (l_max - l_min) * v;
        stops += '<stop offset="' + (v * 100) + '%" stop-color="hsl(' + hh + ',' + s + '%,' + ll + '%)" stop-opacity="' + op + '"/>';
      });
    } else {
      for (let i = 0; i < seg; ++i) {
        const hh = hueNorm(h + i * (360 / seg) * 0.2),
          ll = i % 2 === 0 ? rand(l_min, l_min + 15) : rand(l_max - 15, l_max),
          c = "hsl(" + hh + "," + s + "%," + ll + "%)";
        stops += '<stop offset="' + ((i * 100) / seg) + '%" stop-color="' + c + '" stop-opacity="' + op + '"/><stop offset="' + (((i + 1) * 100) / seg) + '%" stop-color="' + c + '" stop-opacity="' + op + '"/>';
      }
    }
    const angle = rand(0, 360),
      rad = (angle * Math.PI) / 180,
      x1 = Math.round(50 + 50 * Math.cos(rad)),
      y1 = Math.round(50 + 50 * Math.sin(rad));
    return '<linearGradient id="' + id + '" x1="' + x1 + '%" y1="' + y1 + '%" x2="' + (100 - x1) + '%" y2="' + (100 - y1) + '%">' + stops + '</linearGradient>';
  },
  hsla = (h, l, op) => "hsla(" + h + "," + rand(60, 90) + "%," + l + "%," + op + ")",
  filters = () => {
    const seed = rand(0, 1000);
    return '\n<filter id="f_noise" x="0" y="0" width="100%" height="100%">\n  <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" seed="' + seed + '" result="noise"/>\n  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>\n  <feComposite operator="in" in2="SourceGraphic"/>\n  <feBlend mode="multiply" in2="SourceGraphic"/>\n</filter>\n<filter id="f_distort" x="-20%" y="-20%" width="140%" height="140%">\n  <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="2" seed="' + seed + '" result="noise"/>\n  <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G"/>\n</filter>\n<filter id="f_glossy" x="-20%" y="-20%" width="140%" height="140%">\n  <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur"/>\n  <feSpecularLighting in="blur" surfaceScale="5" specularConstant="1" specularExponent="40" lighting-color="#fff" result="spec">\n    <fePointLight x="-50" y="-50" z="200"/>\n  </feSpecularLighting>\n  <feComposite in="spec" in2="SourceAlpha" operator="in" result="spec"/>\n  <feComposite in="SourceGraphic" in2="spec" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>\n</filter>\n<filter id="f_shadow" x="-20%" y="-20%" width="140%" height="140%">\n  <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>\n  <feOffset dx="2" dy="2" result="offsetBlur"/>\n  <feFlood flood-color="#000" flood-opacity="0.3" result="color"/>\n  <feComposite in="color" in2="offsetBlur" operator="in" result="shadow"/>\n  <feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>\n</filter>';
  },
  shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; --i) {
      const j = rand(0, i);
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
  };

export default (w = 300, h = 300, num = 3) => {
  const palette_data = palette(),
    is_dark = rand(0, 1) === 1,
    bg_color = palette_data[0],
    icon_palette = palette_data.length > 1 ? palette_data.slice(1) : [bg_color],
    bg_l = is_dark ? [20, 40] : [85, 95],
    icon_l = is_dark ? [70, 90] : [15, 35],
    cell_size = 50,
    grid_w = Math.floor(w / cell_size),
    grid_h = Math.floor(h / cell_size),
    total_count = num + rand(1, 3),
    slots = shuffle(Array.from({ length: grid_w * grid_h }, (_, i) => i)).slice(0, total_count),
    icon_idxs = shuffle(Array.from({ length: SVGS.length }, (_, i) => i)).slice(0, total_count),
    positions = [],
    selected_icons = [],
    rendered_groups = [],
    def_nodes = [filters()],
    [p_size, path_d] = PATTERNS[rand(0, PATTERNS.length - 1)];

  def_nodes.push(
    grad("bg0", bg_color[0], bg_l[1] - 5, bg_l[1]),
    grad("bg1", hueNorm(bg_color[0] + 20), bg_l[0], bg_l[0] + 15),
    grad("bg2", hueNorm(bg_color[0] - 20), bg_l[0], bg_l[0] + 10),
    '<pattern id="p" patternTransform="scale(0.8) rotate(' + rand(0, 360) + ')" width="' + p_size + '" height="' + p_size + '" patternUnits="userSpaceOnUse"><path fill="url(#bg2)" d="' + path_d + '"/></pattern>'
  );

  const layer_count = 3,
    waves = [];
  for (let l = 0; l < layer_count; ++l) {
    const y_base = (h / (layer_count + 1)) * (l + 1),
      points = [{ x: 0, y: y_base }],
      seg_count = rand(4, 8),
      seg_w = w / seg_count;
    for (let s = 1; s < seg_count; ++s) {
      points.push({
        x: Math.round(s * seg_w + rand(-seg_w * 0.3, seg_w * 0.3)),
        y: Math.round(y_base + rand(-30, 30)),
      });
    }
    points.push({ x: w, y: y_base });
    waves.push(wavePath(points, w, h));
  }

  let bg_body = '<rect width="' + w + '" height="' + h + '" fill="url(#bg0)" stroke="none"/><rect width="' + w + '" height="' + h + '" fill="url(#p)" fill-opacity="' + (is_dark ? 0.2 : 0.1) + '" stroke="none"/>';
  waves.forEach((d, i) => {
    bg_body += '<path d="' + d + '" filter="url(#f_distort)" fill="url(#bg1)" fill-opacity="' + (0.2 + i * 0.1) + '" stroke="' + hsla(bg_color[0], is_dark ? 40 : 70, 0.2) + '" stroke-width="' + rand(1, 2) + '" transform="rotate(' + (i % 2 ? 180 : 0) + ' ' + (w / 2) + ' ' + (h / 2) + ')"/>';
  });

  for (let i = 0; i < total_count; ++i) {
    const slot = slots[i],
      gx = slot % grid_w,
      gy = Math.floor(slot / grid_w),
      icon_idx = icon_idxs[i],
      [render_fn, raw_svg] = SVGS[icon_idx],
      icon_sz = rand(34, 44),
      pad = (cell_size - icon_sz) / 2,
      jx = rand(-Math.floor(pad + 5), Math.floor(pad + 5)),
      jy = rand(-Math.floor(pad + 5), Math.floor(pad + 5)),
      px = gx * cell_size + pad + jx,
      py = gy * cell_size + pad + jy,
      color = icon_palette[i % icon_palette.length],
      grad_id = "g" + i,
      mask_id = "m" + i,
      filter = i < num ? (rand(0, 1) ? "f_glossy" : "f_shadow") : "f_shadow";

    if (i < num) {
      positions.push([px, py, icon_sz]);
      selected_icons.push(raw_svg);
    }
    def_nodes.push(grad(grad_id, hueNorm(color[0] + rand(-15, 15)), icon_l[0], icon_l[1], 1, rand(0, 3)));
    const [mask_str, group_str] = render_fn(px, py, rand(-45, 45), icon_sz, rand(-10, 10), rand(-10, 10), (rand(70, 95) / 100).toFixed(2), grad_id, mask_id);
    def_nodes.push(mask_str);
    rendered_groups.push(group_str.replace("<g transform=", '<g filter="url(#' + filter + ') url(#f_distort)" transform='));
  }

  return [
    '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg">\n  <defs>' + def_nodes.join("") + '</defs>\n  <g filter="url(#f_noise)">\n    ' + bg_body + "\n    " + rendered_groups.join("") + "\n  </g>\n</svg>",
    selected_icons,
    positions,
  ];
};

import { readFileSync, writeFileSync } from "node:fs";
import { optimize } from "svgo";

const parsePath = (d, _file) => {
    const commands = d.match(/[a-df-z][^a-df-z]*/gi) || [],
      points = [];
    let curr_x = 0,
      curr_y = 0,
      start_x = 0,
      start_y = 0;

    commands.forEach((cmd) => {
      const type = cmd[0],
        args = cmd.slice(1).match(/-?\d*\.?\d+(?:e[+-]?\d+)?/gi)?.map(Number) || [];

      switch (type) {
        case "M":
          curr_x = args[0];
          curr_y = args[1];
          start_x = curr_x;
          start_y = curr_y;
          points.push({ x: curr_x, y: curr_y });
          for (let i = 2; i < args.length; i += 2) {
            curr_x = args[i];
            curr_y = args[i + 1];
            points.push({ x: curr_x, y: curr_y });
          }
          break;
        case "m":
          if (points.length === 0) {
            curr_x = args[0];
            curr_y = args[1];
          } else {
            curr_x += args[0];
            curr_y += args[1];
          }
          start_x = curr_x;
          start_y = curr_y;
          points.push({ x: curr_x, y: curr_y });
          for (let i = 2; i < args.length; i += 2) {
            curr_x += args[i];
            curr_y += args[i + 1];
            points.push({ x: curr_x, y: curr_y });
          }
          break;
        case "L":
          for (let i = 0; i < args.length; i += 2) {
            curr_x = args[i];
            curr_y = args[i + 1];
            points.push({ x: curr_x, y: curr_y });
          }
          break;
        case "l":
          for (let i = 0; i < args.length; i += 2) {
            curr_x += args[i];
            curr_y += args[i + 1];
            points.push({ x: curr_x, y: curr_y });
          }
          break;
        case "H":
          args.forEach((x) => {
            curr_x = x;
            points.push({ x: curr_x, y: curr_y });
          });
          break;
        case "h":
          args.forEach((dx) => {
            curr_x += dx;
            points.push({ x: curr_x, y: curr_y });
          });
          break;
        case "V":
          args.forEach((y) => {
            curr_y = y;
            points.push({ x: curr_x, y: curr_y });
          });
          break;
        case "v":
          args.forEach((dy) => {
            curr_y += dy;
            points.push({ x: curr_x, y: curr_y });
          });
          break;
        case "C":
          for (let i = 0; i < args.length; i += 6) {
            points.push({ x: args[i], y: args[i + 1] });
            points.push({ x: args[i + 2], y: args[i + 3] });
            curr_x = args[i + 4];
            curr_y = args[i + 5];
            points.push({ x: curr_x, y: curr_y });
          }
          break;
        case "c":
          for (let i = 0; i < args.length; i += 6) {
            points.push({ x: curr_x + args[i], y: curr_y + args[i + 1] });
            points.push({ x: curr_x + args[i + 2], y: curr_y + args[i + 3] });
            curr_x += args[i + 4];
            curr_y += args[i + 5];
            points.push({ x: curr_x, y: curr_y });
          }
          break;
        case "S":
        case "Q":
          for (let i = 0; i < args.length; i += 4) {
            points.push({ x: args[i], y: args[i + 1] });
            curr_x = args[i + 2];
            curr_y = args[i + 3];
            points.push({ x: curr_x, y: curr_y });
          }
          break;
        case "s":
        case "q":
          for (let i = 0; i < args.length; i += 4) {
            points.push({ x: curr_x + args[i], y: curr_y + args[i + 1] });
            curr_x += args[i + 2];
            curr_y += args[i + 3];
            points.push({ x: curr_x, y: curr_y });
          }
          break;
        case "A":
          for (let i = 0; i < args.length; i += 7) {
            curr_x = args[i + 5];
            curr_y = args[i + 6];
            points.push({ x: curr_x, y: curr_y });
          }
          break;
        case "a":
          for (let i = 0; i < args.length; i += 7) {
            curr_x += args[i + 5];
            curr_y += args[i + 6];
            points.push({ x: curr_x, y: curr_y });
          }
          break;
        case "Z":
        case "z":
          curr_x = start_x;
          curr_y = start_y;
          break;
      }
    });
    return points;
  },
  PADDING = 16;

export const resize = (path, file) => {
  let data = readFileSync(path, "utf8"),
    clean_data = data;

  while (clean_data.includes('<g transform="translate')) {
    const next = clean_data.replace(
      /<g transform="translate\([^)]+\)\s*scale\([^)]+\)">\s*([\s\S]*?)\s*<\/g>/g,
      "$1"
    );
    if (next === clean_data) break;
    clean_data = next;
  }

  const result = optimize(clean_data, {
    path,
    multipass: true,
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            convertPathData: { applyTransforms: true, makeAbsolute: true },
            convertTransform: true,
            moveGroupAttrsToElems: true,
          },
        },
      },
      "convertShapeToPath",
      "removeDimensions",
    ],
  });

  let optimized = result.data,
    all_points = [];

  const stroke_widths = optimized.match(/stroke-width="([^"]+)"/g);
  let max_stroke = 0;
  if (stroke_widths) {
    max_stroke = Math.max(
      ...stroke_widths.map((s) => {
        const val = Number(s.match(/stroke-width="([^"]+)"/)[1]);
        return isNaN(val) ? 0 : val;
      })
    );
  }

  const d_matches = optimized.match(/d="([^"]+)"/g);
  if (d_matches) {
    d_matches.forEach((m) => {
      const d = m.match(/d="([^"]+)"/)[1];
      all_points.push(...parsePath(d, file));
    });
  }

  const circle_matches = optimized.match(/<circle[^>]+>/g);
  if (circle_matches) {
    circle_matches.forEach((m) => {
      const cx = Number(m.match(/cx="([^"]+)"/)?.[1] || 0),
        cy = Number(m.match(/cy="([^"]+)"/)?.[1] || 0),
        r = Number(m.match(/r="([^"]+)"/)?.[1] || 0);
      all_points.push({ x: cx - r, y: cy - r }, { x: cx + r, y: cy + r });
    });
  }

  if (all_points.length > 0) {
    let min_x = Math.min(...all_points.map((p) => p.x)) - max_stroke / 2,
      max_x = Math.max(...all_points.map((p) => p.x)) + max_stroke / 2,
      min_y = Math.min(...all_points.map((p) => p.y)) - max_stroke / 2,
      max_y = Math.max(...all_points.map((p) => p.y)) + max_stroke / 2;

    const width = max_x - min_x,
      height = max_y - min_y;

    if (width > 0 && height > 0) {
      const target_size = 1024 - PADDING * 2,
        scale = target_size / Math.max(width, height),
        tx = (1024 - width * scale) / 2 - min_x * scale,
        ty = (1024 - height * scale) / 2 - min_y * scale,
        inner_content = optimized
          .replace(/<svg[^>]*>([\s\S]*?)<\/svg>/, "$1")
          .trim(),
        new_svg =
          '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">\n' +
          '  <g transform="translate(' +
          tx.toFixed(3) +
          ", " +
          ty.toFixed(3) +
          ") scale(" +
          scale.toFixed(3) +
          ')">\n' +
          "    " +
          inner_content +
          "\n" +
          "  </g>\n" +
          "</svg>";
      writeFileSync(path, new_svg);
      return true;
    }
  } else {
    const new_svg = optimized.replace(
      /<svg([^>]*)>/,
      '<svg$1 width="1024" height="1024" viewBox="0 0 1024 1024">'
    );
    writeFileSync(path, new_svg);
    return false;
  }
};

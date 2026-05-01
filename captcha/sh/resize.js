import { readFileSync, writeFileSync } from "node:fs";
import { optimize } from "svgo";

const parsePath = (d, _file) => {
  const commands = d.match(/[a-df-z][^a-df-z]*/ig) || [];
  const points = [];
  let currX = 0, currY = 0;
  let startX = 0, startY = 0;

  commands.forEach(cmd => {
    const type = cmd[0];
    const args = cmd.slice(1).match(/-?\d*\.?\d+(?:e[+-]?\d+)?/ig)?.map(Number) || [];
    
    switch (type) {
      case 'M':
        currX = args[0]; currY = args[1];
        startX = currX; startY = currY;
        points.push({x: currX, y: currY});
        for (let i = 2; i < args.length; i += 2) {
          currX = args[i]; currY = args[i+1];
          points.push({x: currX, y: currY});
        }
        break;
      case 'm':
        if (points.length === 0) {
          currX = args[0]; currY = args[1];
        } else {
          currX += args[0]; currY += args[1];
        }
        startX = currX; startY = currY;
        points.push({x: currX, y: currY});
        for (let i = 2; i < args.length; i += 2) {
          currX += args[i]; currY += args[i+1];
          points.push({x: currX, y: currY});
        }
        break;
      case 'L':
        for (let i = 0; i < args.length; i += 2) {
          currX = args[i]; currY = args[i+1];
          points.push({x: currX, y: currY});
        }
        break;
      case 'l':
        for (let i = 0; i < args.length; i += 2) {
          currX += args[i]; currY += args[i+1];
          points.push({x: currX, y: currY});
        }
        break;
      case 'H':
        args.forEach(x => { currX = x; points.push({x: currX, y: currY}); });
        break;
      case 'h':
        args.forEach(dx => { currX += dx; points.push({x: currX, y: currY}); });
        break;
      case 'V':
        args.forEach(y => { currY = y; points.push({x: currX, y: currY}); });
        break;
      case 'v':
        args.forEach(dy => { currY += dy; points.push({x: currX, y: currY}); });
        break;
      case 'C':
        for (let i = 0; i < args.length; i += 6) {
          points.push({x: args[i], y: args[i+1]});
          points.push({x: args[i+2], y: args[i+3]});
          currX = args[i+4]; currY = args[i+5];
          points.push({x: currX, y: currY});
        }
        break;
      case 'c':
        for (let i = 0; i < args.length; i += 6) {
          points.push({x: currX + args[i], y: currY + args[i+1]});
          points.push({x: currX + args[i+2], y: currY + args[i+3]});
          currX += args[i+4]; currY += args[i+5];
          points.push({x: currX, y: currY});
        }
        break;
      case 'S':
      case 'Q':
        for (let i = 0; i < args.length; i += 4) {
          points.push({x: args[i], y: args[i+1]});
          currX = args[i+2]; currY = args[i+3];
          points.push({x: currX, y: currY});
        }
        break;
      case 's':
      case 'q':
        for (let i = 0; i < args.length; i += 4) {
          points.push({x: currX + args[i], y: currY + args[i+1]});
          currX += args[i+2]; currY += args[i+3];
          points.push({x: currX, y: currY});
        }
        break;
      case 'A':
        for (let i = 0; i < args.length; i += 7) {
          currX = args[i+5]; currY = args[i+6];
          points.push({x: currX, y: currY});
        }
        break;
      case 'a':
        for (let i = 0; i < args.length; i += 7) {
          currX += args[i+5]; currY += args[i+6];
          points.push({x: currX, y: currY});
        }
        break;
      case 'Z':
      case 'z':
        currX = startX; currY = startY;
        break;
    }
  });
  return points;
};

const PADDING = 16; // Reduced padding to maximize icon size

export const resize = (path, file) => {
  let data = readFileSync(path, "utf8");

  // Strip previous normalization wrapper if any (recursive-ish)
  let cleanData = data;
  while (cleanData.includes('<g transform="translate')) {
    const next = cleanData.replace(/<g transform="translate\([^)]+\)\s*scale\([^)]+\)">\s*([\s\S]*?)\s*<\/g>/g, '$1');
    if (next === cleanData) break;
    cleanData = next;
  }

  const result = optimize(cleanData, {
    path,
    multipass: true,
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            convertPathData: {
              applyTransforms: true,
              makeAbsolute: true,
            },
            convertTransform: true,
            moveGroupAttrsToElems: true,
          },
        },
      },
      'convertShapeToPath',
      'removeDimensions',
    ],
  });

  let optimized = result.data;

  // Heuristic to find max stroke-width
  const strokeWidths = optimized.match(/stroke-width="([^"]+)"/g);
  let maxStroke = 0;
  if (strokeWidths) {
    maxStroke = Math.max(...strokeWidths.map(s => {
      const val = Number(s.match(/stroke-width="([^"]+)"/)[1]);
      return isNaN(val) ? 0 : val;
    }));
  }

  const dMatches = optimized.match(/d="([^"]+)"/g);
  let allPoints = [];
  if (dMatches) {
    dMatches.forEach(m => {
      const d = m.match(/d="([^"]+)"/)[1];
      allPoints.push(...parsePath(d, file));
    });
  }

  const circleMatches = optimized.match(/<circle[^>]+>/g);
  if (circleMatches) {
    circleMatches.forEach(m => {
      const cx = Number(m.match(/cx="([^"]+)"/)?.[1] || 0);
      const cy = Number(m.match(/cy="([^"]+)"/)?.[1] || 0);
      const r = Number(m.match(/r="([^"]+)"/)?.[1] || 0);
      allPoints.push({x: cx - r, y: cy - r});
      allPoints.push({x: cx + r, y: cy + r});
    });
  }

  if (allPoints.length > 0) {
    let minX = Math.min(...allPoints.map(p => p.x));
    let maxX = Math.max(...allPoints.map(p => p.x));
    let minY = Math.min(...allPoints.map(p => p.y));
    let maxY = Math.max(...allPoints.map(p => p.y));

    // Expand by half stroke width on each side
    minX -= maxStroke / 2;
    maxX += maxStroke / 2;
    minY -= maxStroke / 2;
    maxY += maxStroke / 2;

    const width = maxX - minX;
    const height = maxY - minY;
    
    if (width > 0 && height > 0) {
      const targetSize = 1024 - PADDING * 2;
      const scale = targetSize / Math.max(width, height);
      const tx = (1024 - width * scale) / 2 - minX * scale;
      const ty = (1024 - height * scale) / 2 - minY * scale;
      
      const innerContent = optimized.replace(/<svg[^>]*>([\s\S]*?)<\/svg>/, '$1').trim();
      const newSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <g transform="translate(${tx.toFixed(3)}, ${ty.toFixed(3)}) scale(${scale.toFixed(3)})">
    ${innerContent}
  </g>
</svg>`;
      writeFileSync(path, newSvg);
      return true;
    }
  } else {
    const newSvg = optimized.replace(/<svg([^>]*)>/, '<svg$1 width="1024" height="1024" viewBox="0 0 1024 1024">');
    writeFileSync(path, newSvg);
    return false;
  }
};

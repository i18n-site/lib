import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SVG_DIR = "./svg";

const SMALL_ICONS = {
  "check.svg": { scale: 12, tx: -88, ty: -88 },
  "circle.svg": { scale: 11.5, tx: -63, ty: -63 },
  "diamond.svg": { scale: 12, tx: -102, ty: -102 },
  "star.svg": { scale: 11, tx: -38, ty: -38 },
  "triangle.svg": { scale: 12, tx: -102, ty: -102 },
};

const normalize = (file) => {
  const path = join(SVG_DIR, file);
  let data = readFileSync(path, "utf8");
  
  // Strip previous normalization if any
  data = data.replace(/<g transform="scale\(10\.24\)">\n\s*([\s\S]*?)\n\s*<\/g>/, "$1");
  data = data.replace(/<g transform="translate\([^)]+\) scale\([^)]+\)">\n\s*([\s\S]*?)\n\s*<\/g>/, "$1");

  if (SMALL_ICONS[file]) {
    const { scale, tx, ty } = SMALL_ICONS[file];
    console.log(`Normalizing small icon ${file} with scale ${scale}`);
    data = data.replace(/viewBox="[^"]+"/, 'viewBox="0 0 1024 1024"');
    data = data.replace(/<svg([^>]*)>([\s\S]*?)<\/svg>/, (match, attrs, content) => {
      return `<svg${attrs}>\n  <g transform="translate(${tx}, ${ty}) scale(${scale})">\n    ${content.trim()}\n  </g>\n</svg>`;
    });
    writeFileSync(path, data);
  } else {
    // For large icons, just ensure viewBox is 1024
    if (data.includes('viewBox="0 0 1024 1024"')) return;
    data = data.replace(/viewBox="[^"]+"/, 'viewBox="0 0 1024 1024"');
    writeFileSync(path, data);
  }
};

const files = readdirSync(SVG_DIR).filter(f => f.endsWith(".svg"));
files.forEach(normalize);
console.log("Internal normalization complete.");

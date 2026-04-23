#!/usr/bin/env bun
import gemini from "./gemini.js";
import qwen from "./qwen3Mt.js";
import CODE2QWEN from "./CODE2QWEN.js";
import rank from "./rank.js";
import NAME from "./NAME.js";
import Table from "cli-table3";

const g_map = new Map(gemini.map(([name, code]) => [code, name])),
  q_map = new Map(qwen.map(([zh, en, code]) => [code, [zh, en]])),
  common = [],
  missing_qwen = [],
  missing_gemini = [],
  new_table = () =>
    new Table({
      chars: {
        top: "",
        "top-mid": "",
        "top-left": "",
        "top-right": "",
        bottom: "",
        "bottom-mid": "",
        "bottom-left": "",
        "bottom-right": "",
        left: "",
        "left-mid": "",
        mid: "",
        "mid-mid": "",
        right: "",
        "right-mid": "",
        middle: " ",
      },
      style: { "padding-left": 0, "padding-right": 0 },
    });

const getName = (code, fallback) => {
  const info = NAME.get(code);
  if (info) return info[0]; // 使用 NAME.js 中的中文名
  console.warn(`⚠️ Missing name for code: ${code}`);
  return fallback;
};

const seen_q = new Set();
const seen_g = new Set();

for (const [g_code, g_name] of g_map) {
  let q_code = g_code;
  if (CODE2QWEN[g_code]) {
    q_code = CODE2QWEN[g_code];
  }

  const q_info = q_map.get(q_code);
  if (q_info) {
    const [q_zh, q_en] = q_info;
    const displayName = getName(g_code, g_name.length <= q_zh.length ? g_name : q_zh);
    common.push([g_code, displayName, q_en]);
    seen_g.add(g_code);
    seen_q.add(q_code);
  }
}

for (const [code, name] of g_map) {
  if (!seen_g.has(code)) {
    missing_qwen.push([code, getName(code, name)]);
  }
}

for (const [code, info] of q_map) {
  if (!seen_q.has(code)) {
    const [q_zh, q_en] = info;
    missing_gemini.push([code, getName(code, q_zh), q_en]);
  }
}

common.sort((a, b) => {
  const codeA = a[0].split("/")[0];
  const codeB = b[0].split("/")[0];
  return (rank.get(codeB) || 0) - (rank.get(codeA) || 0);
});

const log = (title, data) => {
  console.log(`\n=== ${title} (${data.length}) ===`);
  const t = new_table();
  t.push(...data);
  console.log(t.toString());
};

log("共同支持", common);
log("Qwen 缺失 (Gemini 有)", missing_qwen);
log("Gemini 缺失 (Qwen 有)", missing_gemini);

const exportData = common.map(([code, zh, en]) => {
  const info = NAME.get(code);
  return [code, en, zh, info ? info[2] : ""];
});
const content = `export default ${JSON.stringify(exportData, null, 2)};\n`;
await Bun.write("common.js", content);
console.log("\nExported common.js");

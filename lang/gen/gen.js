#!/usr/bin/env bun
import gemini from "./gemini.js";
import qwen from "./qwen3Mt.js";
import CODE2QWEN from "./CODE2QWEN.js";
import Table from "cli-table3";

const g_map = new Map(gemini.map(([name, code]) => [code, name])),
  q_map = new Map(qwen.map(([en, zh, code]) => [code, [zh, en]])),
  all_codes = new Set([
    ...g_map.keys(),
    ...q_map.keys(),
    ...Object.values(CODE2QWEN),
  ]),
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

const seen_q = new Set();
const seen_g = new Set();

for (const code of all_codes) {
  let g_code = code,
    q_code = code;

  for (const [g, q] of Object.entries(CODE2QWEN)) {
    if (code === g || code === q) {
      g_code = g;
      q_code = q;
      break;
    }
  }

  const g_name = g_map.get(g_code),
    q_info = q_map.get(q_code);

  if (g_name && q_info) {
    const [q_zh, q_en] = q_info;
    common.push([`${g_code}/${q_code}`, g_name, q_zh, q_en]);
    seen_g.add(g_code);
    seen_q.add(q_code);
  }
}

for (const [code, name] of g_map) {
  if (!seen_g.has(code)) {
    missing_qwen.push([code, name]);
  }
}

for (const [code, info] of q_map) {
  if (!seen_q.has(code)) {
    missing_gemini.push([code, ...info]);
  }
}

const log = (title, data) => {
  console.log(`\n=== ${title} (${data.length}) ===`);
  const t = new_table();
  t.push(...data);
  console.log(t.toString());
};

log("共同支持", common);
log("Qwen 缺失 (Gemini 有)", missing_qwen);
log("Gemini 缺失 (Qwen 有)", missing_gemini);

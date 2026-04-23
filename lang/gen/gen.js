#!/usr/bin/env bun

import gemini from "./gemini.js";
import qwen from "./qwen3Mt.js";
import Table from "cli-table3";

const g_map = new Map(gemini.map(([name, code]) => [code, name])),
  q_map = new Map(qwen.map(([en, zh, code]) => [code, [zh, en]])),
  all_codes = new Set([...g_map.keys(), ...q_map.keys()]),
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

for (const code of all_codes) {
  const g_name = g_map.get(code),
    q_info = q_map.get(code);

  if (g_name && q_info) {
    const [q_zh, q_en] = q_info;
    common.push([code, g_name, q_zh, q_en]);
  } else if (g_name) {
    missing_qwen.push([code, g_name]);
  } else if (q_info) {
    const [q_zh, q_en] = q_info;
    missing_gemini.push([code, q_zh, q_en]);
  }
}

const log = (title, data) => {
  console.log("\n=== " + title + " ===");
  const t = new_table();
  t.push(...data);
  console.log(t.toString());
};

log("共同支持", common);
log("Qwen 缺失 (Gemini 有)", missing_qwen);
log("Gemini 缺失 (Qwen 有)", missing_gemini);

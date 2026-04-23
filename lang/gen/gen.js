#!/usr/bin/env bun
import gemini from "./gemini.js";
import qwen from "./qwen3Mt.js";
import CODE2QWEN from "./CODE2QWEN.js";
import rank from "./rank.js";
import NAME from "./NAME.js";
import Table from "cli-table3";

const
  G_MAP = new Map(gemini.map(([name, code]) => [code, name])),
  Q_MAP = new Map(qwen.map(([zh, en, code]) => [code, [zh, en]])),
  COMMON = [],
  MISSING_QWEN = [],
  MISSING_GEMINI = [],
  seen_q = new Set(),
  seen_g = new Set(),
  tableNew = () => new Table({
    chars: { top: "", "top-mid": "", "top-left": "", "top-right": "", bottom: "", "bottom-mid": "", "bottom-left": "", "bottom-right": "", left: "", "left-mid": "", mid: "", "mid-mid": "", right: "", "right-mid": "", middle: " " },
    style: { "padding-left": 0, "padding-right": 0 }
  }),
  nameByCode = (code, fallback) => {
    const info = NAME.get(code);
    if (info) return info[0];
    console.warn("⚠️ Missing name for code: " + code);
    return fallback;
  };

for (const [g_code, g_name] of G_MAP) {
  const
    q_code = CODE2QWEN[g_code] || g_code,
    q_info = Q_MAP.get(q_code);
  if (q_info) {
    const [q_zh, q_en] = q_info;
    COMMON.push([g_code, nameByCode(g_code, g_name.length <= q_zh.length ? g_name : q_zh), q_en]);
    seen_g.add(g_code);
    seen_q.add(q_code);
  }
}

for (const [code, name] of G_MAP) if (!seen_g.has(code)) MISSING_QWEN.push([code, nameByCode(code, name)]);

for (const [code, info] of Q_MAP) if (!seen_q.has(code)) {
  const [q_zh, q_en] = info;
  MISSING_GEMINI.push([code, nameByCode(code, q_zh), q_en]);
}

COMMON.sort((a, b) => {
  const ca = a[0].split("/")[0], cb = b[0].split("/")[0];
  return (rank.get(cb) || 0) - (rank.get(ca) || 0);
});

const log = (title, data) => {
  console.log("\n=== " + title + " (" + data.length + ") ===");
  const t = tableNew();
  t.push(...data);
  console.log(t.toString());
};

log("共同支持", COMMON);
log("Qwen 缺失 (Gemini 有)", MISSING_QWEN);
log("Gemini 缺失 (Qwen 有)", MISSING_GEMINI);

const
  write = async (path, data) => {
    await Bun.write(path, "export default " + JSON.stringify(data, null, 2) + ";\n");
    console.log("Exported " + path);
  },
  export_data = COMMON.map(([code, zh, en]) => {
    const info = NAME.get(code);
    return [code, en, zh, info ? info[2] : ""];
  });

await write("common.js", export_data);

const
  codes = COMMON.map(i => i[0]),
  zhs = COMMON.map(i => i[1]),
  ens = COMMON.map(i => i[2]),
  names = COMMON.map(i => (NAME.get(i[0]) || [])[2] || "");

await write("../src/CODE.js", codes);
await write("../src/ZH.js", zhs);
await write("../src/EN.js", ens);
await write("../src/NAME.js", names);

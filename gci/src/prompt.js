const MAX_DIFF_LEN = 16000;

export default async (git, diff_text) => {
  let diff = diff_text;
  if (diff.length > MAX_DIFF_LEN) {
    const stat = await git.diff(["--cached", "--stat"]).catch(() => "");
    diff =
      (stat ? stat + "\n\n" : "") +
      diff.slice(0, MAX_DIFF_LEN) +
      "\n...(diff 已截断，剩余 " +
      (diff.length - MAX_DIFF_LEN) +
      " 字符)...";
  }

  const log = await git.log({ maxCount: 10 }).catch(() => null),
    msg_li = log?.all?.map((item) => item.message).filter(Boolean) || [],
    has_cn =
      msg_li.length === 0 || msg_li.some((msg) => /[\u4e00-\u9fa5]/.test(msg)),
    fmt =
      "`<type>: <短描述>`" +
      (has_cn ? "（中文说明，type为英文动词如feat/fix/refactor/chore）" : ""),
    custom_prompt = process.env.GCI_PROMPT;

  if (custom_prompt) {
    return custom_prompt + "\n\n" + diff;
  }

  const log_hint =
    msg_li.length > 0
      ? "\n\n参考本仓库最近提交的格式与风格（严格对齐其写法与用词）：\n" +
        msg_li.map((msg) => "- " + msg).join("\n")
      : "";

  return (
    "作为资深开发者，请根据以下代码改动（git diff）生成一行极简、准确的 git commit message。\n" +
    "要求：\n" +
    "1. 格式遵循 " +
    fmt +
    "\n" +
    "2. 仅返回单行提交信息本身，严禁包含任何多余文字、问候、分析或 Markdown 代码块包裹（不要加 ``` 反引号）\n" +
    log_hint +
    "\n\n代码改动如下：\n" +
    diff
  );
};


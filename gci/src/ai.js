import chat from "cersei_rs";
import { join } from "node:path";
import { homedir } from "node:os";
import { existsSync } from "node:fs";

const llmConfig = async () => {
  const path = join(homedir(), ".config", "OPENAI.js");
  if (existsSync(path)) {
    const config = (await import(path)).default;
    if (Array.isArray(config) && config.length >= 3) {
      return config; // [baseUrl, apiKey, model]
    }
  }
  throw new Error("Unable to locate LLM configuration at " + path + ". The file must export default [ baseUrl, apiKey, model ].");
};

export default async (git, diff_text, dir) => {
  const log = await git.log({ maxCount: 1 }).catch(() => null),
    last_msg = log?.latest?.message,
    has_cn = !last_msg || /[\u4e00-\u9fa5]/.test(last_msg);

  let fmt = "`type: commit msg`";
  if (has_cn) {
    fmt += "`\\n类型: 中文说明`。这里『类型』，是type的中文翻译，不要直接写『类型』";
  }

  const [baseUrl, apiKey, model] = await llmConfig();
  const agent = chat(baseUrl, apiKey, model);

  const prompt_text = (process.env.GCI_PROMPT ||
    "根据以下代码改动，生成一句话的git提交消息，格式如" +
      fmt +
      "。不要返回其他多余的说明，仅返回提交消息即可。") +
    "\n\n" +
    diff_text;

  const reply = await agent(prompt_text, dir);

  return reply.replace(/^`+|`+$/g, "").trim();
};

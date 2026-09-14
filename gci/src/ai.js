import chat from "cersei_rs";
import { join } from "node:path";
import { homedir } from "node:os";
import { existsSync } from "node:fs";
import authRead from "./cline/auth.js";
import modelLi from "./cline/modelLi.js";
import clineChat from "./cline/chat.js";

const confLoad = async () => {
  const path = join(homedir(), ".config", "OPENAI.js");
  if (existsSync(path)) {
    const config = (await import(path)).default;
    if (Array.isArray(config) && config.length >= 3) {
      return config;
    }
  }
  return null;
};

export default async (git, diff_text, dir) => {
  const log = await git.log({ maxCount: 1 }).catch(() => null),
    last_msg = log?.latest?.message,
    has_cn = !last_msg || /[\u4e00-\u9fa5]/.test(last_msg),
    fmt =
      "`type: commit msg`" +
      (has_cn
        ? "`\\n类型: 中文说明`。这里『类型』，是type的中文翻译，不要直接写『类型』"
        : ""),
    prompt_text =
      (process.env.GCI_PROMPT ||
        "根据以下代码改动，生成一句话的git提交消息，格式如" +
          fmt +
          "。不要返回其他多余的说明，仅返回提交消息即可。") +
      "\n\n" +
      diff_text,
    token = await authRead();

  if (token) {
    const model_li = await modelLi(),
      reply = await clineChat(prompt_text, token, model_li);
    if (reply) {
      return reply.replace(/^`+|`+$/g, "").trim();
    }
  }

  const conf = await confLoad();
  if (conf) {
    const [base_url, api_key, model] = conf,
      agent = chat(base_url, api_key, model),
      reply = await agent(prompt_text, dir);
    return reply.replace(/^`+|`+$/g, "").trim();
  }

  throw new Error(
    "未检测到可用的 LLM 配置或 Cline 免费模型配额，请检查 Cline 登录或 ~/.config/OPENAI.js",
  );
};

import chat from "cersei_rs";
import { join } from "node:path";
import { homedir } from "node:os";
import { existsSync } from "node:fs";
import authRead from "./cline/auth.js";
import modelLi from "./cline/modelLi.js";
import clineChat from "./cline/chat.js";
import promptMake from "./prompt.js";

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
  const prompt_text = await promptMake(git, diff_text),
    token = await authRead();

  if (token) {
    const model_li = await modelLi(),
      reply = await clineChat(prompt_text, token, model_li);
    if (reply) {
      return reply;
    }
  }

  const conf = await confLoad();
  if (conf) {
    const [base_url, api_key, model] = conf,
      agent = chat(base_url, api_key, model),
      reply = await agent(prompt_text, dir);
    if (reply) {
      return reply.replace(/^`+|`+$/g, "").trim();
    }
  }

  throw new Error("AI 生成未返回有效提交信息");
};

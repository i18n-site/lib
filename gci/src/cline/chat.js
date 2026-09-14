import _req from "@3-/req/_req.js";
import headerMake from "./header.js";
import authRead from "./auth.js";
import msgClean from "../msgClean.js";

const TIMEOUT = 20000,
  API_URL = "https://api.cline.bot/api/v1/chat/completions",
  postChat = (model, headers, prompt_text) =>
    _req(API_URL, {
      headers,
      body: {
        model,
        messages: [{ role: "user", content: prompt_text }],
      },
      timeout: TIMEOUT,
    });

export default async (prompt_text, token, model_li) => {
  let cur_token = token,
    headers = headerMake(cur_token);

  for (const model of model_li) {
    let res = await postChat(model, headers, prompt_text).catch((err) => err);

    if (res?.status === 401) {
      const next_token = await authRead(true);
      if (next_token && next_token !== cur_token) {
        cur_token = next_token;
        headers = headerMake(cur_token);
        res = await postChat(model, headers, prompt_text).catch(() => null);
      }
    }

    if (!res || !res.ok) {
      continue;
    }

    const data = await res.json().catch(() => null),
      content =
        data?.data?.choices?.[0]?.message?.content ??
        data?.choices?.[0]?.message?.content;

    if (content && typeof content === "string") {
      return msgClean(content);
    }
  }

  return null;
};



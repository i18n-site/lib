import _req from "@3-/req/_req.js";
import headerMake from "./header.js";

const TIMEOUT = 15000,
  API_URL = "https://api.cline.bot/api/v1/chat/completions";

export default async (prompt_text, token, model_li) => {
  const headers = headerMake(token);

  for (const model of model_li) {
    const res = await _req(API_URL, {
      headers,
      body: {
        model,
        messages: [{ role: "user", content: prompt_text }],
      },
      timeout: TIMEOUT,
    }).catch(() => null);

    if (!res) {
      continue;
    }

    const data = await res.json().catch(() => null),
      content =
        data?.data?.choices?.[0]?.message?.content ??
        data?.choices?.[0]?.message?.content;

    if (content && typeof content === "string") {
      return content.replace(/^`+|`+$/g, "").trim();
    }
  }

  return null;
};

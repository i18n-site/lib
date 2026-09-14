import headerMake from "./header.js";

const TIMEOUT_MS = 15000,
  API_URL = "https://api.cline.bot/api/v1/chat/completions";

export default async (prompt_text, token, model_li) => {
  const headers = headerMake(token);

  for (const model of model_li) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt_text }],
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    }).catch(() => null);

    if (!res || !res.ok) {
      continue;
    }

    const data = await res.json().catch(() => null),
      content =
        data?.data?.choices?.[0]?.message?.content ??
        data?.choices?.[0]?.message?.content;

    if (content && typeof content === "string") {
      return content.trim();
    }
  }

  return null;
};

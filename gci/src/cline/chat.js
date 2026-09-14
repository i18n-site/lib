const VERSION = "0.0.82",
  TIMEOUT_MS = 15000,
  API_URL = "https://api.cline.bot/api/v1/chat/completions";

export default async (prompt_text, token, model_li) => {
  const header = {
    Authorization: "Bearer " + token,
    "Content-Type": "application/json",
    "HTTP-Referer": "https://cline.bot",
    "X-Title": "Cline",
    "User-Agent": "Cline/" + VERSION,
    "X-CLIENT-TYPE": "cline-cli",
    "X-CLIENT-VERSION": VERSION,
    "X-PLATFORM": process.platform,
    "X-CORE-VERSION": VERSION,
  };

  for (const model of model_li) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: header,
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

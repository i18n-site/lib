const URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
  HEADERS = { "Content-Type": "application/json" };

export default (token) => {
  const headers = { ...HEADERS, Authorization: "Bearer " + token };
  return async (from_lang, to_lang, txt) => {
    const response = await fetch(URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: "qwen-mt-flash",
          messages: [{ role: "user", content: txt }],
          translation_options: {
            source_lang: from_lang || "auto",
            target_lang: to_lang,
          },
        }),
      }),
      { choices } = await response.json();

    return choices?.[0]?.message?.content;
  };
};

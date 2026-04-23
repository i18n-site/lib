export default (token, model = "qwen-mt-flash") =>
  async (from_lang, to_lang, txt) => {
    const response = await fetch(
      "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: txt }],
          translation_options: {
            source_lang: from_lang || "auto",
            target_lang: to_lang,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content;
  };

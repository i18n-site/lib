import CODE_QWEN from "@3-/lang/code/QWEN.js";

const URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
  HEADERS = { "Content-Type": "application/json" },
  AUTO = "auto";

export default (token, model = "qwen-mt-flash") => {
  const headers = { ...HEADERS, Authorization: "Bearer " + token };
  return async (from_lang, to_lang, txt) => {
    from_lang = CODE_QWEN[from_lang] || from_lang || AUTO;
    to_lang = CODE_QWEN[to_lang] || to_lang;

    const response = await fetch(URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: txt }],
          translation_options: {
            source_lang: from_lang,
            target_lang: to_lang,
          },
        }),
      }),
      { choices } = await response.json();

    return choices?.[0]?.message?.content;
  };
};

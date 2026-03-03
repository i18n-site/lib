import merge from "@3-/u8/u8merge.js";
import utf8d from "@3-/utf8/utf8d.js";

export default (token) => {
  const Authorization = `Bearer ${token}`;
  return async (img, text = "把这张图里所有文字原样输出，保留段落。") => {
    const res = await fetch("https://api.gitcode.com/api/v5/chat/completions", {
      method: "POST",
      headers: {
        Authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${img.toString("base64")}`,
                },
              },
              { type: "text", text },
            ],
          },
        ],
        model: "tencent_hunyuan/HunyuanOCR",
        stream: true,
        max_tokens: 1024,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        frequency_penalty: 0,
      }),
    });

    if (res.status != 200) {
      throw new Error(await res.text());
    }

    let raw = [];
    for await (const chunk of res.body) {
      raw.push(chunk);
    }

    let txt = "";

    for (let line of utf8d(merge(...raw)).split("\n")) {
      const begin = line.slice(0, 5);
      if (begin != "data:") continue;
      line = line.slice(5);
      if (line.startsWith("[DONE]")) continue;
      const json = JSON.parse(line),
        delta = json?.choices?.[0]?.delta;
      if (delta?.content) {
        txt += delta.content;
      }
    }

    raw = [];

    for (let line of txt.split("\n")) {
      line = line.trimEnd();
      if (!line) continue;
      raw.push(line);
    }

    return raw.join("\n");
  };
};

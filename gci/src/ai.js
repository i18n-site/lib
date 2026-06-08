import { createOpencode } from "@opencode-ai/sdk";
import { gray } from "@3-/log/GRAY.js";
import { green } from "@3-/log/GREEN.js";

const aiInit = async (title) => {
  const { client, server } = await createOpencode(),
    {
      data: { id: session_id },
    } = await client.session.create({ body: { title } }),
    run = async (prompt_text) => {
      const res = await client.session.prompt({
        path: { id: session_id },
        body: {
          parts: [{ type: "text", text: prompt_text }],
        },
      });
      if (res.data?.info?.error) {
        throw new Error(JSON.stringify(res.data.info.error));
      }
      const parts = res.data?.parts;
      if (parts && parts.length > 0) {
        const reasoning = parts
            .filter((p) => p.type === "reasoning")
            .map((p) => p.text)
            .join(""),
          reply = parts
            .filter((p) => p.type === "text")
            .map((p) => p.text)
            .join("");
        if (reasoning) {
          console.log(gray("\n💡 " + reasoning));
        }
        console.log(green("\n← " + reply));
        return reply;
      }
      return "";
    };

  run[Symbol.asyncDispose] = () => {
    server.close();
  };
  return run;
};

export default async (diff_text) => {
  await using ai = await aiInit("gci-commit");
  return (
    await ai(
      (process.env.GCI_PROMPT ||
        "根据以下代码改动，生成一句话的git提交消息，格式如`type: 英文说明\n类型: 中文说明`。这里『类型』，是type的中文翻译，不要直接写『类型』。不要返回其他多余的说明，仅返回提交消息即可。") +
        "\n\n" +
        diff_text,
    )
  )
    ?.replace(/^`+|`+$/g, "")
    .trim();
};

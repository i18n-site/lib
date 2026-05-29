import { createOpencode } from '@opencode-ai/sdk';

const aiInit = async (title) => {
  const { client, server } = await createOpencode(),
    { data: { id: session_id } } = await client.session.create({ body: { title } }),
    run = async (prompt_text) => {
      const res = await client.session.prompt({
        path: { id: session_id },
        body: {
          parts: [{ type: "text", text: prompt_text }],
        },
      });
      const parts = res.data?.parts;
      if (parts) {
        const reasoning = parts.filter((p) => p.type === "reasoning").map((p) => p.text).join(""),
          reply = parts.filter((p) => p.type === "text").map((p) => p.text).join("");
        if (reasoning) {
          console.log("\n💡 " + reasoning);
        }
        console.log("\n← " + reply);
        return reply;
      }
      if (res.data?.info?.error) {
        throw new Error(JSON.stringify(res.data.info.error));
      }
      return "";
    };

  run[Symbol.asyncDispose] = async () => {
    await server.close();
  };
  return run;
};

export default async (diff_text) => {
  await using ai = await aiInit("gci-commit");
  return (await ai("根据以下代码改动，生成一句话的git提交消息，格式如<type>: <中文标题> / <English Subject>。不要返回其他多余的说明，仅返回提交消息即可。\n\n" + diff_text))?.trim();
};

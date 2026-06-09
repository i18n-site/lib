import newOpencode from "@1-/opencode";

export default async (git, diff_text) => {
  const log = await git.log({ maxCount: 1 }).catch(() => null),
    last_msg = log?.latest?.message,
    has_cn = !last_msg || /[\u4e00-\u9fa5]/.test(last_msg);

  let fmt = "`type: commit msg`";
  if (has_cn) {
    fmt += "`\\n类型: 中文说明`。这里『类型』，是type的中文翻译，不要直接写『类型』";
  }

  const [prompt, client, session] = await newOpencode(process.cwd(), "gci-commit"),
    [reply] = await prompt(
      (process.env.GCI_PROMPT ||
        "根据以下代码改动，生成一句话的git提交消息，格式如" +
          fmt +
          "。不要返回其他多余的说明，仅返回提交消息即可。") +
        "\n\n" +
        diff_text,
    );
  if (reply) {
    return reply.replace(/^`+|`+$/g, "").trim();
  }
  const res = await client.session.messages({ path: { id: session.id } }),
    last_msg_item = res.data?.[res.data.length - 1],
    text = last_msg_item?.parts
      ?.filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("");
  return text?.replace(/^`+|`+$/g, "").trim();
};

import newOpencode from "@1-/opencode";

export default async (diff_text) => {
  await using helper = await newOpencode(process.cwd(), "gci-commit");
  const [prompt] = helper,
    [reply] = await prompt(
      (process.env.GCI_PROMPT ||
        "根据以下代码改动，生成一句话的git提交消息，格式如`type: 英文说明\n类型: 中文说明`。这里『类型』，是type的中文翻译，不要直接写『类型』。不要返回其他多余的说明，仅返回提交消息即可。") +
        "\n\n" +
        diff_text,
    );
  return reply?.replace(/^`+|`+$/g, "").trim();
};


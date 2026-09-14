import reqJson from "@3-/req/reqJson.js";

const DEFAULT_MODEL_LI = [
  "deepseek/deepseek-v4-flash",
  "z-ai/glm-5.3-flash",
  "cline-free/solar-pro4",
  "cline-free/longcat-2.0",
  "cline-free/muse-spark-1.3-contributor",
  "poolside/laguna-s-2.1:free",
];

export default async () => {
  const data = await reqJson(
      "https://api.cline.bot/api/v1/ai/cline/recommended-models",
    ).catch(() => null),
    free_li = data?.free || [];
  return free_li.length > 0
    ? free_li.map((item) => item.id)
    : DEFAULT_MODEL_LI;
};

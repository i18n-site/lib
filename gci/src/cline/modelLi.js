const DEFAULT_MODEL_LI = [
  "deepseek/deepseek-v4-flash",
  "z-ai/glm-5.3-flash",
  "cline-free/solar-pro4",
  "cline-free/longcat-2.0",
  "cline-free/muse-spark-1.3-contributor",
  "poolside/laguna-s-2.1:free",
];

export default async () => {
  const url = "https://api.cline.bot/api/v1/ai/cline/recommended-models",
    res = await fetch(url).catch(() => null);
  if (!res || !res.ok) {
    return DEFAULT_MODEL_LI;
  }
  const data = await res.json().catch(() => null),
    free_li = data?.free || [];
  if (free_li.length > 0) {
    return free_li.map((item) => item.id);
  }
  return DEFAULT_MODEL_LI;
};

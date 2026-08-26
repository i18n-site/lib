import mammoth from "mammoth";

export default async (bin) => {
  const result = await mammoth.extractRawText({ buffer: Buffer.from(bin) }),
    r = [];
  // console.log(result.messages); // 警告信息
  for (let i of result.value.split("\n")) {
    i = i.trimEnd();
    if (i) {
      r.push(i);
    }
  }
  return r.join("\n");
};

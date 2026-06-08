import { format as 格式化 } from "oxfmt";
import read from "@3-/read";
import write from "@3-/write";

export default async (fp) => {
  const 原始内容 = read(fp);
  const { code, errors } = await 格式化(fp, 原始内容);
  if (errors && errors.length > 0) {
    return errors;
  }

  if (typeof code === "string" && 原始内容 !== code) {
    write(fp, code);
  }
};

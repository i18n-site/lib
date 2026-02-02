import { default as seg, segWithTitle } from "./seg.js";
import txtLi from "@3-/txt_li";
import rmCnSpace from "@3-/rm_cn_space";

const partition = async (li, title_number, remain_seg) => {
    const order = title_number.sort((a, b) => a[1] - b[1]);
    const result = [];

    let title,
      row,
      pre = 0;
    for ([title, row] of order) {
      console.log(title);
      result.push([title, li.slice(pre, row)]);
      pre = row;
    }

    if (pre < li.length) {
      li = li.slice(pre);
      if (li.join("\n").length > 3000) {
        return result.concat(await remain_seg(li));
      } else {
        result.at(-1)[1].push(...li);
      }
    }

    return result;
  },
  repartition = (chat, len) => async (li) => {
    if (
      // 这表示不可再分
      li.length == len
    ) {
      return li;
    }
    if (li.length == 1) {
      li = li[0].split("。");
    }
    return partition(li, await seg(chat, li), (i) =>
      repartition(chat, li.length)(i),
    );
  };

export default async (chat, txt) => {
  if (!txt) {
    return ["", []];
  }
  const li = txtLi(txt).map((i) => rmCnSpace(i)),
    [title, user, seg_li] = await segWithTitle(chat, li);
  return [
    title,
    user,
    await partition(li, seg_li, repartition(chat, li.length)),
  ];
};

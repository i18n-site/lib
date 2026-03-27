import mupdf from "mupdf";
import rmCnSpace from "@3-/rm_cn_space";

export default (pdf) => {
  const doc = mupdf.Document.openDocument(pdf, "application/pdf"),
    pageCount = doc.countPages(),
    y_line = new Map();

  let max_w = 0;

  for (let i = 0; i < pageCount; i++) {
    const page = doc.loadPage(i),
      li = JSON.parse(page.toStructuredText().asJSON()).blocks;

    for (const { lines } of li) {
      for (const line of lines) {
        const { text } = line;
        if (text.trimEnd()) {
          let t = y_line.get(line.y);
          const { bbox } = line;
          if (t) {
            if (bbox.x < t[0].x) {
              t[0].x = bbox.x;
              t = [t[0], text, ...t.slice(1)];
              continue;
            }
            t[0].w += bbox.w;
            if (t[0].w > max_w) {
              max_w = t[0].w;
            }
          } else {
            if (bbox.w > max_w) {
              max_w = bbox.w;
            }
            t = [bbox];
            y_line.set(line.y, t);
          }
          t.push(text);
        }
      }
    }
  }

  let pre_box = { x: 0, y: 0, w: 0, h: 0 },
    t = [];
  const r = [],
    push = () => {
      t = rmCnSpace(t.join(" "));
      if (t) {
        r.push(t);
      }
      t = [];
    };
  for (const [y, [box, ...li]] of [...y_line.entries()].toSorted(
    (a, b) => a[0] - b[0],
  )) {
    const y_diff = y - pre_box.y;
    if (
      y < pre_box.h + pre_box.y ||
      (y_diff < 3 * box.h && pre_box.w + 3 * box.h > max_w)
    ) {
      t.push(...li);
    } else {
      push();
      t = [...li];
    }
    pre_box = box;
  }
  push();
  return r.join("\n");
};

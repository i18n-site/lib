#!/usr/bin/env bun

import { join, dirname } from "path"
import { existsSync } from "fs"
import read from "@3-/read"
import write from "@3-/write"

const MOD = "mod api;"

const regen = (src, code) => {
  const li = ["// GEN BY ../gen.sh ! DON'T EDIT\n\n" + MOD],
    mod_li = []
  let mod, fp, t

  const save = (func) => {
    if (!existsSync(fp)) {
      write(fp, func())
    }
  }

  const iter = code.split('\n')[Symbol.iterator]()
  for (const line of iter) {
    const trimed = line.trim()
    if (mod) {
      if (trimed.startsWith('::volo_grpc::BoxStream')) {
        t.push(line);
        let tmp = t;
        while (true) {
          const s = iter.next();
          if (s.done) break;
          const v = s.value;
          tmp.push(v);
          if (v == "  > {") {
            tmp = [];
          }
          if (v == "  }") {
            break;
          }
        }
        save(
          () => `pub async fn ${mod}(${t[2].trim()}sender:tokio::sync::mpsc::Sender<${t[7].trim()}>) -> anyhow::Result<()> {
  Ok(())
}`
        );

        t.push(`\
    let (sender, recver) = ::volo_grpc::codegen::mpsc::channel(16);
    tokio::spawn(async move {
      xerr::log!(api::${mod}(req, sender).await);
    });
    Ok(volo_grpc::Response::new(Box::pin(volo_grpc::codegen::ReceiverStream::new(recver))))
  }`)
        li.push(t.join('\n'))
        mod = 0
      } else if (trimed.startsWith("::std::result::Result::Ok(")) {
        t.push("    api::" + mod + "(req).await")
      } else if (trimed.startsWith("_req:")) {
        t.push("    " + trimed.slice(1))
      } else {
        t.push(line)
        if (trimed == "}") {
          li.push(t.join("\n"))
          save(() => {
            t.splice(1, 1)
            t[t.length - 2] =
              "::std::result::Result::Ok(::volo_grpc::Response::new(Default::default()))"
            return "pub " + t.join("\n").trim()
          })
          mod = undefined
        }
      }
    } else if (trimed.startsWith("async fn")) {
      mod = trimed.slice(9).split("(")[0]
      fp = join(src, "api", mod + ".rs")
      console.log(fp)
      t = [line]
      mod_li.push(mod)
    } else {
      li.push(line)
    }
  }

  write(
    join(src, "api/mod.rs"),
    mod_li
      .map(
        (mod) => `mod ${mod};
pub use ${mod}::${mod};`,
      )
      .join("\n")
      .trim(),
  )
  return li.join("\n")
}
  ; (() => {
    const root = process.cwd()

    const src = join(root, "src"),
      src_lib = join(src, "lib.rs")

    let code = read(src_lib)
    if (code.includes(MOD)) {
      return
    }

    code = regen(src, code)
    if (!code) return
    write(src_lib, code)

    const volo_fp = join(root, "volo-gen/src/lib.rs"),
      volo = read(volo_fp)

    if (volo.includes("r#")) return

    write(volo_fp, volo.replaceAll(/\bgen\b/g, "r#gen"))
  })()

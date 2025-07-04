#!/usr/bin/env bun

import { join, dirname } from "path"
import { existsSync } from "fs"
import read from "@3-/read"
import write from "@3-/write"

const MOD = "mod api;"

const regen = (src, code) => {
	const li = ["// GEN BY ../gen.sh ! DON'T EDIT\n\n" + MOD],
		mod_li = []
	let mod, t

	for (const line of code.split("\n")) {
		const trimed = line.trim()
		if (mod) {
			if (trimed.startsWith("::std::result::Result::Ok(")) {
				t.push("    api::" + mod + "(req).await")
			} else if (trimed.startsWith("_req:")) {
				t.push("    " + trimed.slice(1))
			} else {
				t.push(line)
				if (trimed == "}") {
					li.push(t.join("\n"))
					const fp = join(src, "api", mod + ".rs")
					if (!existsSync(fp)) {
						console.log(fp)
						t.splice(1, 1)
						t[t.length - 2] =
							"::std::result::Result::Ok(::volo_grpc::Response::new(Default::default()))"
						write(fp, "pub " + t.join("\n").trim())
					}
					mod = undefined
				}
			}
		} else if (trimed.startsWith("async fn")) {
			mod = trimed.slice(9).split("(")[0]
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
;(() => {
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

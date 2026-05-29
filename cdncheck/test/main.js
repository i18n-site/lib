#!/usr/bin/env -S node --trace-uncaught --expose-gc --unhandled-rejections=strict
import cdncheck from "../lib/index.js";

console.log(
	await cdncheck("3ti.site", ".i", ["111.13.143.204", "111.13.143.204"]),
);

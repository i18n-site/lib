#!/usr/bin/env bun

import test from "tape"
import cssNesting from "../src/cssNesting.js"
import DATA from "./data"

Object.entries(DATA).forEach(([name, [from_css, to_css]]) => {
	test(name, (t) => {
		t.equal(cssNesting(from_css).trim(), to_css.trim())
		t.end()
	})
})

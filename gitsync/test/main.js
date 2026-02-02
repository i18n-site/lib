#!/usr/bin/env bun

import GITHUB from "@3-/gitsync/GITHUB.js";
import ATOMGIT from "@3-/gitsync/ATOMGIT.js";

import sync from "@3-/gitsync";

import { join } from "path";

const ROOT = import.meta.dirname;

await sync(join(ROOT, "sync.yml"), ATOMGIT, "js0", GITHUB, "js0-site");

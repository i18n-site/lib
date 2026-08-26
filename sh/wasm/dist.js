#!/usr/bin/env bun

import { copyFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import make from "@3-/mdt/make.js";
import read from "@3-/read";

const dir = existsSync("package.json") ? process.cwd() : join(process.cwd(), "..");
process.chdir(dir);

const package_path = "package.json",
  pkg_json = JSON.parse(read(package_path)),
  version_parts = pkg_json.version.split(".");

await make(dir);

copyFileSync("README.md", join("pkg", "README.md"));

version_parts[2] = String(Number(version_parts[2]) + 1);
pkg_json.version = version_parts.join(".");

writeFileSync(package_path, JSON.stringify(pkg_json, null, 2) + "\n");

delete pkg_json.devDependencies;
writeFileSync(join("pkg", "package.json"), JSON.stringify(pkg_json, null, 2) + "\n");

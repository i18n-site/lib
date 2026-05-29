#!/usr/bin/env zx

import reqJson from "@3-/req/reqJson.js";
import { existsSync } from "node:fs";
import { $ } from "zx";
import write from "@3-/write";
import read from "@3-/read";
import { join } from "node:path";

$.verbose = 1;

const { GITHUB_TOKEN } = process.env;

export default async (root, repo, tag) => {
  const [org, name] = repo.split("/"),
    ver_json = join(root, "ver.json"),
    git_repo = join(root, name);

  if (!tag) {
    const headers = {};
    if (GITHUB_TOKEN) {
      headers["Authorization"] = "token " + GITHUB_TOKEN;
    }
    tag = (
      await reqJson(`https://api.github.com/repos/${repo}/releases/latest`, {
        headers,
      })
    ).tag_name;
  }

  if (existsSync(git_repo)) {
    await $`cd ${git_repo} && ( git tag --points-at HEAD | grep -qx "${tag}" ) || ( git fetch --depth 1 origin tag ${tag} && git checkout tags/${tag} -b ${tag} )`;
  } else {
    await $`git clone --depth=1 -b ${tag} https://github.com/${repo}.git ${git_repo}`;
  }

  const commit = (
    await $`git --git-dir=${git_repo}/.git rev-parse HEAD`
  ).stdout.trim();

  if (!(existsSync(ver_json) && JSON.parse(read(ver_json)).commit == commit)) {
    write(
      ver_json,
      JSON.stringify({
        rev: tag,
        commit: commit,
        hash: JSON.parse(
          (
            await $`nix-shell -p nix-prefetch-github --run "nix-prefetch-github --rev ${commit} ${org} ${name}"`
          ).stdout,
        ).hash,
      }),
    );
  }
};

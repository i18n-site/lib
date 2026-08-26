#!/usr/bin/env bun

import { $ } from "zx";
import ymd from "@3-/ymd";
import sshConfig from "@3-/ssh_config";

const { PASSWORD } = process.env;

export default async (name, ip, dir) => {
  const fname = `/tmp/${name}.tar.zst.enc`,
    today = ymd(),
    ssh_config = sshConfig([["vps", ip]]);

  $.verbose = 0;
  const p =
    $`ssh -F ${ssh_config} -o ConnectTimeout=10 -o BatchMode=yes vps bash -c '"nix-shell -p openssl zstd gnutar --run \\"export PASSWORD=${PASSWORD} && set -ex && tar --remove-files -C ${dir} -cf - . | zstd -18 -T0 | openssl enc -aes-256-cbc -pbkdf2 -salt -pass env:PASSWORD -out ${fname} && set +x\\""'`.pipe(
      process.stdout,
    );
  $.verbose = 1;
  await p;
  await $`rsync --remove-source-files -e 'ssh -F ${ssh_config}' -avz vps:${fname} ${fname} && gh release upload ${today} ${fname}`;
};

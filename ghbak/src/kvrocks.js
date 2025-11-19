#!/usr/bin/env bun

import { $ } from "zx";
import write from "@3-/write";
import ymd from "@3-/ymd";

const { PASSWORD } = process.env;

export default async (name, ip, dir) => {
  const ssh_config = `/tmp/ssh_config/${name}`,
    fname = `/tmp/${name}.tar.zst.enc`,
    today = ymd();
  write(
    ssh_config,
    `
Host *
StrictHostKeyChecking accept-new

Host kvrocks
HostName ${ip}
User root`,
  );

  $.verbose = 0;
  await $`ssh -F ${ssh_config} -o ConnectTimeout=10 -o BatchMode=yes kvrocks bash -c '"nix-shell -p openssl zstd gnutar --run \\"export PASSWORD=${PASSWORD} && set -ex && cd ${dir} && tar --remove-files -C backup -cf - . | zstd -18 -T0 | openssl enc -aes-256-cbc -pbkdf2 -salt -pass env:PASSWORD -out ${fname} && set +x\\""'`.pipe(
    process.stdout,
  );
  $.verbose = 1;
  await $`rsync --remove-source-files -e 'ssh -F ${ssh_config}' -avz kvrocks:${fname} ${fname} && gh release upload ${today} ${fname}`;
};

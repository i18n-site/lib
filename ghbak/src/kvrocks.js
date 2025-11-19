#!/usr/bin/env bun

import Redis from "@3-/ioredis";
import int from "@3-/int";
import sleep from "@3-/sleep";
import { $ } from "zx";
import write from "@3-/write";

const { PASSWORD } = process.env;

export default async (name, ip) => {
  const ssh_config = `/tmp/ssh_config/${name}`,
    fname = `/tmp/${name}.tar.zst.enc`,
    today = new Date().toISOString().slice(0, 10);
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
  await $`ssh -F ${ssh_config} -o ConnectTimeout=10 -o BatchMode=yes kvrocks bash -c '"nix-shell -p openssl zstd gnutar --run \\"export PASSWORD=${PASSWORD} && set -ex && cd /var/lib/kvrocks && tar --remove-files -C backup -cf - . | zstd -18 -T0 | openssl enc -aes-256-cbc -pbkdf2 -salt -pass env:PASSWORD -out ${fname} && set +x\\""'`.pipe(
    process.stdout,
  );
  $.verbose = 1;
  await $`rsync --remove-source-files -e 'ssh -F ${ssh_config}' -avz kvrocks:${fname} ${fname} && gh release upload ${today} ${fname}`;
};

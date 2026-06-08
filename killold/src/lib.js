#!/usr/bin/env bun
import { existsSync, unlinkSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import int from "@3-/int";
import read from "@3-/read";
import write from "@3-/write";
import sleep from "@3-/sleep";
import RED from "@3-/log/RED.js";
import GRAY from "@3-/log/GRAY.js";

const exist = (pid) => {
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return err.code === "EPERM";
  }
};

export default async (path) => {
  const file_path = path ? resolve(path) : process.argv[1],
    lock = join(tmpdir(), file_path + ".pid");

  if (existsSync(lock)) {
    const pid = int(read(lock).trim());
    if (pid && pid !== process.pid) {
      while (exist(pid)) {
        GRAY(file_path + ": pid " + pid + " running , trying kill it");
        await sleep(1000);
        RED("$ kill -9 " + pid);
        try {
          process.kill(pid, 9);
        } catch (err) {
          if (err.code !== "ESRCH") {
            console.error(err);
          }
        }
      }
    }
  }

  write(lock, process.pid.toString());

  const rm = () => {
    try {
      unlinkSync(lock);
    } catch (_) {}
  };

  process.on("exit", rm);
  process.on("SIGINT", () => {
    rm();
    process.exit(130);
  });
  process.on("SIGTERM", () => {
    rm();
    process.exit(143);
  });
};

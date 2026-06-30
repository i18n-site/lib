#!/usr/bin/env bun
import { existsSync, unlinkSync, mkdirSync, rmdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import fkill from "fkill";
import int from "@3-/int";
import read from "@3-/read";
import write from "@3-/write";
import sleep from "@3-/sleep";
import RED from "@3-/log/RED.js";
import ERR from "@3-/log/ERR.js";

const TMP_DIR = tmpdir(),
  exist = (pid) => {
    try {
      process.kill(pid, 0);
      return true;
    } catch (err) {
      return err.code === "EPERM";
    }
  },
  tryLock = (path) => {
    try {
      mkdirSync(path);
      return true;
    } catch {
      return false;
    }
  };

export default async () => {
  const file_path = resolve(process.argv[1]),
    hash = createHash("sha256").update(file_path).digest(),
    file_name = Buffer.from(hash).toString("base64url"),
    lock_pre = join(TMP_DIR, file_name),
    lock_sys = lock_pre + ".lock",
    lock_pid = lock_pre + ".pid",
    rm = () => {
      try {
        rmdirSync(lock_sys);
        unlinkSync(lock_pid);
      } catch {}
    },
    exitWith = (code) => {
      rm();
      process.exit(code);
    };

  if (!tryLock(lock_sys)) {
    if (existsSync(lock_pid)) {
      const pid = int(read(lock_pid).trim());
      if (pid && pid !== process.pid) {
        while (exist(pid)) {
          RED("killing pid " + pid + " ...");
          try {
            await fkill(pid, { force: true, silent: true });
          } catch (err) {
            ERR(err);
          } finally {
            await sleep(1000);
          }
        }
      }
    }
    try {
      rmdirSync(lock_sys);
      if (!tryLock(lock_sys)) {
        throw new Error("lock failed");
      }
    } catch (err) {
      ERR(err);
    }
  }

  write(lock_pid, process.pid.toString());

  process.on("exit", rm);
  [
    ["SIGINT", 130],
    ["SIGTERM", 143],
  ].forEach(([sig, code]) => process.on(sig, exitWith.bind(null, code)));
};

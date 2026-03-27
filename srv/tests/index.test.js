#! /usr/bin/env bun
import { join } from "path";
import { test, expect } from "vitest";
import install from "../srv/install.js";
import uninstall from "../srv/uninstall.js";
import { $ } from "zx";

const service_name = "test_srv_3_agent";

const check_server = async () => {
  const { stdout } = await $`curl -s http://127.0.0.1:18374 || echo "FAIL"`.quiet();
  return stdout.trim();
};

const wait_for_server = async (retries = 15) => {
  for (let i = 0; i < retries; i++) {
    const res = await check_server();
    if (res === "OK") return "OK";
    await new Promise((r) => setTimeout(r, 1000));
  }
  return "FAIL";
};

const wait_for_server_to_stop = async (retries = 15) => {
  for (let i = 0; i < retries; i++) {
    const res = await check_server();
    if (res === "FAIL") return "FAIL";
    await new Promise((r) => setTimeout(r, 1000));
  }
  return "OK";
};

test("部署并验证真实的后台服务网络可达性", async () => {
  const script_path = join(import.meta.dirname, "dummy.js");
  
  await install({ name: service_name, scriptPath: script_path });

  const text_after_install = await wait_for_server();
  expect(text_after_install).toBe("OK");
  console.log("安装服务测试通过");

  await uninstall({ name: service_name });

  const text_after_uninstall = await wait_for_server_to_stop(15);
  expect(text_after_uninstall).toBe("FAIL");
  console.log("卸载服务测试通过");
}, 30000);

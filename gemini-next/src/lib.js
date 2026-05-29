#!/usr/bin/env bun

import nowts from "@3-/nowts";
import load from "@3-/yml/load.js";
import { homedir } from "os";
import { join } from "path";
import { existsSync, renameSync, mkdirSync, copyFileSync, unlinkSync } from "fs";
import read from "@3-/read";
import write from "@3-/write";

const loadJson = (fp) => {
    if (existsSync(fp)) {
      try {
        return JSON.parse(read(fp)) || {};
      } catch {}
    }
    return {};
  },
  HOME = homedir(),
  CONFIG_GEMINI = join(HOME, ".config/gemini-cli"),
  HOME_GEMINI = join(HOME, ".gemini"),
  GOOGLE_CLOUD_PROJECT_YML = join(CONFIG_GEMINI, "google_cloud_project.yml"),
  GOOGLE_ACCOUNTS_JSON = join(HOME_GEMINI, "google_accounts.json"),
  GOOGLE_ACCOUNTS = loadJson(GOOGLE_ACCOUNTS_JSON),
  ACTIVE_ACCOUNT = GOOGLE_ACCOUNTS.active?.split("@", 1)[0],
  OAUTH_CREDS_JSON = join(HOME_GEMINI, "oauth_creds.json"),
  AUTH_DIR = join(CONFIG_GEMINI, "auth");

if (!existsSync(AUTH_DIR)) {
  mkdirSync(AUTH_DIR, { recursive: true });
}

if (existsSync(OAUTH_CREDS_JSON)) {
  if (ACTIVE_ACCOUNT) {
    try {
      renameSync(OAUTH_CREDS_JSON, join(AUTH_DIR, ACTIVE_ACCOUNT));
    } catch (error) {
      if (error.code === 'EXDEV') {
        // Cross-device link not permitted, use copy and delete instead
        copyFileSync(OAUTH_CREDS_JSON, join(AUTH_DIR, ACTIVE_ACCOUNT));
        // Delete the source file after successful copy
        unlinkSync(OAUTH_CREDS_JSON);
      } else {
        throw error;
      }
    }
  }
} else {
  mkdirSync(HOME_GEMINI, { recursive: true });
}

(() => {
  const account_token_dict = load(GOOGLE_CLOUD_PROJECT_YML),
    account_use_time = [],
    use_time_json = join(CONFIG_GEMINI, "use_time.json"),
    use_time = loadJson(use_time_json);

  for (let [user, token] of Object.entries(account_token_dict)) {
    account_use_time.push([user, use_time[user] || 0]);
  }

  account_use_time.sort((a, b) => b[1] - a[1]);
  const account = account_use_time.pop()[0],
    token = account_token_dict[account];
  if (token) {
    write(
      join(CONFIG_GEMINI, "project.env"),
      "# " + account + "\nexport GOOGLE_CLOUD_PROJECT=" + token,
    );
  } else {
    console.warn(account + "not in " + GOOGLE_CLOUD_PROJECT_YML);
  }
  const account_auth = join(AUTH_DIR, account),
    active = account + "@gmail.com";

  console.log("\n→ " + active + "\n");

  if (existsSync(account_auth)) {
    copyFileSync(account_auth, OAUTH_CREDS_JSON);
  }

  write(GOOGLE_ACCOUNTS_JSON, JSON.stringify({ active }));

  const now = nowts();

  if (ACTIVE_ACCOUNT) {
    use_time[ACTIVE_ACCOUNT] = now;
  }
  use_time[account] = now;

  write(use_time_json, JSON.stringify(use_time));
})();

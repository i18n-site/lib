import { homedir } from "node:os";
import { join } from "node:path";
import { existsSync } from "node:fs";
import rJson from "@3-/read/rJson.js";
import write from "@3-/write";

const REFRESH_URL = "https://api.cline.bot/api/v1/auth/refresh",
  CONF_PATH = join(
    homedir(),
    ".cline",
    "data",
    "settings",
    "providers.json",
  ),
  TIMEOUT = 30000,
  BUFFER_MS = 300000,
  PREFIX = "workos:",
  tokenFormat = (token) => {
    const t = (token || "").trim();
    return t.toLowerCase().startsWith(PREFIX) ? t : PREFIX + t;
  },
  jwtExp = (token) => {
    const part = (token || "").replace(/^workos:/i, "").split(".")[1];
    if (part) {
      try {
        const exp = JSON.parse(
          atob(part.replace(/-/g, "+").replace(/_/g, "/")),
        )?.exp;
        if (typeof exp === "number" && exp > 0) {
          return exp * 1000;
        }
      } catch {}
    }
    return 0;
  },
  tokenExp = (auth) => {
    const { expiresAt, accessToken } = auth;
    return typeof expiresAt === "number" &&
      Number.isFinite(expiresAt) &&
      expiresAt > 0
      ? expiresAt
      : jwtExp(accessToken);
  },

  tokenRefresh = async (conf, auth, refresh_token) => {
    const res = await fetch(REFRESH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refreshToken: refresh_token,
        grantType: "refresh_token",
      }),
      signal: AbortSignal.timeout(TIMEOUT),
    }).catch(() => null);

    if (res?.ok) {
      const { data } = await res.json().catch(() => ({}));
      if (data?.accessToken) {
        const token = tokenFormat(data.accessToken);
        auth.accessToken = token;
        if (data.refreshToken) {
          auth.refreshToken = data.refreshToken;
        }
        if (data.expiresAt) {
          auth.expiresAt = new Date(data.expiresAt).getTime();
        }
        write(CONF_PATH, JSON.stringify(conf, null, 2));
        return token;
      }
    }
    return null;
  };

export default async (force = false) => {
  if (!existsSync(CONF_PATH)) {
    return null;
  }

  const conf = rJson(CONF_PATH),
    auth = conf?.providers?.cline?.settings?.auth;

  if (!auth) {
    return null;
  }

  const { refreshToken, accessToken } = auth,
    exp = tokenExp(auth),
    is_expired = force || (exp > 0 ? Date.now() >= exp - BUFFER_MS : true);

  if (is_expired && refreshToken) {
    const token = await tokenRefresh(conf, auth, refreshToken);
    if (token) {
      return token;
    }
  }

  return accessToken ? tokenFormat(accessToken) : null;
};



import ping from "./lib.js";

export default async (host, port, timeout) => {
  try {
    await ping(host, port, timeout);
    return 1;
  } catch {}
};

import ping from "./lib.js";

export default async (host, port, timeout) => {
  if (await ping(host, port, timeout)) {
    return 1;
  }
};

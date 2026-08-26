import { Socket } from "node:net";

export default (host, port) =>
  new Promise((resolve) => {
    const sock = new Socket(),
      finish = (status) => {
        sock.destroy();
        resolve(status);
      };

    sock.setTimeout(1000);
    sock.on("connect", () => finish(true));
    sock.on("timeout", () => finish(false));
    sock.on("error", () => finish(false));
    sock.connect(port, host);
  });

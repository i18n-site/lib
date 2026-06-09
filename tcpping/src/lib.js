import net from "net";

const TIMEOUT = "timeout";

export default (host, port, timeout = 7000) =>
  new Promise((resolve, reject) => {
    const socket = net.connect({ host, port, timeout }),
      end = (err) => {
        socket.destroy();
        reject(err);
      };

    socket.on("connect", () => {
      resolve(true);
      socket.destroy();
    });

    socket.on("error", (err) => end(err.code));
    socket.on(TIMEOUT, () => end(TIMEOUT));
  });

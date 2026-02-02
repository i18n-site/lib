import { connect } from "node:tls";

const toBase64 = (str) => Buffer.from(str).toString("base64");

export default (user, pass, ip, domain) => {
  const { promise, resolve, reject } = Promise.withResolvers(),
    socket = connect({
      host: ip || domain,
      port: 465,
      servername: domain,
      rejectUnauthorized: true,
      checkServerIdentity: (_host, cert) => {
        const valid_to = new Date(cert.valid_to),
          now = new Date(),
          days_remaining = (valid_to - now) / (1000 * 60 * 60 * 24);
        if (days_remaining < 10) {
          return new Error(
            `证书有效期不足10天，剩余 ${days_remaining.toFixed(1)} 天`,
          );
        }
        return undefined;
      },
    });

  let step = 0,
    buffer = "";

  const send = (cmd) => socket.write(`${cmd}\r\n`);

  socket.setEncoding("utf8");

  socket.on("data", (chunk) => {
    if (chunk.trim()) {
      console.log("Server:", chunk.trim());
    }
    buffer += chunk;

    const lines = buffer.split("\n");
    buffer = lines.pop();

    for (const line of lines) {
      const trimmed_line = line.trim();
      if (!trimmed_line) continue;

      if (step === 0 && trimmed_line.startsWith("220")) {
        send(`EHLO ${domain}`);
        step++;
      } else if (step === 1 && trimmed_line.startsWith("250")) {
        if (!trimmed_line.includes("-")) {
          send("AUTH LOGIN");
          step++;
        }
      } else if (step === 2 && trimmed_line.startsWith("334")) {
        send(toBase64(user));
        step++;
      } else if (step === 3 && trimmed_line.startsWith("334")) {
        send(toBase64(pass));
        step++;
      } else if (step === 4) {
        if (trimmed_line.startsWith("235")) {
          send("QUIT");
          socket.end();
          resolve(true);
        } else if (trimmed_line.match(/^[45]\d{2}/)) {
          socket.destroy();
          reject(new Error(`SMTP Auth Failed: ${trimmed_line}`));
        }
      }
    }
  });

  socket.on("error", (err) => {
    reject(err);
  });

  socket.on("timeout", () => {
    socket.destroy();
    reject(new Error("Connection timeout"));
  });

  // 设置超时
  socket.setTimeout(7000);
  return promise;
};

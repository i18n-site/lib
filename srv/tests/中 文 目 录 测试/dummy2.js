#!/usr/bin/env node
import { createServer } from "http";

const PORT = 18374,
  handler = (req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("OK2");
  },
  server = createServer(handler),
  tryListen = () => {
    server.listen(PORT, "127.0.0.1").on('error', () => {
      setTimeout(tryListen, 1000);
    });
  };

tryListen();

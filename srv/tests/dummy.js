#! /usr/bin/env node
import { createServer } from "http";

const PORT = 18374,
  handler = (req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("OK");
  },
  server = createServer(handler);

server.listen(PORT, "127.0.0.1");

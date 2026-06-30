#!/usr/bin/env node
import { createServer } from "http";

const handler = (req, res) => res.end("OK"),
  server = createServer(handler),
  tryListen = () => server.listen(18374, "127.0.0.1").on("error", () => setTimeout(tryListen, 1e3));

tryListen();

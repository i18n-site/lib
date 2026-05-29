#!/usr/bin/env bun

import { Readable } from "stream";
import { createReadStream } from "node:fs";

export default (path) => Readable.toWeb(createReadStream(path));

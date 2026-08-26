#!/usr/bin/env bun

import KVROCKS from "./KVROCKS.js";
import redis from "@3-/redis/Sentinel.js";

export default await redis(KVROCKS);

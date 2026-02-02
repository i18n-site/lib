#!/usr/bin/env bun

import { join } from "node:path";
import { homedir } from "node:os";
import mysql from "@8v/mysql";

const TIDB = (await import(join(homedir(), "js0/status/conf/TIDB.js"))).default;

export default mysql(TIDB);

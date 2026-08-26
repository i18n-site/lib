#!/usr/bin/env -S node --trace-uncaught --expose-gc --unhandled-rejections=strict
import cargoUpgrade from "./lib.js";

cargoUpgrade(process.cwd());

process.exit();

#!/usr/bin/env bun

import CODE from "../src/CODE.js";

const LI = Intl.DateTimeFormat.supportedLocalesOf(CODE);

console.log(LI, LI.length, CODE.length);

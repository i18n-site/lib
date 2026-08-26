#!/usr/bin/env bun

import CONF from "../../../../js0/conf/cron/ali/user_tax.js";
import Alissl from "../src/lib.js";
import R from "./R.js";

const SITE_LI = CONF.pop();
for (const site of SITE_LI) {
  const alissl = Alissl(...CONF);
  await alissl(JSON.parse(await R.get("ssl:" + site)));
}
process.exit();

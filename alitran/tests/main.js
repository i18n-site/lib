#!/usr/bin/env bun

import CONF from "../../../../i/conf/dev/ALI_TRAN.js";
import alitran from "../src/lib.js";

const txt = "我看到这个视频后没有笑",
  translate = alitran(CONF),
  result = await translate("zh", "kk", txt);

console.log(txt + "\n" + result);

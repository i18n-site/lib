#!/usr/bin/env bun

import CONF from "../../../../i/conf/dev/ALI_TRAN.js";
import alitran from "../src/lib.js";

const translate = alitran(CONF),
  原文 = "我看到这个视频后没有笑";
console.log(原文);
const result = await translate("auto", "English", 原文);
console.log("→\n" + result);

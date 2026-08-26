import { $ } from "zx";

$.verbose = true;
$.shell = process.env.ComSpec || "cmd.exe";
$.prefix = "";

export { $ };

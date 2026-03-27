import gen from "@3-/srv-obj-replace/gen.js";
gen(
  { name: "test_srv", execPath: "/usr/bin/node", scriptPath: "/home/z/中 文 目 录 测试/dummy.js" },
  "linux/systemd.service",
  "test_systemd.service"
);

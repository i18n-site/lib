[‼️]: ✏️README.mdt

# @3-/protojs

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/protojs
  @3-/uridir
  ansis > greenBright
  path > join
  fs > readdirSync

ROOT = uridir(import.meta)

console.log await protojs join ROOT, 'api.proto'
```

output :

```
auth.proto
syntax = "proto3";

package api;

enum Stat {
  Ok = 0;              // 成功
  AccountInvalid = 1;  // 账号格式无效
  PasswordInvalid = 2; // 密码错误
}

message Sign
{
  Stat Stat = 1;
}

captcha.proto
syntax = "proto3";

package api;

message Captcha
{
  uint64 id = 1;
  bytes img = 2;
  repeated string svg_li = 3;
}

tran.proto
syntax = "proto3";

package api;

message Translated
{
  repeated string htm = 1;
  repeated string txt = 2;
}
```

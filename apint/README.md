[‼️]: ✏️README.mdt

# @3-/apint

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/apint > gen_nt
  @3-/read
  path > join

ROOT = import.meta.dirname

rs = read join ROOT,'test.rs'

nt = gen_nt(rs,'')
console.log nt
```

output :

```
  month : i32

Bill(Uid(uid):Uid) -> Bill
  setup_indent : Option<String>

CardLi(Uid(uid):Uid,setup_indent:Option<::jarg::Json<(String)>>) -> CardLi

Cash(client:Client) -> ()

Setup(Uid(uid):Uid) -> ()

(Uid(uid):Uid) -> BillIndex
[
  {
    Bill: 'month:i32→Bill',
    CardLi: 'setup_indent:String→CardLi',
    Cash: '→()',
    Setup: '→()',
    '': '→BillIndex'
  },
  Set(5) {
    'bill as Bill',
    'card_li as CardLi',
    'cash as Cash',
    'setup as Setup',
    'self as '
  },
  {},
  { Bill: 0, CardLi: 0, Cash: 0, Setup: 0, '': 0 }
]
```

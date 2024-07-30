[‼️]: ✏️README.mdt

# @3-/tran

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/tran

console.log await tran(
  "en"
  "sk"
  []
  [
    "Click <br _0_> in order on below image"
    "Click<br _0_> in order on below image"
  ]
  null
  null
)
```

output :

```
[
  [],
  [
    'Kliknite<br _0_> v poradí na obrázku nižšie',
    'Kliknite<br _0_> v poradí na obrázku nižšie'
  ]
]
```

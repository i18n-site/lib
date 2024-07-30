[‼️]: ✏️README.mdt

# @3-/cdncheck

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/cdncheck

console.log await cdncheck(
  'i18n.site'
  '.js'
  [
    '110.53.110.41'
    '188.114.96.3'
  ]
)
```

output :

```
[ [ '110.53.110.41', 164, 'JSP3/2.0.14' ] ]
```

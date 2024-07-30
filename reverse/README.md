[‼️]: ✏️README.mdt

# @3-/reverse

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/reverse

f = 'A☺️B'
t = reverse(f)
f1 = reverse(t)
console.log {f,t,f1}
console.log f.length, t.length
```

output :

```
{ f: 'A☺️B', t: 'B️☺A', f1: 'A☺️B' }
4 4
```

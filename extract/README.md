[‼️]: ✏️README.mdt

# @3-/extract

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/extract > extract extractLi
console.log extract('12<a>b</a>23','<a>','</a>')
for i from extractLi('<a>a</a>12<a>b</a>23','<a>','</a>')
  console.log i
```

output :

```
b
a
b
```

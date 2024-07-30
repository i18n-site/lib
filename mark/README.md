[‼️]: ✏️README.mdt

# @3-/mark

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/mark
#   @3-/uridir
#   path > join

# ROOT = uridir(import.meta)

# console.log mark "# 测试 <br _tex23x_> <br>"
# console.log mark "# 测试 <br _tex23x_> <br> o'tish"
# console.log mark "# 测试 <br _12_> <br>"
# console.log mark "o'tish"

txt = '''
| Syntax      | Description |
| ----------- | ----------- |
| Header      | Title       |
| Paragraph   | Text        |

'''

console.log mark txt
```

output :

```
<table>
<thead>
<tr>
<th>Syntax</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>Header</td>
<td>Title</td>
</tr>
<tr>
<td>Paragraph</td>
<td>Text</td>
</tr>
</tbody>
</table>
```

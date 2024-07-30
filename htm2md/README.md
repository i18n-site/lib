[‼️]: ✏️README.mdt

# @3-/htm2md

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/htm2md

for htm from [
  '<h1>I18N.SITE · 文档无国界 <img src="//ok0.pw/5l" style="width:42px;float:right;margin-top:6px"></h1>'
  '<p>test&gt;</p>'
  '<p>test&gt;<a href="#">b</a></p>'
  '<p>修改译文后需要重新运行 <code>./i18n.sh</code> 更新缓存。</p>'
  '<p>修改译文后需要重新运行 <a href="/">./i18n.sh</a> 更新缓存。</p>'
  '<img src="/x.png" alt="123" />'
  '<img src="/x.png" alt="123" style="width:100px">'
  '<p>需要在 ``` 之后表明语言， 比如 <code>```rust</code> 。</p>'
  '<p>我想说，<strong>只有做了全站国际化，才能支持多语种的站内全文搜索和搜索引擎优化</strong>。</p>'
]
  console.log htm2md htm
```

output :

```
# I18N.SITE · 文档无国界 <img src="//ok0.pw/5l" style="width:42px;float:right;margin-top:6px">
test&gt;
test&gt;[b](#)
修改译文后需要重新运行 `./i18n.sh` 更新缓存。
修改译文后需要重新运行 [./i18n.sh](/) 更新缓存。
![123](/x.png)
<img src="/x.png" alt="123" style="width:100px">
需要在 \``` 之后表明语言， 比如 ` ```rust` 。
我想说，**只有做了全站国际化，才能支持多语种的站内全文搜索和搜索引擎优化**。
```

# @3-/fli

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/fli

url_list = [
  "https://jsonplaceholder.typicode.com/posts/1"  # 一个返回 JSON 的公共 API
  "https://jsonplaceholder.typicode.com/posts/2"
  "https://jsonplaceholder.typicode.com/posts/3"
  "https://jsonplaceholder.typicode.com/posts/4"
  "https://jsonplaceholder.typicode.com/posts/5"
  "https://jsonplaceholder.typicode.com/posts/6"
  "https://jsonplaceholder.typicode.com/posts/7"
  "https://jsonplaceholder.typicode.com/posts/8"
  "https://jsonplaceholder.typicode.com/posts/9"
  "https://jsonplaceholder.typicode.com/posts/10"
]
iter = fli(
  url_list
  (url)=>
    (await fetch(url)).json()
)

# console.log await iter.next()
# console.log await iter.next()
# console.log await iter.next()

for await [r, err] from fli(
  url_list
  (url)=>
    (await fetch(url)).json()
  3
)
  console.log '\n'+r.id+'\n',r, err
```

output :

```

4
 {
  userId: 1,
  id: 4,
  title: 'eum et est occaecati',
  body: 'ullam et saepe reiciendis voluptatem adipisci\n' +
    'sit amet autem assumenda provident rerum culpa\n' +
    'quis hic commodi nesciunt rem tenetur doloremque ipsam iure\n' +
    'quis sunt voluptatem rerum illo velit'
} undefined

5
 {
  userId: 1,
  id: 5,
  title: 'nesciunt quas odio',
  body: 'repudiandae veniam quaerat sunt sed\n' +
    'alias aut fugiat sit autem sed est\n' +
    'voluptatem omnis possimus esse voluptatibus quis\n' +
    'est aut tenetur dolor neque'
} undefined

6
 {
  userId: 1,
  id: 6,
  title: 'dolorem eum magni eos aperiam quia',
  body: 'ut aspernatur corporis harum nihil quis provident sequi\n' +
    'mollitia nobis aliquid molestiae\n' +
    'perspiciatis et ea nemo ab reprehenderit accusantium quas\n' +
    'voluptate dolores velit et doloremque molestiae'
} undefined

7
 {
  userId: 1,
  id: 7,
  title: 'magnam facilis autem',
  body: 'dolore placeat quibusdam ea quo vitae\n' +
    'magni quis enim qui quis quo nemo aut saepe\n' +
    'quidem repellat excepturi ut quia\n' +
    'sunt ut sequi eos ea sed quas'
} undefined

8
 {
  userId: 1,
  id: 8,
  title: 'dolorem dolore est ipsam',
  body: 'dignissimos aperiam dolorem qui eum\n' +
    'facilis quibusdam animi sint suscipit qui sint possimus cum\n' +
    'quaerat magni maiores excepturi\n' +
    'ipsam ut commodi dolor voluptatum modi aut vitae'
} undefined

9
 {
  userId: 1,
  id: 9,
  title: 'nesciunt iure omnis dolorem tempora et accusantium',
  body: 'consectetur animi nesciunt iure dolore\n' +
    'enim quia ad\n' +
    'veniam autem ut quam aut nobis\n' +
    'et est aut quod aut provident voluptas autem voluptas'
} undefined

10
 {
  userId: 1,
  id: 10,
  title: 'optio molestias id quia eum',
  body: 'quo et expedita modi cum officia vel magni\n' +
    'doloribus qui repudiandae\n' +
    'vero nisi sit\n' +
    'quos veniam quod sed accusamus veritatis error'
} undefined
```

## About

This project is an open-source component of [i18n.site ⋅ Internationalization Solution](https://i18n.site).

* [i18 : MarkDown Command Line Translation Tool](https://i18n.site/i18)

  The translation perfectly maintains the Markdown format.

  It recognizes file changes and only translates the modified files.

  The translated Markdown content is editable; if you modify the original text and translate it again, manually edited translations will not be overwritten (as long as the original text has not been changed).

* [i18n.site : MarkDown Multi-language Static Site Generator](https://i18n.site/i18n.site)

  Optimized for a better reading experience

## 关于

本项目为 [i18n.site ⋅ 国际化解决方案](https://i18n.site) 的开源组件。

* [i18 :  MarkDown命令行翻译工具](https://i18n.site/i18)

  翻译能够完美保持 Markdown 的格式。能识别文件的修改，仅翻译有变动的文件。

  Markdown 翻译内容可编辑；如果你修改原文并再次机器翻译，手动修改过的翻译不会被覆盖（如果这段原文没有被修改）。

* [i18n.site : MarkDown多语言静态站点生成器](https://i18n.site/i18n.site) 为阅读体验而优化。

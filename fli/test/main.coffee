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
  10
)
  console.log '\n'+r.id+'\n',r, err

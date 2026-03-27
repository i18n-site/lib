#!/usr/bin/env coffee

> @3-/wget

url = 'https://www.baidu.com/robots.txt'
path = import.meta.dirname+'/downloads/file.txt'
await wget(url, path)

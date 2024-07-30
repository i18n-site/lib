[‼️]: ✏️README.mdt

# @3-/read

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/read/rJson.js
  path > join dirname

{dirname:dir} = import.meta

dir = dirname dir

console.log dir
o = rJson join(dir,'package.json')
console.log o
console.log o.name
```

output :

```
/Users/z/i18n/lib/read
{
  name: '@3-/read',
  version: '0.1.2',
  repository: 'https://atomgit.com/i18n/lib.git',
  homepage: 'https://atomgit.com/i18n/lib/tree/dev/read',
  author: 'i18n.site@gmail.com',
  license: 'Apache-2.0',
  exports: { '.': './lib/index.js', './*': './lib/*' },
  files: [ 'lib/*' ],
  devDependencies: {},
  scripts: {},
  type: 'module'
}
@3-/read
```

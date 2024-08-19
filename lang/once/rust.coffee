#!/usr/bin/env coffee

> ../src/index.js:LANG
  @3-/write
  path > join dirname
  os > homedir
  fs > copyFileSync
  ../src/name/zh.js:_ZH
  ../src/CODE.js:CODE
  ../src/name/en.js:_EN

ZH = new Map CODE.map (i,p)=> [i,_ZH[p]]
EN = new Map CODE.map (i,p)=> [i,_EN[p]]

alias = {
zh:'zh-CN'
he: 'iw'
jv: 'jw'
}

code_enum = []
name_code = []
lang_code = []
code_li = []
name_li = []

console.log LANG
for [code, name],pos in LANG
  code_li.push code
  varname = code.split('-').map(
    (i, pos)=>
      i[0].toUpperCase()+i.slice(1).toLowerCase()
  ).join('')
  code_enum.push(varname + ' = '+ pos)
  lang_code.push(code)
  t = [code,varname,name]
  name_code.push(t)
  name_li.push t
  a = alias[code]
  if a
    name_code.push([a,varname,name])

out = join homedir(),'i18n/rust/lang/src'

write(
  join out,'lang.rs'
  """
use strum::{EnumIter, EnumCount};
use int_enum::IntEnum;

#[repr(u16)]
#[derive(
  EnumIter, Hash, PartialEq, Eq, Clone, Debug, Copy, IntEnum, EnumCount, Ord, PartialOrd
)]
pub enum Lang {
  #{code_enum.join(',\n  ')}
}
  """
)

write(
  join out,'lang_code.rs'
  """pub static LANG_CODE: [&str; #{lang_code.length}] = #{JSON.stringify lang_code};"""
)

for [
    name, lang
] from [
  [
    'cn', ZH
  ]
  [
    'en', EN
  ]
]

  write(
    join out,name+'.rs'
    """
  pub static LANG_#{name.toUpperCase()}: [&str;#{name_li.length}] = [
#{name_li.map(
    ([n,c,native_name])=>
      "\"#{lang.get(n)}\","
  ).join('\n')}
  ];
    """
  )

write(
  join out,'lang_name.rs'
  """
pub static LANG_NAME: [&str;#{name_li.length}] = [
#{name_li.map(
  ([n,c,native_name])=>
    console.log native_name
    """
"#{native_name.replace('\u202b','\\u{202b}').replace('\u202c','\\u{202c}')}", // #{
  [
    EN.get(n)
    ZH.get(n)
  ].join(' / ')
}"""
).join('\n')}
];
  """
)

# write(
#   join out,'code_lang.rs'
#   """use phf::{phf_map, Map};
#
# use crate::Lang;
#
# pub static CODE_LANG: Map<&'static str, Lang> = phf_map! {
# #{name_code.map(
#   ([n,c,native_name])=>
#     console.log native_name
#     "\"#{n.toLowerCase()}\" => Lang::#{c}, // #{
#       [
#         native_name.trim().replace('\u202b','').replace('\u202c','')
#         EN.get(n)
#         ZH.get(n)
#       ].join(' / ')
#     }"
# ).join('\n')}
# };
#   """
# )

lang_code_md = """# 语言代码

语言代码的编号是固定的，新的语言将在后面追加。

| 编号 | 代码 | 语言名 | 英文名 | 显示名 |
| - | - | - | - | - |
#{
  LANG.map(
    ([n,native_name],pos)=>
      '| ' + [
        pos
        "`#{n}`"
        "#{ZH.get(n)}"
        "`#{EN.get(n)}`"
        "`#{native_name.trim().replace('\u202b','').replace('\u202c','')}`"
      ].join(' | ')+' |\n'
  ).join('')
}
"""

write(
  join out, '../README.mdt'
  lang_code_md
)

lang_code_md = """# 语言代码

语言代码的编号是固定的，新的语言将在后面追加。

| 编号 | 代码 | 语言 | 显示名 |
| - | - | - | - |
#{
  LANG.map(
    ([n,native_name],pos)=>
      '| ' + [
        pos
        "`#{n}`"
        "#{ZH.get(n)}"
        "`#{native_name.trim().replace('\u202b','').replace('\u202c','')}`"
      ].join(' | ')+' |\n'
  ).join('')
}
"""

write(
  join homedir(),'i18n/md/zh/i18/LANG_CODE.md'
  lang_code_md
)

write(
  join out,'../code.txt'
  """#{code_li.join('\n')}"""
)

copyFileSync(
  join dirname(import.meta.dirname), 'src/CODE.js'
  join homedir(),'i18n/18x/src/LANG_CODE.js'
)

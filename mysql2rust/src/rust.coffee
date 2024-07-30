#!/usr/bin/env coffee

INT_TYPE = {
  BIGINT: 64
  INT: 32
  MEDIUMINT: 32
  SMALLINT: 16
  TINYINT: 8
}
F_TYPE = {
  FLOAT: 'f32'
  DOUBLE: 'f64'
}
S_TYPE = {
  VARBINARY: 'String'
  VARCHAR: 'String'
  TEXT: 'String'
  MIDDLETEXT: 'String'
  LONGTEXT: 'String'
  BLOB: 'Vec<u8>'
  MEDIUMBLOB: 'Vec<u8>'
  LONGBLOB: 'Vec<u8>'
}

RT_TYPE = {
  ...F_TYPE
  ...S_TYPE
}

< (GEN)=>
  rust = [
    'pub use mysql_macro::*;\n'
  ]

  for [fn, args, _return, option] from GEN
    if _return
      t = _return.split ' '
      rtype = INT_TYPE[t[0]]
      if rtype
        if t[1] == 'UNSIGNED'
          rtype = 'u'+rtype
        else
          rtype = 'i'+rtype
      else
        [rtype]=t
        p = rtype.indexOf('(')
        if ~p
          rtype = rtype.slice(0,p)
        rtype = RT_TYPE[rtype] or rtype
      func = 'q1'
      if option
        rtype = 'Option<'+rtype+'>'
    else
      rtype = '()'
      func = 'e'

    # used.add func
    format = 0
    qli = []
    mli = []
    ali = []
    fli = []
    for i from args
      [name,type] = i = i.split(' ')
      ty = INT_TYPE[type]
      qpush = (i)=>
        format = 1
        qli.push i
        return
      if ty
        if i[2] == 'UNSIGNED'
          ty = 'u'+ty
        else
          ty = 'i'+ty
        qpush("{#{name}}")
      else
        ty = F_TYPE[type]
        if ty
          qpush("{#{name}}")
        else
          p = type.indexOf '('
          if ~p
            num = +type.slice(p+1,-1)
            type = type.slice(0,p)
          ty = S_TYPE[type]
          qli.push('?')
          if ty
            if num != 255 and type.includes 'BINARY'
              ty = '&[u8]'
              fli.push name
            else
              ty = 'impl AsRef<str>'
              fli.push "#{name}.as_ref()"
          else if type == 'BINARY'
            ty = "[u8;#{num}]"
            fli.push name
          else
            console.log "⚠️ UNDEFINED",type, num
      ali.push("#{name}:#{ty}")
      mli.push name

    if fli.length
      fli = ','+fli.join(',')
    sql = JSON.stringify "SELECT #{fn}(#{qli.join(',')})"

    rust.push """
  pub async fn #{fn}(#{ali.join(',')})->Result<#{rtype}>{"""
    if format
      rust.push "let sql = format!(#{sql});"
      sql = 'sql'

    rust.push """
    Ok(#{func}!(#{sql}#{fli}))
  }

#[macro_export]
macro_rules! #{fn} {
(#{mli.map((i)=>"$#{i}:expr").join(',')}) => {
$crate::#{fn}(#{mli.map((i)=>'$'+i).join(',')}).await?
};
}\n"""

  rust = rust.join('\n')
  """
#[allow(non_snake_case,clippy::too_many_arguments)]
mod r#fn {
  #{rust}
}

pub use r#fn::*;
  """

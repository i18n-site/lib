> protobufjs:Pb
  @3-/snake > SNAKE

DEFAULT_0 = new Set [
  'double'
  'enum_'
  'fixed32'
  'fixed64'
  'float'
  'i32'
  'i64'
  'sfixed32'
  'sfixed64'
  'sint32'
  'sint64'
  'u32'
  'u64'
]

NODEFAULT = 'nodefault'

typeName = (type)=>
  if ['uint64','uint32','int64','int32'].includes(type)
    type = type.replace('uint','u').replace('int','i')
  return type

< (proto_fp)=>
  pb = await Pb.load proto_fp

  li = []
  lip = li.push.bind li

  enum_set = new Set
  cast_set = new Set
  decode_import = new Set
  decode_default = 0

  has_bin = 0
  has_bin1 = 0

  castTypeDefault = (cast_type)=>
    if DEFAULT_0.has cast_type
      v = 0
    else
      char0 = cast_type.charAt(0)
      if char0.toLowerCase() != char0
        v = '$'+cast_type+'(BIN1)$'
        has_bin1 = 1
      else
        switch cast_type
          when 'string'
            v = ''
          when 'bool'
            v = false
          when 'bytes'
            v = '$BIN$'
            has_bin = 1
    v

  for ns from Object.values pb.nested
    if not ns.nested
      continue
    for [k,any] from Object.entries ns.nested
      nodefault = 0

      {comment} = any
      if comment
        comment = new Set comment.trim().split(' ')
        if comment.has NODEFAULT
          nodefault = 1

      cls = any.constructor.className
      switch cls
        when 'Enum'
          enum_set.add k
          lip "/* Enum #{k} */"
          for [ek,ev] from Object.entries any.values
            lip 'export const ' + SNAKE(k) + '_' + SNAKE(ek) + ' = ' + ev
          lip ''

        when 'Type'
          meta_li = []
          max_key_len = 0
          for [key, o] from Object.entries any.fields
            {type, repeated, id, optional, keyType} = o
            if key.length > max_key_len
              max_key_len = key.length

            meta_li.push [id, repeated, key, type, o.options?.proto3_optional, keyType]

          meta_li.sort((a,b)=>a[0]-b[0])

          pos = 0
          func_li = []
          comment_li = []
          default_li = []
          array_pos = []
          map_pos = []

          for [id, repeated, key, type, optional, keyType] from meta_li

            type0 = type.charAt 0
            cast_prefix = '$'
            is_int_li = false

            if type0.toLowerCase() != type0
              if enum_set.has type
                cast_type = 'enum_'
                cast_set.add cast_type
              else
                cast_prefix = ''
                cast_type = type
            else
              if keyType
                keyType = typeName keyType
                type = typeName type
                default_k = JSON.stringify castTypeDefault(keyType)
                default_v = JSON.stringify castTypeDefault(type)
                cast_type = "kv($#{keyType},#{default_k},$#{type},#{default_v})"
                for i from [keyType,type]
                  cast_set.add i
                decode_import.add 'kv'
              else
                t = typeName type
                if t != type
                  type = t
                  if repeated
                    type += 'Li'
                    is_int_li = true
                cast_type = type
                cast_set.add cast_type

            --id

            if keyType
              rtype = "{#{keyType}:#{type}}"
              array_pos.push id
              map_pos.push id
              if not nodefault
                default_li[id] = 3
            else if repeated
              array_pos.push id
              if not nodefault
                default_li[id] = if is_int_li then 2 else 1
              rtype = "[#{type}]"
            else
              rtype = type
              if optional
                rtype += '?'
              else if not nodefault
                v = castTypeDefault cast_type
                if v != undefined
                  default_li[id] = v

            comment_li.push "#{id} #{key.padEnd(max_key_len)}\t#{rtype}"

            loop
              if id == pos
                ++pos
                func_li.push cast_prefix+cast_type
                break
              else
                ++pos
                func_li.push ''

          comment = '/*\n  '+comment_li.join('\n  ')+'\n*/'
          func_str = "[#{func_li.join(',')}],"

          # 全部都是数组
          if array_pos.length == default_li.length
            nodefault = 1

          if default_li.length == 1
            func_name = func_li[0]
            if array_pos.length and not (func_name.endsWith('Li') and func_name.startsWith('$'))
              if func_name.startsWith('$kv(')
                map = 'map'
                decode_import.add map
                decode = map + func_name.slice(3)
              else
                decode_import.add 'li'
                decode = """li(#{func_li[0]})"""
            else
              # import_one = 1
              # default_val = default_li[0]
              # if default_val != undefined
              #   default_val = ','+default_val
              # decode = """one(#{func_li[0]}#{default_val})"""
              lip "\nexport { default as #{k} #{comment}} from '@3-/proto/decode/#{func_li[0].slice(1)}.js'"
              continue
          else if nodefault
            decode_import.add NODEFAULT
            if map_pos.length
              decode = "nodefault(#{func_str}#{JSON.stringify array_pos.filter((i)=>!map_pos.includes(i))},#{JSON.stringify map_pos})"
            else
              decode = "nodefault(#{func_str}#{JSON.stringify array_pos})"
          else
            decode_default = 1
            decode = """decode(
              #{func_str}
              #{JSON.stringify(default_li).replaceAll('null','').replaceAll('"$','').replaceAll('$"','')}
            )"""

          lip "export const #{k} #{comment} = "+'$'+decode+'\n'

  js = li.join('\n').trim()

  decode = 'default as $decode'
  if decode_import.size
    decode_import = "#{[...decode_import].map((i)=>"#{i} as $#{i}").join(',')}"
    if decode_default
      decode_import = decode+','+decode_import
  else
    decode_import = decode

  import_ = [
    """import {#{decode_import}} from '@3-/proto/decode.js'
import {#{[...cast_set].map((i)=>"#{i} as $#{i}").join(',')}} from '@3-/proto/decode/types.js'"""
  ]
  if has_bin
    import_.push 'import BIN from "@3-/proto/decode/BIN.js"'
  if has_bin1
    import_.push 'import BIN1 from "@3-/proto/decode/BIN1.js"'

  import_.join('\n')+'\n\n'+js

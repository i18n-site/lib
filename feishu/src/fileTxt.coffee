
docTxt = (feishu, token)->
  {
    content
  } = await feishu.get 'docx/v1/documents/' + token + '/raw_content?lang=0'
  pos = content.indexOf('\n')
  if ~ pos
    content = content.slice(pos+1)
  content

fileTxt = (feishu, token)->
  feishu.reqTxt(
    'drive/v1/files/'+token+'/download'
  )

export default (feishu, file)=>
  {
    name
    type
    token
  } = file
  if type == 'shortcut'
    {
      target_type: type
      target_token: token
    } = file.shortcut_info
  switch type
    when 'file'
      pos = name.lastIndexOf('.')
      if ~pos
        if ['md','txt'].includes name.slice(pos+1)
          return [
            name.slice(0,pos)
            await fileTxt feishu, token
          ]
    when 'docx'
      return [
        name
        await docTxt feishu, token
      ]
  return

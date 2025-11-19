> ./index.js:cf

export default (
  prefix, host, id, content, ttl=600
)=>
  name = prefix + '.' + host
  li = await cf.GET "#{id}/dns_records?type=TXT&name="+name
  await Promise.all li.map (i)=>
    cf.DELETE(
      id+'/dns_records/'+i.id
    )
  cf.POST(
    id+'/dns_records'
    {
      type: 'TXT'
      name
      content
      ttl
    }
  )

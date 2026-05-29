> @huaweicloud/huaweicloud-sdk-core:core
  @huaweicloud/huaweicloud-sdk-dns/v2/public-api.js:dns
  @3-/chunk

###

令牌申请
https://console.huaweicloud.com/iam/?locale=zh-cn#/mine/apiCredential

API 调试
https://console.huaweicloud.com/apiexplorer/#/openapi/DNS/sdk?api=ListPublicZones

###

export default (ak,sk,endpoint,project_id)=>
  HW = dns.DnsClient.newBuilder()
    .withCredential(
      new core.BasicCredentials()
      .withAk(ak)
      .withSk(sk)
      .withProjectId(project_id)
    )
    .withEndpoint(endpoint)
    .build()

  zoneIdByName = (name)=>
    request = new dns.ListPublicZonesRequest()
    request.name = name
    result = await HW.listPublicZones(request)
    loop
      if result.httpStatusCode == 200
        zoneId = result.zones[0]?.id
        if zoneId
          return zoneId
      console.error(result)
    return

  (domain)=>
    prefixDomain = (prefix) =>
      if prefix
        return prefix+'.'+domain
      domain

    zoneId = await zoneIdByName(domain)
    setLi = (type, prefix, line_records_li)=>
      if not line_records_li.length
        return

      name = prefixDomain prefix

      for li from chunk(line_records_li,20)
        request = new dns.CreateRecordSetWithBatchLinesRequest()
        request.zoneId = zoneId
        body = new dns.CreateRSetBatchLinesReq()
        body.withLines li.map ([line,records,ttl])=>
          console.log 'new', type, name
          r = new dns.BatchCreateRecordSetWithLine()
                .withLine(line)
                .withRecords(records)
          if ttl
            r.withTtl(ttl)
          r
        body.withType(type)
        body.withName(name+'.')
        request.withBody(body)
        await HW.createRecordSetWithBatchLines(request)
      return

    rmIdLi = (id_li)=>
      for li from chunk(id_li,100)
        request = new dns.BatchDeleteRecordSetWithLineRequest()
        request.zoneId = zoneId
        body = new dns.BatchDeleteRecordSetWithLineRequestBody()
        body.withRecordsetIds(li)
        request.withBody(body)
        await HW.batchDeleteRecordSetWithLine(request)
      return

    ls = (prefix, type)=>
      name = prefixDomain prefix
      request = new dns.ShowRecordSetByZoneRequest()
      Object.assign(request, {
        zoneId
        name
      })
      if type
        request.type = type
      {recordsets} = await HW.showRecordSetByZone(request)
      return recordsets.filter(
        (o)=>
          o.name == name+'.'
      )

    rm = (prefix, type)=>
      id_li = (await ls(prefix,type)).map(({id})=>id)
      if id_li.length
        await rmIdLi id_li
      return
    {
      reset: (prefix, type_li)=>
        for [type, to_set_records] from Object.entries type_li
          if not Array.isArray to_set_records
            to_set_records = [to_set_records]
          exist_li = await ls(prefix, type)
          exist = false
          for i from exist_li
            li = i.records.map(
              (i)=>
                if i.endsWith('.')
                  return i.slice(0,-1)
                i
            ).toSorted()
            if JSON.stringify(to_set_records.toSorted()) ==  JSON.stringify(li)
              exist = true
              continue
            else
              await rmIdLi([i.id])
          if not exist
            await setLi(type, prefix, [
              [
                'default_view'
                to_set_records
              ]
            ])
        return
      ls
      set:(type, prefix, content, ttl)=>
        set = ()=>
          setLi(
            type
            prefix
            [
              [
                'default_view'
                [
                  content
                ]
                ttl
              ]
            ]
          )
        try
          await set()
        catch err
          await rm(prefix, type)
          await set()
        return

      setLi
      rm
    }

# export setStatus = (id, status)=>
#   request = new dns.SetRecordSetsStatusRequest()
#   request.recordsetId = id
#   body = new dns.SetRecordSetsStatusReq()
#   body.withStatus status
#   request.withBody(body)
#   HW.setRecordSetsStatus(request)
#
# export disable = (id)=>
#   setStatus id,'DISABLE'
#
# export enable = (id)=>
#   setStatus id,'ENABLE'
#
#
#
# export update = (
#   zoneId
#   to_update # [[id,line], ip_li]
# )=>
#   for update_li from chunk(to_update, 50)
#     request = new dns.BatchUpdateRecordSetWithLineRequest()
#     request.zoneId = zoneId
#     body = new dns.BatchUpdateRecordSetWithLineReq()
#
#     body.withRecordsets update_li.map ([[id,line], li])=>
#       console.log 'update', line, li
#       new dns.BatchUpdateRecordSet()
#         .withId(id)
#         .withRecords(li)
#
#     request.withBody(body)
#     await HW.batchUpdateRecordSetWithLine(request)
#   return

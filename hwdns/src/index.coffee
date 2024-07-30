> @huaweicloud/huaweicloud-sdk-core:core
  @huaweicloud/huaweicloud-sdk-dns/v2/public-api.js:dns
  lodash-es > chunk

###

令牌申请
https://console.huaweicloud.com/iam/?locale=zh-cn#/mine/apiCredential

API 调试
https://console.huaweicloud.com/apiexplorer/#/openapi/DNS/sdk?api=ListPublicZones

###

{
  HW_AK
  HW_SK
} = process.env

< DEFAULT_VIEW = 'default_view'

endpoint = "https://dns.cn-north-4.myhuaweicloud.com"
project_id = ""

credentials = new core.BasicCredentials()
.withAk(HW_AK)
.withSk(HW_SK)
.withProjectId(project_id)

export HW = dns.DnsClient.newBuilder()
.withCredential(credentials)
.withEndpoint(endpoint)
.build()

export zoneIdByName = (name)=>
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

export showRecordSetByZone = (
  opt
)=>
  request = new dns.ShowRecordSetByZoneRequest()
  Object.assign(request, opt)
  HW.showRecordSetByZone(request)

export setStatus = (id, status)=>
  request = new dns.SetRecordSetsStatusRequest()
  request.recordsetId = id
  body = new dns.SetRecordSetsStatusReq()
  body.withStatus status
  request.withBody(body)
  HW.setRecordSetsStatus(request)

export disable = (id)=>
  setStatus id,'DISABLE'

export enable = (id)=>
  setStatus id,'ENABLE'

export create = (zoneId, type, name, all)=>
  if not all.length
    return

  for li from chunk(all,20)
    request = new dns.CreateRecordSetWithBatchLinesRequest()
    request.zoneId = zoneId
    body = new dns.CreateRSetBatchLinesReq()
    body.withLines li.map ([line,records])=>
      console.log 'new', type, name, line ,records
      new dns.BatchCreateRecordSetWithLine()
            .withLine(line)
            .withRecords(records)
    body.withType(type)
    body.withName(name+'.')
    request.withBody(body)
    await HW.createRecordSetWithBatchLines(request)
  return

export rm = (zoneId, recordsetId)=>
  for li from chunk(recordsetId,100)
    request = new dns.BatchDeleteRecordSetWithLineRequest()
    request.zoneId = zoneId
    body = new dns.BatchDeleteRecordSetWithLineRequestBody()
    body.withRecordsetIds(li)
    request.withBody(body)
    await HW.batchDeleteRecordSetWithLine(request)
  return

export update = (
  zoneId
  to_update # [[id,line], ip_li]
)=>
  for update_li from chunk(to_update, 50)
    request = new dns.BatchUpdateRecordSetWithLineRequest()
    request.zoneId = zoneId
    body = new dns.BatchUpdateRecordSetWithLineReq()

    body.withRecordsets update_li.map ([[id,line], li])=>
      console.log 'update', line, li
      new dns.BatchUpdateRecordSet()
        .withId(id)
        .withRecords(li)

    request.withBody(body)
    await HW.batchUpdateRecordSetWithLine(request)
  return
  # exist = new Map
  # offset = 0
  # limit = 500
  # to_rm = []
  # loop
  #   offset += limit
  #   {
  #     recordsets
  #     metadata:{
  #       total_count
  #     }
  #   } = await HW.showRecordSetByZone(request)
  #   for i from recordsets
  #     if i.name.slice(0,-1) == name
  #       {id,line,records} = i
  #       pre = exist.get(line)
  #       if pre
  #         console.log '删除重复线路',line
  #         to_rm.push id
  #         continue
  #       records.sort()
  #       exist.set(line,[
  #         id
  #         records
  #       ])
  #   console.log total_count
  #   if offset >= total_count
  #     break
  # console.log name, type+'记录条目数', exist.size
  # await rm(zoneId, to_rm)

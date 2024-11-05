#!/usr/bin/env coffee

> @3-/hwdns/purge


# await purge 'i18n.site'


# MX 数值越小优先级越高





###
if recordsets.length > 0
  console.log await rm(zoneId, recordsets.map (i)=>i.id)
###

# console.log await enable()

# console.log zoneId

#
# for i from acme.recordsets
#   console.log i.name, i.status, i.type
#   if i.status == 'ACTIVE'
#     await disable i.id
#
# for i from acme.recordsets
#   console.log i.name, i.status, i.type
#   await enable i.id


console.log ''

# const client = dns.DnsClient.newBuilder()
#                             .withCredential(credentials)
#                             .withEndpoint(endpoint)
#                             .build();
# const request = new dns.SetRecordSetsStatusRequest();
# request.recordsetId = "123";
# const body = new dns.SetRecordSetsStatusReq();
# body.withStatus("DISABLE");
# request.withBody(body);
# const result = client.setRecordSetsStatus(request);
# result.then(result => {
#     console.log("JSON.stringify(result)::" + JSON.stringify(result));
# }).catch(ex => {
#     console.log("exception:" + JSON.stringify(ex));
# });

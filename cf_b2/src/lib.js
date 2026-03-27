

const rm_b2_headers = [
  "X-Bz-Upload-Timestamp",
  "x-bz-content-sha1",
  "x-bz-file-id",
  "x-bz-file-name",
  "x-bz-info-src_last_modified_millis",
  "x-cloud-trace-context",
]

const rm_cdn_headers = [
  "age",
  "date",
  "last-modified",
  "nel",
  "report-to",
]

const b2_headers = Object.fromEntries([
  ["access-control-allow-origin", { operation: "set", value: "*" }],
  ...rm_b2_headers.map((h) => [h, { operation: "remove" }]),
])

const cdn_headers = Object.fromEntries(
  rm_cdn_headers.map((h) => [h, { operation: "remove" }])
)

const addHostToExpression = (expr, new_host) => {
  let hosts = []
  if (expr) {
    const match_in = expr.match(/\(http\.host in \{(.+?)\}\)/)
    if (match_in) hosts = match_in[1].split(/\s+/).map(s => s.replace(/"/g, ''))
      
    const match_eq = expr.match(/\(http\.host eq "(.+?)"\)/)
    if (match_eq) hosts = [match_eq[1]]
  }
  if (!hosts.includes(new_host)) hosts.push(new_host)
  return `(http.host in {${hosts.map(h => `"${h}"`).join(" ")}})`
}

const getRules = async (cf, zone_id, phase) => {
  const res = await cf.rulesets.phases.get(phase, { zone_id }).catch(() => ({}))
  return res.rules || []
}

const cleanDns = async (cf, zone_id, host) => {
  for await (const r of cf.dns.records.list({ zone_id, name: host, type: "CNAME" })) {
    console.log(`  删除已有 CNAME: ${r.name} → ${r.content}`)
    await cf.dns.records.delete(r.id, { zone_id })
  }
}

const bind = async (cf, zone_id, host, backblazeb2, bucket) => {
  await cleanDns(cf, zone_id, host)

  const req_rules = await getRules(cf, zone_id, "http_request_transform")
  const res_rules = await getRules(cf, zone_id, "http_response_headers_transform")

  const req_desc = `${host} → b2:${bucket}`
  const new_req_rules = req_rules.filter(r => r.description !== req_desc)
  
  new_req_rules.push({
    action: "rewrite",
    action_parameters: {
      uri: { path: { expression: `concat("/file/${bucket}", http.request.uri.path)` } }
    },
    description: req_desc,
    expression: `(http.host in {"${host}"})`,
    enabled: true,
  })

  let b2_expr = ""
  const b2_old = res_rules.find(r => r.description === "rm_b2_head")
  if (b2_old) b2_expr = b2_old.expression

  const new_res_rules = res_rules.filter(r => r.description !== "rm_b2_head" && r.description !== "删除cdn头")
  
  new_res_rules.push({
    action: "rewrite",
    action_parameters: { headers: b2_headers },
    description: "rm_b2_head",
    expression: addHostToExpression(b2_expr, host),
    enabled: true,
  })

  new_res_rules.push({
    action: "rewrite",
    action_parameters: { headers: cdn_headers },
    description: "删除cdn头",
    expression: "true",
    enabled: true,
  })

  const r = await Promise.allSettled([
    cf.dns.records.create({
      zone_id,
      content: backblazeb2,
      name: host,
      proxied: true,
      ttl: 1,
      type: "CNAME",
      comment: "",
      tags: [],
    }),
    cf.rulesets.phases.update("http_request_transform", { zone_id, rules: new_req_rules }),
    cf.rulesets.phases.update("http_response_headers_transform", { zone_id, rules: new_res_rules }),
  ])

  for (const i of r) {
    if (i.status === "rejected") console.error("  ✗", i.reason?.message || i.reason)
  }
}

export default bind



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

const cleanDns = async (cf, zone_id, host) => {
  for await (const r of cf.dns.records.list({ zone_id, name: host, type: "CNAME" })) {
    console.log(`  删除已有 CNAME: ${r.name} → ${r.content}`)
    await cf.dns.records.delete(r.id, { zone_id })
  }
}

const bind = async (cf, zone_id, host, backblazeb2, bucket) => {
  await cleanDns(cf, zone_id, host)

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
    cf.rulesets.phases.update("http_request_transform", {
      zone_id,
      rules: [
        {
          action: "rewrite",
          action_parameters: {
            uri: {
              path: {
                expression: `concat("/file/${bucket}", http.request.uri.path)`,
              },
            },
          },
          description: `${host} → b2:${bucket}`,
          expression: `(http.host eq ${JSON.stringify(host)})`,
          enabled: true,
        },
      ],
    }),
    cf.rulesets.phases.update("http_response_headers_transform", {
      zone_id,
      rules: [
        {
          action: "rewrite",
          action_parameters: { headers: b2_headers },
          description: "rm_b2_head",
          expression: `(http.host eq ${JSON.stringify(host)})`,
          enabled: true,
        },
        {
          action: "rewrite",
          action_parameters: { headers: cdn_headers },
          description: "删除cdn头",
          expression: "true",
          enabled: true,
        },
      ],
    }),
  ])

  for (const i of r)
    if (i.status === "rejected") console.error("  ✗", i.reason?.message || i.reason)
}

export default bind

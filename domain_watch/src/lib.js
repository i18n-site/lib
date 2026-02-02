#!/usr/bin/env node

import sleep from '@3-/sleep'
import * as Domain20180129 from "@alicloud/domain20180129"
import * as $OpenApi from "@alicloud/openapi-client"
import Credential from "@alicloud/credentials"
import conf, {FEISHU_BOT} from "./conf.js"

const createClient = () => {
	const credential = new Credential.default({
		type: "access_key",
		...conf,
	})
	const config = new $OpenApi.Config({
		credential,
	})
	config.endpoint = `domain.aliyuncs.com`
	return new Domain20180129.default.default(config)
}

const main = async () => {
	const client = createClient()
	const checkDomainRequest = new Domain20180129.CheckDomainRequest({
		domainName: "i18n.site",
	})
	const { body } = await client.checkDomain(checkDomainRequest)
	let { avail } = body
	avail = +avail
	console.log((new Date).toLocaleString(), body)
  if(avail>0){
    await fetch(FEISHU_BOT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        msg_type: 'text',
        content: {
          text: `域名 ${checkDomainRequest.domainName} avail ${avail}`
        }
      })
    });
  }
}

while(1){
  try {
    await main()
  } catch (error) {
    console.error(error)
  }
  await sleep(1e3)
}

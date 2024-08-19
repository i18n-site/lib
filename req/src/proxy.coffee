#!/usr/bin/env coffee

> https-proxy-agent:agent
  node-fetch:fetch

{https_proxy} = process.env

export default proxy = {}
if https_proxy
  console.log "@3-/req use https_proxy",https_proxy
  Agent = agent.HttpsProxyAgent
  global.fetch = fetch
  proxy.agent = new Agent(https_proxy)


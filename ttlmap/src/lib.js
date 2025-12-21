#!/usr/bin/env bun

export default (ttl) => {
	const r = new Map(),
		set = r.set.bind(r),
		expire = []
	let timer
	r.set = (k, v) => {
		expire.push([new Date().getTime() + ttl, k])
		if (expire.length == 1) {
			timer = setInterval(() => {
				// console.log("interval")
				const now = new Date().getTime()
				while (expire.length) {
					const t = expire[0]
					if (t[0] <= now) {
						expire.shift()
						r.delete(t[1])
					} else {
						break
					}
				}
				if (!expire.length) {
					// console.log("clear interval")
					clearInterval(timer)
				}
			}, ttl)
		}
		set(k, v)
	}
	return r
}

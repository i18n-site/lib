export default (ss) => {
	ss = new URL(ss)
	const [加密方式, 密码, 插件参数] = Buffer.from(ss.username, "base64")
		.toString()
		.split(":")
	return [
		decodeURIComponent(ss.hash.slice(1)), // name
		ss.hostname,
		ss.port,
		加密方式,
		密码,
		插件参数,
	]
}

export default (METHOD) => {
	METHOD.HEAD = async (req, env, ctx) => {
		const r = await METHOD.GET(req, env, ctx)
		if (r) {
			if ([200, 404].includes(r.status)) {
				return new Response("", { headers: r.headers })
			}
			return r
		}
	}
	return METHOD
}

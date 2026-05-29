export default (url) => {
	const end = url.indexOf("/")
	return end < 0 ? url : url.slice(0, end)
}

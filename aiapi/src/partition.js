import seg from "./seg.js"
import txtLi from "@3-/txt_li"

const partition = async (li, title_number, remain_seg) => {
	let title = ""
	const order = title_number.sort((a, b) => a[1] - b[1])
	const result = []
	let start = 0

	for (const [t, row] of order) {
		console.log(t)
		const index = row - 1
		result.push(title + li.slice(start, index).join("\n"))
		title = "# " + t + "\n"
		start = index
	}

	if (start < li.length) {
		li = li.slice(start)
		const remain = li.join("\n")
		if (remain.length > 6000) {
			return result.concat(await remain_seg(li))
		} else {
			result.push(title + remain)
		}
	}

	return result
}

const repartition = (chat, len) => async (li) => {
	if (li.length == len) {
		return li
	}
	if (li.length == 1) {
		li = li[0].split("。")
	}
	return partition(li, await seg(chat, li), (i) =>
		repartition(chat, li.length)(i),
	)
}

export default async (chat, txt) => {
	const li = txtLi(txt)
	return partition(li, await seg(chat, li), repartition(chat, li.length))
}

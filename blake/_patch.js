const { createReadStream } = require("node:fs")

module.exports.hashFp = (fp) => {
	const b3 = new Blake3()
	return new Promise((resolve, reject) => {
		createReadStream(fp)
			.on("error", reject)
			.on("data", (bin) => {
				b3.update(bin)
			})
			.on("end", () => {
				resolve(b3.finalize())
			})
	})
}

module.exports.hashFpLen = (fp) => {
	const b3 = new Blake3()
	return new Promise((resolve, reject) => {
		let len = 0
		createReadStream(fp)
			.on("error", reject)
			.on("data", (bin) => {
				len += bin.length
				b3.update(bin)
			})
			.on("end", () => {
				resolve([b3.finalize(), len])
			})
	})
}

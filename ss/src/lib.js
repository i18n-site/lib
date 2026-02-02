import { Agent } from "node:https"
import { Socket } from "node:net"
import { Duplex } from "node:stream"
import { createBLAKE3 } from "hash-wasm"
import { Buffer } from "node:buffer"

const textEncoder = new TextEncoder()

const 创建主密钥 = async (密码) => {
	const hasher = await createBLAKE3()
	const hexPassword = Buffer.from(密码, "base64").toString()
	hasher.update(Buffer.from(hexPassword, "hex"))
	const digest = hasher.digest("binary")
	return digest.slice(0, 16)
}

const 创建会话密钥 = async (主密钥, salt) => {
	const hasher = await createBLAKE3()
	hasher.update(主密钥)
	hasher.update(salt)
	const digest = hasher.digest("binary")
	const keyData = digest.slice(0, 16)
	return crypto.subtle.importKey("raw", keyData, { name: "AES-GCM" }, false, [
		"encrypt",
		"decrypt",
	])
}

const createShadowsocksSocket = (会话密钥) => {
	let encryptNonce = 0n
	let decryptNonce = 0n
	let remoteBuffer = new Uint8Array(0)
	const remoteSocket = new Socket()

	const encrypt = async (data) => {
		const nonce = new Uint8Array(12)
		new DataView(nonce.buffer).setBigUint64(0, encryptNonce++, false)
		return new Uint8Array(
			await crypto.subtle.encrypt(
				{ name: "AES-GCM", iv: nonce },
				会话密钥,
				data,
			),
		)
	}

	const decrypt = async (data) => {
		const nonce = new Uint8Array(12)
		new DataView(nonce.buffer).setBigUint64(0, decryptNonce++, false)
		return new Uint8Array(
			await crypto.subtle.decrypt(
				{ name: "AES-GCM", iv: nonce },
				会话密钥,
				data,
			),
		)
	}

	const send = async (data) => {
		const lenBytes = new Uint8Array(2)
		new DataView(lenBytes.buffer).setUint16(0, data.length)
		const encryptedLen = await encrypt(lenBytes)
		const encryptedData = await encrypt(data)
		remoteSocket.write(encryptedLen)
		remoteSocket.write(encryptedData)
	}

	const duplex = new Duplex({
		write(chunk, encoding, callback) {
			send(chunk).then(() => callback()).catch(callback)
		},
		read(size) {},
		destroy(err, callback) {
			remoteSocket.destroy()
			callback(err)
		},
		final(callback) {
			remoteSocket.end(callback)
		},
	})

	const handleRemoteData = async (data) => {
		remoteBuffer = new Uint8Array([...remoteBuffer, ...data])
		while (true) {
			if (remoteBuffer.length < 2 + 16) break
			const lenBytes = await decrypt(remoteBuffer.slice(0, 2 + 16))
			const length = new DataView(lenBytes.buffer).getUint16(0)

			if (remoteBuffer.length < 2 + 16 + length + 16) break

			const payload = await decrypt(
				remoteBuffer.slice(2 + 16, 2 + 16 + length + 16),
			)
			duplex.push(payload)

			remoteBuffer = remoteBuffer.slice(2 + 16 + length + 16)
		}
	}

	remoteSocket.on("data", (data) =>
		handleRemoteData(data).catch((err) => duplex.emit("error", err)),
	)
	remoteSocket.on("close", () => duplex.emit("close"))
	remoteSocket.on("error", (err) => duplex.emit("error", err))
	remoteSocket.on("connect", () => duplex.emit("connect"))

	duplex.connect = (port, host, callback) => {
		remoteSocket.connect(port, host, callback)
	}
	duplex.send = send
	duplex.remoteSocket = remoteSocket

	return duplex
}

const createShadowsocksAgent = async (ssConfig) => {
	const 主密钥 = await 创建主密钥(ssConfig[4])
	const agent = new Agent({ keepAlive: true })

	agent.createConnection = (options, callback) => {
		const createSocketAsync = async () => {
			const salt = crypto.getRandomValues(new Uint8Array(16))
			const 会话密钥 = await 创建会话密钥(主密钥, salt)

			const ssSocket = createShadowsocksSocket(会话密钥)

			const [_, ssHost, ssPort] = ssConfig

			ssSocket.connect(ssPort, ssHost, async () => {
				ssSocket.remoteSocket.write(salt)

				const addrType = 3 // Domain
				const hostBytes = textEncoder.encode(options.host)
				const requestHeader = new Uint8Array(1 + 1 + hostBytes.length + 2)
				const view = new DataView(requestHeader.buffer)
				requestHeader[0] = addrType
				requestHeader[1] = hostBytes.length
				requestHeader.set(hostBytes, 2)
				view.setUint16(2 + hostBytes.length, options.port)

				await ssSocket.send(requestHeader)
			})

			return ssSocket
		}

		createSocketAsync()
			.then((socket) => callback(null, socket))
			.catch((err) => callback(err, null))
	}

	return agent
}

export default createShadowsocksAgent

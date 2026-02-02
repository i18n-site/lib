import B36 from "./B36.js"

/**
 * Decodes a base36 string to a Buffer.
 *
 * @param {string} str The base36 encoded string.
 * @returns {Buffer} The decoded Buffer.
 */
export default function base36Decode(str) {
	const result = []

	for (let i = 0; i < str.length; i++) {
		let carry = B36.indexOf(str[i])
		if (carry === -1) {
			throw new Error("Invalid base36 string")
		}

		// Multiply the current result by 36 and add the new digit
		for (let j = 0; j < result.length; j++) {
			const value = result[j] * 36 + carry
			result[j] = value & 0xff // Take the last 8 bits
			carry = value >> 8 // Carry over the remaining bits
		}

		while (carry > 0) {
			result.push(carry & 0xff)
			carry >>= 8
		}
	}

	return Buffer.from(result.reverse())
}

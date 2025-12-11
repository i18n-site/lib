import B36 from "./B36.js"

/**
 * Encodes a Buffer to a base36 string.
 *
 * @param {Buffer} buffer The Buffer to encode.
 * @returns {string} The base36 encoded string.
 */
export default (buffer) => {
	let result = ""
	let num = []

	// Convert Buffer to an array of decimal values
	for (let i = 0; i < buffer.length; i++) {
		num.push(buffer[i])
	}

	while (num.length > 0) {
		let remainder = 0
		const quotient = []

		// Perform long division with base 36
		for (let i = 0; i < num.length; i++) {
			const dividend = num[i] + remainder * 256
			const newDigit = Math.floor(dividend / 36)
			remainder = dividend % 36

			if (quotient.length > 0 || newDigit > 0) {
				quotient.push(newDigit)
			}
		}

		result = B36[remainder] + result
		num = quotient
	}

	return result
}

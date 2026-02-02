const merge = (target, ...sources) => {
	for (const source of sources) {
		for (const key of Object.keys(source)) {
			const target_val = target[key]
			const source_val = source[key]

			target[key] =
				Array.isArray(target_val) && Array.isArray(source_val)
					? target_val.concat(source_val)
					: target_val?.constructor === Object
						? merge(target_val, source_val)
						: source_val
		}
	}
	return target
}

export default merge

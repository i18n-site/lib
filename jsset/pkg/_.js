let wasm

const cachedTextDecoder =
	typeof TextDecoder !== "undefined"
		? new TextDecoder("utf-8", { ignoreBOM: true, fatal: true })
		: {
				decode: () => {
					throw Error("TextDecoder not available")
				},
			}

if (typeof TextDecoder !== "undefined") {
	cachedTextDecoder.decode()
}

let cachedUint8ArrayMemory0 = null

function getUint8ArrayMemory0() {
	if (
		cachedUint8ArrayMemory0 === null ||
		cachedUint8ArrayMemory0.byteLength === 0
	) {
		cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer)
	}
	return cachedUint8ArrayMemory0
}

function getStringFromWasm0(ptr, len) {
	ptr = ptr >>> 0
	return cachedTextDecoder.decode(
		getUint8ArrayMemory0().subarray(ptr, ptr + len),
	)
}

let WASM_VECTOR_LEN = 0

function passArray8ToWasm0(arg, malloc) {
	const ptr = malloc(arg.length * 1, 1) >>> 0
	getUint8ArrayMemory0().set(arg, ptr / 1)
	WASM_VECTOR_LEN = arg.length
	return ptr
}

function getArrayU8FromWasm0(ptr, len) {
	ptr = ptr >>> 0
	return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len)
}

const JsSetFinalization =
	typeof FinalizationRegistry === "undefined"
		? { register: () => {}, unregister: () => {} }
		: new FinalizationRegistry((ptr) => wasm.__wbg_jsset_free(ptr >>> 0, 1))

export class JsSet {
	static __wrap(ptr) {
		ptr = ptr >>> 0
		const obj = Object.create(JsSet.prototype)
		obj.__wbg_ptr = ptr
		JsSetFinalization.register(obj, obj.__wbg_ptr, obj)
		return obj
	}

	__destroy_into_raw() {
		const ptr = this.__wbg_ptr
		this.__wbg_ptr = 0
		JsSetFinalization.unregister(this)
		return ptr
	}

	free() {
		const ptr = this.__destroy_into_raw()
		wasm.__wbg_jsset_free(ptr, 0)
	}
	constructor() {
		const ret = wasm.jsset_new()
		this.__wbg_ptr = ret >>> 0
		JsSetFinalization.register(this, this.__wbg_ptr, this)
		return this
	}
	/**
	 * @param {Uint8Array} key
	 */
	add(key) {
		const ptr0 = passArray8ToWasm0(key, wasm.__wbindgen_malloc)
		const len0 = WASM_VECTOR_LEN
		wasm.jsset_add(this.__wbg_ptr, ptr0, len0)
	}
	/**
	 * @param {Uint8Array} key
	 * @returns {boolean}
	 */
	has(key) {
		const ptr0 = passArray8ToWasm0(key, wasm.__wbindgen_malloc)
		const len0 = WASM_VECTOR_LEN
		const ret = wasm.jsset_has(this.__wbg_ptr, ptr0, len0)
		return ret !== 0
	}
	/**
	 * @returns {Uint8Array}
	 */
	dump() {
		const ret = wasm.jsset_dump(this.__wbg_ptr)
		var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice()
		wasm.__wbindgen_free(ret[0], ret[1] * 1, 1)
		return v1
	}
	/**
	 * @param {Uint8Array} bin
	 * @returns {JsSet}
	 */
	static load(bin) {
		const ptr0 = passArray8ToWasm0(bin, wasm.__wbindgen_malloc)
		const len0 = WASM_VECTOR_LEN
		const ret = wasm.jsset_load(ptr0, len0)
		return JsSet.__wrap(ret)
	}
	/**
	 * @returns {number}
	 */
	get size() {
		const ret = wasm.jsset_size(this.__wbg_ptr)
		return ret >>> 0
	}
}

async function __wbg_load(module, imports) {
	if (typeof Response === "function" && module instanceof Response) {
		if (typeof WebAssembly.instantiateStreaming === "function") {
			try {
				return await WebAssembly.instantiateStreaming(module, imports)
			} catch (e) {
				if (module.headers.get("Content-Type") != "application/wasm") {
					console.warn(
						"`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",
						e,
					)
				} else {
					throw e
				}
			}
		}

		const bytes = await module.arrayBuffer()
		return await WebAssembly.instantiate(bytes, imports)
	} else {
		const instance = await WebAssembly.instantiate(module, imports)

		if (instance instanceof WebAssembly.Instance) {
			return { instance, module }
		} else {
			return instance
		}
	}
}

function __wbg_get_imports() {
	const imports = {}
	imports.wbg = {}
	imports.wbg.__wbindgen_init_externref_table = function () {
		const table = wasm.__wbindgen_export_0
		const offset = table.grow(4)
		table.set(0, undefined)
		table.set(offset + 0, undefined)
		table.set(offset + 1, null)
		table.set(offset + 2, true)
		table.set(offset + 3, false)
	}
	imports.wbg.__wbindgen_throw = function (arg0, arg1) {
		throw new Error(getStringFromWasm0(arg0, arg1))
	}

	return imports
}

function __wbg_init_memory(imports, memory) {}

function __wbg_finalize_init(instance, module) {
	wasm = instance.exports
	__wbg_init.__wbindgen_wasm_module = module
	cachedUint8ArrayMemory0 = null

	wasm.__wbindgen_start()
	return wasm
}

function initSync(module) {
	if (wasm !== undefined) return wasm

	if (typeof module !== "undefined") {
		if (Object.getPrototypeOf(module) === Object.prototype) {
			;({ module } = module)
		} else {
			console.warn(
				"using deprecated parameters for `initSync()`; pass a single object instead",
			)
		}
	}

	const imports = __wbg_get_imports()

	__wbg_init_memory(imports)

	if (!(module instanceof WebAssembly.Module)) {
		module = new WebAssembly.Module(module)
	}

	const instance = new WebAssembly.Instance(module, imports)

	return __wbg_finalize_init(instance, module)
}

const __wbg_init = async (module_or_path) => {
	if (wasm !== undefined) return wasm

	if (typeof module_or_path !== "undefined") {
		if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
			;({ module_or_path } = module_or_path)
		} else {
			console.warn(
				"using deprecated parameters for the initialization function; pass a single object instead",
			)
		}
	}

	if (typeof module_or_path === "undefined") {
		module_or_path = new URL("__bg.wasm", import.meta.url)
	}
	const imports = __wbg_get_imports()

	if (
		typeof module_or_path === "string" ||
		(typeof Request === "function" && module_or_path instanceof Request) ||
		(typeof URL === "function" && module_or_path instanceof URL)
	) {
		try {
			module_or_path = await fetch(module_or_path)
		} catch (e) {
			if (e.cause?.toString().startsWith("Error: not implemented")) {
				module_or_path = (await import("fs")).readFileSync(module_or_path)
			} else {
				throw e
			}
		}
	}

	__wbg_init_memory(imports)

	const { instance, module } = await __wbg_load(module_or_path, imports)

	return __wbg_finalize_init(instance, module)
}

// export { initSync }
await __wbg_init()
export default () => new JsSet()

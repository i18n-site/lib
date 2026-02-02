import { TextDecoder } from 'util';

let wasm;
let wasmModule;
export function __wbg_set_wasm(exports, module) {
    wasm = exports;
    wasmModule = module;
}


let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

const BinMapFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_binmap_free(ptr >>> 0, 1));

export class BinMap {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BinMap.prototype);
        obj.__wbg_ptr = ptr;
        BinMapFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BinMapFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_binmap_free(ptr, 0);
    }
    /**
     * @param {Uint8Array} bin
     * @returns {BinMap}
     */
    static load(bin) {
        const ptr0 = passArray8ToWasm0(bin, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.binmap_load(ptr0, len0);
        return BinMap.__wrap(ret);
    }
    /**
     * @param {Uint8Array} key
     * @returns {Uint8Array | undefined}
     */
    get(key) {
        const ptr0 = passArray8ToWasm0(key, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.binmap_get(this.__wbg_ptr, ptr0, len0);
        let v2;
        if (ret[0] !== 0) {
            v2 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v2;
    }
    /**
     * @param {Uint8Array} key
     * @param {Uint8Array} val
     */
    set(key, val) {
        const ptr0 = passArray8ToWasm0(key, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(val, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        wasm.binmap_set(this.__wbg_ptr, ptr0, len0, ptr1, len1);
    }
    /**
     * @returns {Uint8Array}
     */
    dump() {
        const ret = wasm.binmap_dump(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * @param {Uint8Array} key
     * @returns {boolean}
     */
    has(key) {
        const ptr0 = passArray8ToWasm0(key, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.binmap_has(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    constructor() {
        const ret = wasm.binmap_new();
        this.__wbg_ptr = ret >>> 0;
        BinMapFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {number}
     */
    get size() {
        const ret = wasm.binmap_size(this.__wbg_ptr);
        return ret >>> 0;
    }
}

export function __wbindgen_init_externref_table() {
    const table = wasm.__wbindgen_export_0;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
    ;
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};


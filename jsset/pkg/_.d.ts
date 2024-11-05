/* tslint:disable */
/* eslint-disable */
/**
*/
export class JsSet {
  free(): void;
/**
*/
  constructor();
/**
* @param {Uint8Array} key
*/
  add(key: Uint8Array): void;
/**
* @param {Uint8Array} key
* @returns {boolean}
*/
  has(key: Uint8Array): boolean;
/**
* @returns {Uint8Array}
*/
  dump(): Uint8Array;
/**
* @param {Uint8Array} bin
* @returns {JsSet}
*/
  static load(bin: Uint8Array): JsSet;
/**
*/
  readonly size: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_jsset_free: (a: number) => void;
  readonly jsset_new: () => number;
  readonly jsset_add: (a: number, b: number, c: number) => void;
  readonly jsset_has: (a: number, b: number, c: number) => number;
  readonly jsset_dump: (a: number, b: number) => void;
  readonly jsset_load: (a: number, b: number) => number;
  readonly jsset_size: (a: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;

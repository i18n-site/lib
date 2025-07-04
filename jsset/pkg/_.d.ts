/* tslint:disable */
/* eslint-disable */
export class JsSet {
  free(): void;
  constructor();
  add(key: Uint8Array): void;
  has(key: Uint8Array): boolean;
  dump(): Uint8Array;
  static load(bin: Uint8Array): JsSet;
  readonly size: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_jsset_free: (a: number, b: number) => void;
  readonly jsset_new: () => number;
  readonly jsset_add: (a: number, b: number, c: number) => void;
  readonly jsset_has: (a: number, b: number, c: number) => number;
  readonly jsset_dump: (a: number) => [number, number];
  readonly jsset_load: (a: number, b: number) => number;
  readonly jsset_size: (a: number) => number;
  readonly __wbindgen_export_0: WebAssembly.Table;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;

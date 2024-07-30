/* tslint:disable */
/* eslint-disable */
/**
*/
export class BinMap {
  free(): void;
/**
*/
  constructor();
/**
* @param {Uint8Array} key
* @param {Uint8Array} val
*/
  set(key: Uint8Array, val: Uint8Array): void;
/**
* @param {Uint8Array} key
* @returns {boolean}
*/
  has(key: Uint8Array): boolean;
/**
* @param {Uint8Array} key
* @returns {Uint8Array | undefined}
*/
  get(key: Uint8Array): Uint8Array | undefined;
/**
* @returns {Uint8Array}
*/
  dump(): Uint8Array;
/**
* @param {Uint8Array} bin
* @returns {BinMap}
*/
  static load(bin: Uint8Array): BinMap;
/**
*/
  readonly size: number;
}

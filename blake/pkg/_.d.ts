/* tslint:disable */
/* eslint-disable */
/**
* @param {any} js_value
* @returns {Uint8Array}
*/
export function as_bin(js_value: any): Uint8Array;
/**
* @param {any} input
* @returns {Uint8Array}
*/
export function blake3Hash(input: any): Uint8Array;
/**
* @param {any} input
* @param {number} n
* @returns {Uint8Array}
*/
export function blake3HashN(input: any, n: number): Uint8Array;
/**
*/
export class Blake3 {
  free(): void;
/**
*/
  constructor();
/**
* @param {any} input
*/
  update(input: any): void;
/**
* @returns {Uint8Array}
*/
  finalize(): Uint8Array;
}

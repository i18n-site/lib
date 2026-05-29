/* tslint:disable */
/* eslint-disable */
/**
*/
export class JsMap {
  free(): void;
/**
*/
  constructor();
/**
* @returns {any[]}
*/
  values(): any[];
/**
* @returns {(Uint8Array)[]}
*/
  keys(): (Uint8Array)[];
/**
* @returns {(Array<any>)[]}
*/
  entries(): (Array<any>)[];
/**
*/
  clear(): void;
/**
* @param {Uint8Array} key
* @returns {boolean}
*/
  has(key: Uint8Array): boolean;
/**
* @param {Uint8Array} key
* @returns {boolean}
*/
  delete(key: Uint8Array): boolean;
/**
* @param {Uint8Array} key
* @param {any} val
*/
  set(key: Uint8Array, val: any): void;
/**
* @param {Uint8Array} key
* @returns {any}
*/
  get(key: Uint8Array): any;
/**
*/
  readonly size: number;
}

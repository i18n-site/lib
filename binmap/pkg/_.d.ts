/* tslint:disable */
/* eslint-disable */
export class BinMap {
  free(): void;
  static load(bin: Uint8Array): BinMap;
  get(key: Uint8Array): Uint8Array | undefined;
  set(key: Uint8Array, val: Uint8Array): void;
  dump(): Uint8Array;
  has(key: Uint8Array): boolean;
  constructor();
  readonly size: number;
}

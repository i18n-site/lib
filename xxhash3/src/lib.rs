use wasm_bindgen::prelude::*;
use xxhash_rust::xxh3::{xxh3_128, xxh3_64};

#[wasm_bindgen]
pub fn hash128(input: &[u8]) -> Box<[u8]> {
  xxh3_128(&input).to_le_bytes().into()
}

#[allow(non_snake_case)]
#[wasm_bindgen]
pub fn hash128Len(input: &[u8]) -> Box<[u8]> {
  [
    &xxh3_128(&input).to_le_bytes()[..],
    &(input.len() as u32).to_le_bytes()[..],
  ]
  .concat()
  .into()
}

#[wasm_bindgen]
pub fn hash(input: &[u8]) -> u64 {
  xxh3_64(&input)
}

#[allow(non_snake_case)]
#[wasm_bindgen]
pub fn hashI64(input: &[u8]) -> i64 {
  (xxh3_64(&input) + i64::MIN as u64) as i64
}

/*
#[wasm_bindgen]
pub fn encode_bin(input: &[u8]) -> Vec<u8> {
rmw_utf8::encode(input)
}

#[wasm_bindgen]
pub fn encode(input: String) -> Vec<u8> {
rmw_utf8::encode(input.as_bytes())
}

#[wasm_bindgen]
pub fn decode(input: &[u8]) -> String {
rmw_utf8::decode(input)
}
*/

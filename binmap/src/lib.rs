#![allow(non_snake_case)]
use rapidhash::RapidHashMap;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(PartialEq, Debug)]
pub struct BinMap(RapidHashMap<Vec<u8>, Vec<u8>>);

impl Default for BinMap {
  fn default() -> Self {
    Self::new()
  }
}

#[wasm_bindgen]
impl BinMap {
  #[wasm_bindgen(constructor)]
  pub fn new() -> BinMap {
    BinMap(RapidHashMap::default())
  }

  pub fn set(&mut self, key: &[u8], val: &[u8]) {
    self.0.insert(key.to_vec(), val.to_vec());
  }

  pub fn has(&self, key: &[u8]) -> bool {
    self.0.contains_key(key)
  }

  pub fn get(&self, key: &[u8]) -> Option<Box<[u8]>> {
    self.0.get(key).map(|v| v.clone().into_boxed_slice())
  }

  pub fn dump(&self) -> Vec<u8> {
    bitcode::encode(&self.0)
  }

  #[wasm_bindgen(getter)]
  pub fn size(&self) -> usize {
    self.0.len()
  }

  pub fn load(bin: &[u8]) -> BinMap {
    BinMap(bitcode::decode(bin).unwrap())
  }
}

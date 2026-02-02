#[allow(non_snake_case)]
use std::collections::BTreeMap;

use speedy::{Readable, Writable};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(PartialEq, Debug, Readable, Writable)]
pub struct BinMap(BTreeMap<Box<[u8]>, Box<[u8]>>);

#[wasm_bindgen]
impl BinMap {
  #[wasm_bindgen(constructor)]
  pub fn new() -> Self {
    Self(BTreeMap::new())
  }

  pub fn set(&mut self, key: &[u8], val: &[u8]) {
    self.0.insert(Box::from(key), Box::from(val));
  }

  pub fn has(&self, key: &[u8]) -> bool {
    self.0.contains_key(key)
  }

  pub fn get(&self, key: &[u8]) -> Option<Box<[u8]>> {
    match self.0.get(key) {
      Some(r) => Some(r.clone()),
      None => None,
    }
  }

  pub fn dump(&self) -> Vec<u8> {
    self.write_to_vec().unwrap()
  }

  #[wasm_bindgen(getter)]
  pub fn size(&self) -> usize {
    self.0.len()
  }

  #[wasm_bindgen]
  pub fn load(bin: &[u8]) -> BinMap {
    BinMap::read_from_buffer(bin).unwrap()
  }
}

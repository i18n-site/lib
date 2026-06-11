#![allow(non_snake_case)]
use bitcode::{Decode, Encode};
use rapidhash::RapidHashSet;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(PartialEq, Debug, Encode, Decode)]
pub struct BinSet(RapidHashSet<Box<[u8]>>);

impl Default for BinSet {
  fn default() -> Self {
    Self::new()
  }
}

#[wasm_bindgen]
impl BinSet {
  #[wasm_bindgen(constructor)]
  pub fn new() -> BinSet {
    BinSet(RapidHashSet::default())
  }

  pub fn add(&mut self, val: &[u8]) {
    self.0.insert(Box::from(val));
  }

  pub fn has(&self, val: &[u8]) -> bool {
    self.0.contains(val)
  }

  pub fn dump(&self) -> Vec<u8> {
    bitcode::encode(self)
  }

  #[wasm_bindgen(getter)]
  pub fn size(&self) -> usize {
    self.0.len()
  }

  pub fn values(&self) -> js_sys::Iterator {
    self.0
      .iter()
      .map(|val| js_sys::Uint8Array::from(val.as_ref()))
      .collect::<js_sys::Array>()
      .values()
  }


  pub fn load(bin: &[u8]) -> BinSet {
    bitcode::decode(bin).unwrap()
  }
}

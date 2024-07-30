#[allow(non_snake_case)]
use std::collections::BTreeSet;

use speedy::{Readable, Writable};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(PartialEq, Debug, Readable, Writable)]
pub struct JsSet(BTreeSet<Box<[u8]>>);

#[wasm_bindgen]
impl JsSet {
  #[wasm_bindgen(constructor)]
  pub fn new() -> Self {
    Self(BTreeSet::new())
  }

  pub fn add(&mut self, key: &[u8]) {
    self.0.insert(Box::from(key));
  }

  pub fn has(&self, key: &[u8]) -> bool {
    self.0.contains(key)
  }

  pub fn dump(&self) -> Vec<u8> {
    self.write_to_vec().unwrap()
  }

  #[wasm_bindgen]
  pub fn load(bin: &[u8]) -> JsSet {
    JsSet::read_from_buffer(bin).unwrap()
  }

  #[wasm_bindgen(getter)]
  pub fn size(&self) -> usize {
    self.0.len()
  }
}

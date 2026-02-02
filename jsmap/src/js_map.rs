#[allow(non_snake_case)]
use std::collections::HashMap;

use js_sys::Array;
use wasm_bindgen::prelude::{wasm_bindgen, JsValue};

#[wasm_bindgen]
#[derive(PartialEq, Debug)]
pub struct JsMap(HashMap<Box<[u8]>, JsValue>);

#[wasm_bindgen]
impl JsMap {
  #[wasm_bindgen(constructor)]
  pub fn new() -> Self {
    Self(HashMap::new())
  }

  pub fn values(&self) -> Vec<JsValue> {
    self.0.values().map(|v| v.into()).collect()
  }

  pub fn keys(&self) -> Vec<js_sys::Uint8Array> {
    self
      .0
      .keys()
      .map(|k| js_sys::Uint8Array::from(&k[..]))
      .collect()
  }

  pub fn entries(&self) -> Vec<Array> {
    self
      .0
      .iter()
      .map(|(k, v)| Array::of2(&js_sys::Uint8Array::from(&k[..]).into(), v))
      .collect()
  }

  pub fn clear(&mut self) {
    self.0.clear()
  }

  #[wasm_bindgen(getter)]
  pub fn size(&self) -> usize {
    self.0.len()
  }

  pub fn has(&mut self, key: &[u8]) -> bool {
    self.0.contains_key(key)
  }

  pub fn delete(&mut self, key: &[u8]) -> bool {
    self.0.remove(key).is_some()
  }

  pub fn set(&mut self, key: &[u8], val: JsValue) {
    if val == JsValue::UNDEFINED {
      self.delete(key);
    } else {
      self.0.insert(Box::from(key), val);
    }
  }

  pub fn get(&self, key: &[u8]) -> JsValue {
    match self.0.get(key) {
      Some(r) => r.clone(),
      None => JsValue::UNDEFINED,
    }
  }

  // pub fn dump(&self) -> Vec<u8> {
  //   self.write_to_vec().unwrap()
  // }

  // pub fn len(&self) -> usize {
  //   self.0.len()
  // }
  //
  // #[wasm_bindgen]
  // pub fn load(bin: &[u8]) -> JsMap {
  //   JsMap::read_from_buffer(bin).unwrap()
  // }
}

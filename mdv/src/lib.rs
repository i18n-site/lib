#![allow(non_snake_case)]
pub mod api {
  include!(concat!(env!("OUT_DIR"), "/api.rs"));
}

use js_sys::{Array, Number};
use prost::Message;
use wasm_bindgen::{prelude::wasm_bindgen, JsError};

#[wasm_bindgen]
pub fn id_url_li(id_url_li: Array) -> Result<Vec<u8>, JsError> {
  for li in id_url_li {
    let li = Array::from(&li);
    let len = li.length() as usize;
    let mut id_li = Vec::with_capacity(len);
    let mut url_li = Vec::with_capacity(len);
    if let Some(url) = li.get(1).as_string() {
      let id = Number::from(li.get(0)).value_of() as u64;
      id_li.push(id);
      url_li.push(url);
    }
    return Ok(api::IdUrlLi { id_li, url_li }.encode_to_vec());
  }
  Ok(Default::default())
}
//
// #[wasm_bindgen]
// pub fn u64Bin(n: f64) -> Box<[u8]> {
//   intbin::u64_bin(n as u64)
// }

// impl JsMap {
//   #[wasm_bindgen(constructor)]
//   pub fn new() -> Self {
//     Self(HashMap::new())
//   }
//
//   pub fn clear(&mut self) {
//     self.0.clear()
//   }
//
//   #[wasm_bindgen(getter)]
//   pub fn size(&self) -> usize {
//     self.0.len()
//   }
//
//   pub fn has(&mut self, key: &[u8]) -> bool {
//     self.0.contains_key(key)
//   }
//
//   pub fn delete(&mut self, key: &[u8]) -> bool {
//     self.0.remove(key).is_some()
//   }
//
//   pub fn set(&mut self, key: &[u8], val: JsValue) {
//     if val == JsValue::UNDEFINED {
//       self.delete(key);
//     } else {
//       self.0.insert(Box::from(key), val);
//     }
//   }
//
//   pub fn get(&self, key: &[u8]) -> JsValue {
//     match self.0.get(key) {
//       Some(r) => r.clone(),
//       None => JsValue::UNDEFINED,
//     }
//   }
//
//   // pub fn dump(&self) -> Vec<u8> {
//   //   self.write_to_vec().unwrap()
//   // }
//
//   // pub fn len(&self) -> usize {
//   //   self.0.len()
//   // }
//   //
//   // #[wasm_bindgen]
//   // pub fn load(bin: &[u8]) -> JsMap {
//   //   JsMap::read_from_buffer(bin).unwrap()
//   // }
// }

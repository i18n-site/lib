#![allow(non_snake_case)]

pub type Result<T> = std::result::Result<T, wasm_bindgen::JsError>;

use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub fn binU64(bin: &[u8]) -> f64 {
  intbin::bin_u64(bin) as _
}

#[wasm_bindgen]
pub fn u64Bin(n: f64) -> Box<[u8]> {
  intbin::u64_bin(n as u64)
}

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

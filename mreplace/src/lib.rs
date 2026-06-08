// #[allow(non_snake_case)]
// use std::collections::BTreeMap;
// use speedy::{Readable, Writable};
// use wasm_bindgen::prelude::*;
use wasm_bindgen::{prelude::wasm_bindgen, JsError};

#[wasm_bindgen]
pub struct Mreplace {
  replacer: mreplace::Mreplace,
  to: Vec<String>,
}

#[wasm_bindgen]
impl Mreplace {
  pub fn from(from: Vec<String>, to: Vec<String>) -> Result<Mreplace, JsError> {
    Ok(Self {
      replacer: match mreplace::Mreplace::new(from) {
        Ok(r) => r,
        Err(err) => return Err(JsError::new(&err.to_string())),
      },
      to,
    })
  }

  pub fn replace(&self, s: &str) -> String {
    self.replacer.replace(s, &self.to).to_string()
  }
}
//
//   pub fn set(&mut self, key: &[u8], val: &[u8]) {
//     self.0.insert(Box::from(key), Box::from(val));
//   }
//
//   pub fn has(&self, key: &[u8]) -> bool {
//     self.0.contains_key(key)
//   }
//
//   pub fn get(&self, key: &[u8]) -> Option<Box<[u8]>> {
//     match self.0.get(key) {
//       Some(r) => Some(r.clone()),
//       None => None,
//     }
//   }
//
//   pub fn dump(&self) -> Vec<u8> {
//     self.write_to_vec().unwrap()
//   }
//
//   #[wasm_bindgen(getter)]
//   pub fn size(&self) -> usize {
//     self.0.len()
//   }
//
//   #[wasm_bindgen]
//   pub fn load(bin: &[u8]) -> BinMap {
//     BinMap::read_from_buffer(bin).unwrap()
//   }
// }

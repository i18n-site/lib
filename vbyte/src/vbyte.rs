use wasm_bindgen::prelude::wasm_bindgen;

use crate::Result;

#[wasm_bindgen]
pub fn vbyteE(vs: &[f64]) -> Vec<u8> {
  vb::e(&vs.iter().map(|i| *i as u64).collect::<Vec<_>>())
}

#[wasm_bindgen]
pub fn vbyteD(vs: &[u8]) -> Result<Vec<f64>> {
  match vb::d(vs) {
    Ok(r) => Ok(r.into_iter().map(|i| i as f64).collect()),
    Err(err) => Err(wasm_bindgen::JsError::new(&err.to_string())),
  }
}

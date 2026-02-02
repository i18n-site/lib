#![feature(allocator_api, new_uninit)]

use js_sys::Uint8Array;

#[wasm_bindgen]
pub fn as_bin(js_value: JsValue) -> Result<Vec<u8>, JsValue> {
  if js_value.is_string() {
    // 如果是字符串，转换为String，然后转换为字节切片
    let string = js_value
      .as_string()
      .ok_or(JsValue::from_str("Error: JsValue → String"))?;
    Ok(string.into_bytes())
  } else if js_value.is_instance_of::<Uint8Array>() {
    // 如果是Uint8Array，直接转换为字节切片
    let uint8_array = Uint8Array::from(js_value);
    Ok(uint8_array.to_vec())
  } else {
    Err(JsValue::from_str("Error: JsValue Can't Hash"))
  }
}

#[allow(non_snake_case)]
use blake3::{hash, Hasher};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Blake3(Hasher);

#[wasm_bindgen]
impl Blake3 {
  #[wasm_bindgen(constructor)]
  pub fn new() -> Self {
    Self(Hasher::new())
  }

  pub fn update(&mut self, input: JsValue) -> Result<(), JsValue> {
    self.0.update(&as_bin(input)?);
    Ok(())
  }

  pub fn finalize(&self) -> Box<[u8]> {
    self.0.finalize().as_bytes()[..].into()
  }
}

#[allow(non_snake_case)]
#[wasm_bindgen]
pub fn blake3Hash(input: JsValue) -> Result<Box<[u8]>, JsValue> {
  Ok(Box::<[u8]>::from(&hash(&as_bin(input)?).as_bytes()[..]))
}

#[allow(non_snake_case)]
#[wasm_bindgen]
pub fn blake3HashN(input: JsValue, n: usize) -> Result<Box<[u8]>, JsValue> {
  let mut hasher = Hasher::new();
  hasher.update(&as_bin(input)?);
  let mut output = unsafe { Box::<[u8]>::new_uninit_slice(n).assume_init() };
  let mut output_reader = hasher.finalize_xof();
  output_reader.fill(&mut output[..]);
  Ok(output)
}

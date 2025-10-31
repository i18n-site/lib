#![allow(non_snake_case)]

pub mod js_map;

pub type Result<T> = std::result::Result<T, wasm_bindgen::JsError>;

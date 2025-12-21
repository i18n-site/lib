#![cfg_attr(docsrs, feature(doc_cfg))]

mod code;
pub use code::CODE;

mod zh;
pub use zh::ZH;

mod en;
pub use en::EN;

mod name;
pub use name::NAME;

mod lang;
pub use lang::{LANG, Lang};

pub fn by_str(lang: impl AsRef<str>) -> Option<usize> {
  use index_of::IndexOf;
  CODE.index_of(&lang.as_ref())
}

#[cfg(feature = "nospace")]
pub const NOSPACE: [Lang; 6] = [Lang::Zh, Lang::Ja, Lang::Th, Lang::ZhTw, Lang::Km, Lang::Lo];

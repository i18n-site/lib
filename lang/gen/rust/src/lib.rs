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

use int_enum::IntEnum;
use strum::{EnumCount, EnumIter};

#[repr(u16)]
#[derive(
  EnumIter, Hash, PartialEq, Eq, Clone, Debug, Copy, IntEnum, EnumCount, Ord, PartialOrd
)]
pub enum Lang {
  En = 0,
  Zh = 1,
  Fr = 2,
  De = 3,
  Ja = 4,
  Es = 5,
  Ar = 6,
  It = 7,
  Pt = 8,
  Ru = 9,
  Ko = 10,
  Hi = 11,
  Id = 12,
  ZhTw = 13,
  Nl = 14,
  Tr = 15,
  Pl = 16,
  Sv = 17,
  Bn = 18,
  Iw = 19,
  No = 20,
  Th = 21,
  Da = 22,
  Mr = 23,
  Vi = 24,
  Cs = 25,
  Fi = 26,
  Te = 27,
  El = 28,
  Ta = 29,
  Kn = 30,
  Ro = 31,
  Sw = 32,
  Ur = 33,
  Gu = 34,
  Hu = 35,
  Uk = 36,
  Sk = 37,
  Ml = 38,
  Sr = 39,
  Bg = 40,
  Hr = 41,
  Sl = 42,
  Lt = 43,
  Et = 44,
  Lv = 45,
}

pub const LANG: &[u32] = &[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45];
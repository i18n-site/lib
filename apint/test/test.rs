#![feature(prelude_import)]
#[prelude_import]
use std::prelude::rust_2021::*;
#[macro_use]
extern crate std;
pub mod api {
  #[allow(clippy::derive_partial_eq_without_eq)]
  pub struct Item {
    #[prost(uint32, tag = "1")]
    pub cid: u32,
    #[prost(uint64, tag = "2")]
    pub kid: u64,
    #[prost(uint64, tag = "3")]
    pub rid: u64,
    #[prost(int32, tag = "4")]
    pub day: i32,
    #[prost(int64, tag = "5")]
    pub n: i64,
  }
  #[automatically_derived]
  #[allow(clippy::derive_partial_eq_without_eq)]
  impl ::core::clone::Clone for Item {
    #[inline]
    fn clone(&self) -> Item {
      Item {
        cid: ::core::clone::Clone::clone(&self.cid),
        kid: ::core::clone::Clone::clone(&self.kid),
        rid: ::core::clone::Clone::clone(&self.rid),
        day: ::core::clone::Clone::clone(&self.day),
        n: ::core::clone::Clone::clone(&self.n),
      }
    }
  }
  #[automatically_derived]
  #[allow(clippy::derive_partial_eq_without_eq)]
  impl ::core::marker::StructuralPartialEq for Item {}
  #[automatically_derived]
  #[allow(clippy::derive_partial_eq_without_eq)]
  impl ::core::cmp::PartialEq for Item {
    #[inline]
    fn eq(&self, other: &Item) -> bool {
      self.cid == other.cid
        && self.kid == other.kid
        && self.rid == other.rid
        && self.day == other.day
        && self.n == other.n
    }
  }
  impl ::prost::Message for Item {
    #[allow(unused_variables)]
    fn encode_raw<B>(&self, buf: &mut B)
    where
      B: ::prost::bytes::BufMut,
    {
      if self.cid != 0u32 {
        ::prost::encoding::uint32::encode(1u32, &self.cid, buf);
      }
      if self.kid != 0u64 {
        ::prost::encoding::uint64::encode(2u32, &self.kid, buf);
      }
      if self.rid != 0u64 {
        ::prost::encoding::uint64::encode(3u32, &self.rid, buf);
      }
      if self.day != 0i32 {
        ::prost::encoding::int32::encode(4u32, &self.day, buf);
      }
      if self.n != 0i64 {
        ::prost::encoding::int64::encode(5u32, &self.n, buf);
      }
    }
    #[allow(unused_variables)]
    fn merge_field<B>(
      &mut self,
      tag: u32,
      wire_type: ::prost::encoding::WireType,
      buf: &mut B,
      ctx: ::prost::encoding::DecodeContext,
    ) -> ::core::result::Result<(), ::prost::DecodeError>
    where
      B: ::prost::bytes::Buf,
    {
      const STRUCT_NAME: &'static str = "Item";
      match tag {
        1u32 => {
          let mut value = &mut self.cid;
          ::prost::encoding::uint32::merge(wire_type, value, buf, ctx).map_err(|mut error| {
            error.push(STRUCT_NAME, "cid");
            error
          })
        }
        2u32 => {
          let mut value = &mut self.kid;
          ::prost::encoding::uint64::merge(wire_type, value, buf, ctx).map_err(|mut error| {
            error.push(STRUCT_NAME, "kid");
            error
          })
        }
        3u32 => {
          let mut value = &mut self.rid;
          ::prost::encoding::uint64::merge(wire_type, value, buf, ctx).map_err(|mut error| {
            error.push(STRUCT_NAME, "rid");
            error
          })
        }
        4u32 => {
          let mut value = &mut self.day;
          ::prost::encoding::int32::merge(wire_type, value, buf, ctx).map_err(|mut error| {
            error.push(STRUCT_NAME, "day");
            error
          })
        }
        5u32 => {
          let mut value = &mut self.n;
          ::prost::encoding::int64::merge(wire_type, value, buf, ctx).map_err(|mut error| {
            error.push(STRUCT_NAME, "n");
            error
          })
        }
        _ => ::prost::encoding::skip_field(wire_type, tag, buf, ctx),
      }
    }
    #[inline]
    fn encoded_len(&self) -> usize {
      0 + if self.cid != 0u32 {
        ::prost::encoding::uint32::encoded_len(1u32, &self.cid)
      } else {
        0
      } + if self.kid != 0u64 {
        ::prost::encoding::uint64::encoded_len(2u32, &self.kid)
      } else {
        0
      } + if self.rid != 0u64 {
        ::prost::encoding::uint64::encoded_len(3u32, &self.rid)
      } else {
        0
      } + if self.day != 0i32 {
        ::prost::encoding::int32::encoded_len(4u32, &self.day)
      } else {
        0
      } + if self.n != 0i64 {
        ::prost::encoding::int64::encoded_len(5u32, &self.n)
      } else {
        0
      }
    }
    fn clear(&mut self) {
      self.cid = 0u32;
      self.kid = 0u64;
      self.rid = 0u64;
      self.day = 0i32;
      self.n = 0i64;
    }
  }
  impl ::core::default::Default for Item {
    fn default() -> Self {
      Item {
        cid: 0u32,
        kid: 0u64,
        rid: 0u64,
        day: 0i32,
        n: 0i64,
      }
    }
  }
  impl ::core::fmt::Debug for Item {
    fn fmt(&self, f: &mut ::core::fmt::Formatter) -> ::core::fmt::Result {
      let mut builder = f.debug_struct("Item");
      let builder = {
        let wrapper = {
          #[allow(non_snake_case)]
          fn ScalarWrapper<T>(v: T) -> T {
            v
          }
          ScalarWrapper(&self.cid)
        };
        builder.field("cid", &wrapper)
      };
      let builder = {
        let wrapper = {
          #[allow(non_snake_case)]
          fn ScalarWrapper<T>(v: T) -> T {
            v
          }
          ScalarWrapper(&self.kid)
        };
        builder.field("kid", &wrapper)
      };
      let builder = {
        let wrapper = {
          #[allow(non_snake_case)]
          fn ScalarWrapper<T>(v: T) -> T {
            v
          }
          ScalarWrapper(&self.rid)
        };
        builder.field("rid", &wrapper)
      };
      let builder = {
        let wrapper = {
          #[allow(non_snake_case)]
          fn ScalarWrapper<T>(v: T) -> T {
            v
          }
          ScalarWrapper(&self.day)
        };
        builder.field("day", &wrapper)
      };
      let builder = {
        let wrapper = {
          #[allow(non_snake_case)]
          fn ScalarWrapper<T>(v: T) -> T {
            v
          }
          ScalarWrapper(&self.n)
        };
        builder.field("n", &wrapper)
      };
      builder.finish()
    }
  }
  #[allow(clippy::derive_partial_eq_without_eq)]
  pub struct Bill {
    #[prost(message, repeated, tag = "1")]
    pub li: ::prost::alloc::vec::Vec<Item>,
  }
  #[automatically_derived]
  #[allow(clippy::derive_partial_eq_without_eq)]
  impl ::core::clone::Clone for Bill {
    #[inline]
    fn clone(&self) -> Bill {
      Bill {
        li: ::core::clone::Clone::clone(&self.li),
      }
    }
  }
  #[automatically_derived]
  #[allow(clippy::derive_partial_eq_without_eq)]
  impl ::core::marker::StructuralPartialEq for Bill {}
  #[automatically_derived]
  #[allow(clippy::derive_partial_eq_without_eq)]
  impl ::core::cmp::PartialEq for Bill {
    #[inline]
    fn eq(&self, other: &Bill) -> bool {
      self.li == other.li
    }
  }
  impl ::prost::Message for Bill {
    #[allow(unused_variables)]
    fn encode_raw<B>(&self, buf: &mut B)
    where
      B: ::prost::bytes::BufMut,
    {
      for msg in &self.li {
        ::prost::encoding::message::encode(1u32, msg, buf);
      }
    }
    #[allow(unused_variables)]
    fn merge_field<B>(
      &mut self,
      tag: u32,
      wire_type: ::prost::encoding::WireType,
      buf: &mut B,
      ctx: ::prost::encoding::DecodeContext,
    ) -> ::core::result::Result<(), ::prost::DecodeError>
    where
      B: ::prost::bytes::Buf,
    {
      const STRUCT_NAME: &'static str = "Bill";
      match tag {
        1u32 => {
          let mut value = &mut self.li;
          ::prost::encoding::message::merge_repeated(wire_type, value, buf, ctx).map_err(
            |mut error| {
              error.push(STRUCT_NAME, "li");
              error
            },
          )
        }
        _ => ::prost::encoding::skip_field(wire_type, tag, buf, ctx),
      }
    }
    #[inline]
    fn encoded_len(&self) -> usize {
      0 + ::prost::encoding::message::encoded_len_repeated(1u32, &self.li)
    }
    fn clear(&mut self) {
      self.li.clear();
    }
  }
  impl ::core::default::Default for Bill {
    fn default() -> Self {
      Bill {
        li: ::core::default::Default::default(),
      }
    }
  }
  impl ::core::fmt::Debug for Bill {
    fn fmt(&self, f: &mut ::core::fmt::Formatter) -> ::core::fmt::Result {
      let mut builder = f.debug_struct("Bill");
      let builder = {
        let wrapper = &self.li;
        builder.field("li", &wrapper)
      };
      builder.finish()
    }
  }
  #[allow(clippy::derive_partial_eq_without_eq)]
  pub struct Cash {
    #[prost(int64, tag = "1")]
    pub n: i64,
  }
  #[automatically_derived]
  #[allow(clippy::derive_partial_eq_without_eq)]
  impl ::core::clone::Clone for Cash {
    #[inline]
    fn clone(&self) -> Cash {
      Cash {
        n: ::core::clone::Clone::clone(&self.n),
      }
    }
  }
  #[automatically_derived]
  #[allow(clippy::derive_partial_eq_without_eq)]
  impl ::core::marker::StructuralPartialEq for Cash {}
  #[automatically_derived]
  #[allow(clippy::derive_partial_eq_without_eq)]
  impl ::core::cmp::PartialEq for Cash {
    #[inline]
    fn eq(&self, other: &Cash) -> bool {
      self.n == other.n
    }
  }
  impl ::prost::Message for Cash {
    #[allow(unused_variables)]
    fn encode_raw<B>(&self, buf: &mut B)
    where
      B: ::prost::bytes::BufMut,
    {
      if self.n != 0i64 {
        ::prost::encoding::int64::encode(1u32, &self.n, buf);
      }
    }
    #[allow(unused_variables)]
    fn merge_field<B>(
      &mut self,
      tag: u32,
      wire_type: ::prost::encoding::WireType,
      buf: &mut B,
      ctx: ::prost::encoding::DecodeContext,
    ) -> ::core::result::Result<(), ::prost::DecodeError>
    where
      B: ::prost::bytes::Buf,
    {
      const STRUCT_NAME: &'static str = "Cash";
      match tag {
        1u32 => {
          let mut value = &mut self.n;
          ::prost::encoding::int64::merge(wire_type, value, buf, ctx).map_err(|mut error| {
            error.push(STRUCT_NAME, "n");
            error
          })
        }
        _ => ::prost::encoding::skip_field(wire_type, tag, buf, ctx),
      }
    }
    #[inline]
    fn encoded_len(&self) -> usize {
      0 + if self.n != 0i64 {
        ::prost::encoding::int64::encoded_len(1u32, &self.n)
      } else {
        0
      }
    }
    fn clear(&mut self) {
      self.n = 0i64;
    }
  }
  impl ::core::default::Default for Cash {
    fn default() -> Self {
      Cash { n: 0i64 }
    }
  }
  impl ::core::fmt::Debug for Cash {
    fn fmt(&self, f: &mut ::core::fmt::Formatter) -> ::core::fmt::Result {
      let mut builder = f.debug_struct("Cash");
      let builder = {
        let wrapper = {
          #[allow(non_snake_case)]
          fn ScalarWrapper<T>(v: T) -> T {
            v
          }
          ScalarWrapper(&self.n)
        };
        builder.field("n", &wrapper)
      };
      builder.finish()
    }
  }
  #[allow(clippy::derive_partial_eq_without_eq)]
  pub struct BillIndex {
    #[prost(int64, tag = "1")]
    pub cash: i64,
    #[prost(message, repeated, tag = "2")]
    pub li: ::prost::alloc::vec::Vec<Item>,
    #[prost(int32, repeated, tag = "3")]
    pub month_li: ::prost::alloc::vec::Vec<i32>,
  }
  #[automatically_derived]
  #[allow(clippy::derive_partial_eq_without_eq)]
  impl ::core::clone::Clone for BillIndex {
    #[inline]
    fn clone(&self) -> BillIndex {
      BillIndex {
        cash: ::core::clone::Clone::clone(&self.cash),
        li: ::core::clone::Clone::clone(&self.li),
        month_li: ::core::clone::Clone::clone(&self.month_li),
      }
    }
  }
  #[automatically_derived]
  #[allow(clippy::derive_partial_eq_without_eq)]
  impl ::core::marker::StructuralPartialEq for BillIndex {}
  #[automatically_derived]
  #[allow(clippy::derive_partial_eq_without_eq)]
  impl ::core::cmp::PartialEq for BillIndex {
    #[inline]
    fn eq(&self, other: &BillIndex) -> bool {
      self.cash == other.cash && self.li == other.li && self.month_li == other.month_li
    }
  }
  impl ::prost::Message for BillIndex {
    #[allow(unused_variables)]
    fn encode_raw<B>(&self, buf: &mut B)
    where
      B: ::prost::bytes::BufMut,
    {
      if self.cash != 0i64 {
        ::prost::encoding::int64::encode(1u32, &self.cash, buf);
      }
      for msg in &self.li {
        ::prost::encoding::message::encode(2u32, msg, buf);
      }
      ::prost::encoding::int32::encode_packed(3u32, &self.month_li, buf);
    }
    #[allow(unused_variables)]
    fn merge_field<B>(
      &mut self,
      tag: u32,
      wire_type: ::prost::encoding::WireType,
      buf: &mut B,
      ctx: ::prost::encoding::DecodeContext,
    ) -> ::core::result::Result<(), ::prost::DecodeError>
    where
      B: ::prost::bytes::Buf,
    {
      const STRUCT_NAME: &'static str = "BillIndex";
      match tag {
        1u32 => {
          let mut value = &mut self.cash;
          ::prost::encoding::int64::merge(wire_type, value, buf, ctx).map_err(|mut error| {
            error.push(STRUCT_NAME, "cash");
            error
          })
        }
        2u32 => {
          let mut value = &mut self.li;
          ::prost::encoding::message::merge_repeated(wire_type, value, buf, ctx).map_err(
            |mut error| {
              error.push(STRUCT_NAME, "li");
              error
            },
          )
        }
        3u32 => {
          let mut value = &mut self.month_li;
          ::prost::encoding::int32::merge_repeated(wire_type, value, buf, ctx).map_err(
            |mut error| {
              error.push(STRUCT_NAME, "month_li");
              error
            },
          )
        }
        _ => ::prost::encoding::skip_field(wire_type, tag, buf, ctx),
      }
    }
    #[inline]
    fn encoded_len(&self) -> usize {
      0 + if self.cash != 0i64 {
        ::prost::encoding::int64::encoded_len(1u32, &self.cash)
      } else {
        0
      } + ::prost::encoding::message::encoded_len_repeated(2u32, &self.li)
        + ::prost::encoding::int32::encoded_len_packed(3u32, &self.month_li)
    }
    fn clear(&mut self) {
      self.cash = 0i64;
      self.li.clear();
      self.month_li.clear();
    }
  }
  impl ::core::default::Default for BillIndex {
    fn default() -> Self {
      BillIndex {
        cash: 0i64,
        li: ::core::default::Default::default(),
        month_li: ::prost::alloc::vec::Vec::new(),
      }
    }
  }
  impl ::core::fmt::Debug for BillIndex {
    fn fmt(&self, f: &mut ::core::fmt::Formatter) -> ::core::fmt::Result {
      let mut builder = f.debug_struct("BillIndex");
      let builder = {
        let wrapper = {
          #[allow(non_snake_case)]
          fn ScalarWrapper<T>(v: T) -> T {
            v
          }
          ScalarWrapper(&self.cash)
        };
        builder.field("cash", &wrapper)
      };
      let builder = {
        let wrapper = &self.li;
        builder.field("li", &wrapper)
      };
      let builder = {
        let wrapper = {
          struct ScalarWrapper<'a>(&'a ::prost::alloc::vec::Vec<i32>);
          impl<'a> ::core::fmt::Debug for ScalarWrapper<'a> {
            fn fmt(&self, f: &mut ::core::fmt::Formatter) -> ::core::fmt::Result {
              let mut vec_builder = f.debug_list();
              for v in self.0 {
                #[allow(non_snake_case)]
                fn Inner<T>(v: T) -> T {
                  v
                }
                vec_builder.entry(&Inner(v));
              }
              vec_builder.finish()
            }
          }
          ScalarWrapper(&self.month_li)
        };
        builder.field("month_li", &wrapper)
      };
      builder.finish()
    }
  }
  #[allow(clippy::derive_partial_eq_without_eq)]
  pub struct Card {
    #[prost(uint64, tag = "1")]
    pub id: u64,
    #[prost(string, tag = "2")]
    pub brand: ::prost::alloc::string::String,
    #[prost(string, tag = "3")]
    pub name: ::prost::alloc::string::String,
    #[prost(uint32, tag = "4")]
    pub expire: u32,
    #[prost(enumeration = "Status", tag = "5")]
    pub status: i32,
  }
  #[automatically_derived]
  #[allow(clippy::derive_partial_eq_without_eq)]
  impl ::core::clone::Clone for Card {
    #[inline]
    fn clone(&self) -> Card {
      Card {
        id: ::core::clone::Clone::clone(&self.id),
        brand: ::core::clone::Clone::clone(&self.brand),
        name: ::core::clone::Clone::clone(&self.name),
        expire: ::core::clone::Clone::clone(&self.expire),
        status: ::core::clone::Clone::clone(&self.status),
      }
    }
  }
  #[automatically_derived]
  #[allow(clippy::derive_partial_eq_without_eq)]
  impl ::core::marker::StructuralPartialEq for Card {}
  #[automatically_derived]
  #[allow(clippy::derive_partial_eq_without_eq)]
  impl ::core::cmp::PartialEq for Card {
    #[inline]
    fn eq(&self, other: &Card) -> bool {
      self.id == other.id
        && self.brand == other.brand
        && self.name == other.name
        && self.expire == other.expire
        && self.status == other.status
    }
  }
  impl ::prost::Message for Card {
    #[allow(unused_variables)]
    fn encode_raw<B>(&self, buf: &mut B)
    where
      B: ::prost::bytes::BufMut,
    {
      if self.id != 0u64 {
        ::prost::encoding::uint64::encode(1u32, &self.id, buf);
      }
      if self.brand != "" {
        ::prost::encoding::string::encode(2u32, &self.brand, buf);
      }
      if self.name != "" {
        ::prost::encoding::string::encode(3u32, &self.name, buf);
      }
      if self.expire != 0u32 {
        ::prost::encoding::uint32::encode(4u32, &self.expire, buf);
      }
      if self.status != Status::default() as i32 {
        ::prost::encoding::int32::encode(5u32, &self.status, buf);
      }
    }
    #[allow(unused_variables)]
    fn merge_field<B>(
      &mut self,
      tag: u32,
      wire_type: ::prost::encoding::WireType,
      buf: &mut B,
      ctx: ::prost::encoding::DecodeContext,
    ) -> ::core::result::Result<(), ::prost::DecodeError>
    where
      B: ::prost::bytes::Buf,
    {
      const STRUCT_NAME: &'static str = "Card";
      match tag {
        1u32 => {
          let mut value = &mut self.id;
          ::prost::encoding::uint64::merge(wire_type, value, buf, ctx).map_err(|mut error| {
            error.push(STRUCT_NAME, "id");
            error
          })
        }
        2u32 => {
          let mut value = &mut self.brand;
          ::prost::encoding::string::merge(wire_type, value, buf, ctx).map_err(|mut error| {
            error.push(STRUCT_NAME, "brand");
            error
          })
        }
        3u32 => {
          let mut value = &mut self.name;
          ::prost::encoding::string::merge(wire_type, value, buf, ctx).map_err(|mut error| {
            error.push(STRUCT_NAME, "name");
            error
          })
        }
        4u32 => {
          let mut value = &mut self.expire;
          ::prost::encoding::uint32::merge(wire_type, value, buf, ctx).map_err(|mut error| {
            error.push(STRUCT_NAME, "expire");
            error
          })
        }
        5u32 => {
          let mut value = &mut self.status;
          ::prost::encoding::int32::merge(wire_type, value, buf, ctx).map_err(|mut error| {
            error.push(STRUCT_NAME, "status");
            error
          })
        }
        _ => ::prost::encoding::skip_field(wire_type, tag, buf, ctx),
      }
    }
    #[inline]
    fn encoded_len(&self) -> usize {
      0 + if self.id != 0u64 {
        ::prost::encoding::uint64::encoded_len(1u32, &self.id)
      } else {
        0
      } + if self.brand != "" {
        ::prost::encoding::string::encoded_len(2u32, &self.brand)
      } else {
        0
      } + if self.name != "" {
        ::prost::encoding::string::encoded_len(3u32, &self.name)
      } else {
        0
      } + if self.expire != 0u32 {
        ::prost::encoding::uint32::encoded_len(4u32, &self.expire)
      } else {
        0
      } + if self.status != Status::default() as i32 {
        ::prost::encoding::int32::encoded_len(5u32, &self.status)
      } else {
        0
      }
    }
    fn clear(&mut self) {
      self.id = 0u64;
      self.brand.clear();
      self.name.clear();
      self.expire = 0u32;
      self.status = Status::default() as i32;
    }
  }
  impl ::core::default::Default for Card {
    fn default() -> Self {
      Card {
        id: 0u64,
        brand: ::prost::alloc::string::String::new(),
        name: ::prost::alloc::string::String::new(),
        expire: 0u32,
        status: Status::default() as i32,
      }
    }
  }
  impl ::core::fmt::Debug for Card {
    fn fmt(&self, f: &mut ::core::fmt::Formatter) -> ::core::fmt::Result {
      let mut builder = f.debug_struct("Card");
      let builder = {
        let wrapper = {
          #[allow(non_snake_case)]
          fn ScalarWrapper<T>(v: T) -> T {
            v
          }
          ScalarWrapper(&self.id)
        };
        builder.field("id", &wrapper)
      };
      let builder = {
        let wrapper = {
          #[allow(non_snake_case)]
          fn ScalarWrapper<T>(v: T) -> T {
            v
          }
          ScalarWrapper(&self.brand)
        };
        builder.field("brand", &wrapper)
      };
      let builder = {
        let wrapper = {
          #[allow(non_snake_case)]
          fn ScalarWrapper<T>(v: T) -> T {
            v
          }
          ScalarWrapper(&self.name)
        };
        builder.field("name", &wrapper)
      };
      let builder = {
        let wrapper = {
          #[allow(non_snake_case)]
          fn ScalarWrapper<T>(v: T) -> T {
            v
          }
          ScalarWrapper(&self.expire)
        };
        builder.field("expire", &wrapper)
      };
      let builder = {
        let wrapper = {
          struct ScalarWrapper<'a>(&'a i32);
          impl<'a> ::core::fmt::Debug for ScalarWrapper<'a> {
            fn fmt(&self, f: &mut ::core::fmt::Formatter) -> ::core::fmt::Result {
              let res: ::core::result::Result<Status, _> =
                ::core::convert::TryFrom::try_from(*self.0);
              match res {
                Err(_) => ::core::fmt::Debug::fmt(&self.0, f),
                Ok(en) => ::core::fmt::Debug::fmt(&en, f),
              }
            }
          }
          ScalarWrapper(&self.status)
        };
        builder.field("status", &wrapper)
      };
      builder.finish()
    }
  }
  #[allow(dead_code)]
  impl Card {
    ///Returns the enum value of `status`, or the default if the field is set to an invalid enum value.
    pub fn status(&self) -> Status {
      ::core::convert::TryFrom::try_from(self.status).unwrap_or(Status::default())
    }
    ///Sets `status` to the provided enum value.
    pub fn set_status(&mut self, value: Status) {
      self.status = value as i32;
    }
  }
  #[allow(clippy::derive_partial_eq_without_eq)]
  pub struct Setup {
    #[prost(string, tag = "1")]
    pub mail: ::prost::alloc::string::String,
    #[prost(string, tag = "2")]
    pub stripe_pk: ::prost::alloc::string::String,
  }
  #[automatically_derived]
  #[allow(clippy::derive_partial_eq_without_eq)]
  impl ::core::clone::Clone for Setup {
    #[inline]
    fn clone(&self) -> Setup {
      Setup {
        mail: ::core::clone::Clone::clone(&self.mail),
        stripe_pk: ::core::clone::Clone::clone(&self.stripe_pk),
      }
    }
  }
  #[automatically_derived]
  #[allow(clippy::derive_partial_eq_without_eq)]
  impl ::core::marker::StructuralPartialEq for Setup {}
  #[automatically_derived]
  #[allow(clippy::derive_partial_eq_without_eq)]
  impl ::core::cmp::PartialEq for Setup {
    #[inline]
    fn eq(&self, other: &Setup) -> bool {
      self.mail == other.mail && self.stripe_pk == other.stripe_pk
    }
  }
  impl ::prost::Message for Setup {
    #[allow(unused_variables)]
    fn encode_raw<B>(&self, buf: &mut B)
    where
      B: ::prost::bytes::BufMut,
    {
      if self.mail != "" {
        ::prost::encoding::string::encode(1u32, &self.mail, buf);
      }
      if self.stripe_pk != "" {
        ::prost::encoding::string::encode(2u32, &self.stripe_pk, buf);
      }
    }
    #[allow(unused_variables)]
    fn merge_field<B>(
      &mut self,
      tag: u32,
      wire_type: ::prost::encoding::WireType,
      buf: &mut B,
      ctx: ::prost::encoding::DecodeContext,
    ) -> ::core::result::Result<(), ::prost::DecodeError>
    where
      B: ::prost::bytes::Buf,
    {
      const STRUCT_NAME: &'static str = "Setup";
      match tag {
        1u32 => {
          let mut value = &mut self.mail;
          ::prost::encoding::string::merge(wire_type, value, buf, ctx).map_err(|mut error| {
            error.push(STRUCT_NAME, "mail");
            error
          })
        }
        2u32 => {
          let mut value = &mut self.stripe_pk;
          ::prost::encoding::string::merge(wire_type, value, buf, ctx).map_err(|mut error| {
            error.push(STRUCT_NAME, "stripe_pk");
            error
          })
        }
        _ => ::prost::encoding::skip_field(wire_type, tag, buf, ctx),
      }
    }
    #[inline]
    fn encoded_len(&self) -> usize {
      0 + if self.mail != "" {
        ::prost::encoding::string::encoded_len(1u32, &self.mail)
      } else {
        0
      } + if self.stripe_pk != "" {
        ::prost::encoding::string::encoded_len(2u32, &self.stripe_pk)
      } else {
        0
      }
    }
    fn clear(&mut self) {
      self.mail.clear();
      self.stripe_pk.clear();
    }
  }
  impl ::core::default::Default for Setup {
    fn default() -> Self {
      Setup {
        mail: ::prost::alloc::string::String::new(),
        stripe_pk: ::prost::alloc::string::String::new(),
      }
    }
  }
  impl ::core::fmt::Debug for Setup {
    fn fmt(&self, f: &mut ::core::fmt::Formatter) -> ::core::fmt::Result {
      let mut builder = f.debug_struct("Setup");
      let builder = {
        let wrapper = {
          #[allow(non_snake_case)]
          fn ScalarWrapper<T>(v: T) -> T {
            v
          }
          ScalarWrapper(&self.mail)
        };
        builder.field("mail", &wrapper)
      };
      let builder = {
        let wrapper = {
          #[allow(non_snake_case)]
          fn ScalarWrapper<T>(v: T) -> T {
            v
          }
          ScalarWrapper(&self.stripe_pk)
        };
        builder.field("stripe_pk", &wrapper)
      };
      builder.finish()
    }
  }
  #[allow(clippy::derive_partial_eq_without_eq)]
  pub struct CardLi {
    #[prost(message, repeated, tag = "1")]
    pub li: ::prost::alloc::vec::Vec<Card>,
    #[prost(message, optional, tag = "2")]
    pub setup: ::core::option::Option<Setup>,
  }
  #[automatically_derived]
  #[allow(clippy::derive_partial_eq_without_eq)]
  impl ::core::clone::Clone for CardLi {
    #[inline]
    fn clone(&self) -> CardLi {
      CardLi {
        li: ::core::clone::Clone::clone(&self.li),
        setup: ::core::clone::Clone::clone(&self.setup),
      }
    }
  }
  #[automatically_derived]
  #[allow(clippy::derive_partial_eq_without_eq)]
  impl ::core::marker::StructuralPartialEq for CardLi {}
  #[automatically_derived]
  #[allow(clippy::derive_partial_eq_without_eq)]
  impl ::core::cmp::PartialEq for CardLi {
    #[inline]
    fn eq(&self, other: &CardLi) -> bool {
      self.li == other.li && self.setup == other.setup
    }
  }
  impl ::prost::Message for CardLi {
    #[allow(unused_variables)]
    fn encode_raw<B>(&self, buf: &mut B)
    where
      B: ::prost::bytes::BufMut,
    {
      for msg in &self.li {
        ::prost::encoding::message::encode(1u32, msg, buf);
      }
      if let Some(ref msg) = self.setup {
        ::prost::encoding::message::encode(2u32, msg, buf);
      }
    }
    #[allow(unused_variables)]
    fn merge_field<B>(
      &mut self,
      tag: u32,
      wire_type: ::prost::encoding::WireType,
      buf: &mut B,
      ctx: ::prost::encoding::DecodeContext,
    ) -> ::core::result::Result<(), ::prost::DecodeError>
    where
      B: ::prost::bytes::Buf,
    {
      const STRUCT_NAME: &'static str = "CardLi";
      match tag {
        1u32 => {
          let mut value = &mut self.li;
          ::prost::encoding::message::merge_repeated(wire_type, value, buf, ctx).map_err(
            |mut error| {
              error.push(STRUCT_NAME, "li");
              error
            },
          )
        }
        2u32 => {
          let mut value = &mut self.setup;
          ::prost::encoding::message::merge(
            wire_type,
            value.get_or_insert_with(::core::default::Default::default),
            buf,
            ctx,
          )
          .map_err(|mut error| {
            error.push(STRUCT_NAME, "setup");
            error
          })
        }
        _ => ::prost::encoding::skip_field(wire_type, tag, buf, ctx),
      }
    }
    #[inline]
    fn encoded_len(&self) -> usize {
      0 + ::prost::encoding::message::encoded_len_repeated(1u32, &self.li)
        + self
          .setup
          .as_ref()
          .map_or(0, |msg| ::prost::encoding::message::encoded_len(2u32, msg))
    }
    fn clear(&mut self) {
      self.li.clear();
      self.setup = ::core::option::Option::None;
    }
  }
  impl ::core::default::Default for CardLi {
    fn default() -> Self {
      CardLi {
        li: ::core::default::Default::default(),
        setup: ::core::default::Default::default(),
      }
    }
  }
  impl ::core::fmt::Debug for CardLi {
    fn fmt(&self, f: &mut ::core::fmt::Formatter) -> ::core::fmt::Result {
      let mut builder = f.debug_struct("CardLi");
      let builder = {
        let wrapper = &self.li;
        builder.field("li", &wrapper)
      };
      let builder = {
        let wrapper = &self.setup;
        builder.field("setup", &wrapper)
      };
      builder.finish()
    }
  }
  #[repr(i32)]
  pub enum Status {
    Processing = 0,
    Active = 1,
    Cancel = 2,
    Expire = 3,
  }
  #[automatically_derived]
  impl ::core::clone::Clone for Status {
    #[inline]
    fn clone(&self) -> Status {
      *self
    }
  }
  #[automatically_derived]
  impl ::core::marker::Copy for Status {}
  #[automatically_derived]
  impl ::core::fmt::Debug for Status {
    #[inline]
    fn fmt(&self, f: &mut ::core::fmt::Formatter) -> ::core::fmt::Result {
      ::core::fmt::Formatter::write_str(
        f,
        match self {
          Status::Processing => "Processing",
          Status::Active => "Active",
          Status::Cancel => "Cancel",
          Status::Expire => "Expire",
        },
      )
    }
  }
  #[automatically_derived]
  impl ::core::marker::StructuralPartialEq for Status {}
  #[automatically_derived]
  impl ::core::cmp::PartialEq for Status {
    #[inline]
    fn eq(&self, other: &Status) -> bool {
      let __self_tag = ::core::intrinsics::discriminant_value(self);
      let __arg1_tag = ::core::intrinsics::discriminant_value(other);
      __self_tag == __arg1_tag
    }
  }
  #[automatically_derived]
  impl ::core::marker::StructuralEq for Status {}
  #[automatically_derived]
  impl ::core::cmp::Eq for Status {
    #[inline]
    #[doc(hidden)]
    #[coverage(off)]
    fn assert_receiver_is_total_eq(&self) -> () {}
  }
  #[automatically_derived]
  impl ::core::hash::Hash for Status {
    #[inline]
    fn hash<__H: ::core::hash::Hasher>(&self, state: &mut __H) -> () {
      let __self_tag = ::core::intrinsics::discriminant_value(self);
      ::core::hash::Hash::hash(&__self_tag, state)
    }
  }
  #[automatically_derived]
  impl ::core::cmp::PartialOrd for Status {
    #[inline]
    fn partial_cmp(&self, other: &Status) -> ::core::option::Option<::core::cmp::Ordering> {
      let __self_tag = ::core::intrinsics::discriminant_value(self);
      let __arg1_tag = ::core::intrinsics::discriminant_value(other);
      ::core::cmp::PartialOrd::partial_cmp(&__self_tag, &__arg1_tag)
    }
  }
  #[automatically_derived]
  impl ::core::cmp::Ord for Status {
    #[inline]
    fn cmp(&self, other: &Status) -> ::core::cmp::Ordering {
      let __self_tag = ::core::intrinsics::discriminant_value(self);
      let __arg1_tag = ::core::intrinsics::discriminant_value(other);
      ::core::cmp::Ord::cmp(&__self_tag, &__arg1_tag)
    }
  }
  impl Status {
    ///Returns `true` if `value` is a variant of `Status`.
    pub fn is_valid(value: i32) -> bool {
      match value {
        0 => true,
        1 => true,
        2 => true,
        3 => true,
        _ => false,
      }
    }
    #[deprecated = "Use the TryFrom<i32> implementation instead"]
    ///Converts an `i32` to a `Status`, or `None` if `value` is not a valid variant.
    pub fn from_i32(value: i32) -> ::core::option::Option<Status> {
      match value {
        0 => ::core::option::Option::Some(Status::Processing),
        1 => ::core::option::Option::Some(Status::Active),
        2 => ::core::option::Option::Some(Status::Cancel),
        3 => ::core::option::Option::Some(Status::Expire),
        _ => ::core::option::Option::None,
      }
    }
  }
  impl ::core::default::Default for Status {
    fn default() -> Status {
      Status::Processing
    }
  }
  impl ::core::convert::From<Status> for i32 {
    fn from(value: Status) -> i32 {
      value as i32
    }
  }
  impl ::core::convert::TryFrom<i32> for Status {
    type Error = ::prost::DecodeError;
    fn try_from(value: i32) -> ::core::result::Result<Status, ::prost::DecodeError> {
      match value {
        0 => ::core::result::Result::Ok(Status::Processing),
        1 => ::core::result::Result::Ok(Status::Active),
        2 => ::core::result::Result::Ok(Status::Cancel),
        3 => ::core::result::Result::Ok(Status::Expire),
        _ => ::core::result::Result::Err(::prost::DecodeError::new("invalid enumeration value")),
      }
    }
  }
  impl Status {
    /// String value of the enum field names used in the ProtoBuf definition.
    ///
    /// The values are not transformed in any way and thus are considered stable
    /// (if the ProtoBuf definition does not change) and safe for programmatic use.
    pub fn as_str_name(&self) -> &'static str {
      match self {
        Status::Processing => "processing",
        Status::Active => "active",
        Status::Cancel => "cancel",
        Status::Expire => "expire",
      }
    }
    /// Creates an enum from field names used in the ProtoBuf definition.
    pub fn from_str_name(value: &str) -> ::core::option::Option<Self> {
      match value {
        "processing" => Some(Self::Processing),
        "active" => Some(Self::Active),
        "cancel" => Some(Self::Cancel),
        "expire" => Some(Self::Expire),
        _ => None,
      }
    }
  }
}
mod _mod {}
pub mod bill {
  use client::Uid;
  use jarg::{jarg, json};

  use crate::{api, db::month_bill};
  pub async fn post(
    Uid(uid): Uid,
    ::jarg::Json((month)): ::jarg::Json<(i32)>,
  ) -> ::re::Result<impl Into<::re::Msg>> {
    Ok(api::Bill {
      li: month_bill(uid, month)
        .await?
        .into_iter()
        .map(|(cid, kid, rid, day, n)| api::Item {
          cid: cid as _,
          kid,
          rid,
          day,
          n,
        })
        .collect(),
    })
  }
}
pub mod card_li {
  use client::Uid;
  use jarg::{jarg, json};

  use crate::api;
  #[allow(clippy::upper_case_acronyms)]
  struct __StaticInitGeneratorFor_STRIPE_PK;
  impl ::static_init::Generator<String> for __StaticInitGeneratorFor_STRIPE_PK {
    #[inline]
    fn generate(&self) -> String {
      ::genv::get("STRIPE_PK")
    }
  }
  impl ::static_init::GeneratorTolerance for __StaticInitGeneratorFor_STRIPE_PK {
    const INIT_FAILURE: bool = true;
    const FINAL_REGISTRATION_FAILURE: bool = false;
  }
  static STRIPE_PK: ::static_init::lazy::LesserLazy<String, __StaticInitGeneratorFor_STRIPE_PK> = {
    let _ = ();
    unsafe {
      ::static_init::lazy::LesserLazy::<String, __StaticInitGeneratorFor_STRIPE_PK>::from_generator(
        __StaticInitGeneratorFor_STRIPE_PK,
      )
    }
  };
  pub async fn post(
    Uid(uid): Uid,
    setup_indent: Option<::jarg::Json<(String)>>,
  ) -> ::re::Result<impl Into<::re::Msg>> {
    let li = ::alloc::vec::Vec::new();
    if let Some(indent) = setup_indent {
      (
        match "!!!!!" {
          tmp => {
            {
              ::std::io::_eprint(format_args!(
                "[{0}:{1}:{2}] {3} = {4:#?}\n",
                "src/card_li.rs", 12u32, 5u32, "\"!!!!!\"", &tmp,
              ));
            };
            tmp
          }
        },
        match indent.0 {
          tmp => {
            {
              ::std::io::_eprint(format_args!(
                "[{0}:{1}:{2}] {3} = {4:#?}\n",
                "src/card_li.rs", 12u32, 5u32, "indent.0", &tmp,
              ));
            };
            tmp
          }
        },
      );
    }
    let setup = if li.is_empty() {
      Some(api::Setup {
        mail: ::m::authUidMail(uid).await?,
        stripe_pk: STRIPE_PK.to_owned(),
      })
    } else {
      None
    };
    Ok(api::CardLi { li, setup })
  }
}
pub mod cash {
  use client::Client;
  pub async fn post(client: Client) -> ::re::Result<impl Into<::re::Msg>> {
    Ok(())
  }
}
pub mod setup {
  use client::Uid;

  use crate::db::stripe;
  #[allow(clippy::upper_case_acronyms)]
  struct __StaticInitGeneratorFor_MAIL_HOST;
  impl ::static_init::Generator<String> for __StaticInitGeneratorFor_MAIL_HOST {
    #[inline]
    fn generate(&self) -> String {
      ::genv::get("MAIL_HOST")
    }
  }
  impl ::static_init::GeneratorTolerance for __StaticInitGeneratorFor_MAIL_HOST {
    const INIT_FAILURE: bool = true;
    const FINAL_REGISTRATION_FAILURE: bool = false;
  }
  static MAIL_HOST: ::static_init::lazy::LesserLazy<String, __StaticInitGeneratorFor_MAIL_HOST> = {
    let _ = ();
    unsafe {
      ::static_init::lazy::LesserLazy::<String, __StaticInitGeneratorFor_MAIL_HOST>::from_generator(
        __StaticInitGeneratorFor_MAIL_HOST,
      )
    }
  };
  pub async fn post(Uid(uid): Uid) -> ::re::Result<impl Into<::re::Msg>> {
    Ok(stripe::setup_intents(uid).await?)
  }
}
#[allow(non_snake_case)]
pub mod K {
  pub const PAY_ON: &[u8] = b"payOn";
  pub const PAY_N: &[u8] = b"payN:";
  pub const PAY_MONTH: &[u8] = b"payMonth";
}
pub mod db {
  mod api {
    use r::fred::interfaces::{FunctionInterface, SetsInterface};

    use crate::{lua, CID, K};
    pub struct Api {
      pub threshold: u64,
      pub threshold_amount: u64,
      pub kid: u64,
    }
    #[automatically_derived]
    impl ::core::fmt::Debug for Api {
      #[inline]
      fn fmt(&self, f: &mut ::core::fmt::Formatter) -> ::core::fmt::Result {
        ::core::fmt::Formatter::debug_struct_field3_finish(
          f,
          "Api",
          "threshold",
          &self.threshold,
          "threshold_amount",
          &self.threshold_amount,
          "kid",
          &&self.kid,
        )
      }
    }
    #[automatically_derived]
    impl ::core::clone::Clone for Api {
      #[inline]
      fn clone(&self) -> Api {
        Api {
          threshold: ::core::clone::Clone::clone(&self.threshold),
          threshold_amount: ::core::clone::Clone::clone(&self.threshold_amount),
          kid: ::core::clone::Clone::clone(&self.kid),
        }
      }
    }
    impl Api {
      pub async fn can_pay(&self, uid: u64) -> anyhow::Result<bool> {
        let uid_bin = intbin::u64_bin(uid);
        Ok(r::R.sismember(K::PAY_ON, &uid_bin[..]).await?)
      }
      pub fn cost(&self, rid: u64, uid: u64, n: u32) -> anyhow::Result<()> {
        let kid = self.kid;
        let threshold = self.threshold;
        let threshold_amount = self.threshold_amount;
        trt::bg(async move {
          let uid_bin = &intbin::u64_bin(uid)[..];
          let ts = sts::sec();
          let key = [K::PAY_N, &intbin::u64_bin(kid)].concat();
          let cost: Option<u64> = r::R
            .fcall(
              lua::PAY_N,
              &[&key[..]],
              (uid_bin, n as i64, threshold as i64),
            )
            .await?;
          if let Some(cost) = cost {
            let remain = ::m::payBillNew(
              CID::API as _,
              kid,
              rid,
              uid,
              -((threshold_amount * cost) as i64),
              ts,
            )
            .await?;
            if remain <= 0 {
              r::R.srem(K::PAY_ON, uid_bin).await?;
            }
          }
          Ok::<_, anyhow::Error>(())
        });
        Ok(())
      }
    }
  }
  mod bill_month {
    use std::collections::HashSet;

    use r::{fred::interfaces::HashesInterface, R};

    use crate::K;
    async fn _bill_month(uid: u64, mut li: Vec<i32>) -> anyhow::Result<Vec<i32>> {
      let now = sts::now_month() - 1;
      let last = if li.is_empty() { 1 } else { li.pop().unwrap() };
      if last != now {
        let last = last + 1;
        let range = sts::month_day(last);
        let start = range.start;
        let end = if last == now {
          range.end
        } else {
          sts::month_day(now).end
        };
        let day_li: Vec<i32> = {
          #[allow(unused_mut)]
          let mut conn = ::mysql_macro::POOL.get_conn().await?;
          {
            use ::mysql_macro::Query;
            {
              let res = ::alloc::fmt::format(format_args!(
                "SELECT DISTINCT day FROM payBill WHERE uid={0} AND day>={1} AND day<{2}",
                uid, start, end,
              ));
              res
            }
            .fetch(&mut conn)
            .await?
          }
        };
        let mut month_set = HashSet::new();
        for i in day_li {
          month_set.insert(sts::day_month(i));
        }
        let mut mli: Vec<_> = month_set.into_iter().collect();
        mli.sort();
        li.append(&mut mli);
        let mut li = li.clone();
        trt::bg(async move {
          li.push(now);
          let uid_bin = intbin::u64_bin(uid);
          let li_bin = vb::diffe(li.into_iter().map(|i| i as u64).collect::<Vec<_>>());
          R.hset(K::PAY_MONTH, (&uid_bin[..], &li_bin[..])).await?;
          Ok::<_, anyhow::Error>(())
        });
      }
      Ok(li)
    }
    pub async fn bill_month(uid: u64) -> anyhow::Result<Vec<i32>> {
      let uid_bin = intbin::u64_bin(uid);
      let month_li: Vec<u8> = R.hget(K::PAY_MONTH, &uid_bin[..]).await?;
      _bill_month(
        uid,
        if month_li.is_empty() {
          ::alloc::vec::Vec::new()
        } else {
          vb::diffd(month_li)?.into_iter().map(|i| i as _).collect()
        },
      )
      .await
    }
  }
  pub mod stripe {
    use std::str::FromStr;

    use stripe::{Client, CreateCustomer, CreateSetupIntent, Customer, CustomerId, SetupIntent};
    #[allow(non_snake_case)]
    pub fn STRIPE_SK<T: std::str::FromStr>() -> T
    where
      <T as std::str::FromStr>::Err: std::fmt::Debug,
    {
      ::genv::get("STRIPE_SK")
    }
    #[allow(clippy::upper_case_acronyms)]
    pub struct __StaticInitGeneratorFor_STRIPE;
    impl ::static_init::Generator<Client> for __StaticInitGeneratorFor_STRIPE {
      #[inline]
      fn generate(&self) -> Client {
        Client::new(STRIPE_SK::<String>())
      }
    }
    impl ::static_init::GeneratorTolerance for __StaticInitGeneratorFor_STRIPE {
      const INIT_FAILURE: bool = true;
      const FINAL_REGISTRATION_FAILURE: bool = false;
    }
    pub static STRIPE: ::static_init::lazy::LesserLazy<Client, __StaticInitGeneratorFor_STRIPE> = {
      let _ = ();
      unsafe {
        ::static_init::lazy::LesserLazy::<Client, __StaticInitGeneratorFor_STRIPE>::from_generator(
          __StaticInitGeneratorFor_STRIPE,
        )
      }
    };
    pub async fn customer(uid: u64) -> aok::Result<Vec<u8>> {
      let uid_b64 = ub64::u64_b64(uid);
      Ok(
        if let Some::<Vec<u8>>(v) = {
          #[allow(unused_mut)]
          let mut conn = ::mysql_macro::POOL.get_conn().await?;
          {
            use ::mysql_macro::Query;
            {
              let res = ::alloc::fmt::format(format_args!(
                "SELECT v FROM payStripeCustomer WHERE id={0}",
                uid,
              ));
              res
            }
            .first(&mut conn)
            .await?
          }
        } {
          v
        } else {
          let customer = Customer::create(
            &STRIPE,
            CreateCustomer {
              name: Some(&uid_b64),
              ..Default::default()
            },
          )
          .await?;
          let cid = customer.id.as_str();
          let cid = &cid[4..];
          let v = b62::d(cid)?;
          {
            #[allow(unused_mut)]
            let mut conn = ::mysql_macro::POOL.get_conn().await?;
            {
              use ::mysql_macro::{Query, WithParams};
              {
                let res = ::alloc::fmt::format(format_args!(
                  "INSERT INTO payStripeCustomer(id,v) VALUES ({0},?)",
                  uid,
                ));
                res
              }
              .with(::mysql_macro::Params::Positional(<[_]>::into_vec(
                #[rustc_box]
                ::alloc::boxed::Box::new([(&v).into()]),
              )))
              .ignore(&mut conn)
              .await?
            }
          };
          v
        },
      )
    }
    pub async fn setup_intents(uid: u64) -> aok::Result<String> {
      let customer = {
        let res = ::alloc::fmt::format(format_args!("cus_{0}", b62::e(customer(uid).await?)));
        res
      };
      let setup_intents = SetupIntent::create(
        &STRIPE,
        CreateSetupIntent {
          customer: Some(CustomerId::from_str(&customer)?),
          ..Default::default()
        },
      )
      .await?;
      Ok(if let Some(client_secret) = setup_intents.client_secret {
        client_secret.as_str()[5..].into()
      } else {
        "".into()
      })
    }
  }
  pub use api::Api;
  pub use bill_month::bill_month;
  use r::fred::interfaces::SetsInterface;

  use crate::K;
  pub const BASE: f64 = 100.0;
  pub async fn topup_f64(
    cid: u16,
    kid: u64,
    rid: u64,
    uid: u64,
    amount: f64,
  ) -> anyhow::Result<f64> {
    let amount = (amount * BASE).round();
    Ok(topup_cent(cid, kid, rid, uid, amount as _).await? as f64 / BASE)
  }
  pub async fn topup_cent(
    cid: u16,
    kid: u64,
    rid: u64,
    uid: u64,
    amount: i64,
  ) -> anyhow::Result<i64> {
    let ts = sts::sec();
    let remain = ::m::payBillNew(cid, kid, rid, uid, amount, ts).await?;
    if remain > 0 {
      r::R.sadd(K::PAY_ON, intbin::u64_bin(uid)).await?;
    }
    Ok(remain)
  }
  pub async fn month_bill(uid: u64, month: i32) -> anyhow::Result<Vec<(u16, u64, u64, i32, i64)>> {
    let mday = sts::month_day(month);
    Ok({
      #[allow(unused_mut)]
      let mut conn = ::mysql_macro::POOL.get_conn().await?;
      {
        use ::mysql_macro::Query;
        {
          let res = ::alloc::fmt::format(format_args!(
            "CALL payBill({2},{0},{1})",
            mday.start, mday.end, uid,
          ));
          res
        }
        .fetch(&mut conn)
        .await?
      }
    })
  }
}
use sonic_rs::from_slice;
mod lua {
  pub const PAY_N: &str = "payN";
}
use client::Uid;
pub use db::Api;
#[allow(non_camel_case_types)]
pub enum CID {
  TOPUP = 0,
  API = 1,
}
#[allow(non_camel_case_types)]
pub enum KID {
  MANUAL = 0,
  STRIPE = 1,
  GOOGLE_PAY = 2,
  ALI = 3,
  AIRWALLEX = 4,
  WX = 5,
}
pub async fn post(Uid(uid): Uid) -> ::re::Result<impl Into<::re::Msg>> {
  use crate::db::month_bill;
  let mut month_li = db::bill_month(uid).await?;
  let month = sts::now_month();
  let day_range = sts::month_day(month);
  let json = ::m::payIndex(uid, day_range.start, day_range.end).await?;
  let (cash, li): (i64, Option<Vec<(u16, u64, u64, i32, i64)>>) = from_slice(&json)?;
  (
    match &cash {
      tmp => {
        {
          ::std::io::_eprint(format_args!(
            "[{0}:{1}:{2}] {3} = {4:#?}\n",
            "src/lib.rs", 39u32, 3u32, "&cash", &tmp,
          ));
        };
        tmp
      }
    },
    match &li {
      tmp => {
        {
          ::std::io::_eprint(format_args!(
            "[{0}:{1}:{2}] {3} = {4:#?}\n",
            "src/lib.rs", 39u32, 3u32, "&li", &tmp,
          ));
        };
        tmp
      }
    },
  );
  let li = if let Some(li) = li {
    month_li.push(month as _);
    li
  } else {
    if !month_li.is_empty() {
      let m = month_li.last().unwrap();
      month_bill(uid, *m as _).await?
    } else {
      Vec::new()
    }
  }
  .into_iter()
  .map(|(cid, kid, rid, day, n)| api::Item {
    cid: cid as _,
    kid,
    rid,
    day,
    n,
  })
  .collect::<Vec<_>>();
  month_li.reverse();
  Ok(api::BillIndex { month_li, cash, li })
}

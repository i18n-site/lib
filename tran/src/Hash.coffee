#!/usr/bin/env coffee

> @3-/utf8/utf8e.js
  @3-/xxhash3 > hash128

< (txt)=>
  txt = utf8e txt
  if txt.length <= 16
    return txt
  return hash128 txt


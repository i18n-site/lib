< (b64)=>
  Uint8Array.from(atob(b64), (m) => m.codePointAt(0))

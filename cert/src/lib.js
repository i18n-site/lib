#!/usr/bin/env bun

import { X509Certificate } from "crypto";

export default (crt) => {
  const x509 = new X509Certificate(crt),
    date = new Date(x509.validTo),
    y = date.getFullYear(),
    m = String(date.getMonth() + 1).padStart(2, "0"),
    d = String(date.getDate()).padStart(2, "0"),
    san = x509.subjectAltName || "",
    host_li = san
      .split(",")
      .map((s) => s.trim().replace(/^DNS:/, ""))
      .filter(Boolean);
  return {
    expire: `${y}${m}${d}`,
    host_li,
    host: host_li.reduce(
      (a, b) => (a.length <= b.length ? a : b),
      host_li[0] || "",
    ),
  };
};

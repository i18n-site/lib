#!/usr/bin/env coffee

> ../src/CODE.js

# https://github.com/THUDM/GLM-4/pull/370
GLM4 =  [
    "zh",
    "en",
    "ru",
    "es",
    "de",
    "fr",
    "it",
    "pt",
    "pl",
    "ja",
    "nl",
    "ar",
    "tr",
    "cs",
    "vi",
    "fa",
    "hu",
    "el",
    "ro",
    "sv",
    "uk",
    "fi",
    "ko",
    "da",
    "bg",
    "no"
]

console.log GLM4.length
for i in GLM4
  console.log i, CODE.includes(i)

  if not CODE.includes(i)
    console.log i

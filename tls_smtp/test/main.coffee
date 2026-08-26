#!/usr/bin/env coffee

> ../src/lib.js:TlsSmtp

{
  SMTP_USER
  SMTP_PASSWORD
} = process.env

for ip from [
  '66.94.126.189'
  # '2605:a141:2288:4652::1'
]
  try
    console.log '✅', ip, await TlsSmtp(
      SMTP_USER
      SMTP_PASSWORD
      ip
      "smtp.js0.site"
    )

  catch err
    console.log ip, err

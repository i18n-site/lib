#!/usr/bin/env coffee

> ../src/lib.js:smtpCheck

{
  SMTP_USER
  SMTP_PASSWORD
} = process.env

console.log await smtpCheck 'smtp.js0.site', SMTP_USER, SMTP_PASSWORD

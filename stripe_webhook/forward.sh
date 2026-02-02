#!/usr/bin/env bash
exec stripe listen --forward-to http://127.0.0.1:3000

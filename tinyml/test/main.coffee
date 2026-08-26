#!/usr/bin/env coffee

> @3-/tinyml

console.log tinyml ""

console.log tinyml """

"""

console.log tinyml """
name: John
description: |
  This is a

  multiline string.
  # This is a comment inside the multiline string.
  Second line with content.
age: 25
# This is an ignored comment
address:
  city: New York
  zip: 10001
"""

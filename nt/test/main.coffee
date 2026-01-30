#!/usr/bin/env coffee

> @3-/nt/loads.js
  @3-/nt/dumps.js

# li = loads '''
# # t1
# a:
#   # t2
#   b:
#     c: 1
#     # t3
#     d: 2
#   x: 3
#   y:
#     - m
#     - n
# e:
#   f:
#     > 123
#     > 456
# '''
# console.log dumps li

li = loads '''
cnameFlatten:
  - i18n.site
    - i18n.site.a.bdydns.com/user0.cf
  - 3ti.site
    - 3ti.site.s2-web.dogedns.com/u-01.eu.org
'''
console.log JSON.stringify(li,null,2)
# en:
#  zh :
#   - a: b
#   -
#     c: d
#     e: f

# li = loads '''
# - a
# - b
# '''
# console.log dumps li
#
# li = loads '''
# a:
#   > 123
#   > 235
# b:
#   > 123
#   > 235
# '''
# console.log dumps li

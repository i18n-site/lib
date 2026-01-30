#!/usr/bin/env coffee

> @3-/svgo

svgInput = '<svg viewBox="0 0 100 100">\n<rect width="100" height="100" fill="red"/></svg>'
result = svgo svgInput

console.log svgInput,'\n→\n'+result

#!/usr/bin/env coffee

> @3-/svgo

svgInput = '<svg viewBox="0 0 100 100">\n<rect width="100" height="100" fill="red"/></svg>'
result = svgo svgInput

console.log svgInput,'\n→\n'+result

svgFilter = '<svg><filter id="l"><feTurbulence type="fractalNoise" baseFrequency="0.012"/></filter></svg>'
resultFilter = svgo svgFilter

console.log svgFilter,'\n→\n'+resultFilter

if not resultFilter.includes('id="l"')
  throw new Error("filter id='l' was removed by svgo!")

if not resultFilter.includes('feTurbulence')
  throw new Error("filter content was removed by svgo!")

console.log "Test passed: filter ID and hidden elements are preserved!"

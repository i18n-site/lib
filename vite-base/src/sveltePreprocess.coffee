#!/usr/bin/env coffee

import sveltePreprocess from '@3-/svelte-preprocess'

export pug = {}

export default [
  sveltePreprocess {
    coffeescript: {
      label:true
      sourceMap: true
    }
    #customElement:true
    stylus: true
    pug
  }
]

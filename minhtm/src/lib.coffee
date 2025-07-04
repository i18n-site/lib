import {minify} from 'html-minifier-terser'
import extractReplace from '@3-/extract/extractReplace.js'

export default (htm)=>
  htm = await minify htm,{
    collapseWhitespace: true
    html5: true
    minifyCSS: true
    minifyJS: true
    removeAttributeQuotes: true
    removeComments: true
    removeRedundantAttributes: true
    removeScriptTypeAttributes: true
    removeStyleLinkTypeAttributes: true
    useShortDoctype: true
  }
  extractReplace(
    '<script type=importmap>'
    '</script>'
    (s)=>
      JSON.stringify JSON.parse(s)
    htm
  ) or htm

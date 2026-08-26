import {minify} from 'html-minifier-terser'

export INDEX_HTML = 'index.html'

export default {
  name: 'mini_html'
  apply: 'build'
  enforce: 'post'
  generateBundle : (_,bundle)=>
    li = Object.values bundle

    map = new Map()
    prefix = '../file/'
    prefix_len = prefix.length
    for {name,fileName} from li
      if not name
        continue
      if name.startsWith prefix
        map.set name[prefix_len..],fileName

    for i from li
      if i.type == 'asset' and /\.html?$/.test(i.fileName)
        if INDEX_HTML == i.fileName
          i.fileName = INDEX_HTML[...-1]
        html = await minify i.source,{
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
        i.source = html
    return
}

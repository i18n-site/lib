> @3-/coffee_plus
  pug
  ./sveltePreprocess.js:sveltePreprocess > pug:pugOpt
  ./plugin/pug.js:import_pug
  ./plugin/vite-plugin-stylus-alias.mjs:vitePluginStylusAlias
  lodash-es/merge.js
  path > join dirname
  fs > writeFileSync renameSync
  @sveltejs/vite-plugin-svelte > svelte
  coffeescript

IGNORE_WARN = new Set(
  'a11y-click-events-have-key-events a11y-missing-content'.split(' ')
)

compile = CoffeePlus(coffeescript)

viteConf = (ROOT)=>
  DIST = join ROOT,'dist'
  SRC = join ROOT,'src'
  FILE = join ROOT,'file'

  INDEX_HTML = 'index.html'
  SRC_INDEX_HTML = join SRC,INDEX_HTML
  writeFileSync(
    SRC_INDEX_HTML
    pug.compileFile(join SRC, 'index.pug')({
    })
  )
  {env} = process
  host = env.VITE_HOST or '0.0.0.0'
  port = env.VITE_PORT or 5555

  alias = {
    ":": join(ROOT, "file")
    '~': join ROOT, 'node_modules/~'
  }

  pugOpt.basedir = join SRC, 'pug'

  PRODUCTION = env.NODE_ENV == 'production'
  TARGET = ["esnext"]

  SVELTE_CONFIG = {
    onwarn:(warn)=>
      {code,message} = warn
      if code == 'a11y-missing-attribute'
        return !message.includes('<a>')
      !IGNORE_WARN.has code
    preprocess: sveltePreprocess
  }

  if PRODUCTION
    SVELTE_CONFIG.dynamicCompileOptions = =>
      cssHash: ({ css, hash }) =>
        "_#{hash(css)}"

  config = {
    define:
      DEV: !PRODUCTION
    publicDir: join ROOT, 'public'
    plugins: [
      {
        name: 'coffee2'
        transform: (code, id) ->
          if not id.endsWith '.coffee'
            return
          try
            out = compile code,
              filename:  id
              bare:      true
              sourceMap: true
          catch err
            throw err

          code: out.js
          map:  out.v3SourceMap
      }
      svelte SVELTE_CONFIG
      vitePluginStylusAlias()
      import_pug(SRC)
    ]
    clearScreen: false
    server:{
      https: true
      fs:
        strict: false
      host
      port
      strictPort: true
      proxy:
        '[.@]|^\/i18n\/':
          target: "http://#{host}:#{port}"
          rewrite: (path)=>'/'
          changeOrigin: false
    }
    resolve: {
      alias
    }
    esbuild:
      charset:'utf8'
      legalComments: 'none'
      treeShaking: true
    root: SRC
    # css:
      # transformer: 'lightningcss'
      # lightningcss

    build:
      cssMinify: true #'lightningcss'
      outDir: DIST
      rollupOptions:
        input:
          index:SRC_INDEX_HTML
      target:TARGET
      assetsDir: '/'
      emptyOutDir: true
    optimizeDeps:
      # exclude:[
      #   "@3-/vite"
      # ]
      esbuildOptions:

        plugins: [
          {
            name: "alias",
            setup:(build)=>
              build.onResolve(
                {
                  filter: /^~/,
                  namespace: "file",
                },
                (args) =>
                  return {
                    path: join(ROOT, "node_modules", args.path),
                  }
              )
              return
          }
        ]
        target: TARGET
  }

  merge config, await do =>
    if PRODUCTION
      FILENAME = '[name].[hash].[ext]'
      JSNAME = '[name].[hash].js'

      if env.DEBUG
        base = '/'
        minify = false
      else
        base = env.CDN or '/'
        minify = true

      return {
        plugins:[
          (
            await import('./plugin/mini_html.js')
          ).default
        ]
        base
        build:{
          minify
          rollupOptions:{
            output:
              chunkFileNames: JSNAME
              assetFileNames: FILENAME
              entryFileNames: "I18N.SITE.js"
          }
        }
      }
    else
      return {
        plugins:[
          (await import('vite-plugin-mkcert')).default()
          {
            name:'html-img-src'
            transformIndexHtml:(html)=>
              html.replaceAll(
                'src=":/'
                'src="/@fs'+FILE+'/'
              )
          }
        ]
      }

import { defineConfig } from 'vite'
export default (ROOT)=>
  conf = await viteConf(ROOT)
  =>
    defineConfig(conf)

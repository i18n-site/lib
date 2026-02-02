> ./uws.js
  ./ssl.js
  path > join

< (App, root)=>
  uws(
    App
    ssl(
      join(root,'localhost-key.pem')
      join(root,'localhost.pem')
    )
  )

< (site, token, url_li)=>
  url = "http://data.zz.baidu.com/urls?site=https://#{site}&token=#{token}"
  (
    await fetch(
      url
      {
        method: 'POST'
        headers: {
          'Content-Type': 'text/plain'
        }
        body: url_li.join('\n')
      }
    )
  ).text()

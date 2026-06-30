import webpush from 'web-push'


< (webpush_opt, icon)=>
  (title, url, body, endpoint, auth, p256dh)=>
    # console.log endpoint.length
    # console.log Buffer.from(auth,'base64url').length
    # console.log Buffer.from(p256dh,'base64url').length

    opt = {
      data:{
        url
      }
    }

    if icon
      opt.icon = icon

    if body
      opt.body = body

    p = webpush.sendNotification(
      {
        endpoint: endpoint
        keys: {
          p256dh: p256dh
          auth: auth
        }
      }
      JSON.stringify [
        title
        opt
      ]
      webpush_opt
    )
    try
      return await p
    catch err
      throw err
    return

# const pushSubscription = {
#   endpoint: '< Push Subscription URL >',
#   keys: {
#     p256dh: '< User Public Encryption Key >',
#     auth: '< User Auth Secret >'
#   }
# };
#
# const payload = '< Push Payload String >';
#
# const options = {
#   gcmAPIKey: '< GCM API Key >',
#   vapidDetails: {
#     subject: '< \'mailto\' Address or URL >',
#     publicKey: '< URL Safe Base64 Encoded Public Key >',
#     privateKey: '< URL Safe Base64 Encoded Private Key >'
#   },
#   timeout: <Number>
#   TTL: <Number>,
#   headers: {
#     '< header name >': '< header value >'
#   },
#   contentEncoding: '< Encoding type, e.g.: aesgcm or aes128gcm >',
#   urgency:'< Default is "normal" >',
#   topic:'< Use a maximum of 32 characters from the URL or filename-safe Base64 characters sets. >',
#
#   proxy: '< proxy server options >',
#   agent: '< https.Agent instance >'
# }
#
# webpush.sendNotification(
#   pushSubscription,
#   payload,
#   options
# );
#

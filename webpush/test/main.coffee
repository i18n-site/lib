#!/usr/bin/env coffee

> @3-/webpush
  @3-/dbq > $q
  @3-/utf8/utf8d.js

{
  VAPID_PK
  VAPID_SK
} = process.env

push = webpush(
  {
    proxy: "http://127.0.0.1:7890"
    vapidDetails: {
      subject: 'mailto:i18n.site@gmail.com'
      publicKey : VAPID_PK
      privateKey: VAPID_SK
    }
  }
  'https://i18n.site/android-chrome-512x512.png'
)

base64url = 'base64url'

ID_HOST = new Map (
  await $q("SELECT id,host FROM webpushEndpointHost")
).map ([id, host])=> [id, utf8d(host)]

for [endpointHostId, endpoint, auth, p256dh] from await $q("SELECT endpointHostId,endpoint,auth,p256dh FROM webpush")
  endpoint = 'https://' + ID_HOST.get(endpointHostId) + '/' + utf8d(endpoint)
  console.log endpoint
  auth = auth.toString(base64url)
  p256dh = p256dh.toString(base64url)
  try
    console.log await push(
      '测试webpush'
      'https://www.npmjs.com/package/web-push'
      '主体'
      endpoint
      auth
      p256dh
    )
  catch err
    console.log err.statusCode, err.body
console.log('done')
# {"endpoint":"https://web.push.apple.com/QD8StnDGB1khT2Ehn0itRDrN4rZzF3XqYxG4ELn9ovO39-vIL1C39Mvx2uA8HpNO-d_E8yQtGIDJ92p43ciqp_x0aoi3A930Zbi4C86g7bVjDM6NQ79v_sev4twHXYGWqJSEplvFbUcIN4S_feTPWc-zhnE0vBmPBdaaJSQGghI","keys":{"p256dh":"BBdcKG-6UrSSb8kJJWZ-I0NWDNIqF9_7IDJLfMvr5fv0ZJOlUsFFC5Rz11gEY_fhJlmgeRL96V4hQ27llcDnsuA","auth":"TqzuWW63r_vTfyINDjmVAg"}}

# ARG = [
#   [
#     "https://web.push.apple.com/QD8StnDGB1khT2Ehn0itRDrN4rZzF3XqYxG4ELn9ovO39-vIL1C39Mvx2uA8HpNO-d_E8yQtGIDJ92p43ciqp_x0aoi3A930Zbi4C86g7bVjDM6NQ79v_sev4twHXYGWqJSEplvFbUcIN4S_feTPWc-zhnE0vBmPBdaaJSQGghI"
#     "TqzuWW63r_vTfyINDjmVAg"
#     "BBdcKG-6UrSSb8kJJWZ-I0NWDNIqF9_7IDJLfMvr5fv0ZJOlUsFFC5Rz11gEY_fhJlmgeRL96V4hQ27llcDnsuA"
#   ]
#   ["https://updates.push.services.mozilla.com/wpush/v2/gAAAAABmaRzB2cyqwa5h1iR2Yz9TJjGlfgw5r6OZXkPrJwj3FVtQucKHoDCbPFHFXBElhz8Uz-CrybHYOGZvuA3PQAZ7xx36FXSFELFdc_RDdFz_b99sZzLG7tNpGiXYXu_M-V5EUb93FPhqASfgX-77dQrF1x_cn4-WO_wHwBcw6y6WzEqVHmw","PSCbzbnnMPAFQ9Qcfez_yQ","BGD2kV9zk0d1fv7xCJ00_EPIG335fws_MCrpLX3x852r7ySPqJ8gUqlSTAcyHxetcoMRckIwQyk0FvsdFp8VUxQ",0]
#   ["https://fcm.googleapis.com/fcm/send/eQh3we0tMkk:APA91bFxO_ydkPXvWlnt_3K9Pn4WbIHEPJ2dS5a4Hz0P5wqm40rB13i3QOA29bvqVxqS0oJH6__PXx1GmnpPGb_nwwuHYS2q5I5wQ1vbglGHLEfzssK-CzdhIQaf_FrDPqR67Zzcea8V","5jGSvwj2_K7GGd4-dGw18w","BFoecbFSWzJib91A4UPiqdmJmAVw_b1-hmgdkLsXwqrahcVlP4gj_GxqWKxuOiiLF0fS9_4v0EoW-yRzGjmsOVw",0]
# ]
#
# for arg in ARG
#   console.log await push(
#     '测试webpush'
#     'https://www.npmjs.com/package/web-push'
#     '主体'
#     ... arg
#   )

> @3-/fetch/timeout.js
  @3-/fetch/fJson.js:_fJson
  @3-/time/ymd2day.js
  @3-/retry

fJson = timeout _fJson,6e4

rateUrl = (from_currency, to_currency)=>
  "https://www.mastercard.us/settlement/currencyrate/conversion-rate?fxDate=0000-00-00&transCurr=#{from_currency}&crdhldBillCurr=#{to_currency}&bankFee=0&transAmt=1"

< retry (from_currency, to_currency)=>
  url = rateUrl from_currency, to_currency
  n = 0
  while ++n < 100
    try
      json = await fJson url
      break
    catch e
      console.log '\n'+url, e

  {data:{fxDate,conversionRate}} = json

  [
    ymd2day fxDate
    Math.round conversionRate*1e6
  ]

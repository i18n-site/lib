> @3-/uws
  @3-/uws/Err.js > NOT_FOUND
  ./setup_intent.js:setup_intent
  ./payment_method.js:payment_method
  ./payment_intent.js:payment_intent
  ./STRIPE.js

{
  STRIPE_WEBHOOK
} = process.env

KIND  = {
  setup_intent
  payment_intent
  payment_method
}

stripe = (sig, body)=>
  {type, data} = STRIPE.webhooks.constructEvent(
    body
    sig
    STRIPE_WEBHOOK
  )
  console.log type
  [kind, action] = type.split('.')

  func = KIND[kind]?[action]
  if func
    await func(data.object)
    return
  console.log '⚠️ 未处理类型', type
  throw NOT_FOUND
  return

uws ->
  switch @method
    when 'post'
      sig = @head['stripe-signature']
      if sig
        return await stripe(
          sig
          await @txt
        )
  throw NOT_FOUND
  return

> @3-/b62/b62d.js
  @3-/dbq > $one $row $e
  @3-/time/ymN.js
  ./STRIPE.js
  ./PaymentMethodType.js
  ./SetupIntentStatus.js
  ./db.js > paymentMethodId rmPaymentMethod

brandId = (brand)=>
  $one("SELECT payBrandId(?)", brand)

rm = (o)=>
  {
    payment_method
  } = o

  payment_method_set = new Set()

  if payment_method
    payment_method_set.add payment_method

  id = o.last_setup_error?.payment_method?.id
  if id
    payment_method_set.add id

  for i from payment_method_set
    await rmPaymentMethod i
  return


push = (
  uid
  payment_method_created
  status
  type
  payment_method_id
  brand
  exp
  name
)=>
  brand_id = await brandId(brand)
  $e(
    "INSERT INTO payStripePaymentMethod(uid,ts,status,kind,v,brand_id,exp,name)VALUES(?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE status=VALUES(status),exp=VALUES(exp),name=VALUES(name)",
    uid
    payment_method_created
    SetupIntentStatus[status]
    PaymentMethodType[type]
    paymentMethodId payment_method_id
    brand_id
    exp
    name
  )

export default {
  succeeded: (o)=>
    if o.status != 'succeeded'
      return
    if o.usage != 'off_session'
      return

    {
      payment_method
      latest_attempt
      customer
    } = o

    # payment_method_id = b62d payment_method.slice(3)
    # pre = await $row(
    #   "SELECT id,status FROM payStripePaymentMethod WHERE v=?"
    #   payment_method_id
    # )
    # if pre?[1] == 5
    #   console.log payment_method,'exist'
      # return
    if not customer
      return

    customer = b62d customer.slice(4)
    user_id = await $one(
      "SELECT id FROM payStripeCustomer WHERE v=?"
      customer
    )
    if not user_id
      return

    o = await STRIPE.setupIntents.retrieve(
      o.id
      expand: ["latest_attempt","payment_method","mandate"]
    )

    {payment_method} = o
    {type,created} = payment_method

    _push = (
      payment_method_id
      brand
      exp
      name
    )=>
      push(
        user_id
        payment_method.created
        o.status
        type
        payment_method_id
        brand
        exp
        name
      )

    switch type
      when 'card'
        {card} = payment_method
        {
          exp_year
          exp_month
          brand
          last4
        } = card
        # console.log payment_method.id
        await _push(
          payment_method.id
          brand
          ymN(exp_year,exp_month)
          last4
        )
      when 'sepa_debit'
        {
          country
          last4
        } = payment_method[type]

        li = []
        for i in [country, last4]
          if i
            li.push i

        name = li.join ' '

        # console.log payment_method.id
        # console.log o.mandate.id

        await _push(
          payment_method.id
          'sepa'
          0
          li.join(" ")
        )
      when 'ideal','bancontact'
        {
          payment_method_details
        } = o.latest_attempt
        {
          bank_code
          bank
          iban_last4
          generated_sepa_debit
          generated_sepa_debit_mandate
        } = payment_method_details[type]
        # console.log generated_sepa_debit_mandate,generated_sepa_debit
        await _push(
          generated_sepa_debit
          bank_code or bank
          0
          iban_last4
        )
      else
        console.log '未处理的 payment_method.type',type
    return

  canceled:rm
  setup_failed:rm
}


> @3-/b62/b62d.js
  @3-/dbq > $e

< paymentMethodId = (payment_method_id)=>
   b62d payment_method_id.slice(3)

< rmPaymentMethod = (id)=>
  $e(
    "DELETE from payStripePaymentMethod WHERE v=?"
    paymentMethodId id
  )

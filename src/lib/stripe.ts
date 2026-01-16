import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-12-15.clover',
});

export const MAX_AUTHORIZATION_AMOUNT = 36000; // $360 in cents
export const MIN_CHARGE_AMOUNT = 100; // $1 in cents
export const MAX_CHARGE_AMOUNT = 36000; // $360 in cents

/**
 * Create a PaymentIntent with manual capture method
 * This authorizes the card for $360 but doesn't charge yet
 */
export async function createPaymentIntent(
  amount: number = MAX_AUTHORIZATION_AMOUNT,
  metadata: Record<string, string> = {}
): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    capture_method: 'manual',
    metadata,
  });
}

/**
 * Capture a specific amount from an authorized PaymentIntent
 * @param paymentIntentId The ID of the PaymentIntent to capture
 * @param amountToCapture Amount in cents to actually charge (1-360 dollars)
 */
export async function capturePayment(
  paymentIntentId: string,
  amountToCapture: number
): Promise<Stripe.PaymentIntent> {
  if (amountToCapture < MIN_CHARGE_AMOUNT || amountToCapture > MAX_CHARGE_AMOUNT) {
    throw new Error(`Amount must be between ${MIN_CHARGE_AMOUNT} and ${MAX_CHARGE_AMOUNT} cents`);
  }

  return await stripe.paymentIntents.capture(paymentIntentId, {
    amount_to_capture: amountToCapture,
  });
}

/**
 * Cancel an authorized PaymentIntent (release the hold)
 */
export async function cancelPayment(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.cancel(paymentIntentId);
}

/**
 * Refund a captured payment
 */
export async function refundPayment(
  paymentIntentId: string,
  amount?: number
): Promise<Stripe.Refund> {
  return await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount,
  });
}

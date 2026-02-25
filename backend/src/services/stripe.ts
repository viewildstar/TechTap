import Stripe from 'stripe';
import pool from '../utils/db';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
});

/**
 * Create or get Stripe customer for guest
 */
export async function getOrCreateCustomer(
  userId: string,
  email: string,
  paymentMethodId?: string
): Promise<string> {
  // Check if customer already exists in database
  const userResult = await pool.query(
    'SELECT payment_method_id FROM users WHERE id = $1',
    [userId]
  );

  // TODO: Store Stripe customer ID in users table
  // For now, create a new customer each time (not ideal, but works for MVP)
  
  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  });

  if (paymentMethodId) {
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id,
    });
  }

  return customer.id;
}

/**
 * Create Payment Intent with escrow (for marketplace)
 * Payment is held until both parties confirm completion
 */
export async function createPaymentIntent(
  matchId: string,
  guestId: string,
  hostId: string,
  amount: number, // in dollars
  guestCustomerId: string,
  hostStripeAccountId?: string
): Promise<Stripe.PaymentIntent> {
  const amountInCents = Math.round(amount * 100);

  // If host has Stripe Connect account, use destination charges
  // Otherwise, we'll transfer manually after completion
  const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
    amount: amountInCents,
    currency: 'usd',
    customer: guestCustomerId,
    payment_method_types: ['card'],
    capture_method: 'manual', // Hold payment until we confirm
    metadata: {
      matchId,
      hostId,
      guestId,
    },
  };

  // If host has Stripe Connect account, set up transfer
  if (hostStripeAccountId) {
    paymentIntentParams.application_fee_amount = 0; // No platform fee in MVP
    paymentIntentParams.transfer_data = {
      destination: hostStripeAccountId,
    };
  }

  const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

  return paymentIntent;
}

/**
 * Capture (release) payment to host
 */
export async function capturePayment(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);
  return paymentIntent;
}

/**
 * Refund payment (full or partial)
 */
export async function refundPayment(
  paymentIntentId: string,
  amount?: number // in cents, if partial refund
): Promise<Stripe.Refund> {
  const refundParams: Stripe.RefundCreateParams = {
    payment_intent: paymentIntentId,
  };

  if (amount) {
    refundParams.amount = amount;
  }

  const refund = await stripe.refunds.create(refundParams);
  return refund;
}

/**
 * Create Stripe Connect account for host (Express account)
 */
export async function createConnectAccount(
  userId: string,
  email: string
): Promise<Stripe.Account> {
  const account = await stripe.accounts.create({
    type: 'express',
    country: 'US',
    email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    metadata: {
      userId,
    },
  });

  // Store account ID in database
  await pool.query(
    'UPDATE users SET host_stripe_account_id = $1, updated_at = NOW() WHERE id = $2',
    [account.id, userId]
  );

  return account;
}

/**
 * Create account link for Stripe Connect onboarding
 */
export async function createAccountLink(
  accountId: string,
  returnUrl: string,
  refreshUrl: string
): Promise<Stripe.AccountLink> {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    return_url: returnUrl,
    refresh_url: refreshUrl,
    type: 'account_onboarding',
  });

  return accountLink;
}

/**
 * Transfer funds to host (if not using Connect destination charges)
 */
export async function transferToHost(
  hostStripeAccountId: string,
  amount: number, // in cents
  paymentIntentId: string
): Promise<Stripe.Transfer> {
  const transfer = await stripe.transfers.create({
    amount,
    currency: 'usd',
    destination: hostStripeAccountId,
    source_transaction: paymentIntentId,
  });

  return transfer;
}


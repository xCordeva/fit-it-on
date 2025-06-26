import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
})

export const PLANS = {
  pro: {
    name: 'Pro',
    price: 29,
    priceId: 'price_pro_monthly', // You'll get this from Stripe dashboard
    features: [
      'Unlimited try-ons',
      'High-quality results',
      'Save & organize fits',
      'Priority processing',
      'Export options'
    ]
  }
}
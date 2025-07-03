// import Stripe from "stripe";

// if (!process.env.STRIPE_SECRET_KEY) {
//   throw new Error("STRIPE_SECRET_KEY is not set");
// }

// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: "2024-12-18.acacia",
// });

export const PLANS = {
  starter: {
    name: "Starter",
    price: "8.99",
    credits: 100,
    priceId: "starter-price-id", // replace with your Stripe price ID
    features: [
      "100 try-on images per month",
      "Access to standard models",
      "Email support",
    ],
    description:
      "Perfect for casual users who want to explore virtual try-ons.",
    popular: true,
  },
  pro: {
    name: "Pro",
    price: "18.99",
    credits: 250,
    priceId: "pro-price-id", // replace with your Stripe price ID
    features: [
      "250 try-on images per month",
      "Priority processing",
      "Priority support",
    ],
    description: "Ideal for frequent users and fashion enthusiasts.",
    popular: false,
  },
};

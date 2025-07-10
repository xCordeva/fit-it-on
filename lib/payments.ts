import { Plan, PlanKey } from "@/types/plans";

export const PLANS: Record<PlanKey, Plan> = {
  basic: {
    name: "Basic",
    price: "4.99",
    credits: 50,
    checkoutUrl:
      "https://fititon.lemonsqueezy.com/buy/4ae924a7-c78e-4856-948e-81ee6291c6c8?media=0&discount=0",
    productId: 570814,
    features: [
      "50 try-on images per month",
      "Access to standard models",
      "Email support",
    ],
    description:
      "Perfect for casual users who want to explore virtual try-ons.",
    popular: false,
  },
  starter: {
    name: "Starter",
    price: "8.99",
    credits: 100,
    checkoutUrl:
      "https://fititon.lemonsqueezy.com/buy/e80ddf37-7e09-465e-86c2-73296d9c20d1?media=0&discount=0",
    productId: 570816,
    features: [
      "100 try-on images per month",
      "Access to standard models",
      "Email support",
    ],
    description: "Perfect for casual users exploring more styles.",
    popular: true,
  },
  pro: {
    name: "Pro",
    price: "18.99",
    credits: 250,
    checkoutUrl:
      "https://fititon.lemonsqueezy.com/buy/91ee8a37-fb83-497d-b5ef-9a18fcb1af18?media=0&discount=0",
    productId: 570817,
    features: [
      "250 try-on images per month",
      "Priority processing",
      "Priority support",
    ],
    description: "Ideal for frequent users and fashion enthusiasts.",
    popular: false,
  },
};

import { Plan, PlanKey } from "@/types/plans";

export const PLANS: Record<PlanKey, Plan> = {
  basic: {
    name: "Basic",
    price: "4.99",
    credits: 50,
    checkoutUrl:
      "https://fititon.lemonsqueezy.com/buy/a46c77eb-7dc8-4b80-bba6-1256fdf12540?media=0&discount=0",
    productId: 580092,
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
      "https://fititon.lemonsqueezy.com/buy/50222148-f8b2-475d-bb3b-14cc60cd20ec?media=0&discount=0",
    productId: 580094,
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
      "https://fititon.lemonsqueezy.com/buy/cc164151-6c8a-458f-b473-50995ee5a7c4?media=0&discount=0",
    productId: 580095,
    features: [
      "250 try-on images per month",
      "Priority processing",
      "Priority support",
    ],
    description: "Ideal for frequent users and fashion enthusiasts.",
    popular: false,
  },
};

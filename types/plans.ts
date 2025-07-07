export type PlanKey = "basic" | "starter" | "pro";

export type Plan = {
  name: string;
  price: string;
  credits: number;
  checkoutUrl: string;
  productId: number;
  features: string[];
  description: string;
  popular: boolean;
};

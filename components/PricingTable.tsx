"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PLANS } from "@/lib/payments";
import { toast } from "sonner";
import { PiShootingStarThin } from "react-icons/pi";
import { FaRegStar } from "react-icons/fa";
import { LuCrown } from "react-icons/lu";
import { FaCheck } from "react-icons/fa";
import { TOAST_CONFIG } from "@/lib/utils";
import { Plan } from "@/types/plans";

export function PricingTable() {
  const handleGetStarted = async (plan: Plan) => {
    try {
      window.location.href = plan.checkoutUrl;
    } catch (err) {
      toast.error("Failed to start checkout. Please try again.", {
        ...TOAST_CONFIG.error,
      });
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto py-12">
      {Object.entries(PLANS).map(([key, plan]) => (
        <Card
          key={plan.name}
          className={`relative transition ${
            plan.popular
              ? "border-purple-500 shadow-lg scale-105"
              : "border-gray-200"
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
            </div>
          )}

          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              {plan.name === "Starter" ? (
                <PiShootingStarThin className="h-5 w-5 text-purple-600" />
              ) : plan.name === "Pro" ? (
                <LuCrown className="h-5 w-5 text-yellow-500" />
              ) : (
                <FaRegStar className="h-5 w-5 text-purple-600" />
              )}
              {plan.name}
            </CardTitle>
            <div className="text-3xl font-bold">
              ${plan.price}
              <span className="text-lg font-normal text-gray-600">/month</span>
            </div>
            <p className="text-gray-600">{plan.description}</p>
          </CardHeader>

          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <FaCheck className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => handleGetStarted(plan)}
              className={plan.popular ? "w-full bg-primary" : "w-full"}
              variant={plan.popular ? "default" : "outline"}
            >
              Get {plan.name} Plan
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

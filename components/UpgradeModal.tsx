"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PLANS } from "@/lib/payments";
import { toast } from "sonner";
import { LuLoaderCircle } from "react-icons/lu";
import { LuCrown } from "react-icons/lu";
import { FaCheck } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { TOAST_CONFIG } from "@/lib/utils";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpgradeModal({ open, onOpenChange }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<
    (typeof PLANS)[keyof typeof PLANS]
  >(PLANS.starter);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      window.location.href = selectedPlan.checkoutUrl;
    } catch (err) {
      toast.error("Failed to start checkout. Please try again.", {...TOAST_CONFIG.error});
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col rounded-lg">
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle className="flex items-center gap-2">
            <LuCrown className="h-5 w-5 text-yellow-500" />
            Upgrade Your Plan
          </DialogTitle>
          <DialogDescription>
            Choose the plan that fits your needs and continue exploring your
            style.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(PLANS).map(([key, plan]) => (
            <div
              key={key}
              onClick={() => setSelectedPlan(plan)}
              className={`border rounded-lg cursor-pointer p-4 transition hover:border-primary ${
                selectedPlan.name.toLocaleLowerCase() === key
                  ? "ring-2 ring-primary border-primary"
                  : "border-gray-300"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                {key === "pro" && (
                  <span className="inline-flex items-center gap-1 text-xs bg-[#facc15] px-2 py-0.5 rounded-full">
                    <FaRegStar className="h-3 w-3" />
                    Best Value
                  </span>
                )}
              </div>
              <div className="text-3xl font-bold mb-1">${plan.price}</div>
              <div className="text-sm text-gray-600 mb-4">per month</div>
              <div className="text-sm mb-4">
                Includes{" "}
                <span className="font-bold">{plan.credits} images</span> monthly
              </div>
              <div className="space-y-2">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FaCheck className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 mt-6">
          <Button
            onClick={handleUpgrade}
            className="w-full bg-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <LuLoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Preparing checkout...
              </>
            ) : (
              <>
                <LuCrown className="mr-2 h-4 w-4" />
                Upgrade to {selectedPlan.name}
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full "
          >
            Maybe Later
          </Button>
        </div>

        <div className="text-center text-xs text-gray-500">
          Payments securely handled via Stripe.
        </div>
      </DialogContent>
    </Dialog>
  );
}

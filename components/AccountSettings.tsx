"use client";

import { redirect } from "next/navigation";
import { PLANS } from "@/lib/payments";
import Link from "next/link";
import { AccountSettingsProps } from "@/types/user";
import { DeleteAccountModal } from "./DeleteAccountModal";
import { useState } from "react";
import { toast } from "sonner";
import { TOAST_CONFIG } from "@/lib/utils";
import { useAuth } from "@/app/Provider";
import { useModalStore } from "@/stores/useModalStore";
import { UpgradeModal } from "./UpgradeModal";
import { useTrialsStore } from "@/stores/useTrialsStore";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function AccountSettings({
  session,
  user,
  userData,
}: AccountSettingsProps) {
  if (!session) {
    redirect("/login");
  }
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const plan = Object.values(PLANS).find(
    (p) => p.name.toLowerCase() === userData?.plan?.toLowerCase()
  );
  const { showUpgradeModal, setShowUpgradeModal } = useModalStore();
  const { setAnonTrials } = useTrialsStore();
  const { signOut, setUserData } = useAuth();
  const handleDeleteAccount = async () => {
    const res = await fetch("/api/account/delete", { method: "POST" });
    await signOut();
    setUserData(null);
    setAnonTrials(0);
    if (res.ok) {
      toast.success("Your account has been deleted successfully.", {
        ...TOAST_CONFIG.success,
      });
      window.location.href = "/";
    } else {
      const data = await res.json();
      alert(data.error || "Something went wrong.");
    }
  };

  return (
    <div className="flex flex-col max-w-2xl mx-auto py-12 px-4">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-700 hover:text-black"
        >
          <FaArrowLeft className="w-5 h-5 cursor-pointer" />
        </button>
        <h1 className="text-2xl font-bold ml-2">Your Account</h1>
      </div>

      <div className="border rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-lg mb-2">User Info</h2>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        {user?.user_metadata?.name && (
          <p>
            <strong>Name:</strong> {user.user_metadata.name}
          </p>
        )}
      </div>

      <div className="border rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-lg mb-2">Subscription</h2>

        {plan ? (
          <>
            <p>
              <strong>Plan:</strong> {plan.name}
            </p>
            <p>
              <strong>Status:</strong> {userData?.subscription_status}
            </p>
            <p>
              <strong>Credits:</strong> {userData?.trial_count}
            </p>
            {userData?.subscription_renews_at && (
              <p>
                <strong>Renews At:</strong>{" "}
                {new Date(userData.subscription_renews_at).toLocaleDateString()}
              </p>
            )}
            <div className="mt-4 flex gap-3">
              <Link
                href="https://fititon.lemonsqueezy.com/billing"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
              >
                Manage Billing
              </Link>
              <Link
                href="https://fititon.lemonsqueezy.com/billing"
                className="text-sm text-gray-500 underline"
              >
                Cancel Subscription
              </Link>
            </div>
          </>
        ) : (
          <>
            <p>You are on the free plan.</p>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="inline-block mt-2 font-bold text-gray-700 underline cursor-pointer"
            >
              Upgrade your plan
            </button>
          </>
        )}
      </div>

      <button
        onClick={() => setDeleteOpen(true)}
        className="text-red-500 underline text-sm mt-4 cursor-pointer self-center"
      >
        Delete My Account
      </button>
      <DeleteAccountModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteAccount}
        plan={userData?.plan}
      />
      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
      />
    </div>
  );
}

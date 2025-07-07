import { PLANS } from "@/lib/payments";
import { supabaseServer } from "@/lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";
// import crypto from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const eventName = body?.meta?.event_name;

  try {
    switch (eventName) {
      case "subscription_created":
        const subscriptionId = body.data.id;
        const userEmail = body.data.attributes.user_email;
        const productId = body.data.attributes.product_id;
        const status = body.data.attributes.status;
        const renewsAt = body.data.attributes.renews_at;
        const createdAt = body.data.attributes.created_at;

        const plan = Object.values(PLANS).find(
          (p) => p.productId === productId
        );

        if (!plan) {
          console.error("Unknown plan variant:", productId);
          throw new Error("Unknown plan");
        }

        // Look up the user by email
        const { data: user, error } = await supabaseServer
          .from("users")
          .select("*")
          .eq("email", userEmail)
          .single();

        if (error || !user) {
          console.error("User not found:", userEmail);
          throw new Error("User not found");
        }

        // Update the user subscription
        const { error: updateError } = await supabaseServer
          .from("users")
          .update({
            subscription_id: subscriptionId,
            subscription_status: status,
            plan: plan.name,
            trial_count: plan.credits,
            subscription_renews_at: renewsAt,
            subscription_created_at: createdAt,
          })
          .eq("email", userEmail);

        if (updateError) {
          console.error("Failed to update user subscription:", updateError);
          throw new Error("Failed to update user");
        }

        console.log(`Updated user ${userEmail} to plan ${plan.name}`);
        break;

      case "subscription_updated":
        // Handle upgrades/downgrades/cancellations
        // You can also track status changes here
        break;

      case "subscription_cancelled": {
        const subscriptionId = body.data.id;
        const userEmail = body.data.attributes.user_email;

        const { data: user, error } = await supabaseServer
          .from("users")
          .select("*")
          .eq("email", userEmail)
          .single();

        if (error || !user) {
          console.error("User not found:", userEmail);
          throw new Error("User not found");
        }

        const { error: updateError } = await supabaseServer
          .from("users")
          .update({
            subscription_status: "cancelled",
          })
          .eq("id", user.id);

        if (updateError) {
          console.error("Failed to cancel user subscription:", updateError);
          throw new Error("Failed to update user");
        }

        console.log(`Marked subscription as cancelled for ${userEmail}`);
        break;
      }

      default:
        console.log("Unhandled event:", eventName);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}

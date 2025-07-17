import { PLANS } from "@/lib/payments";
import { supabaseServer } from "@/lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const eventName = body?.meta?.event_name;

  try {
    const subscriptionId = body.data.id;
    const userEmail = body.data.attributes.user_email;
    const productId = body.data.attributes.product_id;
    const status = body.data.attributes.status;
    const renewsAt = body.data.attributes.renews_at;
    const createdAt = body.data.attributes.created_at;

    const plan = Object.values(PLANS).find((p) => p.productId === productId);

    const { data: user, error: userError } = await supabaseServer
      .from("users")
      .select("*")
      .eq("email", userEmail)
      .single();

    if (userError || !user) {
      console.error("User not found:", userEmail);
      throw new Error("User not found");
    }

    switch (eventName) {
      case "subscription_created": {
        if (!plan) {
          console.error("Unknown plan variant:", productId);
          throw new Error("Unknown plan");
        }

        const { error: updateError } = await supabaseServer
          .from("users")
          .update({
            subscription_id: subscriptionId,
            subscription_status: status,
            plan: plan.name,
            trial_count: plan.credits,
            subscription_renews_at: renewsAt,
            subscription_created_at: createdAt,
            upgraded_from_anonymous: true,
          })
          .eq("email", userEmail);

        if (updateError) {
          console.error("Failed to update user subscription:", updateError);
          throw new Error("Failed to update user");
        }

        break;
      }

      case "subscription_updated": {
        const plan = Object.values(PLANS).find(
          (p) => p.productId === productId
        );

        const { error: updateError } = await supabaseServer
          .from("users")
          .update({
            subscription_status: status,
            plan: plan?.name ?? user.plan,
            subscription_renews_at: renewsAt,
          })
          .eq("id", user.id);

        if (updateError) {
          console.error("Failed to update subscription:", updateError);
          throw new Error("Failed to update user");
        }

        break;
      }

      case "subscription_cancelled": {
        const { error: updateError } = await supabaseServer
          .from("users")
          .update({
            subscription_status: "cancelled",
          })
          .eq("id", user.id);

        if (updateError) {
          console.error("Failed to cancel subscription:", updateError);
          throw new Error("Failed to update user");
        }

        break;
      }

      case "subscription_resumed": {
        const { error: updateError } = await supabaseServer
          .from("users")
          .update({
            subscription_status: "active",
            subscription_renews_at: renewsAt,
          })
          .eq("id", user.id);

        if (updateError) {
          console.error("Failed to resume subscription:", updateError);
          throw new Error("Failed to update user");
        }

        break;
      }

      case "subscription_expired": {
        const { error: updateError } = await supabaseServer
          .from("users")
          .update({
            subscription_status: "expired",
            plan: "Free",
          })
          .eq("id", user.id);

        if (updateError) {
          console.error("Failed to expire subscription:", updateError);
          throw new Error("Failed to update user");
        }

        break;
      }

      case "subscription_paused": {
        const { error: updateError } = await supabaseServer
          .from("users")
          .update({
            subscription_status: "paused",
          })
          .eq("id", user.id);

        if (updateError) {
          console.error("Failed to pause subscription:", updateError);
          throw new Error("Failed to update user");
        }

        break;
      }

      default:
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}

import { supabaseServer } from "@/lib/supabaseServer";

async function downgradeExpired() {
  const { data: users, error } = await supabaseServer
    .from("users")
    .select("*")
    .eq("subscription_status", "cancelled")
    .lt("subscription_renews_at", new Date().toISOString());

  if (error) {
    return;
  }

  if (!users || users.length === 0) {
    return;
  }


  for (const user of users) {
    const { error: updateError } = await supabaseServer
      .from("users")
      .update({
        subscription_status: "free",
        subscription_plan: "free",
      })
      .eq("id", user.id);

    if (updateError) {
      console.error(`Error updating user ${user.email}:`, updateError);
    } else {
      console.log(`Downgraded user ${user.email}.`);
    }
  }
}

downgradeExpired();

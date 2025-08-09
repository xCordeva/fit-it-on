import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Create a Supabase server client with the user's session cookies
    const supabase = createRouteHandlerClient({ cookies });

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
    }

    // Fetch current trial count
    const { data: currentData, error: fetchError } = await supabase
      .from("users")
      .select("trial_count")
      .eq("id", user.id)
      .single();

    if (fetchError || !currentData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Decrement but not below 0
    const updatedCount = Math.max(currentData.trial_count - 1, 0);

    const { data: updatedData, error: updateError } = await supabase
      .from("users")
      .update({ trial_count: updatedCount })
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        trial_count: updatedData.trial_count,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

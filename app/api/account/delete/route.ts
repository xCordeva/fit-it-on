import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = cookies();

  // This client reads the current session cookie
  const { createServerComponentClient } = await import(
    "@supabase/auth-helpers-nextjs"
  );
  const supabaseForSession = createServerComponentClient({
    cookies: () => cookieStore as any,
  });

  // Get the session to know who is requesting deletion
  const {
    data: { session },
  } = await supabaseForSession.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;

  // Optional: update user metadata first
  await supabaseForSession
    .from("users")
    .update({ account_deleted: true })
    .eq("id", userId);

  // Create the service role client
  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Delete the user using the admin API
  const { error } = await serviceClient.auth.admin.deleteUser(userId);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({
    cookies: () => cookieStore as any,
  });

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (!session || sessionError) {
    return NextResponse.json(
      { user: null, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (userError) {
    return NextResponse.json(
      { user: null, error: userError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    session,
    user: session.user,
    userData,
  });
}

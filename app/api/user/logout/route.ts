import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  // Clear the auth cookies manually
  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.set("sb-yjppiijxuetpkotghblq-auth-token", "", {
    path: "/",
    maxAge: 0,
  });
  response.cookies.set("sb-yjppiijxuetpkotghblq-refresh-token", "", {
    path: "/",
    maxAge: 0,
  });

  return response;
}

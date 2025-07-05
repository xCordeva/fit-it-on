import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function getUserData() {
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user ?? null;

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", session?.user.id)
    .single();

  return {
    session,
    user,
    userData,
  };
}

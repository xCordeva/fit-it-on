import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/database";

export const supabase = createPagesBrowserClient<Database>();

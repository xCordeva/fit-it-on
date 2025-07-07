import { Session, User } from "@supabase/supabase-js";

interface UserData {
  id: string;
  email: string;
  plan: string;
  trial_count: number;
  subscription_id: string | null;
  subscription_status: string | null;
  subscription_renews_at: string | null;
}

export type AccountSettingsProps = {
  session: Session | null;
  user: User | null;
  userData: UserData | null;
};

import { getUserData } from "@/lib/getUserData";
import { redirect } from "next/navigation";
import AccountSettings from "@/components/AccountSettings";

export default async function AccountPage() {
  const { session, user, userData } = await getUserData();

  if (!session) {
    redirect("/login");
  }

  return <AccountSettings session={session} user={user} userData={userData} />;
}

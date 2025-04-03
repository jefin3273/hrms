import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DashboardHeader from "@/components/claim/header";
import ClaimsDashboard from "@/components/claim/claim-dashboard";

export default async function ClaimPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Fetch claims data
  const { data: claims } = await supabase
    .from("claims")
    .select("*")
    .eq("user_id", user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} title="CLAIM SOFTWARE" />
      <main className="p-4">
        <ClaimsDashboard claims={claims || []} userId={user.id} />
      </main>
    </div>
  );
}

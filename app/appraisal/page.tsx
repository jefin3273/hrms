import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DashboardHeader from "@/components/dashboard/header";
import AppraisalDashboard from "@/components/appraisal/appraisal-dashboard";

export default async function AppraisalPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Fetch appraisal data
  const { data: appraisals } = await supabase
    .from("appraisals")
    .select("*")
    .eq("user_id", user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} title="APPRAISAL SOFTWARE" />
      <main className="p-4">
        <AppraisalDashboard appraisals={appraisals || []} userId={user.id} />
      </main>
    </div>
  );
}

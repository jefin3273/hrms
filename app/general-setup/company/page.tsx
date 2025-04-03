import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DashboardHeader from "@/components/attendance/header";
import CompanyMaster from "@/components/company/company-master";

export default async function CompanyPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Fetch companies data
  const { data: companies } = await supabase
    .from("companies")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} title="ATTENDANCE SOFTWARE" />
      <main className="p-4">
        <CompanyMaster companies={companies || []} />
      </main>
    </div>
  );
}

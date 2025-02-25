import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DashboardHeader from "@/components/dashboard/header";
import OrganizationTabs from "@/components/organization/organization-tabs";

export default async function OrganizationHierarchyPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Fetch initial data for all sections
  const { data: departments } = await supabase.from("departments").select("*");
  const { data: designations } = await supabase
    .from("designations")
    .select("*");
  const { data: sections } = await supabase
    .from("sections")
    .select("*, departments(*)");
  const { data: categories } = await supabase.from("categories").select("*");
  const { data: extraClassifications } = await supabase
    .from("extra_classifications")
    .select("*");

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} title="ATTENDANCE SOFTWARE" />
      <main className="p-4">
        <OrganizationTabs
          initialData={{
            departments: departments || [],
            designations: designations || [],
            sections: sections || [],
            categories: categories || [],
            extraClassifications: extraClassifications || [],
          }}
        />
      </main>
    </div>
  );
}

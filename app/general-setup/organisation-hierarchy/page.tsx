import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DashboardHeader from "@/components/attendance/header";
import OrganizationTabs from "@/components/organization/organization-tabs";
import { prisma } from "@/lib/prisma"; // Make sure you have a prisma client setup

export default async function OrganizationHierarchyPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Fetch initial data using Prisma
  const departments = await prisma.department.findMany();
  const designations = await prisma.designation.findMany();
  const sections = await prisma.section.findMany({
    include: {
      department: true,
    },
  });
  const categories = await prisma.category.findMany();
  const extraClassifications = await prisma.extraClassification.findMany();

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} title="ATTENDANCE SOFTWARE" />
      <main className="p-4">
        <OrganizationTabs
          initialData={{
            departments,
            designations,
            sections,
            categories,
            extraClassifications,
          }}
        />
      </main>
    </div>
  );
}

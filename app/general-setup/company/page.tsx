import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DashboardHeader from "@/components/attendance/header";
import CompanyMaster from "@/components/company/company-master";
import { prisma } from "@/lib/prisma"; // You'll need to create this prisma client file

export default async function CompanyPage() {
  // Still using Supabase for authentication
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Fetch companies using Prisma instead of Supabase
  const companies = await prisma.company.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} title="ATTENDANCE SOFTWARE" />
      <main className="p-4">
        <CompanyMaster initialCompanies={companies || []} />
      </main>
    </div>
  );
}

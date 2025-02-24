import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import DashboardHeader from "@/components/dashboard/header";
import HRDashboard from "@/components/hr/hr-dashboard";

export default async function HRPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Fetch HR data using Prisma
  const meetings = await prisma.meeting.findMany({
    where: {
      userId: user.id,
    },
  });

  const grievances = await prisma.grievance.findMany({
    where: {
      userId: user.id,
    },
  });

  const trainings = await prisma.training.findMany({
    where: {
      userId: user.id,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} title="HR SOFTWARE" />
      <main className="p-4">
        <HRDashboard
          userId={user.id}
          meetings={meetings}
          grievances={grievances}
          trainings={trainings}
        />
      </main>
    </div>
  );
}

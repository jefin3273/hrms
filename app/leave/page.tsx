import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DashboardHeader from "@/components/dashboard/header";
import LeaveManagement from "@/components/leave/leave-management";

export default async function LeavePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} title="LEAVE SOFTWARE" />
      <main className="p-4">
        <LeaveManagement userId={user.id} />
      </main>
    </div>
  );
}

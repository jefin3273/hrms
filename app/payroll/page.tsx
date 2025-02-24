import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DashboardHeader from "@/components/dashboard/header";
import SubscriptionBar from "@/components/dashboard/subscription-bar";
import PayScheduleForm from "@/components/payroll/pay-schedule-form";

export default async function PayrollPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} title="PAYROLL SOFTWARE" />
      <SubscriptionBar subscriptions={[]} />
      <main className="p-4">
        <PayScheduleForm userId={user.id} />
      </main>
    </div>
  );
}

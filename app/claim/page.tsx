import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import DashboardHeader from "@/components/dashboard/header"
import SubscriptionBar from "@/components/dashboard/subscription-bar"
import ClaimsDashboard from "@/components/claims/claims-dashboard"

export default async function ClaimPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  // Fetch claims data
  const { data: claims } = await supabase.from("claims").select("*").eq("user_id", user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} title="CLAIM SOFTWARE" />
      <SubscriptionBar />
      <main className="p-4">
        <ClaimsDashboard claims={claims || []} userId={user.id} />
      </main>
    </div>
  )
}


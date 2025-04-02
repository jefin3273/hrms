import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import LoginForm from "@/components/login-form";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/attendance");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#1e4d8c]">
      <div className="w-full max-w-[400px] mx-auto space-y-6">
        <LoginForm />
      </div>
    </main>
  );
}

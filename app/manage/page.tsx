import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import React from "react";
import DashboardHeader from "@/components/appraisal/header";
import { prisma } from "@/lib/prisma";

export default async function ManageAccountPage() {
  // Authenticate user
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Fetch company data using Prisma
  const company = await prisma.company.findFirst({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} title="MANAGE ACCOUNT" />

      <main className="p-6 max-w-5xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
            Company Details
          </h2>

          {company ? (
            <div className="divide-y divide-gray-200">
              {[
                { label: "Code", value: company.code },
                { label: "Name", value: company.name },
                { label: "City", value: company.city || "N/A" },
                { label: "State", value: company.state || "N/A" },
                { label: "Postal Code", value: company.postalCode || "N/A" },
                { label: "Address", value: company.address || "N/A" },
                { label: "Daily Rate", value: `₹${company.dailyRate}` },
                { label: "Info Updated", value: company.infoUpdated ? "Yes" : "No" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-2 py-4"
                >
                  <div className="font-semibold text-gray-700">{item.label}</div>
                  <div className="text-gray-600">{item.value}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-red-500">No company information found.</p>
          )}
        </div>
      </main>
    </div>
  );
}

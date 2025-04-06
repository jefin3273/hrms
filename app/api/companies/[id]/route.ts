import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const id = params.id;
    const data = await request.json();
    
    // Validate required fields
    if (!data.code || !data.name || !data.address1 || !data.city || !data.postal_code) {
      return NextResponse.json(
        { error: "Required fields missing" },
        { status: 400 }
      );
    }
    
    // Update company in database
    const company = await prisma.company.update({
      where: { id },
      data: {
        code: data.code,
        name: data.name,
        address1: data.address1,
        address2: data.address2 || null,
        state: data.state || null,
        city: data.city,
        postalCode: data.postal_code,
        logoUrl: data.logo_url || null,
        // Convert nested objects to JSON for Prisma
        notifications: JSON.stringify(data.notifications || {}),
        dailyRate: data.daily_rate || 'calendar',
        organizationWorkingDays: data.organization_working_days || null,
        epf: JSON.stringify(data.epf || {}),
        esi: JSON.stringify(data.esi || {}),
        professionalTax: JSON.stringify(data.professional_tax || {}),
        updatedAt: new Date(),
      },
    });
    
    return NextResponse.json(company);
  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json(
      { error: "Failed to update company" },
      { status: 500 }
    );
  }
}
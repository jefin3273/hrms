import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

// GET handler to fetch all extra classifications
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const extraClassifications = await prisma.extraClassification.findMany({
      orderBy: { code: 'asc' },
    });
    
    return NextResponse.json(extraClassifications);
  } catch (error) {
    console.error("Error fetching extra classifications:", error);
    return NextResponse.json(
      { message: "Error fetching extra classifications" },
      { status: 500 }
    );
  }
}

// POST handler to create a new extra classification
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const { code, name } = await request.json();
    
    // Validate input
    if (!code || !name) {
      return NextResponse.json(
        { message: "Code and name are required" },
        { status: 400 }
      );
    }
    
    // Check if code already exists
    const existingClassification = await prisma.extraClassification.findUnique({
      where: { code },
    });
    
    if (existingClassification) {
      return NextResponse.json(
        { message: "Classification code already exists" },
        { status: 409 }
      );
    }
    
    // Create new classification
    const newClassification = await prisma.extraClassification.create({
      data: { code, name },
    });
    
    return NextResponse.json(newClassification, { status: 201 });
  } catch (error) {
    console.error("Error creating extra classification:", error);
    return NextResponse.json(
      { message: "Error creating extra classification" },
      { status: 500 }
    );
  }
}
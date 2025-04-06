import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

// GET handler to fetch all categories
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const categories = await prisma.category.findMany({
      orderBy: { code: 'asc' },
    });
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { message: "Error fetching categories" },
      { status: 500 }
    );
  }
}

// POST handler to create a new category
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
    const existingCategory = await prisma.category.findUnique({
      where: { code },
    });
    
    if (existingCategory) {
      return NextResponse.json(
        { message: "Category code already exists" },
        { status: 409 }
      );
    }
    
    // Create new category
    const newCategory = await prisma.category.create({
      data: { code, name },
    });
    
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { message: "Error creating category" },
      { status: 500 }
    );
  }
}
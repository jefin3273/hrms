import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

// GET a specific category by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const category = await prisma.category.findUnique({
      where: { id: params.id },
    });
    
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { message: "Error fetching category" },
      { status: 500 }
    );
  }
}

// PUT/UPDATE a specific category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Check if the category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: params.id },
    });
    
    if (!categoryExists) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }
    
    // Check if the updated code already exists on another category
    if (code !== categoryExists.code) {
      const codeExists = await prisma.category.findUnique({
        where: { code },
      });
      
      if (codeExists && codeExists.id !== params.id) {
        return NextResponse.json(
          { message: "Category code already exists" },
          { status: 409 }
        );
      }
    }
    
    // Update the category
    const updatedCategory = await prisma.category.update({
      where: { id: params.id },
      data: { code, name },
    });
    
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { message: "Error updating category" },
      { status: 500 }
    );
  }
}

// DELETE a specific category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    // Check if the category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: params.id },
    });
    
    if (!categoryExists) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }
    
    // Delete the category
    await prisma.category.delete({
      where: { id: params.id },
    });
    
    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { message: "Error deleting category" },
      { status: 500 }
    );
  }
}
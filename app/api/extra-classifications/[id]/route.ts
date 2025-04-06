import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

// GET a specific extra classification by ID
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
    
    const classification = await prisma.extraClassification.findUnique({
      where: { id: params.id },
    });
    
    if (!classification) {
      return NextResponse.json(
        { message: "Classification not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(classification);
  } catch (error) {
    console.error("Error fetching extra classification:", error);
    return NextResponse.json(
      { message: "Error fetching extra classification" },
      { status: 500 }
    );
  }
}

// PUT/UPDATE a specific extra classification
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
    
    // Check if the classification exists
    const classificationExists = await prisma.extraClassification.findUnique({
      where: { id: params.id },
    });
    
    if (!classificationExists) {
      return NextResponse.json(
        { message: "Classification not found" },
        { status: 404 }
      );
    }
    
    // Check if the updated code already exists on another classification
    if (code !== classificationExists.code) {
      const codeExists = await prisma.extraClassification.findUnique({
        where: { code },
      });
      
      if (codeExists && codeExists.id !== params.id) {
        return NextResponse.json(
          { message: "Classification code already exists" },
          { status: 409 }
        );
      }
    }
    
    // Update the classification
    const updatedClassification = await prisma.extraClassification.update({
      where: { id: params.id },
      data: { code, name },
    });
    
    return NextResponse.json(updatedClassification);
  } catch (error) {
    console.error("Error updating extra classification:", error);
    return NextResponse.json(
      { message: "Error updating extra classification" },
      { status: 500 }
    );
  }
}

// DELETE a specific extra classification
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
    
    // Check if the classification exists
    const classificationExists = await prisma.extraClassification.findUnique({
      where: { id: params.id },
    });
    
    if (!classificationExists) {
      return NextResponse.json(
        { message: "Classification not found" },
        { status: 404 }
      );
    }
    
    // Delete the classification
    await prisma.extraClassification.delete({
      where: { id: params.id },
    });
    
    return NextResponse.json({ message: "Classification deleted successfully" });
  } catch (error) {
    console.error("Error deleting extra classification:", error);
    return NextResponse.json(
      { message: "Error deleting extra classification" },
      { status: 500 }
    );
  }
}
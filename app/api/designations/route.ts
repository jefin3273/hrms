import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { code, name } = await req.json();
    
    const designation = await prisma.designation.create({
      data: { code, name }
    });

    return NextResponse.json(designation);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, code, name } = await req.json();
    
    const designation = await prisma.designation.update({
      where: { id },
      data: { code, name }
    });

    return NextResponse.json(designation);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: "Designation ID is required" }, { status: 400 });
    }
    
    const designation = await prisma.designation.delete({
      where: { id }
    });

    return NextResponse.json(designation);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
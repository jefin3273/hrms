// app/api/sections/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all sections
export async function GET() {
  try {
    const sections = await prisma.section.findMany({
      include: {
        department: true,
      },
    });
    return NextResponse.json(sections);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
  }
}

// POST new section
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, name, departmentId } = body;
    
    const section = await prisma.section.create({
      data: {
        code,
        name,
        departmentId,
      },
      include: {
        department: true,
      },
    });
    
    return NextResponse.json(section);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


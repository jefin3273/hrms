import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const grievances = await prisma.grievance.findMany()
    return NextResponse.json(grievances)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch grievances" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const grievance = await prisma.grievance.create({
      data,
    })
    return NextResponse.json(grievance)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create grievance" }, { status: 500 })
  }
}


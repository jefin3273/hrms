import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const meetings = await prisma.meeting.findMany()
    return NextResponse.json(meetings)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch meetings" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const meeting = await prisma.meeting.create({
      data,
    })
    return NextResponse.json(meeting)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create meeting" }, { status: 500 })
  }
}


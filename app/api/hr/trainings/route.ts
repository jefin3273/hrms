import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const trainings = await prisma.training.findMany()
    return NextResponse.json(trainings)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch trainings" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const training = await prisma.training.create({
      data,
    })
    return NextResponse.json(training)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create training" }, { status: 500 })
  }
}


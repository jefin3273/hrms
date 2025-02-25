import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Start date and end date are required" },
        { status: 400 }
      );
    }

    // Fetch leave requests for the specified date range
    const leaveRequests = await prisma.leaveRequest.findMany({
      where: {
        OR: [
          {
            // Leave starts in the range
            startDate: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          },
          {
            // Leave ends in the range
            endDate: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          },
          {
            // Leave spans the range
            AND: [
              { startDate: { lte: new Date(startDate) } },
              { endDate: { gte: new Date(endDate) } },
            ],
          },
        ],
      },
      include: {
        leaveType: {
          select: {
            name: true,
          },
        },
        User: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    });

    return NextResponse.json(leaveRequests);
  } catch (error) {
    console.error("Error fetching monthly leaves:", error);
    return NextResponse.json(
      { error: "Failed to fetch monthly leaves" },
      { status: 500 }
    );
  }
}
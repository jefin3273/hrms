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

    // Get all leave types
    const leaveTypes = await prisma.leaveType.findMany();

    // For each leave type, count the number of employees on leave in the period
    const leaveTypeData = await Promise.all(
      leaveTypes.map(async (leaveType) => {
        const leaveRequests = await prisma.leaveRequest.findMany({
          where: {
            leaveTypeId: leaveType.id,
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
          distinct: ["userId"],
        });

        const count = leaveRequests.length;

        return {
          name: leaveType.name,
          count,
        };
      })
    );

    // Sort by count in descending order
    leaveTypeData.sort((a, b) => b.count - a.count);

    return NextResponse.json(leaveTypeData);
  } catch (error) {
    console.error("Error fetching leave type data:", error);
    return NextResponse.json(
      { error: "Failed to fetch leave type data" },
      { status: 500 }
    );
  }
}
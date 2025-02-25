import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const department = searchParams.get("department");

    // Build the query
    const query: any = {
      where: {
        status: "pending",
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
    };

    // Add department filter if not "all"
    if (department && department !== "all") {
      query.where.department = department;
    }

    // Fetch pending leave requests
    const pendingLeaves = await prisma.leaveRequest.findMany(query);

    return NextResponse.json(pendingLeaves);
  } catch (error) {
    console.error("Error fetching pending leaves:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending leaves" },
      { status: 500 }
    );
  }
}
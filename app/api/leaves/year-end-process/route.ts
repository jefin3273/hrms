import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get current year
    const currentYear = new Date().getFullYear();

    // Fetch leave balances for the current year
    const leaveBalances = await prisma.leaveBalance.findMany({
      where: {
        year: currentYear,
      },
      include: {
        leaveType: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        totalDays: "desc",
      },
    });

    return NextResponse.json(leaveBalances);
  } catch (error) {
    console.error("Error fetching year end process:", error);
    return NextResponse.json(
      { error: "Failed to fetch year end process" },
      { status: 500 }
    );
  }
}
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { leaveId, status } = body;

    if (!leaveId || !status) {
      return NextResponse.json(
        { error: "Leave ID and status are required" },
        { status: 400 }
      );
    }

    // Validate status
    if (status !== "approved" && status !== "rejected") {
      return NextResponse.json(
        { error: "Status must be 'approved' or 'rejected'" },
        { status: 400 }
      );
    }

    // Find the leave request
    const existingLeave = await prisma.leaveRequest.findUnique({
      where: { id: leaveId },
      include: {
        User: {
          select: {
            id: true,
          },
        },
        leaveType: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!existingLeave) {
      return NextResponse.json(
        { error: "Leave request not found" },
        { status: 404 }
      );
    }

    // Update the leave request status
    const updatedLeave = await prisma.leaveRequest.update({
      where: { id: leaveId },
      data: { status },
    });

    // If the leave was approved, update the leave balance
    if (status === "approved") {
      // Calculate the number of days
      const startDate = new Date(existingLeave.startDate);
      const endDate = new Date(existingLeave.endDate);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end date

      // Get the current year
      const currentYear = new Date().getFullYear();

      // Update the leave balance
      await prisma.leaveBalance.updateMany({
        where: {
          userId: existingLeave.userId,
          leaveTypeId: existingLeave.leaveTypeId,
          year: currentYear,
        },
        data: {
          usedDays: {
            increment: diffDays,
          },
        },
      });
    }

    return NextResponse.json(updatedLeave);
  } catch (error) {
    console.error("Error updating leave status:", error);
    return NextResponse.json(
      { error: "Failed to update leave status" },
      { status: 500 }
    );
  }
}
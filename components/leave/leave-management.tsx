"use client";

import { useState, useEffect } from "react";
import { Download, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NoDataPlaceholder from "@/components/dashboard/no-data-placeholder";
import { format, startOfMonth, endOfMonth, parseISO } from "date-fns";

// Types based on your Prisma schema
type LeaveRequest = {
  id: string;
  userId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  status: string;
  reason: string | null;
  department: string | null;
  createdAt: string;
  leaveType: {
    name: string;
  };
  User: {
    name: string;
  };
};

type LeaveBalance = {
  id: string;
  userId: string;
  leaveTypeId: string;
  year: number;
  totalDays: number;
  usedDays: number;
  leaveType: {
    name: string;
  };
};

type LeaveTypeData = {
  name: string;
  count: number;
};

export default function LeaveManagement({ userId }: { userId: string }) {
  const [selectedMonth, setSelectedMonth] = useState<string>("2025-02");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [monthlyLeaves, setMonthlyLeaves] = useState<LeaveRequest[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
  const [pendingYearEndProcess, setPendingYearEndProcess] = useState<
    LeaveBalance[]
  >([]);
  const [leaveTypeData, setLeaveTypeData] = useState<LeaveTypeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {}
  );

  // Parse the selected month
  const getDateRange = () => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const start = startOfMonth(new Date(year, month - 1));
    const end = endOfMonth(new Date(year, month - 1));
    return { start, end };
  };

  // Format the display month
  const displayMonth = () => {
    const [year, month] = selectedMonth.split("-").map(Number);
    return format(new Date(year, month - 1), "MMMM, yyyy");
  };

  // Fetch monthly leaves
  const fetchMonthlyLeaves = async () => {
    try {
      const { start, end } = getDateRange();
      const startDate = format(start, "yyyy-MM-dd");
      const endDate = format(end, "yyyy-MM-dd");

      const response = await fetch(
        `/api/leaves/monthly?startDate=${startDate}&endDate=${endDate}`
      );
      const data = await response.json();
      setMonthlyLeaves(data);
    } catch (error) {
      console.error("Error fetching monthly leaves:", error);
    }
  };

  // Fetch pending leaves
  const fetchPendingLeaves = async () => {
    try {
      const response = await fetch(
        `/api/leaves/pending?department=${selectedDepartment}`
      );
      const data = await response.json();
      setPendingLeaves(data);
    } catch (error) {
      console.error("Error fetching pending leaves:", error);
    }
  };

  // Fetch pending year end process
  const fetchPendingYearEndProcess = async () => {
    try {
      const response = await fetch(`/api/leaves/year-end-process`);
      const data = await response.json();
      setPendingYearEndProcess(data);
    } catch (error) {
      console.error("Error fetching year end process:", error);
    }
  };

  // Fetch leave type data
  const fetchLeaveTypeData = async () => {
    try {
      const { start, end } = getDateRange();
      const startDate = format(start, "yyyy-MM-dd");
      const endDate = format(end, "yyyy-MM-dd");

      const response = await fetch(
        `/api/leaves/by-type?startDate=${startDate}&endDate=${endDate}`
      );
      const data = await response.json();
      setLeaveTypeData(data);
    } catch (error) {
      console.error("Error fetching leave type data:", error);
    }
  };

  // Handle month change
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMonth(e.target.value);
  };

  // Handle department change
  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const newDate = new Date(year, month - 2);
    setSelectedMonth(format(newDate, "yyyy-MM"));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const newDate = new Date(year, month);
    setSelectedMonth(format(newDate, "yyyy-MM"));
  };

  // Refresh data
  const refreshData = () => {
    setLoading(true);
    Promise.all([
      fetchMonthlyLeaves(),
      fetchPendingLeaves(),
      fetchPendingYearEndProcess(),
      fetchLeaveTypeData(),
    ]).finally(() => {
      setLoading(false);
    });
  };

  // Update leave status (approve/reject)
  const updateLeaveStatus = async (
    leaveId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      setActionLoading((prev) => ({ ...prev, [leaveId]: true }));

      const response = await fetch(`/api/leaves/update-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ leaveId, status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update leave status");
      }

      // Refresh data after updating
      fetchPendingLeaves();
      fetchMonthlyLeaves();
    } catch (error) {
      console.error("Error updating leave status:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, [leaveId]: false }));
    }
  };

  // Download data as CSV
  const downloadAsCSV = (data: any[], filename: string) => {
    if (!data.length) return;

    // Get headers from the first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    const csvRows = [
      headers.join(","), // Header row
      ...data.map((row) =>
        headers
          .map((header) => {
            let value = row[header];
            // Format dates
            if (
              header === "startDate" ||
              header === "endDate" ||
              header === "createdAt"
            ) {
              if (value) value = format(new Date(value), "yyyy-MM-dd");
            }
            // Format nested objects
            if (typeof value === "object" && value !== null) {
              value = JSON.stringify(value).replace(/"/g, '""');
            }
            // Escape commas and quotes
            if (typeof value === "string") {
              value = value.replace(/"/g, '""');
              if (
                value.includes(",") ||
                value.includes('"') ||
                value.includes("\n")
              ) {
                value = `"${value}"`;
              }
            }
            return value === null || value === undefined ? "" : value;
          })
          .join(",")
      ),
    ].join("\n");

    // Create a blob and download
    const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${filename}_${format(new Date(), "yyyyMMdd")}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Effect for initial data loading
  useEffect(() => {
    refreshData();
  }, []);

  // Effect for when month changes
  useEffect(() => {
    fetchMonthlyLeaves();
    fetchLeaveTypeData();
  }, [selectedMonth]);

  // Effect for when department changes
  useEffect(() => {
    fetchPendingLeaves();
  }, [selectedDepartment]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <input
                type="month"
                value={selectedMonth}
                onChange={handleMonthChange}
                className="rounded-md border px-3 py-2"
              />
              <CardTitle>
                Leaves for the Month - {format(new Date(selectedMonth), "MMMM")}
              </CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => downloadAsCSV(monthlyLeaves, "monthly_leaves")}
                disabled={monthlyLeaves.length === 0}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={refreshData}
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">Loading...</div>
            ) : monthlyLeaves.length === 0 ? (
              <NoDataPlaceholder />
            ) : (
              <div className="space-y-4">
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left font-medium">
                          Employee
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Leave Type
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          From
                        </th>
                        <th className="py-3 px-4 text-left font-medium">To</th>
                        <th className="py-3 px-4 text-left font-medium">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyLeaves.map((leave) => (
                        <tr key={leave.id} className="border-b">
                          <td className="py-3 px-4">{leave.User.name}</td>
                          <td className="py-3 px-4">{leave.leaveType.name}</td>
                          <td className="py-3 px-4">
                            {format(parseISO(leave.startDate), "MMM dd, yyyy")}
                          </td>
                          <td className="py-3 px-4">
                            {format(parseISO(leave.endDate), "MMM dd, yyyy")}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                leave.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : leave.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : leave.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {leave.status.charAt(0).toUpperCase() +
                                leave.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pending Leave Year End Process</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    downloadAsCSV(pendingYearEndProcess, "year_end_process")
                  }
                  disabled={pendingYearEndProcess.length === 0}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={refreshData}
                  disabled={loading}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">Loading...</div>
              ) : pendingYearEndProcess.length === 0 ? (
                <NoDataPlaceholder />
              ) : (
                <div className="space-y-4">
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left font-medium">
                            Leave Type
                          </th>
                          <th className="py-3 px-4 text-left font-medium">
                            Total Days
                          </th>
                          <th className="py-3 px-4 text-left font-medium">
                            Used Days
                          </th>
                          <th className="py-3 px-4 text-left font-medium">
                            Remaining
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingYearEndProcess.map((balance) => (
                          <tr key={balance.id} className="border-b">
                            <td className="py-3 px-4">
                              {balance.leaveType.name}
                            </td>
                            <td className="py-3 px-4">{balance.totalDays}</td>
                            <td className="py-3 px-4">{balance.usedDays}</td>
                            <td className="py-3 px-4">
                              {balance.totalDays - balance.usedDays}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Employees by Leave Type</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    downloadAsCSV(leaveTypeData, "leave_type_stats")
                  }
                  disabled={leaveTypeData.length === 0}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={refreshData}
                  disabled={loading}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPreviousMonth}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium">
                  {format(new Date(selectedMonth), "MMMM yyyy")}
                </span>
                <Button variant="outline" size="icon" onClick={goToNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              {loading ? (
                <div className="flex justify-center py-8">Loading...</div>
              ) : leaveTypeData.length === 0 ? (
                <NoDataPlaceholder />
              ) : (
                <div className="space-y-4">
                  {leaveTypeData.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span>{item.name}</span>
                      <span className="font-medium">
                        {item.count} employees
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle>Leaves Pending Approval</CardTitle>
            <p
              className={
                pendingLeaves.length > 0 ? "text-red-500" : "text-green-500"
              }
            >
              {pendingLeaves.length} Pending Approvals
            </p>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedDepartment}
              onValueChange={handleDepartmentChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="it">IT</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
            <div className="mt-4">
              {loading ? (
                <div className="flex justify-center py-8">Loading...</div>
              ) : pendingLeaves.length === 0 ? (
                <NoDataPlaceholder />
              ) : (
                <div className="space-y-3">
                  {pendingLeaves.map((leave) => (
                    <div
                      key={leave.id}
                      className="rounded-md border bg-white p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium">{leave.User.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {leave.department}
                        </span>
                      </div>
                      <div className="mb-2 text-sm">
                        <span className="font-medium">
                          {leave.leaveType.name}
                        </span>{" "}
                        •
                        <span className="ml-2">
                          {format(parseISO(leave.startDate), "MMM dd")} -{" "}
                          {format(parseISO(leave.endDate), "MMM dd, yyyy")}
                        </span>
                      </div>
                      {leave.reason && (
                        <div className="mb-3 text-sm text-muted-foreground">
                          Reason: {leave.reason}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                          onClick={() =>
                            updateLeaveStatus(leave.id, "approved")
                          }
                          disabled={actionLoading[leave.id]}
                        >
                          {actionLoading[leave.id]
                            ? "Processing..."
                            : "Approve"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
                          onClick={() =>
                            updateLeaveStatus(leave.id, "rejected")
                          }
                          disabled={actionLoading[leave.id]}
                        >
                          {actionLoading[leave.id] ? "Processing..." : "Reject"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

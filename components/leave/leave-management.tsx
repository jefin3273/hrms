"use client";

import { useState } from "react";
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

export default function LeaveManagement({ userId }: { userId: string }) {
  const [selectedMonth, setSelectedMonth] = useState<string>("February, 2025");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <input
                type="month"
                value="2025-02"
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="rounded-md border px-3 py-2"
              />
              <CardTitle>Leaves for the Month - February</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <NoDataPlaceholder />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pending Leave Year End Process</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <NoDataPlaceholder />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Employees by Leave Type</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex items-center justify-between">
                <Button variant="outline" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium">February 2025</span>
                <Button variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <NoDataPlaceholder />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle>Leaves Pending Approval</CardTitle>
            <p className="text-red-500">0 Pending Approvals</p>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
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
              <NoDataPlaceholder />
            </div>
          </CardContent>
        </Card>
      </div>

      <Button className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600">
        Submit Ticket
      </Button>
    </div>
  );
}

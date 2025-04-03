"use client";

import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ClaimsSummaryTable from "./claim-summary-table";
import ClaimStatusCircles from "./claim-status-circles";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ClaimsDashboard({
  claims,
  userId,
}: {
  claims: any[];
  userId: string;
}) {
  const [selectedMonth, setSelectedMonth] = useState("February");

  const chartData = {
    labels: ["Group 1", "Group 2", "Group 3"],
    datasets: [
      {
        label: "Claim Amount",
        data: [0, 0, 0],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Claims for the Month - February",
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Last 12 Months Claim Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ClaimsSummaryTable claims={claims} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Claim Status</CardTitle>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="February">February</SelectItem>
                <SelectItem value="January">January</SelectItem>
                <SelectItem value="December">December</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <ClaimStatusCircles claims={claims} month={selectedMonth} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Claims by Group</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <Bar options={chartOptions} data={chartData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

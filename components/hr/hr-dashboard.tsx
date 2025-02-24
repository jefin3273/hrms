"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Doughnut, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend)

export default function HRDashboard({
  userId,
  meetings,
  grievances,
  trainings,
}: {
  userId: string
  meetings: any[]
  grievances: any[]
  trainings: any[]
}) {
  const [date, setDate] = useState<Date>(new Date())

  // Donut chart data for grievances
  const grievanceData = {
    labels: ["No Data"],
    datasets: [
      {
        data: [100],
        backgroundColor: ["#ff4e8a"],
        borderWidth: 0,
      },
    ],
  }

  // Line chart data for training certificates
  const trainingData = {
    labels: Array.from({ length: 31 }, (_, i) => i + 1),
    datasets: [
      {
        label: "Certificate Expiry",
        data: Array(31).fill(0),
        borderColor: "#1e4d8c",
        tension: 0.1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Meeting & Training Calendar</CardTitle>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const prev = new Date(date)
                    prev.setMonth(prev.getMonth() - 1)
                    setDate(prev)
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span>FEBRUARY - 2025</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const next = new Date(date)
                    next.setMonth(next.getMonth() + 1)
                    setDate(next)
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              className="rounded-md border"
              disabled={(date) => date < new Date()}
              modifiers={{
                meeting: meetings.map((m) => new Date(m.date)),
                training: trainings.map((t) => new Date(t.date)),
              }}
              modifiersStyles={{
                meeting: { backgroundColor: "#1e4d8c", color: "white" },
                training: { backgroundColor: "#22c55e", color: "white" },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grievance Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <Doughnut
                data={grievanceData}
                options={{
                  cutout: "75%",
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>TRAINING CERTIFICATE EXPIRY - FEBRUARY</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Line data={trainingData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


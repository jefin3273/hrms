"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const dayTypes = ["FULL", "HALF", "REST"]

export default function PayScheduleForm({ userId }: { userId: string }) {
  const [workingDays, setWorkingDays] = useState("5.5")
  const [schedule, setSchedule] = useState<Record<string, string>>(
    weekDays.reduce((acc, day) => ({ ...acc, [day]: "FULL" }), {}),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ADD PAY SCHEDULE</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Create (New / Missing Year) Pay Schedule</h3>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="scheduleCode">Pay Schedule Code:</Label>
                <Input id="scheduleCode" placeholder="Enter code" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduleName">Pay Schedule Name:</Label>
                <Input id="scheduleName" placeholder="Enter name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="publicHoliday">Is Public Holiday working day?:</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="holidayGroup">Holiday Group</Label>
                <Select defaultValue="india">
                  <SelectTrigger>
                    <SelectValue placeholder="Select holiday group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="india">INDIA HOLIDAY</SelectItem>
                    <SelectItem value="other">OTHER HOLIDAY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Set Week Day (Full/Half/Rest)</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="workingDays">No of Working days in a week:</Label>
                <Input
                  id="workingDays"
                  value={workingDays}
                  onChange={(e) => setWorkingDays(e.target.value)}
                  className="w-40"
                />
                <Button type="button" variant="secondary">
                  UPDATE
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Example: 5.5 Days as (5 full days and 6th day is Half day)
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-7">
              {weekDays.map((day) => (
                <div key={day} className="space-y-2">
                  <Label>{day}</Label>
                  <Select
                    value={schedule[day]}
                    onValueChange={(value) => setSchedule((prev) => ({ ...prev, [day]: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dayTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Set Monthly Working Days for Salary Period</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Pay Cycle Start Day</Label>
                <Select defaultValue="1">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Pay Cycle End Day</Label>
                <Input value="31" disabled />
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-4">
        <Button variant="destructive">CANCEL</Button>
        <Button className="bg-[#1e4d8c]">SAVE</Button>
      </CardFooter>
    </Card>
  )
}


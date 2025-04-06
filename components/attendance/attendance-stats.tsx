"use client"

import { useState, useEffect } from "react"
import { Download, RefreshCw } from "lucide-react"
import { Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import NoDataPlaceholder from "@/components/attendance/no-data-placeholder"
import { format, parseISO } from "date-fns"

// Type definitions based on Prisma schema
type Attendance = {
  id: string
  userId: string
  date: string
  shift: string
  clockIn: string | null
  clockOut: string | null
  status: string | null
  createdAt: string
}

type AttendanceSummary = {
  total: number
  present: number
  absent: number
  late: number
  earlyOut: number
  overtime: number
}

type EmployeeAttendance = {
  userId: string
  name: string
  status: string
  shift: string
  clockIn: string | null
  clockOut: string | null
}

export default function AttendanceStats({ userId }: { userId: string }) {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"))
  const [selectedShift, setSelectedShift] = useState<string>("all")
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [summary, setSummary] = useState<AttendanceSummary>({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    earlyOut: 0,
    overtime: 0,
  })
  const [employeeAttendances, setEmployeeAttendances] = useState<EmployeeAttendance[]>([])
  const [flaggedEmployees, setFlaggedEmployees] = useState<EmployeeAttendance[]>([])

  const [dailyShiftsMaximized, setDailyShiftsMaximized] = useState<boolean>(false)
  const [employeeAttendanceMaximized, setEmployeeAttendanceMaximized] = useState<boolean>(false)
  const [employeeConstantlyMaximized, setEmployeeConstantlyMaximized] = useState<boolean>(false)

  // Add these filter states for the maximized views
  const [fromDate, setFromDate] = useState<string>(format(new Date(), "yyyy-MM-dd"))
  const [toDate, setToDate] = useState<string>(format(new Date(), "yyyy-MM-dd"))
  const [masterDetails, setMasterDetails] = useState<string>("master")
  const [employeeCode, setEmployeeCode] = useState<string>("")
  const [employeeName, setEmployeeName] = useState<string>("")
  const [reason, setReason] = useState<string>("")

  // Fetch attendance data when date or shift changes
  useEffect(() => {
    const fetchAttendanceData = async () => {
      setIsLoading(true)
      try {
        // Fetch attendance records from API
        const response = await fetch(`/api/attendance?date=${selectedDate}&shift=${selectedShift}&userId=${userId}`)
        if (!response.ok) throw new Error("Failed to fetch attendance data")

        const data = await response.json()
        setAttendances(data.attendances)
        setSummary(data.summary)
        setEmployeeAttendances(data.employeeAttendances)
        setFlaggedEmployees(data.flaggedEmployees)
      } catch (error) {
        console.error("Error fetching attendance data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAttendanceData()
  }, [selectedDate, selectedShift, userId])

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      // Fetch fresh attendance data
      const response = await fetch(
        `/api/attendance?date=${selectedDate}&shift=${selectedShift}&userId=${userId}&refresh=true`,
      )
      if (!response.ok) throw new Error("Failed to refresh attendance data")

      const data = await response.json()
      setAttendances(data.attendances)
      setSummary(data.summary)
      setEmployeeAttendances(data.employeeAttendances)
      setFlaggedEmployees(data.flaggedEmployees)
    } catch (error) {
      console.error("Error refreshing attendance data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = (reportType: string) => {
    // Download attendance report as CSV
    window.open(
      `/api/attendance/download?date=${selectedDate}&shift=${selectedShift}&type=${reportType}&userId=${userId}`,
      "_blank",
    )
  }

  // Render attendance status summary cards
  const renderAttendanceSummary = () => {
    if (summary.total === 0) return <NoDataPlaceholder />

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-500 font-medium">Total</div>
          <div className="text-2xl font-bold">{summary.total}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-green-500 font-medium">Present</div>
          <div className="text-2xl font-bold">{summary.present}</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-red-500 font-medium">Absent</div>
          <div className="text-2xl font-bold">{summary.absent}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-yellow-500 font-medium">Late</div>
          <div className="text-2xl font-bold">{summary.late}</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-orange-500 font-medium">Early Out</div>
          <div className="text-2xl font-bold">{summary.earlyOut}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-purple-500 font-medium">Overtime</div>
          <div className="text-2xl font-bold">{summary.overtime}</div>
        </div>
      </div>
    )
  }

  // Render employee attendance table
  const renderEmployeeAttendance = () => {
    if (employeeAttendances.length === 0) return <NoDataPlaceholder />

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Employee</th>
              <th className="text-left py-2">Shift</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Clock In</th>
              <th className="text-left py-2">Clock Out</th>
            </tr>
          </thead>
          <tbody>
            {employeeAttendances.map((employee) => (
              <tr key={employee.userId} className="border-b hover:bg-gray-50">
                <td className="py-2">{employee.name}</td>
                <td className="py-2">{employee.shift}</td>
                <td className="py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      employee.status === "present"
                        ? "bg-green-100 text-green-800"
                        : employee.status === "absent"
                          ? "bg-red-100 text-red-800"
                          : employee.status === "late"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                  </span>
                </td>
                <td className="py-2">{employee.clockIn ? format(parseISO(employee.clockIn), "hh:mm a") : "-"}</td>
                <td className="py-2">{employee.clockOut ? format(parseISO(employee.clockOut), "hh:mm a") : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Render flagged employees (Late, Early Out, Overtime)
  const renderFlaggedEmployees = () => {
    if (flaggedEmployees.length === 0) return <NoDataPlaceholder />

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Employee</th>
              <th className="text-left py-2">Issue</th>
              <th className="text-left py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {flaggedEmployees.map((employee, index) => (
              <tr key={`${employee.userId}-${index}`} className="border-b hover:bg-gray-50">
                <td className="py-2">{employee.name}</td>
                <td className="py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      employee.status === "late"
                        ? "bg-yellow-100 text-yellow-800"
                        : employee.status === "earlyOut"
                          ? "bg-orange-100 text-orange-800"
                          : employee.status === "overtime"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {employee.status === "late"
                      ? "Late"
                      : employee.status === "earlyOut"
                        ? "Early Out"
                        : employee.status === "overtime"
                          ? "Overtime"
                          : employee.status}
                  </span>
                </td>
                <td className="py-2">
                  {employee.status === "late" && employee.clockIn
                    ? `Arrived at ${format(parseISO(employee.clockIn), "hh:mm a")}`
                    : employee.status === "earlyOut" && employee.clockOut
                      ? `Left at ${format(parseISO(employee.clockOut), "hh:mm a")}`
                      : employee.status === "overtime" && employee.clockOut
                        ? `Worked until ${format(parseISO(employee.clockOut), "hh:mm a")}`
                        : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card
        className={
          dailyShiftsMaximized
            ? "fixed top-10 left-10 right-10 bottom-10 z-50 overflow-auto bg-white shadow-2xl rounded-lg"
            : ""
        }
      >
        <CardHeader className="relative h-16 flex items-center px-4">
          {/* Left Side: Date & Shift Selector */}
          <div className="absolute left-4 flex items-center gap-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-md border px-3 py-2"
            />
            <Select value={selectedShift} onValueChange={setSelectedShift}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select shift" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shifts</SelectItem>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="evening">Evening</SelectItem>
                <SelectItem value="night">Night</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Center: Title */}
          <CardTitle className="absolute left-1/2 transform -translate-x-1/2 text-center">
            Daily Shifts/Schedules Employee Attendance Status
          </CardTitle>

          {/* Right Side: Buttons */}
          <div className="absolute right-4 flex gap-2">
            <Button variant="outline" size="icon" onClick={() => handleDownload("summary")}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setDailyShiftsMaximized(!dailyShiftsMaximized)}>
              {dailyShiftsMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {dailyShiftsMaximized && (
            <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">View</label>
                <Select value={masterDetails} onValueChange={setMasterDetails}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="master">Master</SelectItem>
                    <SelectItem value="details">Details</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => {
                    // Fetch data with the new filters
                    const fetchFilteredData = async () => {
                      setIsLoading(true)
                      try {
                        const response = await fetch(
                          `/api/attendance/range?fromDate=${fromDate}&toDate=${toDate}&view=${masterDetails}&userId=${userId}`,
                        )
                        if (!response.ok) throw new Error("Failed to fetch attendance data")

                        const data = await response.json()
                        setAttendances(data.attendances)
                        setSummary(data.summary)
                      } catch (error) {
                        console.error("Error fetching filtered attendance data:", error)
                      } finally {
                        setIsLoading(false)
                      }
                    }

                    fetchFilteredData()
                  }}
                  className="w-full"
                >
                  Fetch Data
                </Button>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-6">Loading attendance data...</div>
          ) : (
            renderAttendanceSummary()
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card
          className={
            employeeAttendanceMaximized
              ? "fixed top-10 left-10 right-10 bottom-10 z-50 overflow-auto bg-white shadow-2xl rounded-lg"
              : ""
          }
        >
          {/* Top Row: Date + Shift on Left, Buttons on Right */}
          <div className="flex items-center justify-between px-4 pt-4">
            <div className="flex items-center gap-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-md border px-3 py-2"
              />
              <Select value={selectedShift} onValueChange={setSelectedShift}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select shift" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Shifts</SelectItem>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => handleDownload("employees")}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setEmployeeAttendanceMaximized(!employeeAttendanceMaximized)}
              >
                {employeeAttendanceMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Centered Title Below */}
          <CardHeader className="flex justify-center mt-4">
            <CardTitle className="text-center">Employees Attendance</CardTitle>
          </CardHeader>

          {/* Content Section */}
          <CardContent>
            {employeeAttendanceMaximized && (
              <div className="mb-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">From Date</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">To Date</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Employee Code</label>
                  <input
                    type="text"
                    value={employeeCode}
                    onChange={(e) => setEmployeeCode(e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                    placeholder="Enter code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Employee Name</label>
                  <input
                    type="text"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Reason</label>
                  <Select value={reason} onValueChange={setReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="earlyOut">Early Out</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 md:col-span-5">
                  <Button
                    onClick={() => {
                      // Fetch data with the new filters
                      const fetchFilteredEmployeeData = async () => {
                        setIsLoading(true)
                        try {
                          const response = await fetch(
                            `/api/attendance/employees?fromDate=${fromDate}&toDate=${toDate}&employeeCode=${employeeCode}&employeeName=${employeeName}&reason=${reason}&userId=${userId}`,
                          )
                          if (!response.ok) throw new Error("Failed to fetch employee attendance data")

                          const data = await response.json()
                          setEmployeeAttendances(data.employeeAttendances)
                        } catch (error) {
                          console.error("Error fetching filtered employee data:", error)
                        } finally {
                          setIsLoading(false)
                        }
                      }

                      fetchFilteredEmployeeData()
                    }}
                    className="w-full"
                  >
                    Fetch Data
                  </Button>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center py-6">Loading attendance data...</div>
            ) : (
              renderEmployeeAttendance()
            )}
          </CardContent>
        </Card>

        <Card
          className={
            employeeConstantlyMaximized
              ? "fixed top-10 left-10 right-10 bottom-10 z-50 overflow-auto bg-white shadow-2xl rounded-lg"
              : ""
          }
        >
          <div className="flex items-center justify-between px-4 pt-4">
            <div className="flex items-center gap-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-md border px-3 py-2"
              />
              <Select value={selectedShift} onValueChange={setSelectedShift}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select shift" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Shifts</SelectItem>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => handleDownload("employees")}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setEmployeeConstantlyMaximized(!employeeConstantlyMaximized)}
              >
                {employeeConstantlyMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <CardHeader className="flex justify-center mt-4">
            <CardTitle className="text-center">Employees Constantly[Early Out/Late/OT]</CardTitle>
          </CardHeader>

          <CardContent>
            {employeeConstantlyMaximized && (
              <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">From Date</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">To Date</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Employee Code</label>
                  <input
                    type="text"
                    value={employeeCode}
                    onChange={(e) => setEmployeeCode(e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                    placeholder="Enter code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Employee Name</label>
                  <input
                    type="text"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                    placeholder="Enter name"
                  />
                </div>
                <div className="col-span-2 md:col-span-4">
                  <Button
                    onClick={() => {
                      // Fetch data with the new filters
                      const fetchFilteredFlaggedData = async () => {
                        setIsLoading(true)
                        try {
                          const response = await fetch(
                            `/api/attendance/flagged?fromDate=${fromDate}&toDate=${toDate}&employeeCode=${employeeCode}&employeeName=${employeeName}&userId=${userId}`,
                          )
                          if (!response.ok) throw new Error("Failed to fetch flagged employee data")

                          const data = await response.json()
                          setFlaggedEmployees(data.flaggedEmployees)
                        } catch (error) {
                          console.error("Error fetching filtered flagged data:", error)
                        } finally {
                          setIsLoading(false)
                        }
                      }

                      fetchFilteredFlaggedData()
                    }}
                    className="w-full"
                  >
                    Fetch Data
                  </Button>
                </div>
              </div>
            )}

            {isLoading ? <div className="flex justify-center py-6">Loading data...</div> : renderFlaggedEmployees()}
          </CardContent>
        </Card>
      </div>
      {(dailyShiftsMaximized || employeeAttendanceMaximized || employeeConstantlyMaximized) && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => {
            setDailyShiftsMaximized(false)
            setEmployeeAttendanceMaximized(false)
            setEmployeeConstantlyMaximized(false)
          }}
        />
      )}
    </div>
  )
}


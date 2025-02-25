// app/api/attendance/download/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { format, parseISO, startOfDay, endOfDay } from 'date-fns'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const date = url.searchParams.get('date') || format(new Date(), 'yyyy-MM-dd')
  const shift = url.searchParams.get('shift') || 'all'
  const type = url.searchParams.get('type') || 'summary'
  const userId = url.searchParams.get('userId')
  
  try {
    // Define filter options
    const dateFilter = {
      gte: startOfDay(new Date(date)),
      lte: endOfDay(new Date(date))
    }
    
    // Base query
    const baseQuery = {
      where: {
        date: dateFilter,
        ...(shift !== 'all' ? { shift } : {}),
      }
    }
    
    // Fetch attendance records
    const attendances = await prisma.attendance.findMany(baseQuery)
    
    // Format data for CSV export based on report type
    let csvData = ''
    const formattedDate = format(new Date(date), 'yyyy-MM-dd')
    
    if (type === 'summary') {
      // Summary report
      const present = attendances.filter(a => a.clockIn && a.clockOut).length
      const absent = attendances.filter(a => !a.clockIn && !a.clockOut).length
      const late = attendances.filter(a => {
        if (!a.clockIn) return false
        // Late logic - placeholder
        return false
      }).length
      
      csvData = 'Date,Shift,Total,Present,Absent,Late,Early Out,Overtime\n'
      csvData += `${formattedDate},${shift},${attendances.length},${present},${absent},${late},0,0\n`
    } 
    else if (type === 'employees') {
      // Employee attendance details
      csvData = 'Employee ID,Name,Shift,Status,Clock In,Clock Out\n'
      
      attendances.forEach(attendance => {
        // Determine status
        let status = 'Unknown'
        if (!attendance.clockIn && !attendance.clockOut) {
          status = 'Absent'
        } else if (attendance.clockIn && attendance.clockOut) {
          status = 'Present'
        }
        
        const clockInTime = attendance.clockIn ? format(new Date(attendance.clockIn), 'hh:mm a') : '-'
        const clockOutTime = attendance.clockOut ? format(new Date(attendance.clockOut), 'hh:mm a') : '-'
        
        csvData += `${attendance.userId},Employee ${attendance.userId.substring(0, 5)},${attendance.shift},${status},${clockInTime},${clockOutTime}\n`
      })
    }
    else if (type === 'flagged') {
      // Flagged employees report
      csvData = 'Employee ID,Name,Issue,Details\n'
      
      // Placeholder logic for flagged employees - implement your business rules here
      const flaggedAttendances = attendances.filter(a => {
        // Example: If clock in exists but is after expected time
        if (a.clockIn) {
          const clockInTime = new Date(a.clockIn)
          const clockInHour = clockInTime.getHours()
          
          // Simple placeholder logic
          if (a.shift === 'morning' && clockInHour > 9) return true
          if (a.shift === 'evening' && clockInHour > 17) return true
          if (a.shift === 'night' && clockInHour > 22) return true
        }
        return false
      })
      
      flaggedAttendances.forEach(attendance => {
        let issue = 'Unknown'
        let details = '-'
        
        // Determine issue type - placeholder logic
        if (attendance.clockIn) {
          const clockInTime = new Date(attendance.clockIn)
          const clockInHour = clockInTime.getHours()
          
          if (attendance.shift === 'morning' && clockInHour > 9) {
            issue = 'Late'
            details = `Arrived at ${format(clockInTime, 'hh:mm a')}`
          }
          // Add more conditions for other issue types
        }
        
        csvData += `${attendance.userId},Employee ${attendance.userId.substring(0, 5)},${issue},${details}\n`
      })
    }
    
    // Return CSV file
    return new NextResponse(csvData, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="attendance-${type}-${formattedDate}.csv"`
      }
    })
    
  } catch (error) {
    console.error("Error generating attendance report:", error)
    return NextResponse.json(
      { error: "Failed to generate attendance report" },
      { status: 500 }
    )
  }
}
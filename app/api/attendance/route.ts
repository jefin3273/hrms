// app/api/attendance/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { format, parseISO, startOfDay, endOfDay } from 'date-fns'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const date = url.searchParams.get('date') || format(new Date(), 'yyyy-MM-dd')
  const shift = url.searchParams.get('shift') || 'all'
  const userId = url.searchParams.get('userId')
  const refresh = url.searchParams.get('refresh') === 'true'
  
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
      },
      include: {
        // Assuming you'll add a User model to your Prisma schema later
        // user: { select: { name: true } }
      }
    }
    
    // Fetch attendance records
    const attendances = await prisma.attendance.findMany(baseQuery)
    
    // Get employee data
    // This is placeholder as User model integration will be needed
    // For now, just creating a placeholder response
    const employeeAttendances = attendances.map(attendance => {
      // Calculate status based on clock in/out times
      // This logic would depend on your business rules
      let status = 'unknown'
      if (!attendance.clockIn && !attendance.clockOut) {
        status = 'absent'
      } else if (attendance.clockIn && attendance.clockOut) {
        status = 'present'
        
        // Check if late (assuming shift start times, this is placeholder logic)
        const shiftStartTimes = {
          morning: '09:00',
          evening: '17:00',
          night: '22:00'
        }
        
        // Parse clock in time and compare with shift start time
        const clockInTime = attendance.clockIn ? new Date(attendance.clockIn) : null
        if (clockInTime) {
          const clockInHour = clockInTime.getHours()
          const clockInMinute = clockInTime.getMinutes()
          
          // Simple late check (would need actual shift times from your DB)
          if (attendance.shift === 'morning' && (clockInHour > 9 || (clockInHour === 9 && clockInMinute > 15))) {
            status = 'late'
          } else if (attendance.shift === 'evening' && (clockInHour > 17 || (clockInHour === 17 && clockInMinute > 15))) {
            status = 'late'
          } else if (attendance.shift === 'night' && (clockInHour > 22 || (clockInHour === 22 && clockInMinute > 15))) {
            status = 'late'
          }
        }
      }
      
      return {
        userId: attendance.userId,
        name: `Employee ${attendance.userId.substring(0, 5)}`, // Placeholder, replace with actual user data
        status,
        shift: attendance.shift,
        clockIn: attendance.clockIn,
        clockOut: attendance.clockOut
      }
    })
    
    // Create flagged employees list
    const flaggedEmployees = employeeAttendances.filter(employee => 
      ['late', 'earlyOut', 'overtime'].includes(employee.status)
    )
    
    // Calculate summary
    const summary = {
      total: attendances.length,
      present: employeeAttendances.filter(e => e.status === 'present').length,
      absent: employeeAttendances.filter(e => e.status === 'absent').length,
      late: employeeAttendances.filter(e => e.status === 'late').length,
      earlyOut: employeeAttendances.filter(e => e.status === 'earlyOut').length,
      overtime: employeeAttendances.filter(e => e.status === 'overtime').length
    }
    
    return NextResponse.json({
      attendances,
      employeeAttendances,
      flaggedEmployees,
      summary
    })
    
  } catch (error) {
    console.error("Error fetching attendance data:", error)
    return NextResponse.json(
      { error: "Failed to fetch attendance data" },
      { status: 500 }
    )
  }
}
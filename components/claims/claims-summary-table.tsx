import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const months = ["February - 2025", "January - 2025", "December - 2024", "November - 2024", "October - 2024"]

export default function ClaimsSummaryTable({ claims }: { claims: any[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead className="text-right">Approved Amount</TableHead>
            <TableHead className="text-right">Pending Amount</TableHead>
            <TableHead className="text-right">Cancelled Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {months.map((month) => (
            <TableRow key={month}>
              <TableCell>{month}</TableCell>
              <TableCell className="text-right">0</TableCell>
              <TableCell className="text-right">0</TableCell>
              <TableCell className="text-right">0</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}


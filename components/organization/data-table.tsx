"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DataTableProps {
  data: any[]
  columns: {
    key: string
    title: string
  }[]
  onEdit: (item: any) => void
  onDelete: (item: any) => void
  searchPlaceholder: string
}

export default function DataTable({ data, columns, onEdit, onDelete, searchPlaceholder }: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [pageSize, setPageSize] = useState(15)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredData = data.filter((item) =>
    columns.some((column) => item[column.key]?.toString().toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.title}</TableHead>
              ))}
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.id}>
                {columns.map((column) => (
                  <TableCell key={column.key}>{item[column.key]}</TableCell>
                ))}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => onDelete(item)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm">Page Size:</span>
          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm">Go to Page:</span>
            <Input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = Number(e.target.value)
                if (page >= 1 && page <= totalPages) {
                  setCurrentPage(page)
                }
              }}
              className="w-16"
            />
            <Button
              variant="secondary"
              onClick={() => {
                const page = Number(currentPage)
                if (page >= 1 && page <= totalPages) {
                  setCurrentPage(page)
                }
              }}
            >
              GO
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Page: {currentPage} of {totalPages}, Total: {filteredData.length}
          </div>
        </div>
      </div>
    </div>
  )
}


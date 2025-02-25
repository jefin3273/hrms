"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import DataTable from "./data-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import DepartmentForm from "./forms/department-form"

export default function DepartmentList({ initialData }: { initialData: any[] }) {
  const [departments, setDepartments] = useState(initialData)
  const [isOpen, setIsOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<any>(null)
  const { toast } = useToast()
  const supabase = createClient()

  const columns = [
    { key: "code", title: "Department Code" },
    { key: "name", title: "Department Name" },
  ]

  const handleEdit = (department: any) => {
    setEditingDepartment(department)
    setIsOpen(true)
  }

  const handleDelete = async (department: any) => {
    const { error } = await supabase.from("departments").delete().eq("id", department.id)

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
    } else {
      setDepartments(departments.filter((d) => d.id !== department.id))
      toast({
        title: "Success",
        description: "Department deleted successfully",
      })
    }
  }

  const handleSuccess = (updatedDepartment: any) => {
    if (editingDepartment) {
      setDepartments(departments.map((d) => (d.id === updatedDepartment.id ? updatedDepartment : d)))
    } else {
      setDepartments([...departments, updatedDepartment])
    }
    setIsOpen(false)
    setEditingDepartment(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Department List</h2>
        <Button onClick={() => setIsOpen(true)}>+ NEW</Button>
      </div>

      <DataTable
        data={departments}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Enter Department Code or Department Name"
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingDepartment ? "Edit Department" : "Add New Department"}</DialogTitle>
          </DialogHeader>
          <DepartmentForm
            initialData={editingDepartment}
            onSuccess={handleSuccess}
            onCancel={() => {
              setIsOpen(false)
              setEditingDepartment(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}


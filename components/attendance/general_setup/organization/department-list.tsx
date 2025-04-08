"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import DataTable from "./data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DepartmentForm from "./forms/department-form";

export default function DepartmentList({
  initialData,
}: {
  initialData: any[];
}) {
  const [departments, setDepartments] = useState(initialData);
  const [isOpen, setIsOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<any>(null);
  const { toast } = useToast();

  const columns = [
    { key: "code", title: "Department Code" },
    { key: "name", title: "Department Name" },
  ];

  const handleEdit = (department: any) => {
    setEditingDepartment(department);
    setIsOpen(true);
  };

  const handleDelete = async (department: any) => {
    try {
      const response = await fetch(`/api/departments?id=${department.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An error occurred");
      }

      setDepartments(departments.filter((d) => d.id !== department.id));
      toast({
        title: "Success",
        description: "Department deleted successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleSuccess = (updatedDepartment: any) => {
    if (editingDepartment) {
      setDepartments(
        departments.map((d) =>
          d.id === updatedDepartment.id ? updatedDepartment : d
        )
      );
    } else {
      setDepartments([...departments, updatedDepartment]);
    }
    setIsOpen(false);
    setEditingDepartment(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold">Category List</h2>
        <Button onClick={() => setIsOpen(true)} className="w-full sm:w-auto">
          + NEW
        </Button>
      </div>

      <DataTable
        data={departments}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Enter Category Code or Category Name"
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto sm:max-h-[initial]">
          <DialogHeader>
            <DialogTitle>
              {editingDepartment ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>
          <DepartmentForm
            initialData={editingDepartment}
            onSuccess={handleSuccess}
            onCancel={() => {
              setIsOpen(false);
              setEditingDepartment(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

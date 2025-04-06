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
import DesignationForm from "./forms/designation-form";

export default function DesignationList({
  initialData,
}: {
  initialData: any[];
}) {
  const [designations, setDesignations] = useState(initialData);
  const [isOpen, setIsOpen] = useState(false);
  const [editingDesignation, setEditingDesignation] = useState<any>(null);
  const { toast } = useToast();

  const columns = [
    { key: "code", title: "Designation Code" },
    { key: "name", title: "Designation Name" },
  ];

  const handleEdit = (designation: any) => {
    setEditingDesignation(designation);
    setIsOpen(true);
  };

  const handleDelete = async (designation: any) => {
    try {
      const response = await fetch(`/api/designations?id=${designation.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An error occurred");
      }

      setDesignations(designations.filter((d) => d.id !== designation.id));
      toast({
        title: "Success",
        description: "Designation deleted successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleSuccess = (updatedDesignation: any) => {
    if (editingDesignation) {
      setDesignations(
        designations.map((d) =>
          d.id === updatedDesignation.id ? updatedDesignation : d
        )
      );
    } else {
      setDesignations([...designations, updatedDesignation]);
    }
    setIsOpen(false);
    setEditingDesignation(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Designation List</h2>
        <Button onClick={() => setIsOpen(true)}>+ NEW</Button>
      </div>

      <DataTable
        data={designations}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Enter Designation Code or Designation Name"
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingDesignation ? "Edit Designation" : "Add New Designation"}
            </DialogTitle>
          </DialogHeader>
          <DesignationForm
            initialData={editingDesignation}
            onSuccess={handleSuccess}
            onCancel={() => {
              setIsOpen(false);
              setEditingDesignation(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

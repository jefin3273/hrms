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
import ExtraClassificationForm from "./forms/extra-classification-form";
import { ExtraClassification } from "@prisma/client"; // Import the Prisma type

export default function ExtraClassificationList({
  initialData,
}: {
  initialData: ExtraClassification[];
}) {
  const [extraClassifications, setExtraClassifications] =
    useState<ExtraClassification[]>(initialData);
  const [isOpen, setIsOpen] = useState(false);
  const [editingClassification, setEditingClassification] =
    useState<ExtraClassification | null>(null);
  const { toast } = useToast();

  const columns = [
    { key: "code", title: "Classification Code" },
    { key: "name", title: "Classification Name" },
  ];

  const handleEdit = (classification: ExtraClassification) => {
    setEditingClassification(classification);
    setIsOpen(true);
  };

  const handleDelete = async (classification: ExtraClassification) => {
    try {
      const response = await fetch(
        `/api/extra-classifications/${classification.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete classification");
      }

      setExtraClassifications(
        extraClassifications.filter((c) => c.id !== classification.id)
      );
      toast({
        title: "Success",
        description: "Classification deleted successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleSuccess = (updatedClassification: ExtraClassification) => {
    if (editingClassification) {
      setExtraClassifications(
        extraClassifications.map((c) =>
          c.id === updatedClassification.id ? updatedClassification : c
        )
      );
    } else {
      setExtraClassifications([...extraClassifications, updatedClassification]);
    }
    setIsOpen(false);
    setEditingClassification(null);
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
        data={extraClassifications}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Enter Category Code or Category Name"
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto sm:max-h-[initial]">
          <DialogHeader>
            <DialogTitle>
              {editingClassification ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>
          <ExtraClassificationForm
            initialData={editingClassification}
            onSuccess={handleSuccess}
            onCancel={() => {
              setIsOpen(false);
              setEditingClassification(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

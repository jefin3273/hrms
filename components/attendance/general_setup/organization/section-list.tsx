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
import SectionForm from "./forms/section-form";

export default function SectionList({
  initialData,
  departments,
}: {
  initialData: any[];
  departments: any[];
}) {
  const [sections, setSections] = useState(initialData);
  const [isOpen, setIsOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);
  const { toast } = useToast();

  const columns = [
    { key: "code", title: "Section Code" },
    { key: "name", title: "Section Name" },
    {
      key: "department_code",
      title: "Department Code",
      render: (_: any, section: any) => section.department?.code || "N/A",
    },
    {
      key: "department_name",
      title: "Department Name",
      render: (_: any, section: any) => section.department?.name || "N/A",
    },
  ];

  const handleEdit = (section: any) => {
    setEditingSection(section);
    setIsOpen(true);
  };

  const handleDelete = async (section: any) => {
    try {
      const response = await fetch(`/api/sections/${section.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete section");
      }

      setSections(sections.filter((s) => s.id !== section.id));
      toast({
        title: "Success",
        description: "Section deleted successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete section",
      });
    }
  };

  const handleSuccess = (updatedSection: any) => {
    if (editingSection) {
      // For edits, replace the existing item
      setSections(
        sections.map((s) => (s.id === updatedSection.id ? updatedSection : s))
      );
    } else {
      // For new items, add to the array
      setSections([...sections, updatedSection]);
    }
    setIsOpen(false);
    setEditingSection(null);
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
        data={sections}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Enter Category Code or Category Name"
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto sm:max-h-[initial]">
          <DialogHeader>
            <DialogTitle>
              {editingSection ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>
          <SectionForm
            initialData={editingSection}
            departments={departments}
            onSuccess={handleSuccess}
            onCancel={() => {
              setIsOpen(false);
              setEditingSection(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

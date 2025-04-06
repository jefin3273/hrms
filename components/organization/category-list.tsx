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
import CategoryForm from "./forms/category-form";
import { Category } from "@prisma/client"; // Import the Prisma type

export default function CategoryList({
  initialData,
}: {
  initialData: Category[];
}) {
  const [categories, setCategories] = useState<Category[]>(initialData);
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  const columns = [
    { key: "code", title: "Category Code" },
    { key: "name", title: "Category Name" },
  ];

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsOpen(true);
  };

  const handleDelete = async (category: Category) => {
    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete category");
      }

      setCategories(categories.filter((c) => c.id !== category.id));
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleSuccess = (updatedCategory: Category) => {
    if (editingCategory) {
      setCategories(
        categories.map((c) =>
          c.id === updatedCategory.id ? updatedCategory : c
        )
      );
    } else {
      setCategories([...categories, updatedCategory]);
    }
    setIsOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Category List</h2>
        <Button onClick={() => setIsOpen(true)}>+ NEW</Button>
      </div>

      <DataTable
        data={categories}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Enter Category Code or Category Name"
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm
            initialData={editingCategory}
            onSuccess={handleSuccess}
            onCancel={() => {
              setIsOpen(false);
              setEditingCategory(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

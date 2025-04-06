"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface DepartmentFormProps {
  initialData?: any;
  onSuccess: (department: any) => void;
  onCancel: () => void;
}

export default function DepartmentForm({
  initialData,
  onSuccess,
  onCancel,
}: DepartmentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(event.currentTarget);
    const data = {
      code: formData.get("code") as string,
      name: formData.get("name") as string,
    };

    try {
      let response;
      
      if (initialData) {
        // Update existing department
        response = await fetch('/api/departments', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: initialData.id,
            ...data
          }),
        });
      } else {
        // Create new department
        response = await fetch('/api/departments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An error occurred');
      }

      const result = await response.json();
      onSuccess(result);

      toast({
        title: "Success",
        description: `Department ${
          initialData ? "updated" : "created"
        } successfully`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="code">Department Code</Label>
        <Input
          id="code"
          name="code"
          defaultValue={initialData?.code}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Department Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={initialData?.name}
          required
        />
      </div>
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
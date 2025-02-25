"use client";

import type React from "react";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
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
  const supabase = createClient();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      code: formData.get("code"),
      name: formData.get("name"),
    };

    const { data: department, error } = initialData
      ? await supabase
          .from("departments")
          .update(data)
          .eq("id", initialData.id)
          .select()
          .single()
      : await supabase.from("departments").insert(data).select().single();

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } else {
      toast({
        title: "Success",
        description: `Department ${
          initialData ? "updated" : "created"
        } successfully`,
      });
      onSuccess(department);
    }

    setIsLoading(false);
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

"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DepartmentList from "./department-list";
import DesignationList from "./designation-list";
import SectionList from "./section-list";
import CategoryList from "./category-list";
import ExtraClassificationList from "./extra-classification-list";

interface OrganizationTabsProps {
  initialData: {
    departments: any[];
    designations: any[];
    sections: any[];
    categories: any[];
    extraClassifications: any[];
  };
}

export default function OrganizationTabs({
  initialData,
}: OrganizationTabsProps) {
  const [activeTab, setActiveTab] = useState("department");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="department">Department</TabsTrigger>
        <TabsTrigger value="designation">Designation</TabsTrigger>
        <TabsTrigger value="section">Section</TabsTrigger>
        <TabsTrigger value="category">Category</TabsTrigger>
        <TabsTrigger value="extra">Extra Classification</TabsTrigger>
      </TabsList>
      <TabsContent value="department">
        <DepartmentList initialData={initialData.departments} />
      </TabsContent>
      <TabsContent value="designation">
        <DesignationList initialData={initialData.designations} />
      </TabsContent>
      <TabsContent value="section">
        <SectionList
          initialData={initialData.sections}
          departments={initialData.departments}
        />
      </TabsContent>
      <TabsContent value="category">
        <CategoryList initialData={initialData.categories} />
      </TabsContent>
      <TabsContent value="extra">
        <ExtraClassificationList
          initialData={initialData.extraClassifications}
        />
      </TabsContent>
    </Tabs>
  );
}

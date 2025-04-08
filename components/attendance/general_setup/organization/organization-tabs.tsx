"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [isMobile, setIsMobile] = useState(false);

  // Check viewport width on mount and when resizing
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const tabOptions = [
    { value: "department", label: "Department" },
    { value: "designation", label: "Designation" },
    { value: "section", label: "Section" },
    { value: "category", label: "Category" },
    { value: "extra", label: "Extra-Classification" },
  ];

  return (
    <div className="space-y-4">
      {isMobile ? (
        // Dropdown for mobile view
        <div className="w-full">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select tab" />
            </SelectTrigger>
            <SelectContent>
              {tabOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        // Tabs for desktop view
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1">
            {tabOptions.map((option) => (
              <TabsTrigger key={option.value} value={option.value}>
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {/* Content remains the same regardless of view */}
      <div className="mt-4">
        {activeTab === "department" && (
          <DepartmentList initialData={initialData.departments} />
        )}
        {activeTab === "designation" && (
          <DesignationList initialData={initialData.designations} />
        )}
        {activeTab === "section" && (
          <SectionList
            initialData={initialData.sections}
            departments={initialData.departments}
          />
        )}
        {activeTab === "category" && (
          <CategoryList initialData={initialData.categories} />
        )}
        {activeTab === "extra" && (
          <ExtraClassificationList
            initialData={initialData.extraClassifications}
          />
        )}
      </div>
    </div>
  );
}

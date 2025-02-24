"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Gift,
  Settings,
  User,
  ChevronDown,
  ChevronRight,
  Clock,
  Calendar,
  DollarSign,
  FileText,
  Award,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define menu items with their sub-items
const menuItems = [
  { name: "Home", href: "/dashboard", subItems: [] },
  {
    name: "General Setup",
    href: "/dashboard",
    subItems: [
      { name: "Company", href: "/general-setup/company" },
      {
        name: "Organisation Hierarchy",
        href: "/general-setup/organisation-hierarchy",
      },
      {
        name: "User Access",
        href: "/dashboard",
        subItems: [
          { name: "User Role", href: "/general-setup/user-role" },
          { name: "User Creation", href: "/general-setup/user-creation" },
          {
            name: "Employee Access/Password Reset",
            href: "/general-setup/employee-access-password-reset",
          },
        ],
      },
      {
        name: "Attendance Setup",
        href: "/dashboard",
        subItems: [
          { name: "Shift Master", href: "/general-setup/shift-master" },
          { name: "Auto Shift", href: "/general-setup/auto-shift" },
          {
            name: "Duty Roster",
            href: "/general-setup/duty-roster",
          },
          {
            name: "Assign Attendance Approver",
            href: "/general-setup/attendance-approver",
          },
          {
            name: "Holiday Setup",
            href: "/general-setup/holiday-setup",
          },
          {
            name: "Alternate Rest Day Setup",
            href: "/general-setup/alternate-rest-day-setup",
          },
        ],
      },
      {
        name: "Tablet Setup",
        href: "/dashboard",
        subItems: [
          { name: "Tablet Registration", href: "/general-setup/shift-master" },
          { name: "Auto Shift", href: "/general-setup/auto-shift" },
          {
            name: "Tablet Sync",
            href: "/general-setup/duty-roster",
          },
          {
            name: "Employee Sync",
            href: "/general-setup/attendance-approver",
          },
          {
            name: "Face Registration",
            href: "/general-setup/holiday-setup",
          },
        ],
      },
      {
        name: "Mobile Setup",
        href: "/dashboard",
        subItems: [
          { name: "Face Registration", href: "/general-setup/shift-master" },
          { name: "Auto Shift", href: "/general-setup/auto-shift" },
          {
            name: "Mobile Settings",
            href: "/general-setup/duty-roster",
          },
          {
            name: "Work Location",
            href: "/general-setup/attendance-approver",
          },
        ],
      },
      { name: "Global Change", href: "/general-setup/company" },
      {
        name: "Staff Bulk Update",
        href: "/general-setup/organisation-hierarchy",
      },
    ],
  },
  {
    name: "Employee Setup",
    href: "/dashboard",
    subItems: [
      { name: "Employee Master", href: "/employee-setup/add" },
      { name: "IImport Employee Profile", href: "/employee-setup/list" },
    ],
  },
  {
    name: "Attendance Adjustment",
    href: "/dashboard",
    subItems: [
      { name: "By Individual", href: "/employee-setup/add" },
      { name: "By Department", href: "/employee-setup/list" },
      { name: "Staff Bulk Attendance", href: "/employee-setup/list" },
      { name: "Attendance Request Approval", href: "/employee-setup/list" },
      { name: "Attendance OT APprove/Reject", href: "/employee-setup/list" },
    ],
  },
  {
    name: "Time Sheet",
    href: "/dashboard",
    subItems: [{ name: "Project Master", href: "/employee-setup/add" }],
  },
  {
    name: "Field Tracking",
    href: "/dashboard",
    subItems: [
      { name: "Lead Master", href: "/employee-setup/add" },
      { name: "Manage Appointments", href: "/employee-setup/add" },
    ],
  },
  {
    name: "Reports",
    href: "/dashboard",
    subItems: [
      { name: "Daily Attendance Report", href: "/employee-setup/add" },
      { name: "Individual Attendance Report", href: "/employee-setup/add" },
      { name: "Break Reports", href: "/employee-setup/add" },
      { name: "Time Sheet Report", href: "/employee-setup/add" },
      { name: "Mobile Attendance Reports", href: "/employee-setup/add" },
      { name: "Mobile Daily Attendance", href: "/employee-setup/add" },
      { name: "Distance Travelled Report", href: "/employee-setup/add" },
      { name: "Work From Location Attendance", href: "/employee-setup/add" },
      { name: "Attendance Problem Report", href: "/employee-setup/add" },
      {
        name: "Custom Report",
        href: "/employee-setup/add",
        subItems: [
          { name: "Saved Custom Reports", href: "/employee-setup/add" },
          { name: "Create New Report", href: "/employee-setup/add" },
        ],
      },
      { name: "Working Hours Summary", href: "/employee-setup/add" },
      { name: "Performance Report", href: "/employee-setup/add" },
      { name: "Department Attendance Report", href: "/employee-setup/add" },
      { name: "Clocking Data", href: "/employee-setup/add" },
      { name: "Work Location Report", href: "/employee-setup/add" },
      {
        name: "Monthly Attendance Overtime Report",
        href: "/employee-setup/add",
      },
      { name: "Appointment Report", href: "/employee-setup/add" },
      { name: "Attendance Regularization Report", href: "/employee-setup/add" },
      { name: "Location Tracking Report", href: "/employee-setup/add" },
      { name: "Location Tracking Map", href: "/employee-setup/add" },
    ],
  },
  {
    name: "Help",
    href: "/dashboard",
    subItems: [
      { name: "Submit A Ticket", href: "/employee-setup/add" },
      { name: "Share Screen to Support", href: "/employee-setup/add" },
      { name: "Implementation Progress", href: "/employee-setup/add" },
      { name: "Write to Management", href: "/employee-setup/add" },
      { name: "View Latest Updates", href: "/employee-setup/add" },
      { name: "Book Training", href: "/employee-setup/add" },
      { name: "Email Tracker", href: "/employee-setup/add" },
      { name: "SMS Tracker", href: "/employee-setup/add" },
    ],
  },
  {
    name: "Billing",
    href: "/dashboard",
    subItems: [{ name: "Manage License", href: "/employee-setup/add" }],
  },
  {
    name: "InfoTech Support",
    href: "/dashboard",
    subItems: [
      { name: "Purge and Reprocess", href: "/employee-setup/add" },
      { name: "System Parameter", href: "/employee-setup/add" },
      {
        name: "ATD",
        href: "#",
        subItems: [
          { name: "ATD Daily Attendance", href: "/employee-setup/add" },
          { name: "ATD User Transfer", href: "/employee-setup/add" },
          { name: "Template Database", href: "/employee-setup/add" },
          { name: "Template Transfer", href: "/employee-setup/add" },
          { name: "Template History", href: "/employee-setup/add" },
        ],
      },
      { name: "ATD old", href: "/employee-setup/add" },
      { name: "User Access Report", href: "/employee-setup/add" },
    ],
  },
];

const moduleLinks = [
  { icon: Clock, label: "ATTENDANCE", href: "/dashboard" },
  { icon: Calendar, label: "LEAVE", href: "/leave" },
  { icon: DollarSign, label: "PAYROLL", href: "/payroll" },
  { icon: FileText, label: "CLAIM", href: "/claim" },
  { icon: Award, label: "APPRAISAL", href: "/appraisal" },
  { icon: Users, label: "HR", href: "/hr" },
];

export default function DashboardHeader({
  user,
  title = "ATTENDANCE SOFTWARE",
}: {
  user: any;
  title?: string;
}) {
  const [currentYear] = useState(new Date().getFullYear());
  const [currentMonth] = useState(
    new Date().toLocaleString("default", { month: "long" })
  );
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hoveredSubItem, setHoveredSubItem] = useState<string | null>(null);

  // Function to render nested submenus with hover effects
  const renderSubMenu = (parentItem: any) => {
    return (
      <div className="absolute left-0 top-full z-50 min-w-[220px] bg-white text-gray-800 shadow-lg rounded-b-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        {parentItem.subItems.map((subItem: any) => (
          <div
            key={subItem.name}
            className="relative"
            onMouseEnter={() => setHoveredSubItem(subItem.name)}
            onMouseLeave={() => setHoveredSubItem(null)}
          >
            {subItem.subItems && subItem.subItems.length > 0 ? (
              <>
                <div className="flex items-center justify-between px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer">
                  <div className="flex items-center">
                    <ChevronRight className="mr-2 h-4 w-4 text-blue-600" />
                    <span>{subItem.name}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-blue-600" />
                </div>
                {/* Nested submenu */}
                {hoveredSubItem === subItem.name && (
                  <div className="absolute left-full top-0 min-w-[220px] bg-white text-gray-800 shadow-lg rounded-md py-2 z-50">
                    {subItem.subItems.map((nestedItem: any) => (
                      <Link
                        key={nestedItem.name}
                        href={nestedItem.href}
                        className="flex items-center px-4 py-2 text-sm hover:bg-blue-50"
                      >
                        <ChevronRight className="mr-2 h-4 w-4 text-blue-600" />
                        {nestedItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={subItem.href}
                className="flex items-center px-4 py-2 text-sm hover:bg-blue-50"
              >
                <ChevronRight className="mr-2 h-4 w-4 text-blue-600" />
                {subItem.name}
              </Link>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <header className="bg-[#1e4d8c] text-white">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">JONSETA</h1>
          <span className="text-sm">{title}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white/10 rounded-md px-3 py-1">
            <span>{currentYear}</span>
            <span>{currentMonth}</span>
          </div>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-white shadow-md rounded-md border border-gray-200 p-1"
            >
              {moduleLinks.map(({ icon: Icon, label, href }) => (
                <DropdownMenuItem
                  key={label}
                  asChild
                  className="rounded hover:bg-blue-50"
                >
                  <Link
                    href={href}
                    className="flex items-center space-x-3 px-3 py-2"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <nav className="border-t border-blue-600 relative">
        <div className="flex items-center justify-between px-4">
          <div className="flex space-x-6 py-2">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className="relative group"
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {item.subItems.length > 0 ? (
                  <div className="flex items-center whitespace-nowrap text-sm hover:text-blue-200 cursor-pointer">
                    {item.name}
                    <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center whitespace-nowrap text-sm hover:text-blue-200"
                  >
                    {item.name}
                  </Link>
                )}

                {/* Show submenu on hover */}
                {item.subItems.length > 0 && renderSubMenu(item)}
              </div>
            ))}
          </div>
          <Button className="bg-yellow-500 text-black hover:bg-yellow-400 transition-colors duration-200">
            <Gift className="mr-2 h-4 w-4" />
            REFER AND EARN
          </Button>
        </div>
      </nav>
    </header>
  );
}

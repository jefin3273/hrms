"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
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
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ReferEarnButton from "@/components/referral/refer-earn-button";

// Define menu items with their sub-items (from the first implementation)
const menuItems = [
  { name: "Home", href: "/attendance", subItems: [] },
  {
    name: "General Setup",
    href: "/attendance",
    subItems: [
      { name: "Company", href: "/general-setup/company" },
      {
        name: "Organisation Hierarchy",
        href: "/general-setup/organisation-hierarchy",
      },
      {
        name: "User Access",
        href: "/attendance",
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
        href: "/attendance",
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
        href: "/attendance",
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
        href: "/attendance",
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
    href: "/attendance",
    subItems: [
      { name: "Employee Master", href: "/employee-setup/add" },
      { name: "Import Employee Profile", href: "/employee-setup/list" },
    ],
  },
  {
    name: "Attendance Adjustment",
    href: "/attendance",
    subItems: [
      { name: "By Individual", href: "/employee-setup/add" },
      { name: "By Department", href: "/employee-setup/list" },
      { name: "Staff Bulk Attendance", href: "/employee-setup/list" },
      { name: "Attendance Request Approval", href: "/employee-setup/list" },
      { name: "Attendance OT Approve/Reject", href: "/employee-setup/list" },
    ],
  },
  {
    name: "Time Sheet",
    href: "/attendance",
    subItems: [{ name: "Project Master", href: "/employee-setup/add" }],
  },
  {
    name: "Field Tracking",
    href: "/attendance",
    subItems: [
      { name: "Lead Master", href: "/employee-setup/add" },
      { name: "Manage Appointments", href: "/employee-setup/add" },
    ],
  },
  {
    name: "Reports",
    href: "/attendance",
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
    href: "/attendance",
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
    href: "/attendance",
    subItems: [{ name: "Manage License", href: "/employee-setup/add" }],
  },
  {
    name: "InfoTech Support",
    href: "/attendance",
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
  { icon: Clock, label: "ATTENDANCE", href: "/attendance" },
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
  const router = useRouter();
  const [currentYear] = useState(new Date().getFullYear());
  const [currentMonth] = useState(
    new Date().toLocaleString("default", { month: "long" })
  );
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hoveredSubItem, setHoveredSubItem] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

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
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">JONSETA</h1>
          <span className="text-sm hidden sm:inline">{title}</span>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="hidden sm:flex items-center space-x-2 bg-white/10 rounded-md px-3 py-1">
            <span>{currentYear}</span>
            <span>{currentMonth}</span>
          </div>

          <div className="hidden sm:block">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80">
                <div className="space-y-4">
                  <h3 className="font-semibold">
                    Latest Notifications & Activities
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    No new notifications
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Settings className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <ChevronDown className="h-4 w-4 hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[260px] sm:w-80">
              <div className="flex items-center space-x-2 p-4">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">Jefin John</h4>
                  <p className="text-sm text-muted-foreground">
                    USER COMPANY: NONE
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="p-4 space-y-2">
                <p className="text-sm">USER APP RIGHT: SUPER USER</p>
                <p className="text-sm">ACCESS RIGHT CODE: ALL</p>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => router.push("/account")}
                >
                  MANAGE ACCOUNT
                </Button>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <div className="relative">
                  <Users className="h-5 w-5" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {moduleLinks.map(({ icon: Icon, label, href }) => (
                <DropdownMenuItem key={label} asChild>
                  <Link
                    href={href}
                    className="flex items-center space-x-2 px-2 py-2"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Bottom Nav for Desktop */}
      <nav className="border-t border-white/0 mt-0 hidden sm:block">
        <div className="flex items-center justify-between px-4 py-1">
          <div className="flex space-x-6">
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
                {item.subItems.length > 0 && renderSubMenu(item)}
              </div>
            ))}
          </div>

          <ReferEarnButton className="hidden md:flex bg-yellow-500 text-black hover:bg-yellow-400 transition-colors duration-200">
            <Gift className="mr-2 h-4 w-4" />
            REFER AND EARN
          </ReferEarnButton>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-blue-900 overflow-y-auto max-h-[calc(100vh-60px)]">
          {/* Add notification and settings at the top of mobile menu */}
          <div className="flex items-center justify-between p-4 border-b border-blue-800">
            <div className="text-sm flex items-center">
              <span>{currentYear}</span>
              <span className="ml-2">{currentMonth}</span>
            </div>
            <div className="flex items-center space-x-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80">
                  <div className="space-y-4">
                    <h3 className="font-semibold">
                      Latest Notifications & Activities
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      No new notifications
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
          {menuItems.map((item) => (
            <div key={item.name} className="border-b border-blue-800">
              {item.subItems.length > 0 ? (
                <details className="group">
                  <summary className="flex justify-between items-center px-4 py-2 cursor-pointer">
                    <span>{item.name}</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="bg-blue-800 pl-4">
                    {item.subItems.map((subItem) => (
                      <div
                        key={subItem.name}
                        className="border-t border-blue-700"
                      >
                        {subItem.subItems && subItem.subItems.length > 0 ? (
                          <details className="group">
                            <summary className="flex justify-between items-center px-4 py-2 cursor-pointer">
                              <span>{subItem.name}</span>
                              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                            </summary>
                            <div className="bg-blue-700 pl-4">
                              {subItem.subItems.map((nestedItem) => (
                                <Link
                                  key={nestedItem.name}
                                  href={nestedItem.href}
                                  className="block px-4 py-2 text-sm border-t border-blue-600"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {nestedItem.name}
                                </Link>
                              ))}
                            </div>
                          </details>
                        ) : (
                          <Link
                            href={subItem.href}
                            className="block px-4 py-2 text-sm"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </details>
              ) : (
                <Link
                  href={item.href}
                  className="block px-4 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}

          <div className="p-4">
            <ReferEarnButton className="w-full bg-yellow-500 text-black hover:bg-yellow-400 transition-colors duration-200">
              <Gift className="mr-2 h-4 w-4" />
              REFER AND EARN
            </ReferEarnButton>
          </div>

          <div className="p-4 space-y-2 border-t border-blue-800">
            {moduleLinks.map(({ icon: Icon, label, href }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center space-x-2 px-2 py-2 bg-blue-800 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

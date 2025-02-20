"use client";

import Link from "next/link";
import { Bell, Gift, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  "Home",
  "General Setup",
  "Employee Setup",
  "Attendance Adjustment",
  "Time Sheet",
  "Field Tracking",
  "Reports",
  "Help",
  "Billing",
  "InfoTech Support",
];

export default function DashboardHeader({ user }: { user: any }) {
  return (
    <header className="bg-[#1e4d8c] text-white">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">JONSETA</h1>
          <span className="text-sm">HRMS SOFTWARE</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <nav className="border-t border-blue-600">
        <div className="flex items-center justify-between px-4">
          <div className="flex space-x-4 overflow-x-auto py-2">
            {menuItems.map((item) => (
              <Link
                key={item}
                href="#"
                className="whitespace-nowrap text-sm hover:text-blue-200"
              >
                {item}
              </Link>
            ))}
          </div>
          <Button className="bg-yellow-500 text-black hover:bg-yellow-400">
            <Gift className="mr-2 h-4 w-4" />
            REFER AND EARN
          </Button>
        </div>
      </nav>
    </header>
  );
}

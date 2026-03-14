"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
    User,
  Bell,
  Search,
  Globe,
  Package,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "feed"; // Default to feed

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out");
    router.push("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* 1. Brand Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Search className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tighter">
              TRACEBACK
            </span>
          </Link>

          {/* 2. PRO TABS (Now inside the Nav!) */}
          <div className="hidden md:flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
            <TabLink
              label="All Items"
              tab="feed"
              active={activeTab === "feed"}
              icon={<Globe className="w-4 h-4" />}
            />
            <TabLink
              label="My Reports"
              tab="my-items"
              active={activeTab === "my-items"}
              icon={<Package className="w-4 h-4" />}
            />
            <TabLink
              label="My Claims"
              tab="my-claims"
              active={activeTab === "my-claims"}
              icon={<MessageSquare className="w-4 h-4" />}
            />
            <TabLink
              label="Inbox"
              tab="inbox"
              active={activeTab === "inbox"}
              icon={<Bell className="w-4 h-4" />}
            />
          </div>

          {/* 3. User Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>

            <div className="group flex items-center gap-2 relative">
              <button className="w-10 h-10 bg-blue-600  cursor-pointer rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-sm hover:scale-105 transition-transform">
                {localStorage.getItem("user_name")?.charAt(0).toUpperCase() ||
                  "U"}
              </button>

              <div className="absolute right-0  top-8 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="flex gap-2 px-3.5 mb-2">
                  <User className="w-5 h-5 text-black" />
                  <p className="text-black text-[16px] font-bold">
                    {localStorage.getItem("user_name")}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center  cursor-pointer gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Helper component for the links
function TabLink({ label, tab, active, icon }: any) {
  return (
    <Link
      href={`/dashboard?tab=${tab}`}
      className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
        active
          ? "bg-white text-blue-600 shadow-sm"
          : "text-gray-500 hover:text-gray-800"
      }`}
    >
      {icon} {label}
    </Link>
  );
}

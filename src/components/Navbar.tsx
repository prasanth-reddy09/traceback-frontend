"use client";

import { useState, useEffect } from "react";
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
  Menu,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "feed";
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const storedName = localStorage.getItem("user_name");
    if (storedName) setUserName(storedName);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out");
    router.push("/");
  };

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Search className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tighter">
              TRACEBACK
            </span>
          </Link>

          {/* DESKTOP TABS (Hidden on mobile) */}
          <div className="hidden md:flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
            <TabLink label="All Items" tab="feed" active={activeTab === "feed"} icon={<Globe className="w-4 h-4" />} />
            <TabLink label="My Reports" tab="my-items" active={activeTab === "my-items"} icon={<Package className="w-4 h-4" />} />
            <TabLink label="My Claims" tab="my-claims" active={activeTab === "my-claims"} icon={<MessageSquare className="w-4 h-4" />} />
            <TabLink label="Inbox" tab="inbox" active={activeTab === "inbox"} icon={<Bell className="w-4 h-4" />} />
          </div>

          {/*  ACTIONS & MOBILE TOGGLE */}
          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>

            {/*  Dropdown (Hover) */}
            <div className="hidden md:block group relative">
              <button className="w-10 h-10 bg-blue-600 cursor-pointer rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-sm hover:scale-105 transition-transform">
                {userName.charAt(0).toUpperCase()}
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="flex gap-2 px-4 py-2 border-b border-gray-50 mb-1">
                  <User className="w-4 h-4 text-gray-400" />
                  <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
                </div>
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold transition-colors">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE OVERLAY DRAWER --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60] flex flex-col bg-white p-6 animate-in slide-in-from-right duration-300">
          <div className="flex justify-between items-center mb-8">
            <span className="text-xl font-black text-gray-900">MENU</span>
            <button onClick={toggleMenu} className="p-2 bg-gray-100 rounded-full">
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* User Info Section */}
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Logged in as</p>
              <p className="text-lg font-black text-gray-900">{userName}</p>
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex flex-col gap-2">
            <MobileTabLink 
              label="All Items" tab="feed" active={activeTab === "feed"} 
              icon={<Globe className="w-5 h-5" />} onClick={toggleMenu} 
            />
            <MobileTabLink 
              label="My Reports" tab="my-items" active={activeTab === "my-items"} 
              icon={<Package className="w-5 h-5" />} onClick={toggleMenu} 
            />
            <MobileTabLink 
              label="My Claims" tab="my-claims" active={activeTab === "my-claims"} 
              icon={<MessageSquare className="w-5 h-5" />} onClick={toggleMenu} 
            />
            <MobileTabLink 
              label="Inbox" tab="inbox" active={activeTab === "inbox"} 
              icon={<Bell className="w-5 h-5" />} onClick={toggleMenu} 
            />
          </div>

          {/* Sign Out at the Bottom */}
          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 py-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-5 h-5" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// Desktop Link Helper
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

// Mobile Link Helper
function MobileTabLink({ label, tab, active, icon, onClick }: any) {
  return (
    <Link
      href={`/dashboard?tab=${tab}`}
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-xl text-md font-bold transition-all ${
        active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      {icon} {label}
    </Link>
  );
}
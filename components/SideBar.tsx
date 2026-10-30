"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { PlusCircle, MessageSquare, History, Settings, Users, Database, Sparkles, X } from "lucide-react";

// Add props to allow the layout to close the sidebar on mobile
export default function Sidebar({ onCloseMobile }: { onCloseMobile?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  const isAdmin = user?.role === "president" || user?.role === "superadmin";

  const linkClass = (path: string) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-wider transition-all ${
      pathname === path
        ? "bg-green-700 text-white shadow-md shadow-green-700/20"
        : "text-gray-600 hover:bg-green-50 hover:text-green-900"
    }`;

  const iconClass = (path: string) => 
    `h-4 w-4 transition-colors ${
      pathname === path ? "text-green-200" : "text-gray-400"
    }`;

  const handleNewChat = () => {
    if (pathname === "/chat") {
      window.location.reload(); 
    } else {
      router.push("/chat");
    }
    if (onCloseMobile) onCloseMobile();
  };

  const handleNavClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="flex w-64 h-full flex-col justify-between border-r border-green-100 bg-white/80 backdrop-blur-md shadow-sm" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <div>
        <div className="flex h-20 items-center justify-between border-b border-green-50 px-6">
          <Link href="/" className="flex items-center gap-2 cursor-pointer" onClick={handleNavClick}>
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-[20px] font-extrabold text-gray-900 tracking-tight">Corex <span className="text-green-600">AI</span></span>
          </Link>
          
          {/* Close button for mobile inside the sidebar */}
          <button 
            className="md:hidden text-gray-500 hover:text-gray-900" 
            onClick={onCloseMobile}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-4 py-6">
          
          {/* Prominent New Chat Button */}
          <button 
            onClick={handleNewChat}
            className="mb-6 flex items-center justify-center gap-2 rounded-full bg-gray-900 px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-green-700 shadow-md group"
          >
            <PlusCircle size={16} className="text-gray-400 group-hover:text-green-200 transition-colors" />
            New Chat Session
          </button>

          <div className="mb-2 mt-2 px-3 text-[10px] font-bold uppercase tracking-widest text-green-700">
            Student Workspace
          </div>
          
          {/* Dashboard Overview Removed for Users */}
          
          <Link href="/chat" className={linkClass("/chat")} onClick={handleNavClick}>
            <MessageSquare className={iconClass("/chat")} /> Academic RAG
          </Link>
          <Link href="/dashboard/history" className={linkClass("/dashboard/history")} onClick={handleNavClick}>
            <History className={iconClass("/dashboard/history")} /> Chat History
          </Link>

          {/* Conditional Admin Routing */}
          {isAdmin && (
            <>
              <div className="mb-2 mt-8 px-3 text-[10px] font-bold uppercase tracking-widest text-green-700">
                Admin Control
              </div>
              <Link href="/dashboard/admin/ingest" className={linkClass("/dashboard/admin/ingest")} onClick={handleNavClick}>
                <Database className={iconClass("/dashboard/admin/ingest")} /> Ingestion
              </Link>
              <Link href="/dashboard/admin/users" className={linkClass("/dashboard/admin/users")} onClick={handleNavClick}>
                <Users className={iconClass("/dashboard/admin/users")} /> Users
              </Link>
              <Link href="/dashboard/admin/ledger" className={linkClass("/dashboard/admin/ledger")} onClick={handleNavClick}>
                <Settings className={iconClass("/dashboard/admin/ledger")} /> System Ledger
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* User Profile & Logout */}
      <div className="border-t border-green-100 p-6 bg-white/50">
        <div className="mb-6 flex flex-col gap-1">
          <span className="text-[12px] font-bold text-gray-900 truncate uppercase tracking-wider">
            {user?.full_name || "Student User"}
          </span>
          <span className="text-[10px] font-bold text-gray-500 truncate uppercase tracking-widest">
            {user?.level} • {user?.pathway}
          </span>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-2 py-1 text-[8px] font-bold uppercase tracking-widest ${
              user?.account_type === 'pro' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 'bg-gray-100 text-gray-600 border border-gray-200'
            }`}>
              {user?.account_type || "Free"}
            </span>
            <span className={`inline-flex items-center rounded-full px-2 py-1 text-[8px] font-bold uppercase tracking-widest ${
              isAdmin ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-green-100 text-green-800 border border-green-200'
            }`}>
              {user?.role || "Student"}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-gray-700 shadow-sm hover:bg-red-50 hover:text-red-700 hover:border-red-100 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
      }

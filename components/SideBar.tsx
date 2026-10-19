"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { PlusCircle, MessageSquare, LayoutDashboard, History, Settings, Users, Database } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  const isAdmin = user?.role === "president" || user?.role === "superadmin";

  const linkClass = (path: string) =>
    `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      pathname === path
        ? "bg-slate-900 text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  // This forces a hard refresh on the chat route to clear state and start a new session
  const handleNewChat = () => {
    if (pathname === "/chat") {
      window.location.reload(); 
    } else {
      router.push("/chat");
    }
  };

  return (
    <aside className="flex w-64 flex-col justify-between border-r border-slate-200 bg-white shadow-sm">
      <div>
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6">
          <span className="text-xl font-bold tracking-tight text-slate-900">Corex.AI</span>
        </div>

        <nav className="flex flex-col gap-1 px-4 py-6">
          
          {/* Prominent New Chat Button */}
          <button 
            onClick={handleNewChat}
            className="mb-4 flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 shadow-sm"
          >
            <PlusCircle size={18} />
            New Chat Session
          </button>

          <div className="mb-2 mt-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Student Workspace
          </div>
          <Link href="/dashboard" className={linkClass("/dashboard")}>
            <LayoutDashboard size={18} /> Dashboard Overview
          </Link>
          <Link href="/chat" className={linkClass("/chat")}>
            <MessageSquare size={18} /> Academic RAG Assistant
          </Link>
          <Link href="/dashboard/history" className={linkClass("/dashboard/history")}>
            <History size={18} /> Chat History & Export
          </Link>

          {/* Conditional Admin Routing */}
          {isAdmin && (
            <>
              <div className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Admin Control
              </div>
              <Link href="/dashboard/admin/ingest" className={linkClass("/dashboard/admin/ingest")}>
                <Database size={18} /> Knowledge Ingestion
              </Link>
              <Link href="/dashboard/admin/users" className={linkClass("/dashboard/admin/users")}>
                <Users size={18} /> User Management
              </Link>
              <Link href="/dashboard/admin/ledger" className={linkClass("/dashboard/admin/ledger")}>
                <Settings size={18} /> System Ledger
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* User Profile & Logout */}
      <div className="border-t border-slate-200 p-4 bg-slate-50">
        <div className="mb-4 flex flex-col gap-1">
          <span className="text-sm font-bold text-slate-900 truncate">
            {user?.full_name || "Student User"}
          </span>
          <span className="text-xs font-medium text-slate-500 truncate">
            {user?.level} • {user?.pathway}
          </span>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              user?.account_type === 'pro' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-700'
            }`}>
              {user?.account_type || "Free"}
            </span>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              isAdmin ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {user?.role || "Student"}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
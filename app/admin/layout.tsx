"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuthStore from "../../lib/auth-store";
import { UploadCloud, Database, Sparkles, Menu, X } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  
  // Mobile sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Filtered Nav Links (Removed System Overview, Tenure Handoff, and Transaction Ledger)
  const navLinks = [
    { name: "Knowledge Ingestion", href: "/admin/documents", icon: UploadCloud },
    { name: "Past Questions Base", href: "/admin/questions", icon: Database },
  ];

  const closeSidebar = () => setIsMobileSidebarOpen(false);

  return (
    <div 
      className="relative flex h-screen overflow-hidden bg-white selection:bg-green-200 selection:text-green-900" 
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      {/* Background Splashes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] rounded-full bg-green-100/40 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[50%] rounded-full bg-yellow-100/30 blur-[120px]" />
      </div>

      {/* Mobile Header (Visible only on small screens) */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-green-100 z-30 flex items-center px-4">
        <button 
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 text-green-800 hover:bg-green-50 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="ml-3 flex items-center gap-2">
           <Sparkles className="w-4 h-4 text-green-600" />
           <span className="text-[16px] font-extrabold text-gray-900 tracking-tight">Admin Control</span>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Collapsible Sidebar */}
      <aside 
        className={`fixed md:relative inset-y-0 left-0 z-50 transform ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out w-64 border-r border-green-100 bg-white/95 backdrop-blur-xl px-4 py-8 shadow-sm flex flex-col`}
      >
        <div className="mb-10 px-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 cursor-pointer" onClick={closeSidebar}>
              <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-[20px] font-extrabold text-gray-900 tracking-tight leading-none">Corex <span className="text-green-600">AI</span></span>
            </Link>
            {/* Close button for mobile inside sidebar */}
            <button className="md:hidden text-gray-500 hover:text-gray-900" onClick={closeSidebar}>
              <X size={20} />
            </button>
          </div>
          
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-green-700 block">Admin Control</span>
            <p className="mt-1 text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed truncate">
              {user?.full_name || "Department Official"}
            </p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          {navLinks.map((link) => {
            const active = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/admin');
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeSidebar}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-wider transition-all ${
                  active 
                    ? "bg-green-700 text-white shadow-md shadow-green-700/20" 
                    : "text-gray-600 hover:bg-green-50 hover:text-green-900"
                }`}
              >
                <Icon className={`h-4 w-4 transition-colors ${active ? "text-green-200" : "text-gray-400 group-hover:text-green-600"}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 overflow-y-auto bg-white/40 backdrop-blur-3xl pt-20 md:pt-0">
        <div className="p-4 md:p-8 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}

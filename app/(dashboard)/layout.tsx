"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import Sidebar from "@/components/SideBar";
import { Sparkles, Menu } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  // State to manage mobile sidebar visibility
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  // Themed loading state
  if (!isMounted || !token) {
    return (
      <div 
        className="flex h-screen w-full items-center justify-center bg-white" 
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      >
        <div className="flex flex-col items-center gap-4 animate-pulse">
           <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-lg shadow-green-500/20">
             <Sparkles className="w-6 h-6 text-white" />
           </div>
           <div className="text-[10px] font-bold text-green-800 uppercase tracking-widest">
             Authenticating Corex AI...
           </div>
        </div>
      </div>
    );
  }

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
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Collapsible on Mobile */}
      <div 
        className={`fixed md:relative inset-y-0 left-0 z-50 transform ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar onCloseMobile={() => setIsMobileSidebarOpen(false)} />
      </div>
      
      {/* Main Content Area - Add top padding on mobile to account for the header */}
      <main className="relative z-10 flex-1 overflow-y-auto w-full bg-white/40 backdrop-blur-3xl pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store"; // Adjust import path
import Sidebar from "@/components/SideBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  // Prevent hydration mismatch on initial render
  if (!isMounted || !token) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="text-sm font-medium text-slate-500 animate-pulse">
          Authenticating Corex AI Workspace...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
}
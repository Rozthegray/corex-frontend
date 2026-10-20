"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuthStore from "../../lib/auth-store";
import { LayoutDashboard, UploadCloud, Database, Receipt, ArrowRightLeft, Sparkles } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const navLinks = [
    { name: "System Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Knowledge Ingestion", href: "/admin/documents", icon: UploadCloud },
    { name: "Past Questions Base", href: "/admin/questions", icon: Database },
    { name: "Transaction Ledger", href: "/admin/orders", icon: Receipt },
    { name: "Tenure Handoff", href: "/admin/tenure-handoff", icon: ArrowRightLeft },
  ];

  return (
    <div 
      className="relative flex min-h-screen bg-white selection:bg-green-200 selection:text-green-900" 
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      {/* Background Splashes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] rounded-full bg-green-100/40 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[50%] rounded-full bg-yellow-100/30 blur-[120px]" />
      </div>

      <aside className="relative z-20 w-64 border-r border-green-100 bg-white/80 backdrop-blur-md px-4 py-8 shadow-sm flex flex-col">
        
        <div className="mb-10 px-2 flex flex-col gap-6">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-[20px] font-extrabold text-gray-900 tracking-tight leading-none">Corex <span className="text-green-600">AI</span></span>
          </div>
          
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-green-700 block">Admin Control</span>
            <p className="mt-1 text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">
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

      <main className="relative z-10 flex-1 p-8 overflow-y-auto bg-white/40 backdrop-blur-3xl">
        {children}
      </main>
    </div>
  );
}
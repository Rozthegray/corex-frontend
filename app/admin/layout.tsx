"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuthStore from "../../lib/auth-store";
import { LayoutDashboard, UploadCloud, Database, Receipt, ArrowRightLeft } from "lucide-react";

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
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 border-r border-slate-200 bg-white px-4 py-6 shadow-sm">
        <div className="mb-8 px-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Corex AI Executive</span>
          <h2 className="text-lg font-bold text-slate-900">Admin Control</h2>
          <p className="mt-0.5 text-xs text-slate-500">{user?.full_name || "Department Official"}</p>
        </div>

        <nav className="space-y-1">
          {navLinks.map((link) => {
            const active = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/admin');
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                  active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-slate-300" : "text-slate-400"}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
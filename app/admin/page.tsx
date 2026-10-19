"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Activity, Users, Layers, Wallet, ArrowUpRight, Terminal, Clock } from "lucide-react";

interface SystemLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
}

interface AdminStats {
  users: number;
  documents: number;
  pinecone_vectors: number;
  finances: {
    total_revenue: number;
    reserve_wallet_80: number;
    president_stipend_20: number;
  };
  system_log: SystemLog[];
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const token = Cookies.get("access_token");
        const res = await fetch("http://localhost:8001/api/v1/admin/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error("Failed to authenticate or fetch telemetry");
        
        const data = await res.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchTelemetry();
  }, []);

  if (error) {
    return <div className="p-10 text-sm text-red-500 font-medium">Error: {error}</div>;
  }

  if (!stats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Activity className="h-5 w-5 animate-pulse text-blue-500" />
          Connecting to Corex AI telemetry...
        </div>
      </div>
    );
  }

  const kpis = [
    { title: "Registered Students", value: stats.users, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Indexed Documents", value: stats.documents, icon: Layers, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Pinecone Vectors", value: stats.pinecone_vectors, icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Gross Revenue", value: `₦${stats.finances.total_revenue.toLocaleString()}`, icon: Wallet, color: "text-slate-900", bg: "bg-slate-100" },
  ];

  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Platform Telemetry</h1>
          <p className="mt-1 text-sm text-slate-600">Live monitoring of RAG indices, student activity, and financial splits.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 border border-emerald-100">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          System Online
        </div>
      </div>

      {/* KPI Grid */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className={`rounded-md p-2 ${kpi.bg}`}>
                  <Icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">{kpi.title}</h3>
              </div>
              <p className="mt-4 text-2xl font-bold text-slate-900">{kpi.value}</p>
            </div>
          );
        })}
      </div>

      {/* Financial Split Visualizer */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Paystack Subaccount Dispersal</h3>
            <p className="text-xs text-slate-500 mt-1">Automated routing for platform maintenance and department executive stipend.</p>
          </div>
          <ArrowUpRight className="text-slate-400" size={20} />
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-6">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">80% Corex AI Reserve</span>
            <p className="mt-2 text-3xl font-black text-slate-800">
              ₦{stats.finances.reserve_wallet_80.toLocaleString()}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Allocated for Anthropic Claude API usage, OpenAI Image Generation, Pinecone Vector Database, and Cloudflare hosting.
            </p>
          </div>
          
          <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-6">
            <span className="text-xs font-bold uppercase tracking-wide text-emerald-600">20% President Stipend</span>
            <p className="mt-2 text-3xl font-black text-emerald-700">
              ₦{stats.finances.president_stipend_20.toLocaleString()}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-emerald-700/80">
              Routed instantly to the verified active departmental bank account during Paystack checkout. Handled via atomic tenure transfer.
            </p>
          </div>
        </div>
      </div>

      {/* System Activity Log */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 p-4">
          <Terminal size={18} className="text-slate-500" />
          <h3 className="text-sm font-bold text-slate-700">Live System Log</h3>
        </div>
        
        <div className="divide-y divide-slate-100">
          {stats.system_log.length > 0 ? (
            stats.system_log.map((log) => (
              <div key={log.id} className="flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors">
                <div className="mt-0.5 rounded-full bg-blue-100 p-1.5 text-blue-600">
                  <Activity size={14} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{log.action}</span>
                    <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                      <Clock size={12} />
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{log.details}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-sm text-slate-500">
              No recent system activity found.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
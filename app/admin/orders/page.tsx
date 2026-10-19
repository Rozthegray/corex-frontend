"use client";

import { useEffect, useState } from "react";
import { Api } from "@/lib/api-client";
import { CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";

export default function AdminOrdersPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Api.Admin.getTransactions()
      .then(setTransactions)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold text-slate-900">Transaction Ledger</h1>
      <p className="mt-1 text-sm text-slate-600">Audit trail of all student token purchases and subscriptions.</p>

      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Reference</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Student</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {loading ? (
              <tr><td colSpan={5} className="p-6 text-center text-sm text-slate-500">Loading ledger...</td></tr>
            ) : transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-6 py-4 text-xs font-mono text-slate-500">{tx.reference}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-900">{tx.student_name}</div>
                  <div className="text-xs text-slate-500">{tx.matric_number || "No Matric"}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-slate-900">
                  ₦{tx.amount.toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {tx.status === "successful" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Settled
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                      <Clock className="h-3.5 w-3.5" /> Pending
                    </span>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                  {format(new Date(tx.date), "MMM d, yyyy HH:mm")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
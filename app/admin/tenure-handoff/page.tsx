"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";

export default function AdminTenureHandoffPage() {
  const [form, setForm] = useState({
    successor_matric: "",
    successor_email: "",
    bank_code: "058", // GTBank default
    account_number: "",
    academic_session: "2026/2027",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      await apiClient.post("/admin/tenure-transfer", form);
      setStatus({
        type: "success",
        message: "Tenure successfully transferred. Subaccount provisioned; your administrative access is now revoked.",
      });
    } catch (err: any) {
      setStatus({
        type: "error",
        message: err.response?.data?.detail || "Tenure transfer failed. Verify successor matric and account details.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold text-slate-900">Department President Tenure Handoff</h1>
      <p className="mt-1 text-sm text-slate-600">
        Initiate succession to route the 20% management stipend to the next elected Department President and transfer administrative permissions.
      </p>

      {status && (
        <div
          className={`mt-4 rounded-md p-3 text-sm ${
            status.type === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
          }`}
        >
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700">Successor Matric Number</label>
          <input
            type="text"
            required
            value={form.successor_matric}
            onChange={(e) => setForm({ ...form, successor_matric: e.target.value })}
            placeholder="F/HD/25/3210099"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700">Successor Email Address</label>
          <input
            type="email"
            required
            value={form.successor_email}
            onChange={(e) => setForm({ ...form, successor_email: e.target.value })}
            placeholder="successor@institution.edu"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700">Bank Code</label>
            <select
              value={form.bank_code}
              onChange={(e) => setForm({ ...form, bank_code: e.target.value })}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
            >
              <option value="058">Guaranty Trust Bank</option>
              <option value="011">First Bank of Nigeria</option>
              <option value="033">United Bank for Africa</option>
              <option value="057">Zenith Bank</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700">Account Number</label>
            <input
              type="text"
              required
              maxLength={10}
              value={form.account_number}
              onChange={(e) => setForm({ ...form, account_number: e.target.value })}
              placeholder="0123456789"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700">New Academic Session</label>
          <input
            type="text"
            required
            value={form.academic_session}
            onChange={(e) => setForm({ ...form, academic_session: e.target.value })}
            placeholder="2026/2027"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          This operation acquires a distributed lock (`lock:tenure_transfer`) in Redis. Once confirmed, your account is
          reverted to standard student permissions.
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {loading ? "Re-provisioning Paystack Subaccount..." : "Execute Tenure Transition"}
        </button>
      </form>
    </div>
  );
}
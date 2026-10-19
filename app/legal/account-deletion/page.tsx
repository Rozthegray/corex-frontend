"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";

export default function AccountDeletionPage() {
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleDelete = async () => {
    if (confirmText !== "DELETE MY DATA") return;
    setLoading(true);
    setError("");

    try {
      await apiClient.delete("/legal/user");
      clearAuth();
      router.push("/login?message=account_purged");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to purge account. Please contact administrative council.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="mx-auto max-w-xl px-6 py-12">
      <h1 className="text-2xl font-bold text-red-600">Self-Serve Account Deletion</h1>
      <p className="mt-2 text-sm text-slate-600">
        Initiating this action permanently purges your account, removes your conversational RAG transcripts, deletes any
        compiled documents stored in R2, and anonymizes transaction receipts for auditing.
      </p>

      {error && <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="mt-8 rounded-lg border border-red-200 bg-red-50/50 p-6">
        <label className="block text-xs font-semibold uppercase text-slate-700">
          Type &quot;DELETE MY DATA&quot; to confirm:
        </label>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-red-600 focus:outline-none"
        />

        <button
          onClick={handleDelete}
          disabled={confirmText !== "DELETE MY DATA" || loading}
          className="mt-4 w-full rounded-md bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-40"
        >
          {loading ? "Purging Records..." : "Permanently Delete My Account"}
        </button>
      </div>
    </article>
  );
}
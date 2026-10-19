"use client";

export default function AdminAnalyticsPage() {
  const metrics = {
    totalRevenueNaira: "₦250,000.00",
    reserveReserveNaira: "₦200,000.00", // 80%
    presidentStipendNaira: "₦50,000.00", // 20%
    totalTokensConsumed: "4,821,900",
    totalStudentsActive: "520",
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900">Platform Analytics & Split Auditing</h1>
      <p className="mt-1 text-sm text-slate-600">
        Live tracking of subscription collections and automated Paystack subaccount distributions.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">Total Subscription Volume</span>
          <p className="mt-2 text-2xl font-bold text-slate-900">{metrics.totalRevenueNaira}</p>
          <span className="mt-1 block text-xs text-slate-500">From {metrics.totalStudentsActive} active accounts</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">80% Reserve Wallet</span>
          <p className="mt-2 text-2xl font-bold text-blue-600">{metrics.reserveReserveNaira}</p>
          <span className="mt-1 block text-xs text-slate-500">Reserved for Claude API & hosting</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">20% President Stipend</span>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{metrics.presidentStipendNaira}</p>
          <span className="mt-1 block text-xs text-slate-500">Disbursed automatically</span>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">Compute & Token Quotas</h3>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-sm font-medium text-slate-800">Claude Haiku RAG Tokens Processed</p>
            <p className="text-xs text-slate-500">Cumulative prompt synthesis & streaming completions</p>
          </div>
          <span className="text-base font-bold text-slate-900">{metrics.totalTokensConsumed}</span>
        </div>
      </div>
    </div>
  );
}
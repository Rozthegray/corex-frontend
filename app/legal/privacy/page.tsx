export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12 text-slate-800">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Data Privacy Policy</h1>
      <p className="mt-2 text-xs uppercase tracking-wider text-slate-500">Last Revised: October 2026</p>

      <section className="mt-8 space-y-4 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-slate-900">1. Information Collection Boundaries</h2>
        <p>
          The School Academic Archive RAG platform records student matriculation numbers, institution emails, session
          query transcripts, and Paystack transaction receipts strictly for authentication, authorization, and quota
          allocation.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">2. Foundation Model Ingestion Policy</h2>
        <p>
          Academic queries, uploaded notes, and laboratory reports submitted to this system are never utilized to train,
          fine-tune, or reinforce base commercial Large Language Models (such as Anthropic Claude or OpenAI models).
          Contextual vectors are cached strictly in local, departmental PostgreSQL pgvector stores.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">3. Retention & Erasure</h2>
        <p>
          Students maintain full sovereignty under local data protection laws. Initiating account deletion permanently
          drops all vector chunks, chat records, and personal references within 60 seconds.
        </p>
      </section>
    </article>
  );
}
export default function TermsOfServicePage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12 text-slate-800">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Terms of Service</h1>
      <p className="mt-2 text-xs uppercase tracking-wider text-slate-500">Effective Session: 2025/2026</p>

      <section className="mt-8 space-y-4 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-slate-900">1. Academic Integrity & Acceptable Use</h2>
        <p>
          This platform functions exclusively as a pedagogical indexing archive, laboratory methodology primer, and study
          synthesizer. Use of this service during active, supervised proctored examinations or mid-semester tests is
          strictly prohibited and subject to institutional disciplinary boards.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">2. Platform Rate Limits & Automated Scraping</h2>
        <p>
          Rate limits are enforced at the network edge via Redis token-bucket policies. Unsanctioned automated scrapers,
          denial-of-service bursts, or extraction bots targeting syllabus repositories will trigger automatic IP blacklisting
          and account suspension.
        </p>
      </section>
    </article>
  );
}
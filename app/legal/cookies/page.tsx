export default function CookieDisclosurePage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12 text-slate-800">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Cookie Governance & Storage</h1>
      <p className="mt-2 text-xs uppercase tracking-wider text-slate-500">Compliance Disclosure</p>

      <section className="mt-8 space-y-4 text-sm leading-relaxed">
        <p>
          We use strictly necessary cookies to ensure state persistence across our microservices architecture:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>access_token:</strong> An encrypted JSON Web Token storing user claims and active role permissions.
            Lifetime: 8 days.
          </li>
          <li>
            <strong>cookie_consent:</strong> Tracks acknowledgment of storage terms. Lifetime: 365 days.
          </li>
        </ul>
        <p>We do not operate third-party tracking, advertising pixels, or cross-domain behavioral monitors.</p>
      </section>
    </article>
  );
}
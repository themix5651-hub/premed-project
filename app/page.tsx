import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-20 px-4 py-16 sm:px-6 lg:px-8">

      {/* Hero */}
      <section className="flex flex-col items-center gap-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">
          Free · 2 minutes · No credit card required
        </p>
        <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
          Know exactly where your med school application stands.
        </h1>
        <p className="max-w-xl text-lg text-slate-600">
          My Premed Path scores your application across 9 categories — the same ones adcoms actually evaluate — and tells you exactly what to fix and how.
        </p>
        <Link
          href="/intake"
          className="inline-flex items-center justify-center rounded-lg bg-brand-700 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-brand-900"
        >
          Get My Free Score →
        </Link>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
          <span>✓ Calibrated against real AAMC matriculant data</span>
          <span>✓ Built by a premed student</span>
          <span>✓ Used by premeds at every stage</span>
        </div>
      </section>

      {/* How it works */}
      <section>
        <h2 className="mb-8 text-center text-xl font-bold text-slate-900">How it works</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { step: '1', title: 'Fill out your stats', description: 'Takes 2 minutes' },
            { step: '2', title: 'Get your readiness score', description: '0–100 across 9 categories' },
            { step: '3', title: 'See exactly what to fix', description: 'Specific next steps, not generic advice' },
          ].map(({ step, title, description }) => (
            <div key={step} className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-sm font-bold text-white">
                {step}
              </span>
              <p className="font-semibold text-slate-900">{title}</p>
              <p className="text-sm text-slate-500">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Urgency */}
      <section className="rounded-xl border border-slate-200 bg-slate-50 px-8 py-8 text-center">
        <p className="text-base leading-relaxed text-slate-700">
          Most premeds don&apos;t find out their application is weak until it&apos;s too late. My Premed Path tells you now — while you still have time to fix it.
        </p>
      </section>

    </div>
  );
}

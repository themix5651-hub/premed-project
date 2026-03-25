import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

const features = [
  {
    title: 'Readiness Snapshot',
    description: 'Get an immediate score and clear summary of where your application currently stands.'
  },
  {
    title: 'Gap Detector',
    description: 'Quickly identify missing experiences like clinical, shadowing, research, or leadership.'
  },
  {
    title: 'Action Plan',
    description: 'Follow a focused 30-day plan tailored to your top priorities and timeline.'
  }
];

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-12 sm:px-6 lg:px-8">
      <section className="rounded-2xl bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 px-6 py-12 text-white shadow-lg sm:px-10">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-brand-100">Premed planning, simplified</p>
        <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">
          Know exactly what your med school application is missing.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-brand-50 sm:text-lg">
          Premed Path analyzes your profile to reveal strengths, gaps, and the smartest next steps so you can apply with confidence.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button href="/intake" className="bg-white text-brand-700 hover:bg-brand-50">
            Get My Report
          </Button>
          <Button href="/dashboard" variant="secondary" className="border-white/50 bg-white/10 text-white hover:bg-white/20">
            View Dashboard
          </Button>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold text-slate-900">How Premed Path helps</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} title={feature.title} className="h-full">
              <p className="text-sm leading-relaxed text-slate-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

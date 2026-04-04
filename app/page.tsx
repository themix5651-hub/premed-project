import { Button } from '../components/Button';
import { Card } from '../components/Card';

const features = [
  {
    title: 'Readiness Score',
    description: 'Get a score from 0–100 across GPA, MCAT, clinical hours, shadowing, research, leadership, and more — calibrated against real MD applicant data.'
  },
  {
    title: 'Category Breakdown',
    description: 'See exactly which categories are Competitive, Developing, or Needs Work with color-coded bars for each area adcoms evaluate.'
  },
  {
    title: 'Personalized Next Steps',
    description: 'Every category gives you 3 specific action items based on where you stand — not generic advice, but targeted steps for your exact profile.'
  }
];

const trackingCategories = [
  'GPA', 'MCAT', 'Clinical Experience', 'Physician Shadowing', 'Community Service',
  'Research', 'Leadership', 'Extracurriculars', 'Letters of Recommendation'
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
          My Premed Path scores your application across 9 categories adcoms actually evaluate — then tells you exactly what to do next.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button href="/intake" className="bg-brand-900 text-white hover:bg-brand-700">
            Get My Report
          </Button>
          <Button href="/dashboard" variant="secondary" className="border-white/50 bg-white/10 text-white hover:bg-white/20">
            View Dashboard
          </Button>
        </div>
        <p className="mt-4 text-sm text-brand-100">Free to use · No credit card required · Built for MD applicants</p>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold text-slate-900">How My Premed Path helps</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} title={feature.title} className="h-full">
              <p className="text-sm leading-relaxed text-slate-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-slate-900">What premeds are tracking</h2>
        <div className="flex flex-wrap gap-2">
          {trackingCategories.map((category) => (
            <span key={category} className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800">
              {category}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

const previousReports = [
  { id: 'RPT-2081', date: 'March 12, 2026', score: 68, focus: 'Increase clinical and shadowing consistency' },
  { id: 'RPT-1934', date: 'February 03, 2026', score: 63, focus: 'Build volunteering depth + leadership' },
  { id: 'RPT-1788', date: 'January 09, 2026', score: 58, focus: 'Academic trend and MCAT planning' }
];

export default function DashboardPage() {
  const latest = {
    date: 'March 20, 2026',
    score: 74,
    summary: 'Momentum is strong. Keep building weekly clinical exposure and finalize MCAT timing.'
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, future physician.</h1>
          <p className="mt-1 text-sm text-slate-600">Track your progress and review your readiness reports.</p>
        </div>
        <Button href="/intake">Create New Report</Button>
      </div>

      <Card title="Most Recent Report" className="border-brand-100 bg-brand-50">
        <p className="text-sm text-brand-900">Generated on {latest.date}</p>
        <p className="mt-2 text-3xl font-bold text-brand-900">{latest.score}/100</p>
        <p className="mt-2 text-sm text-brand-900">{latest.summary}</p>
      </Card>

      <Card title="Previous Reports">
        <ul className="space-y-3">
          {previousReports.map((report) => (
            <li key={report.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-slate-800">{report.id}</p>
                <p className="text-sm text-slate-500">{report.date}</p>
              </div>
              <p className="mt-1 text-sm text-slate-700">Score: {report.score}/100</p>
              <p className="mt-1 text-sm text-slate-600">Focus: {report.focus}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

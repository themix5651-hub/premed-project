import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { generateReport } from '@/lib/reportLogic';
import { IntakeData } from '@/lib/types';

const parseNumber = (value: string | undefined, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export default function ResultsPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const data: IntakeData = {
    gpa: parseNumber(searchParams.gpa as string, 3.5),
    schoolYear: (searchParams.schoolYear as IntakeData['schoolYear']) ?? 'Junior',
    clinicalHours: parseNumber(searchParams.clinicalHours as string),
    shadowingHours: parseNumber(searchParams.shadowingHours as string),
    volunteeringHours: parseNumber(searchParams.volunteeringHours as string),
    researchHours: parseNumber(searchParams.researchHours as string),
    leadershipExperiences: parseNumber(searchParams.leadershipExperiences as string),
    mcatStatus: (searchParams.mcatStatus as IntakeData['mcatStatus']) ?? 'Planning',
    targetApplicationYear: parseNumber(searchParams.targetApplicationYear as string, new Date().getFullYear() + 1)
  };

  const report = generateReport(data);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Readiness Report</h1>
          <p className="mt-1 text-sm text-slate-600">Deterministic MVP analysis based on your submitted profile.</p>
        </div>
        <Button href="/intake" variant="secondary">
          Re-run Intake
        </Button>
      </div>

      <Card className="bg-gradient-to-r from-brand-900 to-brand-700 text-white">
        <p className="text-sm uppercase tracking-wider text-brand-100">Readiness score</p>
        <p className="mt-2 text-4xl font-bold">{report.readinessScore}/100</p>
        <p className="mt-3 max-w-2xl text-sm text-brand-50">{report.summary}</p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Top Strengths">
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
            {report.strengths.map((strength) => (
              <li key={strength}>{strength}</li>
            ))}
          </ul>
        </Card>

        <Card title="Weak Spots">
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
            {report.weakSpots.map((spot) => (
              <li key={spot}>{spot}</li>
            ))}
          </ul>
        </Card>

        <Card title="Top Priorities">
          <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
            {report.priorities.map((priority) => (
              <li key={priority}>{priority}</li>
            ))}
          </ol>
        </Card>
      </div>

      <Card title="30-Day Action Plan">
        <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-slate-700">
          {report.actionPlan.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

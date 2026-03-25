'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { McatStatus, SchoolYear } from '@/lib/types';

const schoolYears: SchoolYear[] = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Gap Year'];
const mcatOptions: McatStatus[] = ['Not taken', 'Planning', 'Taken'];

const currentYear = new Date().getFullYear();

export default function IntakePage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const parsed = {
      gpa: Number(formData.get('gpa')),
      schoolYear: String(formData.get('schoolYear')),
      clinicalHours: Number(formData.get('clinicalHours')),
      shadowingHours: Number(formData.get('shadowingHours')),
      volunteeringHours: Number(formData.get('volunteeringHours')),
      researchHours: Number(formData.get('researchHours')),
      leadershipExperiences: Number(formData.get('leadershipExperiences')),
      mcatStatus: String(formData.get('mcatStatus')),
      targetApplicationYear: Number(formData.get('targetApplicationYear'))
    };

    if (parsed.gpa < 0 || parsed.gpa > 4) {
      setError('GPA must be between 0.0 and 4.0.');
      return;
    }

    if (parsed.targetApplicationYear < currentYear || parsed.targetApplicationYear > currentYear + 8) {
      setError(`Please choose a realistic application year between ${currentYear} and ${currentYear + 8}.`);
      return;
    }

    setError('');

    const params = new URLSearchParams();
    Object.entries(parsed).forEach(([key, value]) => params.set(key, String(value)));
    router.push(`/results?${params.toString()}`);
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Card className="p-8">
        <h1 className="text-2xl font-bold text-slate-900">Premed Intake Form</h1>
        <p className="mt-2 text-sm text-slate-600">Share your current profile to generate a focused readiness report.</p>

        <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            GPA
            <input name="gpa" type="number" min="0" max="4" step="0.01" required className="rounded-lg border border-slate-300 px-3 py-2" />
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-700">
            School year
            <select name="schoolYear" required className="rounded-lg border border-slate-300 px-3 py-2">
              {schoolYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Clinical hours
              <input name="clinicalHours" type="number" min="0" required className="rounded-lg border border-slate-300 px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Shadowing hours
              <input name="shadowingHours" type="number" min="0" required className="rounded-lg border border-slate-300 px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Volunteering hours
              <input name="volunteeringHours" type="number" min="0" required className="rounded-lg border border-slate-300 px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Research hours
              <input name="researchHours" type="number" min="0" required className="rounded-lg border border-slate-300 px-3 py-2" />
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Number of leadership experiences
              <input name="leadershipExperiences" type="number" min="0" required className="rounded-lg border border-slate-300 px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              MCAT status
              <select name="mcatStatus" required className="rounded-lg border border-slate-300 px-3 py-2">
                {mcatOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Target application year
            <input
              name="targetApplicationYear"
              type="number"
              min={currentYear}
              max={currentYear + 8}
              defaultValue={currentYear + 1}
              required
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

          <div className="flex items-center justify-end gap-3">
            <Button href="/" variant="secondary">
              Cancel
            </Button>
            <Button type="submit">Generate Results</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

type McatStatus = 'Planning' | 'Registered' | 'Taken';
type SchoolYear = 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Gap Year';

export default function IntakePage() {
  const router = useRouter();

  const [gpa, setGpa] = useState('');
  const [scienceGpa, setScienceGpa] = useState('');
  const [schoolYear, setSchoolYear] = useState<SchoolYear>('Junior');
  const [clinicalHours, setClinicalHours] = useState('');
  const [shadowingHours, setShadowingHours] = useState('');
  const [volunteeringHours, setVolunteeringHours] = useState('');
  const [researchHours, setResearchHours] = useState('');
  const [leadershipExperiences, setLeadershipExperiences] = useState('');
  const [extracurriculars, setExtracurriculars] = useState('');
  const [lettersOfRec, setLettersOfRec] = useState('');
  const [mcatStatus, setMcatStatus] = useState<McatStatus>('Planning');
  const [mcatScore, setMcatScore] = useState('');
  const [targetApplicationYear, setTargetApplicationYear] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams({
      gpa,
      scienceGpa,
      schoolYear,
      clinicalHours,
      shadowingHours,
      volunteeringHours,
      researchHours,
      leadershipExperiences,
      extracurriculars,
      lettersOfRec,
      mcatStatus,
      mcatScore,
      targetApplicationYear,
    });

    router.push(`/results?${params.toString()}`);
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Fill out this 2-minute form.</h1>
        <p className="mt-2 text-base text-slate-600">
          Answer honestly — the more accurate your inputs, the more useful your score. This could be the most important 2 minutes of your premed journey.
        </p>
      </div>

      <Card title="Your stats">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">GPA</label>
              <input
                type="number"
                min="0"
                max="4"
                step="0.01"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                placeholder="3.75"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Science GPA</label>
              <input
                type="number"
                min="0"
                max="4"
                step="0.01"
                value={scienceGpa}
                onChange={(e) => setScienceGpa(e.target.value)}
                placeholder="3.68"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">School year</label>
            <select
              value={schoolYear}
              onChange={(e) => setSchoolYear(e.target.value as SchoolYear)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none"
            >
              <option>Freshman</option>
              <option>Sophomore</option>
              <option>Junior</option>
              <option>Senior</option>
              <option>Gap Year</option>
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Clinical hours</label>
              <input
                value={clinicalHours}
                onChange={(e) => setClinicalHours(e.target.value)}
                placeholder="120"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none"
                required
              />
              <p className="mt-1 text-xs text-slate-400">Include scribing, EMT, CNA, hospital volunteering with patient contact</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Shadowing hours</label>
              <input
                value={shadowingHours}
                onChange={(e) => setShadowingHours(e.target.value)}
                placeholder="40"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none"
                required
              />
              <p className="mt-1 text-xs text-slate-400">Observing physicians — does not count as clinical</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Community service hours</label>
              <input
                value={volunteeringHours}
                onChange={(e) => setVolunteeringHours(e.target.value)}
                placeholder="80"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none"
                required
              />
              <p className="mt-1 text-xs text-slate-400">Non-clinical service — free clinics, tutoring, food banks, mentorship</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Research hours</label>
              <input
                value={researchHours}
                onChange={(e) => setResearchHours(e.target.value)}
                placeholder="60"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none"
                required
              />
              <p className="mt-1 text-xs text-slate-400">Lab work, clinical research, data analysis, literature reviews</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Leadership experiences</label>
              <input
                type="number"
                min="0"
                value={leadershipExperiences}
                onChange={(e) => setLeadershipExperiences(e.target.value)}
                placeholder="2"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none"
                required
              />
              <p className="mt-1 text-xs text-slate-400">Clubs, organizations, teams where you held a formal role</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Extracurricular activities</label>
              <input
                type="number"
                min="0"
                value={extracurriculars}
                onChange={(e) => setExtracurriculars(e.target.value)}
                placeholder="3"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none"
                required
              />
              <p className="mt-1 text-xs text-slate-400">Sustained activities outside of clinical/research — sports, music, etc.</p>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Letters of recommendation secured or committed</label>
            <input
              type="number"
              min="0"
              value={lettersOfRec}
              onChange={(e) => setLettersOfRec(e.target.value)}
              placeholder="2"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none"
              required
            />
            <p className="mt-1 text-xs text-slate-400">Professors, physicians, research mentors who have agreed or you plan to ask</p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">MCAT status</label>
            <select
              value={mcatStatus}
              onChange={(e) => setMcatStatus(e.target.value as McatStatus)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none"
            >
              <option>Planning</option>
              <option>Registered</option>
              <option>Taken</option>
            </select>
          </div>

          {mcatStatus === 'Taken' ? (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">MCAT score</label>
              <input
                type="number"
                min="472"
                max="528"
                value={mcatScore}
                onChange={(e) => setMcatScore(e.target.value)}
                placeholder="510"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none"
                required
              />
            </div>
          ) : null}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Target application year</label>
            <input
              value={targetApplicationYear}
              onChange={(e) => setTargetApplicationYear(e.target.value)}
              placeholder="2027"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none"
              required
            />
          </div>

          <div className="pt-2">
            <Button type="submit">Generate My Free Score →</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

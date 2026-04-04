'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { supabase } from '../../lib/supabase';

type SearchParams = {
  gpa?: string;
  scienceGpa?: string;
  schoolYear?: string;
  clinicalHours?: string;
  shadowingHours?: string;
  volunteeringHours?: string;
  researchHours?: string;
  leadershipExperiences?: string;
  mcatStatus?: string;
  mcatScore?: string;
  targetApplicationYear?: string;
};

type CategoryBar = {
  label: string;
  percent: number;
  status: 'Strong' | 'Competitive' | 'Developing' | 'Needs Work' | 'Critical';
};

type ResultsClientProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

function toValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function toNumber(value: string | undefined) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function buildCategory(label: string, percent: number, status: CategoryBar['status']): CategoryBar {
  return { label, percent, status };
}

function getStatusClasses(status: CategoryBar['status']) {
  if (status === 'Strong') return { fill: 'bg-green-700', text: 'text-green-700' };
  if (status === 'Competitive') return { fill: 'bg-green-500', text: 'text-green-600' };
  if (status === 'Developing') return { fill: 'bg-amber-400', text: 'text-amber-600' };
  if (status === 'Needs Work') return { fill: 'bg-red-500', text: 'text-red-500' };
  return { fill: 'bg-red-900', text: 'text-red-900' }; // Critical
}

function generateReport(params: SearchParams) {
  const cgpa = toNumber(params.gpa);
  const sgpa = toNumber(params.scienceGpa);
  const effectiveGpa = sgpa > 0 ? Math.min(cgpa, sgpa) : cgpa;
  const clinical = toNumber(params.clinicalHours);
  const shadowing = toNumber(params.shadowingHours);
  const volunteering = toNumber(params.volunteeringHours);
  const research = toNumber(params.researchHours);
  const leadership = toNumber(params.leadershipExperiences);
  const mcatStatus = params.mcatStatus ?? 'Planning';
  const mcatScore = toNumber(params.mcatScore);

  // Tier → numeric score mapping
  const tierScore: Record<string, number> = { Strong: 92, Competitive: 72, Developing: 48, 'Needs Work': 22, Critical: 8 };

  const gpaTier =
    effectiveGpa >= 3.85 ? 'Strong' : effectiveGpa >= 3.7 ? 'Competitive' : effectiveGpa >= 3.5 ? 'Developing' : effectiveGpa >= 3.2 ? 'Needs Work' : 'Critical';
  const mcatTier =
    mcatStatus !== 'Taken' ? 'Critical' : mcatScore >= 517 ? 'Strong' : mcatScore >= 511 ? 'Competitive' : mcatScore >= 505 ? 'Developing' : mcatScore >= 500 ? 'Needs Work' : 'Critical';
  const clinicalTier =
    clinical >= 500 ? 'Strong' : clinical >= 200 ? 'Competitive' : clinical >= 100 ? 'Developing' : clinical >= 50 ? 'Needs Work' : 'Critical';
  const shadowingTier =
    shadowing >= 100 ? 'Strong' : shadowing >= 60 ? 'Competitive' : shadowing >= 30 ? 'Developing' : shadowing >= 15 ? 'Needs Work' : 'Critical';
  const volunteeringTier =
    volunteering >= 250 ? 'Strong' : volunteering >= 100 ? 'Competitive' : volunteering >= 50 ? 'Developing' : volunteering >= 20 ? 'Needs Work' : 'Critical';
  const researchTier =
    research >= 400 ? 'Strong' : research >= 200 ? 'Competitive' : research >= 100 ? 'Developing' : research >= 50 ? 'Needs Work' : 'Critical';
  const leadershipTier =
    leadership >= 3 ? 'Strong' : leadership >= 2 ? 'Competitive' : leadership >= 1 ? 'Developing' : 'Critical';

  // Weights: MCAT 25%, GPA 20%, Clinical 15%, LOR 10%, Research 10%, Shadowing 7%, Service 6%, Leadership 4%, Extracurriculars 3%
  // LOR and Extracurriculars are not captured at intake so default to Critical (8)
  const score = Math.round(
    tierScore[mcatTier] * 0.25 +
    tierScore[gpaTier] * 0.20 +
    tierScore[clinicalTier] * 0.15 +
    8 * 0.10 + // Letters of Recommendation — not in intake
    tierScore[researchTier] * 0.10 +
    tierScore[shadowingTier] * 0.07 +
    tierScore[volunteeringTier] * 0.06 +
    tierScore[leadershipTier] * 0.04 +
    8 * 0.03   // Extracurriculars — not in intake
  );

  const strengths: string[] = [];
  const weakSpots: string[] = [];
  const priorities: string[] = [];
  const actionPlan: string[] = [];

  if (effectiveGpa >= 3.6) strengths.push('Your academic metrics currently clear a competitive baseline.');
  else if (effectiveGpa >= 3.4) strengths.push('Your GPA remains workable and gives the rest of the application something to build from.');
  else weakSpots.push('The lower of your cumulative and science GPA is below a comfortable range for a strong cycle.');

  if (clinical >= 100) strengths.push('Your clinical exposure shows meaningful patient-facing involvement.');
  else {
    weakSpots.push('Clinical experience is still too light to convincingly show durable patient-facing commitment.');
    priorities.push('Increase clinical volume');
    actionPlan.push('Add a steady patient-facing role and build weekly clinical hours instead of relying on short bursts.');
  }

  if (shadowing >= 20) strengths.push('Your physician shadowing supports a more informed interest in medicine.');
  else {
    weakSpots.push('Shadowing is limited, so the application still lacks enough direct observation of physicians.');
    priorities.push('Increase shadowing');
    actionPlan.push('Set up multiple shadowing sessions over the next month and log them by specialty and date.');
  }

  if (volunteering >= 75) strengths.push('Your service work adds a credible community-facing dimension.');
  else if (volunteering < 25) {
    weakSpots.push('Community service is thin and does not yet show sustained service orientation.');
    priorities.push('Build non-clinical service');
    actionPlan.push('Commit to one recurring non-clinical service role and maintain it long enough to show continuity.');
  }

  if (research >= 50) strengths.push('Your research experience adds useful academic depth to the profile.');
  else if (research === 0) {
    weakSpots.push('Research is absent, which limits breadth for research-oriented schools.');
    priorities.push('Add research exposure');
    actionPlan.push('Reach out to a faculty mentor or lab and secure a regular research commitment.');
  }

  if (leadership >= 1) strengths.push('Your leadership experience shows some ability to take ownership and work with others.');
  else {
    weakSpots.push('Leadership is minimal, making the profile feel more observational than accountable.');
    priorities.push('Build leadership responsibility');
    actionPlan.push('Pursue one role where you coordinate people, operations, or projects rather than only participating.');
  }

  if (mcatStatus === 'Taken') {
    if (mcatScore >= 511) strengths.push('Your MCAT helps reinforce academic readiness.');
    else if (mcatScore < 500) {
      weakSpots.push('The current MCAT score is a meaningful academic concern.');
      priorities.push('Rework MCAT preparation');
      actionPlan.push('Build a structured retake plan around full-length exams, review cycles, and a realistic target score.');
    }
  } else {
    weakSpots.push('Without a completed MCAT, one major academic checkpoint is still missing from the profile.');
  }

  if (effectiveGpa < 3.4 && clinical < 50) {
    weakSpots.push('Lower GPA combined with very limited clinical exposure creates a compounded readiness problem.');
    priorities.push('Address GPA and clinical exposure together');
    actionPlan.push('Put academic repair and patient-facing hours ahead of lower-priority resume-building activities.');
  }

  if (clinical < 50 && shadowing < 15) {
    weakSpots.push('Clinical experience and shadowing are both too limited to show informed commitment to medicine.');
    priorities.push('Raise direct medical exposure');
    actionPlan.push('Build both clinical hours and shadowing together so the profile gains substance quickly.');
  }

  if (research > 100 && clinical < 50) {
    weakSpots.push('The profile leans too heavily on research relative to direct patient exposure.');
    priorities.push('Rebalance toward patient-facing work');
    actionPlan.push('Keep research stable, but shift the next block of effort into consistent clinical experience.');
  }

  const strengthFallbacks = [
    'You have an early foundation that can become more competitive with consistent execution.',
    'Several parts of the profile are moving in the right direction even if the overall picture is still uneven.',
    'There is enough momentum here to improve the application meaningfully over the next few months.',
  ];
  const backupWeakSpots = [
    'No critical weak spots stand out at this stage, but continued consistency still matters.',
    'Keep deepening your strongest experiences rather than only adding new ones.',
    'Make sure your application narrative clearly connects your preparation to your motivation for medicine.',
  ];
  const backupPriorities = [
    'Maintain consistency across your strongest academic and experiential areas.',
    'Deepen your most meaningful commitments instead of spreading effort too broadly.',
    'Refine how you present your experiences so the application reads as cohesive and intentional.',
  ];
  const backupActionPlan = [
    'Keep your current commitments steady and continue tracking progress across each category.',
    'Use the next month to deepen one or two high-value activities instead of adding low-yield extras.',
    'Start drafting reflection notes so your personal narrative is easier to articulate when you apply.',
  ];

  for (const fallback of strengthFallbacks) {
    if (strengths.length >= 3) break;
    if (!strengths.includes(fallback)) strengths.push(fallback);
  }

  while (weakSpots.length < 3) {
    weakSpots.push(backupWeakSpots[weakSpots.length]);
  }
  while (priorities.length < 3) {
    priorities.push(backupPriorities[priorities.length]);
  }
  while (actionPlan.length < 3) {
    actionPlan.push(backupActionPlan[actionPlan.length]);
  }

  let summary = 'Your application currently reads as early-stage, with several core signals still needing stronger support.';
  if (score >= 80) summary = 'Your profile reads as strong across the major admissions categories and already looks meaningfully competitive.';
  else if (score >= 65) summary = 'Your profile is competitive in several important areas, though a few visible gaps still remain.';
  else if (score >= 45) summary = 'Your application has some credible strengths, but committees would still see clear areas that need more development.';
  else if (score >= 25) summary = 'Your profile shows some progress, but it still reads as underdeveloped in multiple high-signal categories.';

  let signal = 'A high-risk applicant profile that currently signals limited readiness for a strong medical school application cycle.';
  if (score >= 80) signal = 'A strong applicant who already signals academic readiness, substantive exposure, and credible preparation for applying.';
  else if (score >= 65) signal = 'A competitive applicant with a believable path to a solid cycle, though some weaknesses are still visible.';
  else if (score >= 45) signal = 'A developing applicant whose profile has real traction, but still leaves meaningful questions about readiness.';
  else if (score >= 25) signal = 'A developing applicant whose current record still signals uneven preparation across key premed categories.';

  const categories: CategoryBar[] = [
    effectiveGpa >= 3.85
      ? buildCategory('GPA', 100, 'Strong')
      : effectiveGpa >= 3.7
        ? buildCategory('GPA', 82, 'Competitive')
        : effectiveGpa >= 3.5
          ? buildCategory('GPA', 62, 'Developing')
          : effectiveGpa >= 3.2
            ? buildCategory('GPA', 38, 'Needs Work')
            : buildCategory('GPA', 15, 'Critical'),
    mcatStatus !== 'Taken'
      ? buildCategory('MCAT', 15, 'Critical')
      : mcatScore >= 517
        ? buildCategory('MCAT', 100, 'Strong')
        : mcatScore >= 511
          ? buildCategory('MCAT', 82, 'Competitive')
          : mcatScore >= 505
            ? buildCategory('MCAT', 62, 'Developing')
            : mcatScore >= 500
              ? buildCategory('MCAT', 38, 'Needs Work')
              : buildCategory('MCAT', 15, 'Critical'),
    clinical >= 500
      ? buildCategory('Clinical experience', 100, 'Strong')
      : clinical >= 200
        ? buildCategory('Clinical experience', 80, 'Competitive')
        : clinical >= 100
          ? buildCategory('Clinical experience', 60, 'Developing')
          : clinical >= 50
            ? buildCategory('Clinical experience', 35, 'Needs Work')
            : buildCategory('Clinical experience', 15, 'Critical'),
    shadowing >= 100
      ? buildCategory('Physician shadowing', 100, 'Strong')
      : shadowing >= 60
        ? buildCategory('Physician shadowing', 80, 'Competitive')
        : shadowing >= 30
          ? buildCategory('Physician shadowing', 60, 'Developing')
          : shadowing >= 15
            ? buildCategory('Physician shadowing', 35, 'Needs Work')
            : buildCategory('Physician shadowing', 15, 'Critical'),
    volunteering >= 250
      ? buildCategory('Community service', 100, 'Strong')
      : volunteering >= 100
        ? buildCategory('Community service', 80, 'Competitive')
        : volunteering >= 50
          ? buildCategory('Community service', 60, 'Developing')
          : volunteering >= 20
            ? buildCategory('Community service', 35, 'Needs Work')
            : buildCategory('Community service', 15, 'Critical'),
    research >= 400
      ? buildCategory('Research', 100, 'Strong')
      : research >= 200
        ? buildCategory('Research', 80, 'Competitive')
        : research >= 100
          ? buildCategory('Research', 60, 'Developing')
          : research >= 50
            ? buildCategory('Research', 35, 'Needs Work')
            : buildCategory('Research', 15, 'Critical'),
    leadership >= 3
      ? buildCategory('Leadership', 100, 'Strong')
      : leadership >= 2
        ? buildCategory('Leadership', 80, 'Competitive')
        : leadership >= 1
          ? buildCategory('Leadership', 55, 'Developing')
          : buildCategory('Leadership', 15, 'Critical'),
    buildCategory('Extracurriculars', 15, 'Critical'),
    buildCategory('Letters of Recommendation', 15, 'Critical'),
  ];

  const tier =
    score >= 80
      ? { label: 'Strong', classes: 'bg-green-100 text-green-700' }
      : score >= 65
        ? { label: 'Competitive', classes: 'bg-green-50 text-green-600' }
        : score >= 45
          ? { label: 'Developing', classes: 'bg-amber-50 text-amber-700' }
          : score >= 25
            ? { label: 'Needs Work', classes: 'bg-orange-50 text-red-600' }
            : { label: 'Critical', classes: 'bg-red-100 text-red-900' };

  return {
    score,
    summary,
    strengths,
    weakSpots: weakSpots.slice(0, 3),
    priorities: priorities.slice(0, 3),
    actionPlan: actionPlan.slice(0, 3),
    signal,
    categories,
    tier,
  };
}

export default function ResultsClient({ searchParams }: ResultsClientProps) {
  const [saveMessage, setSaveMessage] = useState('');

  const params = useMemo<SearchParams>(
    () => ({
      gpa: toValue(searchParams.gpa),
      scienceGpa: toValue(searchParams.scienceGpa),
      schoolYear: toValue(searchParams.schoolYear),
      clinicalHours: toValue(searchParams.clinicalHours),
      shadowingHours: toValue(searchParams.shadowingHours),
      volunteeringHours: toValue(searchParams.volunteeringHours),
      researchHours: toValue(searchParams.researchHours),
      leadershipExperiences: toValue(searchParams.leadershipExperiences),
      mcatStatus: toValue(searchParams.mcatStatus),
      mcatScore: toValue(searchParams.mcatScore),
      targetApplicationYear: toValue(searchParams.targetApplicationYear),
    }),
    [searchParams]
  );

  const report = useMemo(() => generateReport(params), [params]);
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    async function saveReport() {
      if (!paramsKey) return;

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) return;

      const { error } = await supabase.from('profiles').upsert(
        {
          id: user.id,
          reports: {
            savedAt: new Date().toISOString(),
            inputs: params,
            score: report.score,
            summary: report.summary,
            signal: report.signal,
            categories: report.categories,
          },
        },
        { onConflict: 'id' }
      );

      if (error) {
        setSaveMessage('We could not save this report to your dashboard yet.');
        return;
      }

      setSaveMessage('Latest report saved to your dashboard.');
    }

    saveReport();
  }, [paramsKey, params, report]);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <Card title="Readiness Score" className="border-brand-100 bg-brand-50">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-5xl font-bold text-brand-900">{report.score}/100</p>
          <span className={`rounded-full px-3 py-1 text-sm font-medium ${report.tier.classes}`}>
            {report.tier.label}
          </span>
        </div>
      </Card>

      <Card title="Category breakdown">
        <div className="space-y-4">
          {report.categories.map((category) => {
            const statusClasses = getStatusClasses(category.status);

            return (
              <div key={category.label} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-slate-700">{category.label}</span>
                  <span className={`font-medium ${statusClasses.text}`}>{category.status}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                  <div className={`h-full rounded-full ${statusClasses.fill}`} style={{ width: `${category.percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-green-700" />
            <span>Strong</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span>Competitive</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span>Developing</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span>Needs Work</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-900" />
            <span>Critical</span>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your readiness report</h1>
          <p className="mt-1 text-sm text-slate-600">{report.summary}</p>
          {saveMessage ? <p className="mt-2 text-sm text-slate-500">{saveMessage}</p> : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href="/dashboard" variant="secondary">Log new activity</Button>
          <Button href="/intake">Edit Inputs</Button>
        </div>
      </div>

      <Card title="What your application currently signals">
        <p className="text-sm text-slate-700">{report.signal}</p>
      </Card>

      <Card title="Strengths">
        <ul className="space-y-2 text-sm text-slate-700">
          {report.strengths.slice(0, 3).map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </Card>

      <Card title="Weak Spots">
        <ul className="space-y-2 text-sm text-slate-700">
          {report.weakSpots.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </Card>

      <Card title="Top 3 Priorities">
        <ul className="space-y-2 text-sm text-slate-700">
          {report.priorities.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </Card>

      <Card title="30-Day Action Plan">
        <ul className="space-y-2 text-sm text-slate-700">
          {report.actionPlan.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </Card>

      <Card title="Your baseline report">
        <p className="mb-4 text-sm text-slate-600">
          These are the stats you entered when you first built your report. Your category bars reflect your current totals as you log new activity.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-slate-700">GPA</p>
            <p className="text-sm text-slate-600">{params.gpa ?? 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Science GPA</p>
            <p className="text-sm text-slate-600">{params.scienceGpa ?? 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">MCAT status</p>
            <p className="text-sm text-slate-600">{params.mcatStatus ?? 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">MCAT score</p>
            <p className="text-sm text-slate-600">{params.mcatScore ?? 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Clinical hours</p>
            <p className="text-sm text-slate-600">{params.clinicalHours ?? 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Shadowing hours</p>
            <p className="text-sm text-slate-600">{params.shadowingHours ?? 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Volunteering hours</p>
            <p className="text-sm text-slate-600">{params.volunteeringHours ?? 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Research hours</p>
            <p className="text-sm text-slate-600">{params.researchHours ?? 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Leadership count</p>
            <p className="text-sm text-slate-600">{params.leadershipExperiences ?? 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">School year</p>
            <p className="text-sm text-slate-600">{params.schoolYear ?? 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Target application year</p>
            <p className="text-sm text-slate-600">{params.targetApplicationYear ?? 'N/A'}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
